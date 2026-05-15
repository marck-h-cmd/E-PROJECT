import { NextRequest } from 'next/server';
import { GestorSeleccionTemporal } from '@/services/horarios/GestorSeleccionTemporal';
import { ServicioHorario } from '@/services/horarios/ServicioHorario';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const gestorSeleccion = new GestorSeleccionTemporal();
const servicioHorario = new ServicioHorario();

const confirmarSchema = z.object({
  sessionId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const user = (request as any).user;
    const body = await request.json();
    
    const validation = confirmarSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    // Obtener la selección temporal
    const seleccion = await gestorSeleccion.obtenerSeleccion(validation.data.sessionId);

    // Crear horarios para cada celda
    const horariosCreados = [];
    for (const celda of seleccion.celdas) {
      const horario = await servicioHorario.crear({
        periodoId: seleccion.periodoId,
        cursoId: seleccion.cursoId,
        docenteId: seleccion.docenteId,
        grupoId: celda.grupoId,
        ambienteId: celda.ambienteId,
        diaSemana: celda.diaSemana as any,
        horaInicio: celda.horaInicio,
        horaFin: celda.horaFin,
      }, user.userId);
      
      horariosCreados.push(horario);
    }

    // Limpiar la selección temporal
    await gestorSeleccion.confirmarSeleccion(validation.data.sessionId);

    return createSuccessResponse({
      message: 'Selección confirmada exitosamente',
      horarios: horariosCreados,
    }, undefined, 201);
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    console.error('Error confirmando selección:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al confirmar selección', 500);
  }
}