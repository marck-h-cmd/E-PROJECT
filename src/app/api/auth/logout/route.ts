import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth/AuthService';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';
import { withAuth } from '@/middleware/auth';

const authService = new AuthService();

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
export async function POST(request: NextRequest) {
  try {
    const user = (request as any).user; // Del middleware de auth
    
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      await authService.logout(user.userId, token);
    }

    return createSuccessResponse({ message: 'Sesión cerrada exitosamente' });
  } catch (error: any) {
    console.error('Error en logout:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al cerrar sesión', 500);
  }
}