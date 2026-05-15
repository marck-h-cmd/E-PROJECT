import { NextRequest } from 'next/server';
import { GestorVentanasAtencion } from '@/services/ventanas/GestorVentanasAtencion';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const gestorVentanas = new GestorVentanasAtencion();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { atencionId } = body;

    if (!atencionId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere el ID de atención', 400);
    }

    const resultado = await gestorVentanas.marcarDocenteAusente(params.id, atencionId);
    return createSuccessResponse(resultado);
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    console.error('Error marcando ausente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al marcar ausente', 500);
  }
}