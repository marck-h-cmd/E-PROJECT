import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const search = searchParams.get('search') || '';
    const ciclo = parseInt(searchParams.get('ciclo') || '0');
    const activo = searchParams.get('activo');

    const where: any = {};
    
    if (search) {
      where.OR = [
        { codigo: { contains: search, mode: 'insensitive' } },
        { nombre: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (ciclo > 0) where.ciclo = ciclo;
    if (activo !== null && activo !== '') {
      where.activo = activo === 'true';
    }

    const [cursos, total] = await Promise.all([
      prisma.curso.findMany({
        where,
        include: {
          grupos: {
            select: {
              id: true,
              nombre: true,
              capacidad: true,
            },
          },
          _count: {
            select: {
              cursosDocente: true,
              horarios: true,
            },
          },
        },
        orderBy: [{ ciclo: 'asc' }, { codigo: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.curso.count({ where }),
    ]);

    return createPaginatedResponse(cursos, page, limit, total);
  } catch (error) {
    console.error('Error listando cursos:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al listar cursos', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const curso = await prisma.curso.create({
      data: {
        codigo: body.codigo,
        nombre: body.nombre,
        creditos: body.creditos,
        horasTeoria: body.horasTeoria,
        horasPractica: body.horasPractica,
        horasLaboratorio: body.horasLaboratorio,
        ciclo: body.ciclo,
        planEstudios: body.planEstudios,
      },
    });

    return createSuccessResponse(curso, undefined, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return createErrorResponse('DUPLICATE', 'Ya existe un curso con ese código', 409);
    }
    console.error('Error creando curso:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al crear curso', 500);
  }
}