import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const preferenciasSchema = z.object({
  docenteId: z.string().uuid(),
  correoActivo: z.boolean().optional(),
  whatsappActivo: z.boolean().optional(),
  telegramActivo: z.boolean().optional(),
  sistemaActivo: z.boolean().optional(),
  frecuenciaMaxDiaria: z.number().int().min(1).max(50).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const docenteId = searchParams.get('docenteId');

    if (!docenteId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere el ID del docente', 400);
    }

    const preferencias = await prisma.preferenciasNotificacion.findUnique({
      where: { docenteId },
    });

    if (!preferencias) {
      return createErrorResponse('NOT_FOUND', 'Preferencias no encontradas', 404);
    }

    return createSuccessResponse(preferencias);
  } catch (error: any) {
    console.error('Error obteniendo preferencias:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener preferencias', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = preferenciasSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const { docenteId, ...datos } = validation.data;

    const preferencias = await prisma.preferenciasNotificacion.upsert({
      where: { docenteId },
      update: datos,
      create: {
        docenteId,
        ...datos,
      },
    });

    return createSuccessResponse(preferencias);
  } catch (error: any) {
    console.error('Error actualizando preferencias:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al actualizar preferencias', 500);
  }
}