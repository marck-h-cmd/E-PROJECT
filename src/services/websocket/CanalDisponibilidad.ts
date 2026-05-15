import { ServidorWebSocket } from './ServidorWebSocket';
import { redis } from '@/lib/redis';

export class CanalNotificaciones {
  private servidorWS: ServidorWebSocket;
  private readonly CANAL = 'notificaciones';

  constructor(servidorWS: ServidorWebSocket) {
    this.servidorWS = servidorWS;
  }

  /**
   * Envía una notificación a un usuario específico
   */
  async notificarUsuario(usuarioId: string, notificacion: {
    tipo: string;
    titulo: string;
    mensaje: string;
    metadata?: any;
  }): Promise<void> {
    this.servidorWS.enviarAUsuario(usuarioId, {
      type: 'notificacion',
      channel: `notificacion:docente-${usuarioId}`,
      data: notificacion,
      timestamp: new Date().toISOString(),
    });

    // Guardar en historial de notificaciones del usuario
    await redis.lpush(
      `notificaciones:usuario:${usuarioId}`,
      JSON.stringify({
        ...notificacion,
        leida: false,
        createdAt: new Date().toISOString(),
      })
    );

    // Limitar historial a últimas 100 notificaciones
    await redis.ltrim(`notificaciones:usuario:${usuarioId}`, 0, 99);
  }

  /**
   * Envía una notificación a todos los usuarios de un rol
   */
  async notificarRol(rol: string, notificacion: {
    tipo: string;
    titulo: string;
    mensaje: string;
    metadata?: any;
  }): Promise<void> {
    this.servidorWS.enviarARol(rol, {
      type: 'notificacion',
      data: notificacion,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Envía una notificación global a todos los usuarios conectados
   */
  async notificarTodos(notificacion: {
    tipo: string;
    titulo: string;
    mensaje: string;
    metadata?: any;
  }): Promise<void> {
    this.servidorWS.enviarACanal('general', {
      type: 'notificacion',
      data: notificacion,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Marca una notificación como leída
   */
  async marcarComoLeida(usuarioId: string, notificacionIndex: number): Promise<void> {
    const key = `notificaciones:usuario:${usuarioId}`;
    const notificacionStr = await redis.lindex(key, notificacionIndex);

    if (notificacionStr) {
      const notificacion = JSON.parse(notificacionStr);
      notificacion.leida = true;
      notificacion.leidaEn = new Date().toISOString();
      
      await redis.lset(key, notificacionIndex, JSON.stringify(notificacion));
    }
  }

  /**
   * Obtiene notificaciones no leídas de un usuario
   */
  async getNotificacionesNoLeidas(usuarioId: string, limite: number = 20): Promise<any[]> {
    const key = `notificaciones:usuario:${usuarioId}`;
    const notificaciones = await redis.lrange(key, 0, limite - 1);

    return notificaciones
      .map(n => JSON.parse(n))
      .filter(n => !n.leida);
  }

  /**
   * Cuenta notificaciones no leídas
   */
  async countNoLeidas(usuarioId: string): Promise<number> {
    const noLeidas = await this.getNotificacionesNoLeidas(usuarioId, 100);
    return noLeidas.length;
  }

  /**
   * Elimina notificaciones antiguas
   */
  async limpiarNotificacionesAntiguas(usuarioId: string, dias: number = 30): Promise<void> {
    const key = `notificaciones:usuario:${usuarioId}`;
    const notificaciones = await redis.lrange(key, 0, -1);
    
    const limite = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
    const filtradas = notificaciones
      .map(n => JSON.parse(n))
      .filter(n => new Date(n.createdAt) >= limite);

    await redis.del(key);
    
    if (filtradas.length > 0) {
      await redis.lpush(key, ...filtradas.map(n => JSON.stringify(n)));
    }
  }
}