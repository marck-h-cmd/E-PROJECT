import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { AppError } from '@/services/auth/AuthService';
import { CategoriaDocente, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface DocenteFiltros {
  search?: string;
  categoria?: CategoriaDocente;
  departamento?: string;
  activo?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DocenteCreateInput {
  email: string;
  nombre: string;
  apellidos: string;
  codigo: string;
  categoria: CategoriaDocente;
  departamento?: string;
  telefono?: string;
  whatsapp?: string;
}

export interface DocenteUpdateInput extends Partial<DocenteCreateInput> {
  activo?: boolean;
  telegramId?: string;
  verificadoWhatsapp?: boolean;
  verificadoTelegram?: boolean;
}

export class ServicioDocente {
  private readonly CACHE_TTL = 300; // 5 minutos

  /**
   * Lista docentes con filtros y paginación
   */
  async listar(filtros: DocenteFiltros) {
    const {
      search,
      categoria,
      departamento,
      activo,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filtros;

    const where: Prisma.DocenteWhereInput = {};

    if (search) {
      where.OR = [
        { codigo: { contains: search, mode: 'insensitive' } },
        { departamento: { contains: search, mode: 'insensitive' } },
        {
          usuario: {
            OR: [
              { nombre: { contains: search, mode: 'insensitive' } },
              { apellidos: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    if (categoria) where.categoria = categoria;
    if (departamento) where.departamento = { contains: departamento, mode: 'insensitive' };
    if (activo !== undefined) where.usuario = { ...(where.usuario as any || {}), activo };

    const [docentes, total] = await Promise.all([
      prisma.docente.findMany({
        where,
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              nombre: true,
              apellidos: true,
              rol: true,
              activo: true,
              ultimoAcceso: true,
            },
          },
          preferenciasNotificacion: true,
          _count: {
            select: {
              horarios: true,
              cursos: true,
              ventanasAtendidas: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.docente.count({ where }),
    ]);

    return {
      data: docentes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Obtiene un docente por ID
   */
  async obtenerPorId(id: string) {
    const docente = await prisma.docente.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellidos: true,
            rol: true,
            activo: true,
            ultimoAcceso: true,
            verificado: true,
          },
        },
        preferenciasNotificacion: true,
        cursos: {
          include: {
            curso: {
              select: {
                id: true,
                codigo: true,
                nombre: true,
                creditos: true,
                ciclo: true,
              },
            },
          },
          where: { activo: true },
        },
        disponibilidad: {
          orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
        },
        _count: {
          select: {
            horarios: true,
            ventanasAtendidas: true,
          },
        },
      },
    });

    if (!docente) {
      throw new AppError('Docente no encontrado', 404, 'DOCENTE_NOT_FOUND');
    }

    return docente;
  }

  /**
   * Obtiene un docente por código
   */
  async obtenerPorCodigo(codigo: string) {
    const docente = await prisma.docente.findUnique({
      where: { codigo },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
    });

    if (!docente) {
      throw new AppError('Docente no encontrado', 404, 'DOCENTE_NOT_FOUND');
    }

    return docente;
  }

  /**
   * Crea un nuevo docente con su usuario
   */
  async crear(datos: DocenteCreateInput): Promise<any> {
    // Verificar si ya existe el código o email
    const existente = await prisma.docente.findFirst({
      where: {
        OR: [
          { codigo: datos.codigo },
          { usuario: { email: datos.email } },
        ],
      },
    });

    if (existente) {
      throw new AppError(
        'Ya existe un docente con ese código o email',
        409,
        'DOCENTE_DUPLICADO'
      );
    }

    // Crear password temporal
    const passwordTemporal = this.generarPasswordTemporal();
    const passwordHash = await bcrypt.hash(passwordTemporal, 12);

    const docente = await prisma.docente.create({
      data: {
        codigo: datos.codigo,
        categoria: datos.categoria,
        departamento: datos.departamento,
        telefono: datos.telefono,
        whatsapp: datos.whatsapp,
        usuario: {
          create: {
            email: datos.email,
            password: passwordHash,
            nombre: datos.nombre,
            apellidos: datos.apellidos,
            rol: 'DOCENTE',
            verificado: true,
          },
        },
        preferenciasNotificacion: {
          create: {
            correoActivo: true,
            whatsappActivo: !!datos.whatsapp,
            telegramActivo: false,
            sistemaActivo: true,
          },
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellidos: true,
          },
        },
        preferenciasNotificacion: true,
      },
    });

    // Invalidar caché
    await this.invalidarCache();

    return {
      ...docente,
      passwordTemporal, // Solo se muestra al crear
    };
  }

  /**
   * Actualiza un docente existente
   */
  async actualizar(id: string, datos: DocenteUpdateInput): Promise<any> {
    const docente = await this.obtenerPorId(id);

    const updateData: any = {};

    if (datos.categoria) updateData.categoria = datos.categoria;
    if (datos.departamento !== undefined) updateData.departamento = datos.departamento;
    if (datos.telefono !== undefined) updateData.telefono = datos.telefono;
    if (datos.whatsapp !== undefined) updateData.whatsapp = datos.whatsapp;
    if (datos.verificadoWhatsapp !== undefined) updateData.verificadoWhatsapp = datos.verificadoWhatsapp;
    if (datos.verificadoTelegram !== undefined) updateData.verificadoTelegram = datos.verificadoTelegram;
    if (datos.telegramId !== undefined) updateData.telegramId = datos.telegramId;

    const usuarioUpdate: any = {};
    if (datos.nombre) usuarioUpdate.nombre = datos.nombre;
    if (datos.apellidos) usuarioUpdate.apellidos = datos.apellidos;
    if (datos.activo !== undefined) usuarioUpdate.activo = datos.activo;

    const docenteActualizado = await prisma.docente.update({
      where: { id },
      data: {
        ...updateData,
        usuario: Object.keys(usuarioUpdate).length > 0
          ? { update: usuarioUpdate }
          : undefined,
      },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellidos: true,
            activo: true,
          },
        },
        preferenciasNotificacion: true,
      },
    });

    await this.invalidarCache();

    return docenteActualizado;
  }

  /**
   * Elimina (soft delete) un docente
   */
  async eliminar(id: string): Promise<void> {
    const docente = await this.obtenerPorId(id);

    // Verificar que no tenga horarios activos
    const horariosActivos = await prisma.horario.count({
      where: {
        docenteId: id,
        estado: { in: ['CONFIRMADO', 'PUBLICADO'] },
      },
    });

    if (horariosActivos > 0) {
      throw new AppError(
        'No se puede eliminar el docente porque tiene horarios activos',
        409,
        'DOCENTE_CON_HORARIOS'
      );
    }

    await prisma.docente.update({
      where: { id },
      data: {
        usuario: {
          update: { activo: false },
        },
      },
    });

    await this.invalidarCache();
  }

  /**
   * Obtiene docentes por categoría
   */
  async obtenerPorCategoria(categoria: CategoriaDocente) {
    const cacheKey = `docentes:categoria:${categoria}`;
    
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const docentes = await prisma.docente.findMany({
      where: {
        categoria,
        usuario: { activo: true },
      },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellidos: true,
          },
        },
        cursos: {
          where: { activo: true },
          include: {
            curso: { select: { id: true, codigo: true, nombre: true } },
          },
        },
      },
      orderBy: { codigo: 'asc' },
    });

    await redis.setex(cacheKey, this.CACHE_TTL, JSON.stringify(docentes));

    return docentes;
  }

  /**
   * Busca docentes por texto (autocompletado)
   */
  async buscar(termino: string, limite: number = 10) {
    if (!termino || termino.length < 2) return [];

    const docentes = await prisma.docente.findMany({
      where: {
        usuario: { activo: true },
        OR: [
          { codigo: { contains: termino, mode: 'insensitive' } },
          { usuario: { nombre: { contains: termino, mode: 'insensitive' } } },
          { usuario: { apellidos: { contains: termino, mode: 'insensitive' } } },
        ],
      },
      select: {
        id: true,
        codigo: true,
        categoria: true,
        usuario: {
          select: {
            nombre: true,
            apellidos: true,
            email: true,
          },
        },
      },
      take: limite,
    });

    return docentes.map(d => ({
      id: d.id,
      codigo: d.codigo,
      nombreCompleto: `${d.usuario.nombre} ${d.usuario.apellidos}`,
      email: d.usuario.email,
      categoria: d.categoria,
    }));
  }

  /**
   * Obtiene estadísticas de un docente
   */
  async obtenerEstadisticas(docenteId: string) {
    const docente = await prisma.docente.findUnique({
      where: { id: docenteId },
      select: {
        id: true,
        categoria: true,
      },
    });

    if (!docente) {
      throw new AppError('Docente no encontrado', 404, 'DOCENTE_NOT_FOUND');
    }

    const [
      totalCursos,
      totalHorarios,
      horariosPorPeriodo,
    ] = await Promise.all([
      prisma.cursoDocente.count({
        where: { docenteId, activo: true },
      }),
      prisma.horario.count({
        where: { docenteId, estado: { not: 'CANCELADO' } },
      }),
      prisma.horario.groupBy({
        by: ['periodoId'],
        where: { docenteId },
        _count: true,
      }),
    ]);

    return {
      totalCursos,
      totalHorarios,
      horariosPorPeriodo,
    };
  }

  /**
   * Verifica la disponibilidad de un código de docente
   */
  async verificarCodigo(codigo: string): Promise<boolean> {
    const existente = await prisma.docente.findUnique({
      where: { codigo },
      select: { id: true },
    });
    return !existente;
  }

  /**
   * Invalida la caché de docentes
   */
  private async invalidarCache(): Promise<void> {
    const keys = await redis.keys('docentes:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }

  /**
   * Genera una contraseña temporal segura
   */
  private generarPasswordTemporal(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}