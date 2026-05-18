import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const updateGrupoSchema = z.object({
  cursoId: z.string().uuid().optional(),
  nombre: z.string().min(1).max(50).optional(),
  capacidad: z.number().int().positive().optional(),
  activo: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const grupo = await prisma.grupo.findUnique({
      where: { id: params.id },
      include: {
        curso: {
          select: { id: true, codigo: true, nombre: true, ciclo: true },
        },
        _count: {
          select: { horarios: true },
        },
      },
    });

    if (!grupo) {
      return createErrorResponse('NOT_FOUND', 'Grupo no encontrado', 404);
    }

    return createSuccessResponse(grupo);
  } catch (error: any) {
    console.error('Error obteniendo grupo:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener grupo', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = updateGrupoSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const grupo = await prisma.grupo.update({
      where: { id: params.id },
      data: validation.data,
      include: {
        curso: {
          select: { id: true, codigo: true, nombre: true, ciclo: true },
        },
        _count: {
          select: { horarios: true },
        },
      },
    });

    return createSuccessResponse(grupo);
  } catch (error: any) {
    console.error('Error actualizando grupo:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al actualizar grupo', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.grupo.update({
      where: { id: params.id },
      data: { activo: false },
    });

    return createSuccessResponse({ message: 'Grupo desactivado exitosamente' });
  } catch (error: any) {
    console.error('Error eliminando grupo:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al eliminar grupo', 500);
  }
}
