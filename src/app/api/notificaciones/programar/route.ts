import { NextRequest } from 'next/server';
import { redis } from '@/lib/redis';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const programarSchema = z.object({
  usuariosIds: z.array(z.string().uuid()),
  tipo: z.string(),
  titulo: z.string(),
  mensaje: z.string(),
  prioridad: z.enum(['BAJA', 'MEDIA', 'ALTA', 'URGENTE']),
  canal: z.enum(['CORREO', 'WHATSAPP', 'TELEGRAM', 'SISTEMA']),
  programadoPara: z.string().datetime(),
  metadata: z.any().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = programarSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const { usuariosIds, programadoPara, ...datosNotificacion } = validation.data;

    // Guardar notificaciones programadas en Redis sorted set
    const timestamp = new Date(programadoPara).getTime();

    for (const usuarioId of usuariosIds) {
      await redis.zadd('notificaciones:programadas', timestamp, JSON.stringify({
        ...datosNotificacion,
        usuarioId,
        programadoPara,
      }));
    }

    return createSuccessResponse({
      message: `${usuariosIds.length} notificaciones programadas exitosamente`,
      programadoPara,
    }, undefined, 201);
  } catch (error: any) {
    console.error('Error programando notificaciones:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al programar notificaciones', 500);
  }
}