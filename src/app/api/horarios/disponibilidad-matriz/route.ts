import { NextRequest } from 'next/server';
import { GestorDisponibilidad } from '@/services/horarios/GestorDisponibilidad';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const gestorDisponibilidad = new GestorDisponibilidad();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId');
    const tipo = searchParams.get('tipo') as any;

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere el ID del período', 400);
    }

    const matriz = await gestorDisponibilidad.obtenerMatrizDisponibilidad(periodoId, tipo);

    return createSuccessResponse(matriz);
  } catch (error: any) {
    console.error('Error obteniendo matriz de disponibilidad:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener matriz de disponibilidad', 500);
  }
}