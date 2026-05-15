import { NextRequest } from 'next/server';
import { ValidadorHorario } from '@/services/horarios/ValidadorHorario';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const validador = new ValidadorHorario();

const validarSchema = z.object({
  periodoId: z.string().uuid(),
  docenteId: z.string().uuid(),
  cursoId: z.string().uuid(),
  ambienteId: z.string().uuid(),
  grupoId: z.string().uuid().optional(),
  diaSemana: z.enum(['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/),
  horaFin: z.string().regex(/^\d{2}:\d{2}$/),
});

/**
 * @swagger
 * /api/horarios/validar-seleccion:
 *   post:
 *     summary: Validar una selección de horario antes de confirmar
 *     tags: [Horarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               periodoId:
 *                 type: string
 *               docenteId:
 *                 type: string
 *               cursoId:
 *                 type: string
 *               ambienteId:
 *                 type: string
 *               diaSemana:
 *                 type: string
 *               horaInicio:
 *                 type: string
 *               horaFin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Resultado de la validación
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = validarSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const resultado = await validador.validarHorario(
      validation.data.periodoId,
      validation.data.docenteId,
      validation.data.cursoId,
      validation.data.ambienteId,
      validation.data.grupoId,
      validation.data.diaSemana,
      validation.data.horaInicio,
      validation.data.horaFin
    );

    return createSuccessResponse(resultado);
  } catch (error: any) {
    console.error('Error validando selección:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al validar selección', 500);
  }
}