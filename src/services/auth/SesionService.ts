import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { AppError } from './AuthService';

export interface SesionInfo {
  id: string;
  usuarioId: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  expiraEn: Date;
  activa: boolean;
}

export class SesionService {
  private readonly SESSION_PREFIX = 'sesion:';
  private readonly BLACKLIST_PREFIX = 'blacklist:';

  /**
   * Obtiene todas las sesiones activas de un usuario
   */
  async getSesionesActivas(usuarioId: string): Promise<SesionInfo[]> {
    const sesiones = await prisma.sesion.findMany({
      where: {
        usuarioId,
        activa: true,
        expiraEn: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sesiones.map(s => ({
      id: s.id,
      usuarioId: s.usuarioId,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      createdAt: s.createdAt,
      expiraEn: s.expiraEn,
      activa: s.activa,
    }));
  }

  /**
   * Cuenta las sesiones activas de un usuario
   */
  async countSesionesActivas(usuarioId: string): Promise<number> {
    return prisma.sesion.count({
      where: {
        usuarioId,
        activa: true,
        expiraEn: { gt: new Date() },
      },
    });
  }

  /**
   * Cierra una sesión específica
   */
  async cerrarSesion(sesionId: string, usuarioId: string): Promise<void> {
    const sesion = await prisma.sesion.findFirst({
      where: {
        id: sesionId,
        usuarioId,
      },
    });

    if (!sesion) {
      throw new AppError('Sesión no encontrada', 404, 'SESSION_NOT_FOUND');
    }

    await prisma.sesion.update({
      where: { id: sesionId },
      data: { activa: false },
    });

    // Agregar token a lista negra en Redis
    if (sesion.token) {
      const ttl = Math.ceil((sesion.expiraEn.getTime() - Date.now()) / 1000);
      if (ttl > 0) {
        await redis.setex(`${this.BLACKLIST_PREFIX}${sesion.token}`, ttl, '1');
      }
    }
  }

  /**
   * Cierra todas las sesiones de un usuario excepto la actual
   */
  async cerrarOtrasSesiones(usuarioId: string, sesionActualId: string): Promise<number> {
    const resultado = await prisma.sesion.updateMany({
      where: {
        usuarioId,
        activa: true,
        id: { not: sesionActualId },
      },
      data: { activa: false },
    });

    return resultado.count;
  }

  /**
   * Cierra todas las sesiones de un usuario
   */
  async cerrarTodasSesiones(usuarioId: string): Promise<number> {
    const sesiones = await prisma.sesion.findMany({
      where: {
        usuarioId,
        activa: true,
      },
    });

    // Agregar todos los tokens a lista negra
    const pipeline = redis.pipeline();
    for (const sesion of sesiones) {
      if (sesion.token) {
        const ttl = Math.ceil((sesion.expiraEn.getTime() - Date.now()) / 1000);
        if (ttl > 0) {
          pipeline.setex(`${this.BLACKLIST_PREFIX}${sesion.token}`, ttl, '1');
        }
      }
    }
    await pipeline.exec();

    // Desactivar sesiones
    const resultado = await prisma.sesion.updateMany({
      where: {
        usuarioId,
        activa: true,
      },
      data: { activa: false },
    });

    return resultado.count;
  }

  /**
   * Verifica si un token está en lista negra
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    const exists = await redis.exists(`${this.BLACKLIST_PREFIX}${token}`);
    return exists === 1;
  }

  /**
   * Limpia sesiones expiradas
   */
  async limpiarSesionesExpiradas(): Promise<number> {
    const resultado = await prisma.sesion.deleteMany({
      where: {
        OR: [
          { expiraEn: { lt: new Date() } },
          { activa: false, updatedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
        ],
      },
    });

    return resultado.count;
  }

  /**
   * Extiende la duración de una sesión
   */
  async extenderSesion(sesionId: string, horasAdicionales: number = 24): Promise<void> {
    const sesion = await prisma.sesion.findUnique({
      where: { id: sesionId },
    });

    if (!sesion || !sesion.activa) {
      throw new AppError('Sesión no encontrada o inactiva', 404, 'SESSION_NOT_FOUND');
    }

    const nuevaExpiracion = new Date(Date.now() + horasAdicionales * 60 * 60 * 1000);

    await prisma.sesion.update({
      where: { id: sesionId },
      data: { expiraEn: nuevaExpiracion },
    });
  }

  /**
   * Obtiene estadísticas de sesiones
   */
  async getEstadisticasSesiones(): Promise<{
    totalActivas: number;
    totalHoy: number;
    promedioDuracion: number;
  }> {
    const [totalActivas, totalHoy, sesionesRecientes] = await Promise.all([
      prisma.sesion.count({
        where: { activa: true, expiraEn: { gt: new Date() } },
      }),
      prisma.sesion.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.sesion.findMany({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        select: { createdAt: true, updatedAt: true },
        take: 1000,
      }),
    ]);

    // Calcular duración promedio
    let duracionTotal = 0;
    let count = 0;
    for (const sesion of sesionesRecientes) {
      const duracion = sesion.updatedAt.getTime() - sesion.createdAt.getTime();
      if (duracion > 0) {
        duracionTotal += duracion;
        count++;
      }
    }

    const promedioDuracion = count > 0 
      ? Math.round(duracionTotal / count / 1000 / 60) // en minutos
      : 0;

    return {
      totalActivas,
      totalHoy,
      promedioDuracion,
    };
  }
}