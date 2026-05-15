import { NextRequest } from 'next/server';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const gestorNotificaciones = new GestorNotificaciones();

const enviarSchema = z.object({
  usuarioId: z.string().uuid(),
  tipo: z.string(),
  titulo: z.string().min(1).max(200),
  mensaje: z.string().min(1).max(2000),
  prioridad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'URGENTE']),
  canal: z.enum(['CORREO', 'WHATSAPP', 'TELEGRAM', 'SISTEMA']),
  metadata: z.any().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = enviarSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    await gestorNotificaciones.enviarNotificacion(validation.data);

    return createSuccessResponse({ message: 'Notificación encolada exitosamente' }, undefined, 201);
  } catch (error: any) {
    console.error('Error enviando notificación:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al enviar notificación', 500);
  }
}