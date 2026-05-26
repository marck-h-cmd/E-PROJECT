import { NextRequest } from 'next/server';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const gestorNotificaciones = new GestorNotificaciones();

const leerTodasSchema = z.object({
  usuarioId: z.string().uuid(),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = leerTodasSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    await gestorNotificaciones.marcarTodasComoLeidas(validation.data.usuarioId);
    return createSuccessResponse({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al marcar todas las notificaciones', 500);
  }
}
