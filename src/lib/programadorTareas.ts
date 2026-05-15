// Programador de tareas periódicas (cron jobs)
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

export class ProgramadorTareas {
  // Limpiar selecciones temporales expiradas
  static async limpiarSeleccionesExpiradas(): Promise<void> {
    try {
      const ahora = new Date();
      
      await prisma.seleccionTemporal.deleteMany({
        where: {
          expiraEn: {
            lt: ahora,
          },
        },
      });

      // También limpiar en Redis
      const keys = await redis.keys('seleccion:*');
      for (const key of keys) {
        const data = await redis.get(key);
        if (data) {
          const seleccion = JSON.parse(data);
          if (seleccion.expiraEn < ahora.getTime()) {
            await redis.del(key);
          }
        }
      }

      console.log('✅ Selecciones temporales expiradas limpiadas');
    } catch (error) {
      console.error('Error limpiando selecciones expiradas:', error);
    }
  }

  // Actualizar caché de disponibilidad
  static async actualizarCacheDisponibilidad(): Promise<void> {
    try {
      const periodoActivo = await prisma.periodoAcademico.findFirst({
        where: { activo: true },
      });

      if (periodoActivo) {
        const keys = await redis.keys(`disponibilidad:${periodoActivo.id}:*`);
        if (keys.length > 0) {
          await redis.del(...keys);
        }
        console.log('✅ Caché de disponibilidad actualizada');
      }
    } catch (error) {
      console.error('Error actualizando caché de disponibilidad:', error);
    }
  }

  // Verificar notificaciones pendientes
  static async procesarNotificacionesPendientes(): Promise<void> {
    try {
      const notificaciones = await prisma.notificacion.findMany({
        where: {
          estado: 'PENDIENTE',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
          },
        },
        take: 100,
      });

      console.log(`📨 Procesando ${notificaciones.length} notificaciones pendientes`);
      // Aquí se llamaría al servicio de notificaciones para reenviar
    } catch (error) {
      console.error('Error procesando notificaciones:', error);
    }
  }

  // Respaldo automático (simplificado)
  static async respaldoDiario(): Promise<void> {
    try {
      const fecha = new Date().toISOString().split('T')[0];
      console.log(`💾 Iniciando respaldo diario: ${fecha}`);
      // En producción, aquí se implementaría el respaldo real
      // Ej: pg_dump para PostgreSQL
    } catch (error) {
      console.error('Error en respaldo diario:', error);
    }
  }

  // Ejecutar todas las tareas programadas
  static async ejecutarTodas(): Promise<void> {
    await Promise.allSettled([
      this.limpiarSeleccionesExpiradas(),
      this.actualizarCacheDisponibilidad(),
      this.procesarNotificacionesPendientes(),
    ]);
  }
}

// Si se usa node-cron o similar:
// import cron from 'node-cron';
// cron.schedule('*/15 * * * *', ProgramadorTareas.limpiarSeleccionesExpiradas);
// cron.schedule('0 * * * *', ProgramadorTareas.actualizarCacheDisponibilidad);
// cron.schedule('0 2 * * *', ProgramadorTareas.respaldoDiario);