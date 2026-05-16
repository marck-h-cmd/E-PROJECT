import { NextRequest } from 'next/server';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';
import { createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';
import { EstadoNotificacion } from '@prisma/client';

const gestorNotificaciones = new GestorNotificaciones();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId') || undefined;
    const tipo = searchParams.get('tipo') || undefined;
    const estado = searchParams.get('estado') as EstadoNotificacion || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const resultado = await gestorNotificaciones.obtenerHistorial(
      usuarioId,
      tipo,
      estado,
      page,
      limit
    );

    return createPaginatedResponse(
      resultado.data,
      page,
      limit,
      resultado.meta.total
    );
  } catch (error: any) {
    console.error('Error obteniendo historial de notificaciones:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener historial de notificaciones', 500);
  }
}
