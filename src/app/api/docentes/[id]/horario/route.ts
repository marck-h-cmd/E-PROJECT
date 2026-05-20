import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId') ?? undefined;

    const docente = await prisma.docente.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!docente) {
      return createErrorResponse('DOCENTE_NOT_FOUND', 'Docente no encontrado', 404);
    }

    const where: any = { docenteId: params.id };
    if (periodoId) where.periodoId = periodoId;

    const horarios = await prisma.horario.findMany({
      where,
      include: {
        curso: {
          select: { id: true, codigo: true, nombre: true, horasTeoria: true, horasPractica: true },
        },
        ambiente: {
          select: { id: true, codigo: true, nombre: true, tipo: true, capacidad: true },
        },
        grupo: {
          select: { id: true, nombre: true },
        },
        periodo: {
          select: { id: true, nombre: true, estado: true },
        },
      },
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
    });

    return createSuccessResponse(horarios);
  } catch (error: any) {
    console.error('Error obteniendo horario del docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener horario', 500);
  }
}