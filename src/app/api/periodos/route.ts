import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const estado = searchParams.get('estado');

    const where: any = {};
    if (estado) where.estado = estado;

    const [periodos, total] = await Promise.all([
      prisma.periodoAcademico.findMany({
        where,
        include: {
          _count: {
            select: {
              horarios: true,
              ventanas: true,
            },
          },
          configuraciones: true,
        },
        orderBy: { fechaInicio: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.periodoAcademico.count({ where }),
    ]);

    return createPaginatedResponse(periodos, page, limit, total);
  } catch (error) {
    console.error('Error listando períodos:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al listar períodos', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const periodo = await prisma.periodoAcademico.create({
      data: {
        nombre: body.nombre,
        fechaInicio: new Date(body.fechaInicio),
        fechaFin: new Date(body.fechaFin),
        configuraciones: {
          create: {
            horasMaxDiariasDocente: 8,
            horasMaxContinuas: 4,
            descansoMinEntreHoras: 1,
            ordenCategorias: ['PRINCIPAL', 'ASOCIADO', 'AUXILIAR', 'CONTRATADO', 'INVITADO'],
          },
        },
      },
      include: {
        configuraciones: true,
      },
    });

    return createSuccessResponse(periodo, undefined, 201);
  } catch (error) {
    console.error('Error creando período:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al crear período', 500);
  }
}