import { redis } from '@/lib/redis';

export class CacheEstadisticas {
  private readonly PREFIX = 'estadisticas:';
  private readonly DEFAULT_TTL = 600; // 10 minutos

  /**
   * Obtiene datos del caché
   */
  async get<T>(clave: string): Promise<T | null> {
    const data = await redis.get(`${this.PREFIX}${clave}`);
    if (!data) return null;

    const cacheado = JSON.parse(data);
    
    // Verificar si expiró
    if (cacheado.expiraEn && new Date(cacheado.expiraEn) < new Date()) {
      await this.invalidar(clave);
      return null;
    }

    return cacheado.datos as T;
  }

  /**
   * Guarda datos en caché
   */
  async set<T>(clave: string, datos: T, ttl?: number): Promise<void> {
    const cacheado = {
      datos,
      creadoEn: new Date().toISOString(),
      expiraEn: new Date(Date.now() + (ttl || this.DEFAULT_TTL) * 1000).toISOString(),
    };

    await redis.setex(
      `${this.PREFIX}${clave}`,
      ttl || this.DEFAULT_TTL,
      JSON.stringify(cacheado)
    );
  }

  /**
   * Obtiene o calcula datos con caché
   */
  async getOrSet<T>(
    clave: string,
    calculador: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cacheado = await this.get<T>(clave);
    if (cacheado !== null) return cacheado;

    const datos = await calculador();
    await this.set(clave, datos, ttl);
    return datos;
  }

  /**
   * Invalida una clave específica
   */
  async invalidar(clave: string): Promise<void> {
    await redis.del(`${this.PREFIX}${clave}`);
  }

  /**
   * Invalida todas las estadísticas de un período
   */
  async invalidarPeriodo(periodoId: string): Promise<void> {
    const keys = await redis.keys(`${this.PREFIX}*:${periodoId}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * Invalida todas las estadísticas cacheadas
   */
  async invalidarTodas(): Promise<void> {
    const keys = await redis.keys(`${this.PREFIX}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * Obtiene estadísticas de uso del caché
   */
  async getEstadisticasCache(): Promise<{
    totalClaves: number;
    claves: string[];
    memoriaUsada: string;
  }> {
    const keys = await redis.keys(`${this.PREFIX}*`);
    
    let memoriaTotal = 0;
    const pipeline = redis.pipeline();
    
    for (const key of keys) {
      pipeline.memory('USAGE', key);
    }
    
    const resultados = await pipeline.exec();
    if (resultados) {
      for (const [err, tamaño] of resultados) {
        if (!err && tamaño) memoriaTotal += Number(tamaño);
      }
    }

    return {
      totalClaves: keys.length,
      claves: keys.map(k => k.replace(this.PREFIX, '')),
      memoriaUsada: `${(memoriaTotal / 1024).toFixed(2)} KB`,
    };
  }

  /**
   * Verifica si una clave existe en caché
   */
  async existe(clave: string): Promise<boolean> {
    return (await redis.exists(`${this.PREFIX}${clave}`)) === 1;
  }

  /**
   * Obtiene el TTL restante de una clave
   */
  async getTTL(clave: string): Promise<number> {
    return redis.ttl(`${this.PREFIX}${clave}`);
  }
}