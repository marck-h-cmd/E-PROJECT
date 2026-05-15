import { NextRequest } from 'next/server';
import { GestorDisponibilidad } from '@/services/horarios/GestorDisponibilidad';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const gestorDisponibilidad = new GestorDisponibilidad();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId');
    const diaSemana = searchParams.get('diaSemana') as any;

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere el ID del período', 400);
    }

    const disponibilidad = await gestorDisponibilidad.obtenerDisponibilidadAmbientes(
      periodoId,
      'AULA',
      diaSemana
    );

    return createSuccessResponse(disponibilidad);
  } catch (error: any) {
    console.error('Error obteniendo disponibilidad de aulas:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener disponibilidad de aulas', 500);
  }
}