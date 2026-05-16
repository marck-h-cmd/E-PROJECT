import { NextRequest } from 'next/server';
import { ServicioAmbiente } from '@/services/ambientes/ServicioAmbiente';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';
import { TipoAmbiente } from '@prisma/client';

const servicioAmbiente = new ServicioAmbiente();

const updateAmbienteSchema = z.object({
  codigo: z.string().min(3).max(20).optional(),
  nombre: z.string().min(3).max(100).optional(),
  tipo: z.nativeEnum(TipoAmbiente).optional(),
  capacidad: z.number().int().positive().optional(),
  ubicacion: z.string().optional(),
  activo: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ambiente = await servicioAmbiente.obtenerPorId(params.id);
    return createSuccessResponse(ambiente);
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    console.error('Error obteniendo ambiente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener ambiente', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = updateAmbienteSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const ambiente = await servicioAmbiente.actualizar(params.id, validation.data);
    return createSuccessResponse(ambiente);
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    console.error('Error actualizando ambiente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al actualizar ambiente', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await servicioAmbiente.eliminar(params.id);
    return createSuccessResponse({ message: 'Ambiente desactivado exitosamente' });
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    console.error('Error eliminando ambiente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al eliminar ambiente', 500);
  }
}
