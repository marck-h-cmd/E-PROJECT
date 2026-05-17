import { NextRequest } from 'next/server';
import { ServicioCurso } from '@/services/cursos/ServicioCurso';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const servicioCurso = new ServicioCurso();

const asignarSchema = z.object({
  docenteId: z.string().uuid(),
  horasAsignadas: z.number().int().min(0),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = asignarSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const { docenteId, horasAsignadas } = validation.data;
    const asignacion = await servicioCurso.asignarDocente(params.id, docenteId, horasAsignadas);

    return createSuccessResponse(asignacion, undefined, 201);
  } catch (error: unknown) {
    const err = error as { statusCode?: number; code?: string; message?: string };
    if (err.statusCode) {
      return createErrorResponse(err.code || 'ERROR', err.message || 'Error', err.statusCode);
    }
    console.error('Error asignando docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al asignar docente', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const docenteId = searchParams.get('docenteId');

    if (!docenteId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere docenteId', 400);
    }

    await servicioCurso.removerDocente(params.id, docenteId);
    return createSuccessResponse({ message: 'Docente removido del curso' });
  } catch (error: unknown) {
    const err = error as { statusCode?: number; code?: string; message?: string };
    if (err.statusCode) {
      return createErrorResponse(err.code || 'ERROR', err.message || 'Error', err.statusCode);
    }
    console.error('Error removiendo docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al remover docente', 500);
  }
}
