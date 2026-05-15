import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const docente = await prisma.docente.findUnique({
      where: { id: params.id },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellidos: true,
            rol: true,
            activo: true,
            ultimoAcceso: true,
          },
        },
        preferenciasNotificacion: true,
        cursos: {
          include: {
            curso: true,
          },
        },
        _count: {
          select: {
            horarios: true,
          },
        },
      },
    });

    if (!docente) {
      return createErrorResponse('NOT_FOUND', 'Docente no encontrado', 404);
    }

    return createSuccessResponse(docente);
  } catch (error) {
    console.error('Error obteniendo docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener docente', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const docente = await prisma.docente.update({
      where: { id: params.id },
      data: {
        categoria: body.categoria,
        departamento: body.departamento,
        telefono: body.telefono,
        whatsapp: body.whatsapp,
        usuario: {
          update: {
            nombre: body.nombre,
            apellidos: body.apellidos,
            activo: body.activo,
          },
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            email: true,
            nombre: true,
            apellidos: true,
          },
        },
      },
    });

    return createSuccessResponse(docente);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return createErrorResponse('NOT_FOUND', 'Docente no encontrado', 404);
    }
    console.error('Error actualizando docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al actualizar docente', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Soft delete: desactivar en lugar de eliminar
    const docente = await prisma.docente.update({
      where: { id: params.id },
      data: {
        usuario: {
          update: {
            activo: false,
          },
        },
      },
    });

    return createSuccessResponse({ message: 'Docente desactivado exitosamente' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return createErrorResponse('NOT_FOUND', 'Docente no encontrado', 404);
    }
    console.error('Error eliminando docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al eliminar docente', 500);
  }
}