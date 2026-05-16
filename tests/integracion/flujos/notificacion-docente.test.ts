import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';
import { GestorPlantillas } from '@/services/notificaciones/GestorPlantillas';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    notificacion: {
      create: vi.fn().mockResolvedValue({ id: 'notif-1' }),
      createMany: vi.fn().mockResolvedValue({ count: 1 }),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      update: vi.fn().mockResolvedValue({}),
    },
    envioNotificacion: {
      create: vi.fn().mockResolvedValue({}),
    },
    usuario: {
      findUnique: vi.fn().mockResolvedValue({
        id: 'user-1',
        email: 'docente@unitru.edu.pe',
        nombre: 'Juan',
        apellidos: 'Pérez García',
      }),
    },
    docente: {
      findFirst: vi.fn().mockResolvedValue({
        id: 'doc-1',
        whatsapp: '51999123456',
        verificadoWhatsapp: true,
        telegramId: '123456789',
        verificadoTelegram: true,
      }),
      findUnique: vi.fn().mockResolvedValue({
        id: 'doc-1',
        codigo: 'DOC001',
        categoria: 'PRINCIPAL',
        usuario: { id: 'user-1', email: 'docente@unitru.edu.pe' },
      }),
    },
    preferenciasNotificacion: {
      findUnique: vi.fn().mockResolvedValue({
        correoActivo: true,
        whatsappActivo: true,
        telegramActivo: true,
        sistemaActivo: true,
        frecuenciaMaxDiaria: 10,
      }),
      upsert: vi.fn().mockResolvedValue({}),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

describe('Flujo de Notificación a Docente - Integración', () => {
  let gestor: GestorNotificaciones;
  let gestorPlantillas: GestorPlantillas;

  beforeEach(() => {
    gestor = new GestorNotificaciones();
    gestorPlantillas = new GestorPlantillas();
    vi.clearAllMocks();
  });

  describe('Notificación de confirmación de horario', () => {
    it('debe encolar y registrar notificación de confirmación', async () => {
      await gestor.enviarNotificacion({
        usuarioId: 'user-1',
        tipo: 'CONFIRMACION_HORARIO',
        titulo: 'Horario Confirmado',
        mensaje: 'Su horario para el período 2024-II ha sido confirmado.',
        prioridad: 'ALTA',
        canal: 'CORREO',
        metadata: {
          periodoId: 'periodo-1',
          cursoCodigo: 'IS101',
        },
      });

      // Verificar encolado
      expect(redis.lpush).toHaveBeenCalledWith(
        'notificaciones:alta',
        expect.stringContaining('Horario Confirmado')
      );

      // Verificar registro en BD
      expect(prisma.notificacion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            usuarioId: 'user-1',
            tipo: 'CONFIRMACION_HORARIO',
            titulo: 'Horario Confirmado',
            estado: 'PENDIENTE',
            canal: 'CORREO',
          }),
        })
      );
    });
  });

  describe('Notificación de ventana de atención', () => {
    it('debe enviar notificación de ventana a múltiples docentes', async () => {
      const docentesIds = ['user-1', 'user-2', 'user-3'];

      await gestor.enviarMultiplesNotificaciones(
        docentesIds,
        {
          tipo: 'VENTANA_ATENCION',
          titulo: 'Ventana de Atención Abierta',
          mensaje: 'La ventana de atención para docentes PRINCIPAL está abierta.',
          prioridad: 'URGENTE',
          canal: 'WHATSAPP',
          metadata: {
            ventanaId: 'ventana-1',
            categoria: 'PRINCIPAL',
          },
        }
      );

      expect(prisma.notificacion.createMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({
              usuarioId: 'user-1',
              tipo: 'VENTANA_ATENCION',
              prioridad: 'URGENTE',
            }),
            expect.objectContaining({
              usuarioId: 'user-2',
            }),
            expect.objectContaining({
              usuarioId: 'user-3',
            }),
          ]),
        })
      );
    });
  });

  describe('Flujo con plantillas', () => {
    it('debe usar plantilla para notificación de cambio de horario', async () => {
      // Configurar plantilla mock
      (redis.get as any).mockResolvedValueOnce(JSON.stringify([
        {
          id: 'plantilla-1',
          nombre: 'Cambio de Horario',
          tipo: 'CAMBIO_HORARIO',
          canal: 'CORREO',
          asunto: 'Cambio de Horario - {{periodo}}',
          cuerpo: 'Estimado/a {{nombreDocente}}, su horario de {{curso}} ha cambiado a {{nuevoHorario}}.',
          variables: ['nombreDocente', 'periodo', 'curso', 'nuevoHorario'],
          creadaEn: new Date().toISOString(),
        },
      ]));

      const plantillas = await gestorPlantillas.listarPlantillas('CAMBIO_HORARIO');
      
      expect(plantillas).toHaveLength(1);
      expect(plantillas[0].nombre).toBe('Cambio de Horario');
      expect(plantillas[0].variables).toContain('nombreDocente');
      expect(plantillas[0].variables).toContain('curso');
      expect(plantillas[0].variables).toContain('nuevoHorario');

      // Procesar plantilla
      const mensaje = gestorPlantillas.procesarPlantilla(plantillas[0], {
        nombreDocente: 'Juan Pérez',
        periodo: '2024-II',
        curso: 'Programación',
        nuevoHorario: 'Lunes 10:00-12:00',
      });

      expect(mensaje).toContain('Juan Pérez');
      expect(mensaje).toContain('Programación');
      expect(mensaje).toContain('Lunes 10:00-12:00');
      expect(mensaje).not.toContain('{{'); // Sin variables sin reemplazar
    });
  });

  describe('Preferencias de notificación', () => {
    it('debe respetar preferencias del docente', async () => {
      // Docente con solo correo activo
      (prisma.preferenciasNotificacion.findUnique as any).mockResolvedValueOnce({
        correoActivo: true,
        whatsappActivo: false,
        telegramActivo: false,
        sistemaActivo: true,
        frecuenciaMaxDiaria: 5,
      });

      // Enviar notificación
      await gestor.enviarNotificacion({
        usuarioId: 'user-1',
        tipo: 'RECORDATORIO',
        titulo: 'Recordatorio',
        mensaje: 'Recuerde verificar su horario.',
        prioridad: 'MEDIA',
        canal: 'CORREO',
      });

      // La notificación se encoló correctamente
      expect(redis.lpush).toHaveBeenCalled();
      expect(prisma.notificacion.create).toHaveBeenCalled();
    });
  });

  describe('Historial de notificaciones del docente', () => {
    it('debe recuperar historial filtrado por usuario', async () => {
      const historialMock = [
        {
          id: 'n1',
          tipo: 'CONFIRMACION_HORARIO',
          titulo: 'Horario confirmado',
          mensaje: 'Confirmado',
          prioridad: 'ALTA',
          canal: 'CORREO',
          estado: 'ENVIADA',
          createdAt: new Date(),
          envios: [],
          usuario: { email: 'docente@unitru.edu.pe', nombre: 'Juan', apellidos: 'Pérez' },
        },
        {
          id: 'n2',
          tipo: 'CAMBIO_HORARIO',
          titulo: 'Cambio realizado',
          mensaje: 'Cambiado',
          prioridad: 'MEDIA',
          canal: 'SISTEMA',
          estado: 'LEIDA',
          createdAt: new Date(),
          envios: [],
          usuario: { email: 'docente@unitru.edu.pe', nombre: 'Juan', apellidos: 'Pérez' },
        },
      ];

      (prisma.notificacion.findMany as any).mockResolvedValueOnce(historialMock);
      (prisma.notificacion.count as any).mockResolvedValueOnce(2);

      const resultado = await gestor.obtenerHistorial('user-1', undefined, undefined, 1, 10);

      expect(resultado.data).toHaveLength(2);
      expect(resultado.meta.total).toBe(2);
      expect(resultado.data[0].titulo).toBe('Horario confirmado');
      expect(resultado.data[1].estado).toBe('LEIDA');
    });
  });
});