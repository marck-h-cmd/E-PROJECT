import { prisma } from '@/lib/prisma';
import { AccionesAuditoria } from '@/lib/enums';

export interface RegistroAuditoriaInput {
  usuarioId?: string;
  accion: string;
  entidad: string;
  entidadId?: string;
  datos?: any;
  ipAddress?: string;
}

export class ServicioAuditoria {
  async registrar(datos: RegistroAuditoriaInput): Promise<void> {
    try {
      await prisma.registroAuditoria.create({
        data: {
          usuarioId: datos.usuarioId,
          accion: datos.accion,
          entidad: datos.entidad,
          entidadId: datos.entidadId,
          datos: datos.datos ? JSON.parse(JSON.stringify(datos.datos)) : undefined,
          ipAddress: datos.ipAddress,
        },
      });
    } catch (error) {
      console.error('Error registrando auditoría:', error);
      // No lanzar error para no interrumpir la operación principal
    }
  }

  async registrarAccion(
    usuarioId: string | undefined,
    accion: string,
    entidad: string,
    entidadId?: string,
    datos?: any,
    ipAddress?: string
  ): Promise<void> {
    return this.registrar({
      usuarioId,
      accion,
      entidad,
      entidadId,
      datos,
      ipAddress,
    });
  }

  async obtenerHistorial(
    filtros: {
      usuarioId?: string;
      accion?: string;
      entidad?: string;
      entidadId?: string;
      fechaDesde?: Date;
      fechaHasta?: Date;
    },
    page: number = 1,
    limit: number = 50
  ) {
    const where: any = {};

    if (filtros.usuarioId) where.usuarioId = filtros.usuarioId;
    if (filtros.accion) where.accion = filtros.accion;
    if (filtros.entidad) where.entidad = filtros.entidad;
    if (filtros.entidadId) where.entidadId = filtros.entidadId;
    
    if (filtros.fechaDesde || filtros.fechaHasta) {
      where.createdAt = {};
      if (filtros.fechaDesde) where.createdAt.gte = filtros.fechaDesde;
      if (filtros.fechaHasta) where.createdAt.lte = filtros.fechaHasta;
    }

    const [registros, total] = await Promise.all([
      prisma.registroAuditoria.findMany({
        where,
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              nombre: true,
              apellidos: true,
              rol: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.registroAuditoria.count({ where }),
    ]);

    return {
      data: registros,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async obtenerEstadisticasAuditoria() {
    const [
      totalRegistros,
      registrosPorAccion,
      registrosPorEntidad,
      registrosRecientes,
    ] = await Promise.all([
      prisma.registroAuditoria.count(),
      prisma.registroAuditoria.groupBy({
        by: ['accion'],
        _count: true,
        orderBy: { _count: { accion: 'desc' } },
        take: 10,
      }),
      prisma.registroAuditoria.groupBy({
        by: ['entidad'],
        _count: true,
        orderBy: { _count: { entidad: 'desc' } },
        take: 10,
      }),
      prisma.registroAuditoria.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
          },
        },
      }),
    ]);

    return {
      totalRegistros,
      registrosRecientes,
      accionesMasFrecuentes: registrosPorAccion.map(r => ({
        accion: r.accion,
        cantidad: r._count,
      })),
      entidadesMasFrecuentes: registrosPorEntidad.map(r => ({
        entidad: r.entidad,
        cantidad: r._count,
      })),
    };
  }

  async exportarAuditoria(
    filtros: {
      fechaDesde?: Date;
      fechaHasta?: Date;
      entidad?: string;
      accion?: string;
    }
  ): Promise<any[]> {
    const where: any = {};

    if (filtros.fechaDesde || filtros.fechaHasta) {
      where.createdAt = {};
      if (filtros.fechaDesde) where.createdAt.gte = filtros.fechaDesde;
      if (filtros.fechaHasta) where.createdAt.lte = filtros.fechaHasta;
    }
    if (filtros.entidad) where.entidad = filtros.entidad;
    if (filtros.accion) where.accion = filtros.accion;

    const registros = await prisma.registroAuditoria.findMany({
      where,
      include: {
        usuario: {
          select: {
            email: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10000, // Límite para exportación
    });

    return registros.map(r => ({
      fecha: r.createdAt.toISOString(),
      usuario: r.usuario ? `${r.usuario.nombre} ${r.usuario.apellidos}` : 'Sistema',
      email: r.usuario?.email || 'N/A',
      accion: r.accion,
      entidad: r.entidad,
      entidadId: r.entidadId || 'N/A',
      ip: r.ipAddress || 'N/A',
    }));
  }
}