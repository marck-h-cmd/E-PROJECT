import { NextRequest } from 'next/server';
import { ServicioHorario } from '@/services/horarios/ServicioHorario';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const servicioHorario = new ServicioHorario();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId');

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere el ID del período', 400);
    }

    const horarios = await servicioHorario.obtenerPorDocente(params.id, periodoId);

    return createSuccessResponse(horarios);
  } catch (error: any) {
    console.error('Error obteniendo horario del docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener horario', 500);
  }
}