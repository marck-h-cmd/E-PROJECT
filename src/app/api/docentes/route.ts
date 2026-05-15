import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';
import { withAuth } from '@/middleware/auth';
import { CategoriaDocente } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') as CategoriaDocente | null;
    const activo = searchParams.get('activo');

    const where: any = {};
    
    if (search) {
      where.OR = [
        { codigo: { contains: search, mode: 'insensitive' } },
        { usuario: { nombre: { contains: search, mode: 'insensitive' } } },
        { usuario: { apellidos: { contains: search, mode: 'insensitive' } } },
        { usuario: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }
    
    if (categoria) where.categoria = categoria;
    if (activo !== null && activo !== '') {
      where.activo = activo === 'true';
    }

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
          _count: {
            select: {
              horarios: true,
              cursos: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.docente.count({ where }),
    ]);

    return createPaginatedResponse(docentes, page, limit, total);
  } catch (error) {
    console.error('Error listando docentes:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al listar docentes', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar datos requeridos
    if (!body.email || !body.nombre || !body.apellidos || !body.codigo || !body.categoria) {
      return createErrorResponse('VALIDATION_ERROR', 'Faltan campos requeridos', 400);
    }

    // Crear usuario y docente en una transacción
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash('unt123456', 12); // Contraseña temporal

    const docente = await prisma.docente.create({
      data: {
        codigo: body.codigo,
        categoria: body.categoria,
        departamento: body.departamento,
        telefono: body.telefono,
        whatsapp: body.whatsapp,
        usuario: {
          create: {
            email: body.email,
            password: passwordHash,
            nombre: body.nombre,
            apellidos: body.apellidos,
            rol: 'DOCENTE',
            verificado: true,
          },
        },
        preferenciasNotificacion: {
          create: {
            correoActivo: true,
            whatsappActivo: true,
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
      },
    });

    return createSuccessResponse(docente, undefined, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return createErrorResponse('DUPLICATE', 'Ya existe un docente con ese código o email', 409);
    }
    console.error('Error creando docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al crear docente', 500);
  }
}