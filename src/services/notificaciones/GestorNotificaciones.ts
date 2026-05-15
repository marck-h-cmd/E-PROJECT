import { redis } from '@/lib/redis';
import { prisma } from '@/lib/prisma';
import { ServicioCorreo } from './ServicioCorreo';
import { DatosNotificacion } from './ServicioNotificacionBase';
import { CanalNotificacion, EstadoNotificacion, PrioridadNotificacion } from '@prisma/client';

export class GestorNotificaciones {
  private servicios: Map<CanalNotificacion, any> = new Map();
  private readonly MAX_REINTENTOS = 3;
  private readonly COLAS = {
    ALTA: 'notificaciones:alta',
    MEDIA: 'notificaciones:media',
    BAJA: 'notificaciones:baja',
  };

  constructor() {
    // Inicializar servicios por canal
    this.servicios.set('CORREO', new ServicioCorreo());
    // Los otros canales se inicializan bajo demanda
  }

  async enviarNotificacion(datos: DatosNotificacion): Promise<void> {
    // Determinar cola según prioridad
    const cola = this.obtenerColaPorPrioridad(datos.prioridad);
    
    // Encolar notificación
    await redis.lpush(cola, JSON.stringify({
      ...datos,
      intentos: 0,
      encoladoEn: new Date().toISOString(),
    }));

    // Registrar en base de datos
    await prisma.notificacion.create({
      data: {
        usuarioId: datos.usuarioId,
        tipo: datos.tipo as any,
        titulo: datos.titulo,
        mensaje: datos.mensaje,
        prioridad: datos.prioridad,
        canal: datos.canal,
        estado: 'PENDIENTE',
        metadata: datos.metadata || {},
      },
    });
  }

  async enviarMultiplesNotificaciones(
    usuariosIds: string[],
    datos: Omit<DatosNotificacion, 'usuarioId'>
  ): Promise<void> {
    const notificaciones = usuariosIds.map(usuarioId => ({
      ...datos,
      usuarioId,
    }));

    // Encolar en lote
    const pipeline = redis.pipeline();
    const cola = this.obtenerColaPorPrioridad(datos.prioridad);

    for (const notificacion of notificaciones) {
      pipeline.lpush(cola, JSON.stringify(notificacion));
    }

    await pipeline.exec();

    // Registrar en base de datos
    await prisma.notificacion.createMany({
      data: notificaciones.map(n => ({
        usuarioId: n.usuarioId,
        tipo: n.tipo as any,
        titulo: n.titulo,
        mensaje: n.mensaje,
        prioridad: n.prioridad,
        canal: n.canal,
        estado: 'PENDIENTE',
        metadata: n.metadata || {},
      })),
    });
  }

  async procesarCola(cola?: string): Promise<void> {
    const colasProcesar = cola ? [cola] : Object.values(this.COLAS);

    for (const nombreCola of colasProcesar) {
      let notificacionStr = await redis.rpop(nombreCola);
      
      while (notificacionStr) {
        const datos = JSON.parse(notificacionStr);
        
        try {
          const servicio = this.servicios.get(datos.canal as CanalNotificacion);
          if (servicio) {
            const exito = await servicio.enviar(datos);
            
            if (!exito && datos.intentos < this.MAX_REINTENTOS) {
              // Reencolar con intentos incrementados
              await redis.lpush(nombreCola, JSON.stringify({
                ...datos,
                intentos: (datos.intentos || 0) + 1,
              }));
            }
          }
        } catch (error) {
          console.error(`Error procesando notificación en cola ${nombreCola}:`, error);
        }

        notificacionStr = await redis.rpop(nombreCola);
      }
    }
  }

  async obtenerHistorial(
    usuarioId?: string,
    tipo?: string,
    estado?: EstadoNotificacion,
    page: number = 1,
    limit: number = 20
  ) {
    const where: any = {};
    
    if (usuarioId) where.usuarioId = usuarioId;
    if (tipo) where.tipo = tipo;
    if (estado) where.estado = estado;

    const [notificaciones, total] = await Promise.all([
      prisma.notificacion.findMany({
        where,
        include: {
          envios: true,
          usuario: {
            select: {
              email: true,
              nombre: true,
              apellidos: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.notificacion.count({ where }),
    ]);

    return {
      data: notificaciones,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async obtenerEstadoColas() {
    const estado: Record<string, any> = {};

    for (const [nombre, clave] of Object.entries(this.COLAS)) {
      const longitud = await redis.llen(clave);
      estado[nombre] = {
        cola: clave,
        pendientes: longitud,
        estado: longitud > 100 ? 'congestionada' : longitud > 50 ? 'ocupada' : 'normal',
      };
    }

    return estado;
  }

  async limpiarColas(): Promise<void> {
    for (const clave of Object.values(this.COLAS)) {
      await redis.del(clave);
    }
  }

  private obtenerColaPorPrioridad(prioridad: PrioridadNotificacion): string {
    switch (prioridad) {
      case 'URGENTE':
      case 'ALTA':
        return this.COLAS.ALTA;
      case 'MEDIA':
        return this.COLAS.MEDIA;
      case 'BAJA':
      default:
        return this.COLAS.BAJA;
    }
  }
}