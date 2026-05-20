import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { atencionId } = body;

    if (!atencionId) {
      return createErrorResponse('BAD_REQUEST', 'atencionId requerido', 400);
    }

    const atencion = await prisma.atencionVentana.findFirst({
      where: {
        id: atencionId,
        ventanaId: params.id,
        estado: 'AUSENTE',
      },
      include: {
        docente: {
          include: {
            usuario: {
              select: { nombre: true, apellidos: true, id: true }
            }
          }
        }
      }
    });

    if (!atencion) {
      return createErrorResponse('NOT_FOUND', 'Atención no encontrada', 404);
    }

    await prisma.notificacion.updateMany({
      where: {
        AND: [
          { metadata: { path: ['atencionId'], equals: atencionId } },
          { metadata: { path: ['ventanaId'], equals: params.id } }
        ]
      },
      data: {
        estado: 'LEIDA',
      }
    });

    await prisma.notificacion.create({
      data: {
        usuarioId: atencion.docente.usuario.id,
        tipo: 'SISTEMA',
        titulo: 'Justificación aceptada',
        mensaje: 'El administrador ha aceptado tu justificación de ausencia. Se te reagendará para la siguiente ventana disponible.',
        prioridad: 'ALTA',
        canal: 'SISTEMA',
        estado: 'PENDIENTE',
        metadata: {
          ventanaId: params.id,
          atencionId,
          accion: 'JUSTIFICACION_ACEPTADA',
        }
      }
    });

    return createSuccessResponse({
      message: 'Justificación confirmada correctamente',
      atencionId,
    });

  } catch (error: any) {
    console.error('Error confirmando justificación:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al confirmar justificación', 500);
  }
}
