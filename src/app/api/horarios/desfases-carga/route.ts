import { NextRequest } from 'next/server';
import { ValidadorHorario } from '@/services/horarios/ValidadorHorario';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const validador = new ValidadorHorario();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId');

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere periodoId', 400);
    }

    const desfases = await validador.obtenerDesfasesCarga(periodoId);
    return createSuccessResponse(desfases);
  } catch (error: unknown) {
    console.error('Error obteniendo desfases de carga:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al consultar desfases', 500);
  }
}
