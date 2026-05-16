import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    const periodo = await prisma.periodoAcademico.findFirst({
      where: { activo: true },
      include: {
        configuraciones: true,
        _count: {
          select: {
            horarios: true,
          }
        }
      }
    });

    if (!periodo) {
      return createErrorResponse('NOT_FOUND', 'No hay un período académico activo actualmente', 404);
    }

    return createSuccessResponse(periodo);
  } catch (error: any) {
    console.error('Error obteniendo período activo:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener período activo', 500);
  }
}
