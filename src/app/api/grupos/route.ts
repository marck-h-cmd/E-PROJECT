import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || undefined;
    const cursoId = searchParams.get('cursoId') || undefined;
    const ciclo = parseInt(searchParams.get('ciclo') || '0');
    const activo = searchParams.get('activo') === 'true' ? true : 
                   searchParams.get('activo') === 'false' ? false : undefined;

    const where: any = {};

    if (cursoId) {
      where.cursoId = cursoId;
    } else if (ciclo > 0) {
      where.curso = { ciclo };
    }

    if (activo !== undefined) {
      where.activo = activo;
    }

    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { curso: { nombre: { contains: search, mode: 'insensitive' } } },
        { curso: { codigo: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [grupos, total] = await Promise.all([
      prisma.grupo.findMany({
        where,
        include: {
          curso: {
            select: { id: true, codigo: true, nombre: true, ciclo: true },
          },
          _count: {
            select: { horarios: true },
          },
        },
        orderBy: [
          { curso: { ciclo: 'asc' } },
          { curso: { codigo: 'asc' } },
          { nombre: 'asc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.grupo.count({ where }),
    ]);

    return createPaginatedResponse(grupos, page, limit, total);
  } catch (error: any) {
    console.error('Error listando grupos:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al listar grupos', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const grupo = await prisma.grupo.create({
      data: {
        cursoId: body.cursoId,
        nombre: body.nombre,
        capacidad: body.capacidad,
        activo: body.activo ?? true,
      },
      include: {
        curso: {
          select: { id: true, codigo: true, nombre: true, ciclo: true },
        },
        _count: {
          select: { horarios: true },
        },
      },
    });

    return createSuccessResponse(grupo, undefined, 201);
  } catch (error: any) {
    console.error('Error creando grupo:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al crear grupo', 500);
  }
}