import { NextRequest } from 'next/server';
import { ServicioEstadisticas } from '@/services/estadisticas/ServicioEstadisticas';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const servicioEstadisticas = new ServicioEstadisticas();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId');

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere el ID del período', 400);
    }

    const avance = await servicioEstadisticas.obtenerAvanceCategoria(periodoId);

    return createSuccessResponse(avance);
  } catch (error: any) {
    console.error('Error obteniendo avance por categoría:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener avance por categoría', 500);
  }
}