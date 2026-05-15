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

    const mapaCalor = await servicioEstadisticas.obtenerMapaCalor(periodoId);

    return createSuccessResponse(mapaCalor);
  } catch (error: any) {
    console.error('Error obteniendo mapa de calor:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener mapa de calor', 500);
  }
}