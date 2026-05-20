import { NextRequest } from 'next/server';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const gestorNotificaciones = new GestorNotificaciones();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await gestorNotificaciones.marcarComoLeida(params.id);
    return createSuccessResponse({ message: 'Notificación marcada como leída' });
  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al marcar notificación', 500);
  }
}
