import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { AppError } from '@/services/auth/AuthService';
import { DiaSemana, EstadoHorario, Prisma } from '@prisma/client';

export interface CrearHorarioDTO {
  periodoId: string;
  cursoId: string;
  docenteId: string;
  grupoId?: string;
  ambienteId: string;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

export interface FiltrosHorario {
  periodoId?: string;
  docenteId?: string;
  cursoId?: string;
  ambienteId?: string;
  diaSemana?: DiaSemana;
  estado?: EstadoHorario;
}

export interface PaginacionParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class ServicioHorario {
  async listar(filtros: FiltrosHorario, paginacion: PaginacionParams) {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = paginacion;
    const where: Prisma.HorarioWhereInput = {};

    if (filtros.periodoId) where.periodoId = filtros.periodoId;
    if (filtros.docenteId) where.docenteId = filtros.docenteId;
    if (filtros.cursoId) where.cursoId = filtros.cursoId;
    if (filtros.ambienteId) where.ambienteId = filtros.ambienteId;
    if (filtros.diaSemana) where.diaSemana = filtros.diaSemana;
    if (filtros.estado) where.estado = filtros.estado;

    const [horarios, total] = await Promise.all([
      prisma.horario.findMany({
        where,
        include: {
          curso: { select: { id: true, codigo: true, nombre: true } },
          docente: {
            include: {
              usuario: { select: { id: true, nombre: true, apellidos: true } }
            }
          },
          grupo: { select: { id: true, nombre: true } },
          ambiente: { select: { id: true, codigo: true, nombre: true, tipo: true } },
          periodo: { select: { id: true, nombre: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.horario.count({ where }),
    ]);

    return {
      data: horarios,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async obtenerPorId(id: string) {
    const horario = await prisma.horario.findUnique({
      where: { id },
      include: {
        curso: { select: { id: true, codigo: true, nombre: true, creditos: true } },
        docente: {
          include: {
            usuario: { select: { id: true, nombre: true, apellidos: true, email: true } }
          }
        },
        grupo: true,
        ambiente: true,
        periodo: true,
        validaciones: true,
      },
    });

    if (!horario) {
      throw new AppError('Horario no encontrado', 404, 'HORARIO_NOT_FOUND');
    }

    return horario;
  }

  async crear(datos: CrearHorarioDTO, usuarioId: string) {
    // Validar que el período exista y esté activo
    const periodo = await prisma.periodoAcademico.findUnique({
      where: { id: datos.periodoId },
    });
    if (!periodo) {
      throw new AppError('Período no encontrado', 404, 'PERIODO_NOT_FOUND');
    }
    if (periodo.estado === 'FINALIZADO' || periodo.estado === 'ARCHIVADO') {
      throw new AppError('El período no está activo', 400, 'PERIODO_NOT_ACTIVE');
    }

    // Validar que el curso exista
    const curso = await prisma.curso.findUnique({
      where: { id: datos.cursoId },
    });
    if (!curso) {
      throw new AppError('Curso no encontrado', 404, 'CURSO_NOT_FOUND');
    }

    // Validar que el docente exista y tenga asignado el curso
    const cursoDocente = await prisma.cursoDocente.findUnique({
      where: {
        cursoId_docenteId: {
          cursoId: datos.cursoId,
          docenteId: datos.docenteId,
        },
      },
    });
    if (!cursoDocente) {
      throw new AppError('El docente no tiene asignado este curso', 400, 'DOCENTE_NO_ASIGNADO');
    }

    // Validar que el ambiente exista y esté activo
    const ambiente = await prisma.ambiente.findUnique({
      where: { id: datos.ambienteId },
    });
    if (!ambiente || !ambiente.activo) {
      throw new AppError('Ambiente no encontrado o inactivo', 404, 'AMBIENTE_NOT_FOUND');
    }

    // Validar el grupo si se proporciona
    if (datos.grupoId) {
      const grupo = await prisma.grupo.findFirst({
        where: { id: datos.grupoId, cursoId: datos.cursoId },
      });
      if (!grupo) {
        throw new AppError('Grupo no encontrado o no pertenece al curso', 404, 'GRUPO_NOT_FOUND');
      }
    }

    // Crear el horario
    const horario = await prisma.horario.create({
      data: {
        ...datos,
        estado: 'BORRADOR',
        creadoPor: usuarioId,
        fechaCreacion: new Date(),
      },
      include: {
        curso: true,
        docente: {
          include: {
            usuario: { select: { nombre: true, apellidos: true } }
          }
        },
        grupo: true,
        ambiente: true,
        periodo: true,
      },
    });

    return horario;
  }

  async actualizar(id: string, datos: Partial<CrearHorarioDTO>) {
    const horario = await this.obtenerPorId(id);

    if (horario.estado === 'PUBLICADO') {
      throw new AppError('No se puede modificar un horario publicado', 400, 'HORARIO_PUBLICADO');
    }

    const horarioActualizado = await prisma.horario.update({
      where: { id },
      data: {
        ...datos,
        estado: 'BORRADOR', // Resetear estado al editar
      },
      include: {
        curso: true,
        docente: {
          include: {
            usuario: { select: { nombre: true, apellidos: true } }
          }
        },
        grupo: true,
        ambiente: true,
        periodo: true,
      },
    });

    return horarioActualizado;
  }

  async eliminar(id: string) {
    const horario = await this.obtenerPorId(id);

    if (horario.estado === 'PUBLICADO') {
      throw new AppError('No se puede eliminar un horario publicado', 400, 'HORARIO_PUBLICADO');
    }

    await prisma.horario.delete({
      where: { id },
    });

    return { message: 'Horario eliminado exitosamente' };
  }

  async obtenerPorDocente(docenteId: string, periodoId: string) {
    const horarios = await prisma.horario.findMany({
      where: {
        docenteId,
        periodoId,
        estado: { not: 'CANCELADO' },
      },
      include: {
        curso: { select: { id: true, codigo: true, nombre: true, creditos: true } },
        grupo: { select: { id: true, nombre: true } },
        ambiente: { select: { id: true, codigo: true, nombre: true, tipo: true } },
      },
      orderBy: [
        { diaSemana: 'asc' },
        { horaInicio: 'asc' },
      ],
    });

    return horarios;
  }

  async obtenerPorAmbiente(ambienteId: string, periodoId: string) {
    const horarios = await prisma.horario.findMany({
      where: {
        ambienteId,
        periodoId,
        estado: { not: 'CANCELADO' },
      },
      include: {
        curso: { select: { id: true, codigo: true, nombre: true } },
        docente: {
          include: {
            usuario: { select: { nombre: true, apellidos: true } }
          }
        },
        grupo: { select: { id: true, nombre: true } },
      },
      orderBy: [
        { diaSemana: 'asc' },
        { horaInicio: 'asc' },
      ],
    });

    return horarios;
  }
}