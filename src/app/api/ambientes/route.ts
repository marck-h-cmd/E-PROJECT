import { NextRequest } from 'next/server';
import { ServicioAmbiente } from '@/services/ambientes/ServicioAmbiente';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';
import { z } from 'zod';
import { TipoAmbiente } from '@prisma/client';

const servicioAmbiente = new ServicioAmbiente();

const ambienteSchema = z.object({
  codigo: z.string().min(3).max(20),
  nombre: z.string().min(3).max(100),
  tipo: z.nativeEnum(TipoAmbiente),
  capacidad: z.number().int().positive(),
  ubicacion: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || undefined;
    const tipo = searchParams.get('tipo') as TipoAmbiente || undefined;
    const activo = searchParams.get('activo') === 'true' ? true : 
                   searchParams.get('activo') === 'false' ? false : undefined;

    const resultado = await servicioAmbiente.listar({
      page,
      limit,
      search,
      tipo,
      activo,
    });

    return createPaginatedResponse(resultado.data, page, limit, resultado.meta.total);
  } catch (error: any) {
    console.error('Error listando ambientes:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al listar ambientes', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = ambienteSchema.safeParse(body);

    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const ambiente = await servicioAmbiente.crear(validation.data);
    return createSuccessResponse(ambiente, undefined, 201);
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    console.error('Error creando ambiente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al crear ambiente', 500);
  }
}
