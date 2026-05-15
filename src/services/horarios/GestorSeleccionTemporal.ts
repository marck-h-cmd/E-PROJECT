import { redis } from '@/lib/redis';
import { AppError } from '@/services/auth/AuthService';
import { v4 as uuidv4 } from 'uuid';

export interface SeleccionTemporal {
  sessionId: string;
  docenteId: string;
  periodoId: string;
  cursoId: string;
  celdas: CeldaSeleccion[];
  expiraEn: number; // timestamp
}

export interface CeldaSeleccion {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  ambienteId: string;
  grupoId?: string;
}

export class GestorSeleccionTemporal {
  private readonly TTL = 1800; // 30 minutos en segundos
  private readonly PREFIX = 'seleccion:';

  async iniciarSeleccion(
    docenteId: string,
    periodoId: string,
    cursoId: string
  ): Promise<string> {
    const sessionId = uuidv4();
    const seleccion: SeleccionTemporal = {
      sessionId,
      docenteId,
      periodoId,
      cursoId,
      celdas: [],
      expiraEn: Date.now() + this.TTL * 1000,
    };

    await redis.setex(
      `${this.PREFIX}${sessionId}`,
      this.TTL,
      JSON.stringify(seleccion)
    );

    return sessionId;
  }

  async obtenerSeleccion(sessionId: string): Promise<SeleccionTemporal> {
    const data = await redis.get(`${this.PREFIX}${sessionId}`);
    if (!data) {
      throw new AppError('Sesión de selección expirada o no encontrada', 404, 'SELECCION_NOT_FOUND');
    }

    const seleccion = JSON.parse(data) as SeleccionTemporal;
    
    // Extender TTL
    await redis.expire(`${this.PREFIX}${sessionId}`, this.TTL);

    return seleccion;
  }

  async agregarCelda(
    sessionId: string,
    celda: CeldaSeleccion
  ): Promise<SeleccionTemporal> {
    const seleccion = await this.obtenerSeleccion(sessionId);

    // Verificar que no haya solapamiento con celdas existentes
    for (const existente of seleccion.celdas) {
      if (existente.diaSemana === celda.diaSemana) {
        const solapamiento = this.verificarSolapamiento(
          existente.horaInicio,
          existente.horaFin,
          celda.horaInicio,
          celda.horaFin
        );
        if (solapamiento) {
          throw new AppError(
            'La celda se solapa con una selección existente',
            409,
            'CELDA_SOLAPADA'
          );
        }
      }
    }

    seleccion.celdas.push(celda);

    // Actualizar TTL
    const ttl = await redis.ttl(`${this.PREFIX}${sessionId}`);
    await redis.setex(
      `${this.PREFIX}${sessionId}`,
      ttl > 0 ? ttl : this.TTL,
      JSON.stringify(seleccion)
    );

    return seleccion;
  }

  async eliminarCelda(
    sessionId: string,
    celdaIndex: number
  ): Promise<SeleccionTemporal> {
    const seleccion = await this.obtenerSeleccion(sessionId);

    if (celdaIndex < 0 || celdaIndex >= seleccion.celdas.length) {
      throw new AppError('Índice de celda inválido', 400, 'INVALID_CELL_INDEX');
    }

    seleccion.celdas.splice(celdaIndex, 1);

    const ttl = await redis.ttl(`${this.PREFIX}${sessionId}`);
    await redis.setex(
      `${this.PREFIX}${sessionId}`,
      ttl > 0 ? ttl : this.TTL,
      JSON.stringify(seleccion)
    );

    return seleccion;
  }

  async confirmarSeleccion(sessionId: string): Promise<void> {
    const seleccion = await this.obtenerSeleccion(sessionId);

    // Aquí se llamaría al motor de asignación para crear los horarios reales
    // Por ahora, solo eliminamos la selección temporal
    await this.eliminarSeleccion(sessionId);
  }

  async eliminarSeleccion(sessionId: string): Promise<void> {
    await redis.del(`${this.PREFIX}${sessionId}`);
  }

  async listarSeleccionesActivas(): Promise<string[]> {
    const keys = await redis.keys(`${this.PREFIX}*`);
    return keys.map(key => key.replace(this.PREFIX, ''));
  }

  private verificarSolapamiento(
    inicio1: string,
    fin1: string,
    inicio2: string,
    fin2: string
  ): boolean {
    return inicio1 < fin2 && inicio2 < fin1;
  }
}