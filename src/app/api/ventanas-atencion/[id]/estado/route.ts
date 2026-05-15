import { NextRequest } from 'next/server';
import { GestorVentanasAtencion } from '@/services/ventanas/GestorVentanasAtencion';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const gestorVentanas = new GestorVentanasAtencion();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { accion } = body;

    let resultado;

    switch (accion) {
      case 'abrir':
        resultado = await gestorVentanas.abrirVentana(params.id);
        break;
      case 'cerrar':
        resultado = await gestorVentanas.cerrarVentana(params.id);
        break;
      default:
        return createErrorResponse('VALIDATION_ERROR', 'Acción no válida', 400);
    }

    return createSuccessResponse(resultado);
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    console.error('Error cambiando estado de ventana:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al cambiar estado', 500);
  }
}