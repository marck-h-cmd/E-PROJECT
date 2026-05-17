import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';
import { EstadoPeriodo } from '@prisma/client';

const updateSchema = z.object({
  nombre: z.string().min(3).optional(),
  fechaInicio: z.string().optional(),
  fechaFin: z.string().optional(),
  estado: z.nativeEnum(EstadoPeriodo).optional(),
  activo: z.boolean().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = updateSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const data: Record<string, unknown> = { ...validation.data };
    if (validation.data.fechaInicio) data.fechaInicio = new Date(validation.data.fechaInicio);
    if (validation.data.fechaFin) data.fechaFin = new Date(validation.data.fechaFin);

    if (validation.data.activo === true) {
      await prisma.periodoAcademico.updateMany({
        where: { activo: true },
        data: { activo: false },
      });
    }

    const periodo = await prisma.periodoAcademico.update({
      where: { id: params.id },
      data,
    });

    return createSuccessResponse(periodo);
  } catch (error) {
    console.error('Error actualizando período:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al actualizar período', 500);
  }
}
