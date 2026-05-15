import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const ambienteId = searchParams.get('ambienteId') || undefined;

    const where: any = {};
    if (ambienteId) where.ambienteId = ambienteId;

    const [restricciones, total] = await Promise.all([
      prisma.restriccionAmbiente.findMany({
        where,
        include: {
          ambiente: {
            select: { codigo: true, nombre: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.restriccionAmbiente.count({ where }),
    ]);

    return createPaginatedResponse(restricciones, page, limit, total);
  } catch (error: any) {
    console.error('Error obteniendo restricciones:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener restricciones', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const restriccion = await prisma.restriccionAmbiente.create({
      data: {
        ambienteId: body.ambienteId,
        diaSemana: body.diaSemana,
        horaInicio: body.horaInicio,
        horaFin: body.horaFin,
        motivo: body.motivo,
      },
    });

    return createSuccessResponse(restriccion, undefined, 201);
  } catch (error: any) {
    console.error('Error creando restricción:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al crear restricción', 500);
  }
}