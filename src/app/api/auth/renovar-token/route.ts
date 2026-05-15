import { NextRequest } from 'next/server';
import { z } from 'zod';
import { AuthService } from '@/services/auth/AuthService';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

const authService = new AuthService();

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Token de refresco requerido'),
});

/**
 * @swagger
 * /api/auth/renovar-token:
 *   post:
 *     summary: Renovar token de acceso
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens renovados exitosamente
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = refreshSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Datos inválidos',
        400,
        validation.error.errors
      );
    }

    const tokens = await authService.refreshToken(validation.data.refreshToken);

    return createSuccessResponse({ tokens });
  } catch (error: any) {
    if (error.statusCode) {
      return createErrorResponse(error.code, error.message, error.statusCode);
    }
    console.error('Error renovando token:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al renovar token', 500);
  }
}