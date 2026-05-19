import { NextRequest } from 'next/server';
import { ServicioDocente } from '@/services/docentes/ServicioDocente';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const servicioDocente = new ServicioDocente();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cursos = await servicioDocente.obtenerCursosConGrupos(params.id);
    return createSuccessResponse(cursos);
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener cursos', 500);
  }
}