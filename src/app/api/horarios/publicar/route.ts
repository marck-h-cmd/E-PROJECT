import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { periodoId } = body;

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere el ID del período', 400);
    }

    // Publicar todos los horarios confirmados del período
    const resultado = await prisma.horario.updateMany({
      where: {
        periodoId,
        estado: 'CONFIRMADO',
      },
      data: {
        estado: 'PUBLICADO',
        publicado: true,
      },
    });

    // Actualizar estado del período
    await prisma.periodoAcademico.update({
      where: { id: periodoId },
      data: { estado: 'ACTIVO', activo: true },
    });

    return createSuccessResponse({
      message: 'Horarios publicados exitosamente',
      horariosPublicados: resultado.count,
    });
  } catch (error: any) {
    console.error('Error publicando horarios:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al publicar horarios', 500);
  }
}