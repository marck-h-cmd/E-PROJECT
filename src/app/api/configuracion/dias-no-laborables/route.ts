import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const periodoId = searchParams.get('periodoId') || undefined;

    const where: any = {};
    if (periodoId) where.periodoId = periodoId;

    const [dias, total] = await Promise.all([
      prisma.diaNoLaborable.findMany({
        where,
        orderBy: { fecha: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.diaNoLaborable.count({ where }),
    ]);

    return createPaginatedResponse(dias, page, limit, total);
  } catch (error: any) {
    console.error('Error obteniendo días no laborables:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener días no laborables', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const dia = await prisma.diaNoLaborable.create({
      data: {
        fecha: new Date(body.fecha),
        motivo: body.motivo,
        periodoId: body.periodoId,
      },
    });

    return createSuccessResponse(dia, undefined, 201);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return createErrorResponse('DUPLICATE', 'Ya existe un registro para esta fecha', 409);
    }
    console.error('Error creando día no laborable:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al crear día no laborable', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere el ID', 400);
    }

    await prisma.diaNoLaborable.delete({ where: { id } });

    return createSuccessResponse({ message: 'Día no laborable eliminado exitosamente' });
  } catch (error: any) {
    console.error('Error eliminando día no laborable:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al eliminar día no laborable', 500);
  }
}