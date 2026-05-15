import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';
import { TipoAmbiente } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const search = searchParams.get('search') || '';
    const tipo = searchParams.get('tipo') as TipoAmbiente | null;
    const activo = searchParams.get('activo');

    const where: any = {};
    
    if (search) {
      where.OR = [
        { codigo: { contains: search, mode: 'insensitive' } },
        { nombre: { contains: search, mode: 'insensitive' } },
        { ubicacion: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (tipo) where.tipo = tipo;
    if (activo !== null && activo !== '') {
      where.activo = activo === 'true';
    }

    const [ambientes, total] = await Promise.all([
      prisma.ambiente.findMany({
        where,
        include: {
          _count: {
            select: {
              horarios: true,
            },
          },
        },
        orderBy: [{ tipo: 'asc' }, { codigo: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ambiente.count({ where }),
    ]);

    return createPaginatedResponse(ambientes, page, limit, total);
  } catch (error) {
    console.error('Error listando ambientes:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al listar ambientes', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const ambiente = await prisma.ambiente.create({
      data: {
        codigo: body.codigo,
        nombre: body.nombre,
        tipo: body.tipo,
        capacidad: body.capacidad,
        ubicacion: body.ubicacion,
      },
    });

    return createSuccessResponse(ambiente, undefined, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return createErrorResponse('DUPLICATE', 'Ya existe un ambiente con ese código', 409);
    }
    console.error('Error creando ambiente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al crear ambiente', 500);
  }
}