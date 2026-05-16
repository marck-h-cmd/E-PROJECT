import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';

// Mock de Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    notificacion: {
      create: vi.fn().mockResolvedValue({
        id: 'notif-1',
        usuarioId: 'user-1',
        tipo: 'SISTEMA',
        titulo: 'Test',
        mensaje: 'Test mensaje',
        prioridad: 'MEDIA',
        canal: 'CORREO',
        estado: 'PENDIENTE',
      }),
      createMany: vi.fn().mockResolvedValue({ count: 3 }),
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      update: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn().mockResolvedValue(null),
    },
    envioNotificacion: {
      create: vi.fn().mockResolvedValue({}),
    },
    usuario: {
      findUnique: vi.fn().mockResolvedValue({ email: 'test@unitru.edu.pe' }),
    },
  },
}));

import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

describe('GestorNotificaciones', () => {
  let gestor: GestorNotificaciones;

  const datosNotificacion = {
    usuarioId: 'user-1',
    tipo: 'SISTEMA',
    titulo: 'Notificación de prueba',
    mensaje: 'Este es un mensaje de prueba',
    prioridad: 'MEDIA' as const,
    canal: 'CORREO' as const,
    metadata: { origen: 'test' },
  };

  beforeEach(() => {
    gestor = new GestorNotificaciones();
    vi.clearAllMocks();
  });

  describe('enviarNotificacion', () => {
    it('debe encolar la notificación en Redis', async () => {
      await gestor.enviarNotificacion(datosNotificacion);

      expect(redis.lpush).toHaveBeenCalledWith(
        'notificaciones:media',
        expect.any(String)
      );
    });

    it('debe registrar la notificación en base de datos', async () => {
      await gestor.enviarNotificacion(datosNotificacion);

      expect(prisma.notificacion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            usuarioId: 'user-1',
            titulo: 'Notificación de prueba',
            estado: 'PENDIENTE',
          }),
        })
      );
    });

    it('debe encolar en cola ALTA para prioridad URGENTE', async () => {
      await gestor.enviarNotificacion({
        ...datosNotificacion,
        prioridad: 'URGENTE',
      });

      expect(redis.lpush).toHaveBeenCalledWith(
        'notificaciones:alta',
        expect.any(String)
      );
    });

    it('debe encolar en cola BAJA para prioridad BAJA', async () => {
      await gestor.enviarNotificacion({
        ...datosNotificacion,
        prioridad: 'BAJA',
      });

      expect(redis.lpush).toHaveBeenCalledWith(
        'notificaciones:baja',
        expect.any(String)
      );
    });
  });

  describe('enviarMultiplesNotificaciones', () => {
    it('debe encolar múltiples notificaciones', async () => {
      await gestor.enviarMultiplesNotificaciones(
        ['user-1', 'user-2', 'user-3'],
        {
          tipo: 'SISTEMA',
          titulo: 'Notificación masiva',
          mensaje: 'Mensaje para todos',
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

  describe('obtenerHistorial', () => {
    it('debe retornar historial paginado', async () => {
      (prisma.notificacion.findMany as any).mockResolvedValueOnce([
        { id: 'n1', titulo: 'Test 1' },
        { id: 'n2', titulo: 'Test 2' },
      ]);
      (prisma.notificacion.count as any).mockResolvedValueOnce(2);

      const resultado = await gestor.obtenerHistorial('user-1', undefined, undefined, 1, 20);

      expect(resultado.data).toHaveLength(2);
      expect(resultado.meta.total).toBe(2);
      expect(resultado.meta.page).toBe(1);
    });

    it('debe filtrar por usuario', async () => {
      await gestor.obtenerHistorial('user-1', undefined, undefined, 1, 20);

      expect(prisma.notificacion.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            usuarioId: 'user-1',
          }),
        })
      );
    });

    it('debe filtrar por tipo', async () => {
      await gestor.obtenerHistorial(undefined, 'VENTANA_ATENCION', undefined, 1, 20);

      expect(prisma.notificacion.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tipo: 'VENTANA_ATENCION',
          }),
        })
      );
    });
  });

  describe('obtenerEstadoColas', () => {
    it('debe retornar el estado de todas las colas', async () => {
      (redis.llen as any)
        .mockResolvedValueOnce(5)  // alta
        .mockResolvedValueOnce(25) // media
        .mockResolvedValueOnce(0); // baja

      const estado = await gestor.obtenerEstadoColas();

      expect(estado.ALTA.pendientes).toBe(5);
      expect(estado.MEDIA.pendientes).toBe(25);
      expect(estado.BAJA.pendientes).toBe(0);
      expect(estado.MEDIA.estado).toBe('normal');
    });
  });

  describe('limpiarColas', () => {
    it('debe eliminar todas las colas', async () => {
      await gestor.limpiarColas();

      expect(redis.del).toHaveBeenCalledWith('notificaciones:alta');
      expect(redis.del).toHaveBeenCalledWith('notificaciones:media');
      expect(redis.del).toHaveBeenCalledWith('notificaciones:baja');
    });
  });
});