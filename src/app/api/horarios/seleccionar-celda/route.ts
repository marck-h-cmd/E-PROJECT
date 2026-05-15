import { NextRequest } from 'next/server';
import { GestorSeleccionTemporal } from '@/services/horarios/GestorSeleccionTemporal';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const gestorSeleccion = new GestorSeleccionTemporal();

const seleccionarSchema = z.object({
  sessionId: z.string().uuid(),
  celda: z.object({
    diaSemana: z.string(),
    horaInicio: z.string(),
    horaFin: z.string(),
    ambienteId: z.string().uuid(),
    grupoId: z.string().uuid().optional(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = seleccionarSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const seleccion = await gestorSeleccion.agregarCelda(
      validation.data.sessionId,
      validation.data.celda
    );

    return createSuccessResponse(seleccion);
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    console.error('Error seleccionando celda:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al seleccionar celda', 500);
  }
}