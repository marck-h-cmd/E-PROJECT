import { ServidorWebSocket } from './ServidorWebSocket';
import { redis } from '@/lib/redis';

export class CanalDisponibilidad {
  private servidorWS: ServidorWebSocket;
  private readonly CANAL = 'disponibilidad';

  constructor(servidorWS: ServidorWebSocket) {
    this.servidorWS = servidorWS;
  }

  /**
   * Notifica cambio en la disponibilidad de un ambiente
   */
  async notificarCambioAmbiente(ambienteId: string, datos: any): Promise<void> {
    this.servidorWS.enviarACanal(this.CANAL, {
      type: 'ambiente:actualizado',
      ambienteId,
      data: datos,
      timestamp: new Date().toISOString(),
    });

    // Invalidar caché de disponibilidad
    await redis.del(`disponibilidad:${ambienteId}:*`);
  }

  /**
   * Notifica cambio en la matriz de disponibilidad
   */
  async notificarCambioMatriz(periodoId: string, datos: any): Promise<void> {
    this.servidorWS.enviarACanal(`${this.CANAL}:matriz`, {
      type: 'matriz:actualizada',
      periodoId,
      data: datos,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Notifica que una celda ha sido seleccionada temporalmente
   */
  async notificarCeldaSeleccionada(
    ambienteId: string,
    diaSemana: string,
    horaInicio: string,
    horaFin: string,
    docenteId: string
  ): Promise<void> {
    const celdaKey = `${ambienteId}:${diaSemana}:${horaInicio}:${horaFin}`;
    
    // Guardar selección temporal en Redis
    await redis.setex(
      `celda:seleccionada:${celdaKey}`,
      1800, // 30 minutos
      JSON.stringify({
        ambienteId,
        diaSemana,
        horaInicio,
        horaFin,
        docenteId,
        timestamp: new Date().toISOString(),
      })
    );

    // Notificar a todos los clientes
    this.servidorWS.enviarACanal(this.CANAL, {
      type: 'celda:seleccionada',
      celda: celdaKey,
      docenteId,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Notifica que una celda ha sido liberada
   */
  async notificarCeldaLiberada(
    ambienteId: string,
    diaSemana: string,
    horaInicio: string,
    horaFin: string
  ): Promise<void> {
    const celdaKey = `${ambienteId}:${diaSemana}:${horaInicio}:${horaFin}`;
    
    await redis.del(`celda:seleccionada:${celdaKey}`);

    this.servidorWS.enviarACanal(this.CANAL, {
      type: 'celda:liberada',
      celda: celdaKey,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Obtiene celdas actualmente seleccionadas
   */
  async getCeldasSeleccionadas(ambienteId?: string): Promise<any[]> {
    const pattern = ambienteId 
      ? `celda:seleccionada:${ambienteId}:*`
      : 'celda:seleccionada:*';
    
    const keys = await redis.keys(pattern);
    const celdas: any[] = [];

    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        celdas.push(JSON.parse(data));
      }
    }

    return celdas;
  }
}