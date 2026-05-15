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

    const ocupacion = await servicioEstadisticas.obtenerOcupacionAmbientes(periodoId);

    return createSuccessResponse(ocupacion);
  } catch (error: any) {
    console.error('Error obteniendo ocupación:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener ocupación de ambientes', 500);
  }
}