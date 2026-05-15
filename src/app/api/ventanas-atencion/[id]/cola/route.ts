import { NextRequest } from 'next/server';
import { GestorVentanasAtencion } from '@/services/ventanas/GestorVentanasAtencion';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const gestorVentanas = new GestorVentanasAtencion();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cola = await gestorVentanas.obtenerCola(params.id);
    return createSuccessResponse(cola);
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    console.error('Error obteniendo cola:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener cola', 500);
  }
}