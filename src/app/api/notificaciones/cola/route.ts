import { NextRequest } from 'next/server';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const gestorNotificaciones = new GestorNotificaciones();

export async function GET(request: NextRequest) {
  try {
    const estado = await gestorNotificaciones.obtenerEstadoColas();
    return createSuccessResponse(estado);
  } catch (error: any) {
    console.error('Error obteniendo estado de colas:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener estado de colas', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accion, cola } = body;

    switch (accion) {
      case 'procesar':
        await gestorNotificaciones.procesarCola(cola);
        break;
      case 'limpiar':
        await gestorNotificaciones.limpiarColas();
        break;
      default:
        return createErrorResponse('VALIDATION_ERROR', 'Acción no válida', 400);
    }

    return createSuccessResponse({ message: `Acción '${accion}' ejecutada exitosamente` });
  } catch (error: any) {
    console.error('Error gestionando cola:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al gestionar cola', 500);
  }
}