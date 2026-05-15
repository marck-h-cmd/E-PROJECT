import { NextRequest } from 'next/server';
import { GestorNotificaciones } from '@/services/notificaciones/GestorNotificaciones';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';
import { z } from 'zod';

const gestorNotificaciones = new GestorNotificaciones();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const usuarioId = searchParams.get('usuarioId') || undefined;
    const tipo = searchParams.get('tipo') || undefined;
    const estado = searchParams.get('estado') as any || undefined;

    const resultado = await gestorNotificaciones.obtenerHistorial(
      usuarioId,
      tipo,
      estado,
      page,
      limit
    );

    return createPaginatedResponse(
      resultado.data,
      resultado.meta.page,
      resultado.meta.limit,
      resultado.meta.total
    );
  } catch (error: any) {
    console.error('Error listando notificaciones:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al listar notificaciones', 500);
  }
}