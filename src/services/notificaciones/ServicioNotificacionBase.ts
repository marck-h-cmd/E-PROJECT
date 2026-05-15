import { redis } from '@/lib/redis';
import { prisma } from '@/lib/prisma';
import { CanalNotificacion, EstadoNotificacion, PrioridadNotificacion } from '@prisma/client';

export interface DatosNotificacion {
  usuarioId: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  prioridad: PrioridadNotificacion;
  canal: CanalNotificacion;
  metadata?: any;
}

export abstract class ServicioNotificacionBase {
  protected abstract canal: CanalNotificacion;

  abstract enviar(datos: DatosNotificacion): Promise<boolean>;

  abstract verificarConexion(): Promise<boolean>;

  protected async registrarEnvio(
    notificacionId: string,
    exito: boolean,
    error?: string
  ): Promise<void> {
    await prisma.envioNotificacion.create({
      data: {
        notificacionId,
        canal: this.canal,
        estado: exito ? 'ENVIADA' : 'FALLIDA',
        intento: 1,
        error: error || null,
        enviadoEn: exito ? new Date() : null,
      },
    });

    await prisma.notificacion.update({
      where: { id: notificacionId },
      data: { estado: exito ? 'ENVIADA' : 'FALLIDA' },
    });
  }

  protected async crearNotificacion(datos: DatosNotificacion) {
    return await prisma.notificacion.create({
      data: {
        usuarioId: datos.usuarioId,
        tipo: datos.tipo as any,
        titulo: datos.titulo,
        mensaje: datos.mensaje,
        prioridad: datos.prioridad,
        canal: this.canal,
        estado: 'PENDIENTE',
        metadata: datos.metadata || {},
      },
    });
  }

  protected async encolarNotificacion(datos: DatosNotificacion): Promise<void> {
    const queueKey = `bull:notificaciones:${this.canal.toLowerCase()}`;
    await redis.lpush(queueKey, JSON.stringify(datos));
  }
}