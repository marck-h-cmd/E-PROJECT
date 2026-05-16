import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';
import { ServicioCorreo } from '@/services/notificaciones/ServicioCorreo';
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
        apellidos: 'Pérez',
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
    },
  },
}));

import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

describe('Sistema de Notificaciones - Integración', () => {
  let gestor: GestorNotificaciones;

  beforeEach(() => {
    gestor = new GestorNotificaciones();
    vi.clearAllMocks();
  });

  describe('Flujo completo de notificación', () => {
    it('debe encolar, procesar y registrar una notificación', async () => {
      // 1. Enviar notificación
      await gestor.enviarNotificacion({
        usuarioId: 'user-1',
        tipo: 'CONFIRMACION_HORARIO',
        titulo: 'Horario confirmado',
        mensaje: 'Su horario ha sido confirmado para el período 2024-II.',
        prioridad: 'ALTA',
        canal: 'CORREO',
      });

      // 2. Verificar que se encoló
      expect(redis.lpush).toHaveBeenCalledWith(
        'notificaciones:alta',
        expect.stringContaining('Horario confirmado')
      );

      // 3. Verificar que se registró en BD
      expect(prisma.notificacion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            titulo: 'Horario confirmado',
            estado: 'PENDIENTE',
          }),
        })
      );
    });

    it('debe enviar múltiples notificaciones en lote', async () => {
      await gestor.enviarMultiplesNotificaciones(
        ['user-1', 'user-2', 'user-3'],
        {
          tipo: 'SISTEMA',
          titulo: 'Mantenimiento programado',
          mensaje: 'El sistema estará en mantenimiento el sábado.',
          prioridad: 'MEDIA',
          canal: 'CORREO',
        }
      );

      expect(prisma.notificacion.createMany).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.arrayContaining([
            expect.objectContaining({ usuarioId: 'user-1' }),
            expect.objectContaining({ usuarioId: 'user-2' }),
            expect.objectContaining({ usuarioId: 'user-3' }),
          ]),
        })
      );
    });
  });

  describe('GestorPlantillas', () => {
    let gestorPlantillas: GestorPlantillas;

    beforeEach(() => {
      gestorPlantillas = new GestorPlantillas();
    });

    it('debe crear y recuperar plantillas', async () => {
      (redis.get as any).mockResolvedValueOnce('[]'); // Sin plantillas previas

      const plantilla = await gestorPlantillas.crearPlantilla({
        nombre: 'Confirmación Horario',
        tipo: 'CONFIRMACION_HORARIO',
        canal: 'CORREO',
        asunto: 'Horario confirmado - {{periodo}}',
        cuerpo: 'Estimado {{nombreDocente}}, su horario en {{periodo}} ha sido confirmado.',
        variables: ['nombreDocente', 'periodo'],
      });

      expect(plantilla.id).toBeDefined();
      expect(plantilla.nombre).toBe('Confirmación Horario');
      expect(plantilla.variables).toContain('nombreDocente');
      expect(plantilla.variables).toContain('periodo');
    });

    it('debe procesar plantillas reemplazando variables', async () => {
      const plantilla = {
        id: 't1',
        nombre: 'Test',
        tipo: 'TEST',
        canal: 'CORREO',
        cuerpo: 'Hola {{nombre}}, tu curso es {{curso}}.',
        variables: ['nombre', 'curso'],
        creadaEn: new Date().toISOString(),
      };

      const resultado = gestorPlantillas.procesarPlantilla(plantilla, {
        nombre: 'Juan',
        curso: 'Programación',
      });

      expect(resultado).toBe('Hola Juan, tu curso es Programación.');
    });

    it('debe eliminar variables no proporcionadas', async () => {
      const plantilla = {
        id: 't2',
        nombre: 'Test',
        tipo: 'TEST',
        canal: 'CORREO',
        cuerpo: 'Hola {{nombre}}, {{extra}}.',
        variables: ['nombre', 'extra'],
        creadaEn: new Date().toISOString(),
      };

      const resultado = gestorPlantillas.procesarPlantilla(plantilla, {
        nombre: 'María',
      });

      expect(resultado).toBe('Hola María, .');
    });
  });

  describe('ServicioCorreo', () => {
    let servicioCorreo: ServicioCorreo;

    beforeEach(() => {
      servicioCorreo = new ServicioCorreo();
    });

    it('debe generar HTML con los datos de la notificación', async () => {
      // Verificar que el método generarHTML produce HTML válido
      const html = (servicioCorreo as any).generarHTML({
        titulo: 'Test',
        mensaje: 'Mensaje de prueba',
        metadata: { detalle: 'Información adicional' },
      });

      expect(html).toContain('Test');
      expect(html).toContain('Mensaje de prueba');
      expect(html).toContain('Información adicional');
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('UNT');
    });

    it('debe intentar enviar correo y registrar resultado', async () => {
      const datos = {
        usuarioId: 'user-1',
        tipo: 'SISTEMA',
        titulo: 'Prueba',
        mensaje: 'Test',
        prioridad: 'BAJA' as const,
        canal: 'CORREO' as const,
      };

      // El envío real fallará en test, pero debe registrar el intento
      try {
        await servicioCorreo.enviar(datos);
      } catch {
        // Esperado en ambiente de prueba
      }

      // Verificar que se creó la notificación
      expect(prisma.notificacion.create).toHaveBeenCalled();
    });
  });
});