import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const usuarioId = searchParams.get('usuarioId');
    const termino = searchParams.get('q') ?? searchParams.get('search');

    // Buscar por usuarioId (para obtener docenteId del docente logueado)
    if (usuarioId) {
      const docente = await prisma.docente.findUnique({
        where: { usuarioId },
        select: {
          id: true,
          codigo: true,
          categoria: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellidos: true,
              email: true,
            },
          },
        },
      });

      if (!docente) {
        return createErrorResponse('NOT_FOUND', 'Docente no encontrado', 404);
      }

      return createSuccessResponse(docente);
    }

    // Buscar por término (autocompletado)
    if (termino && termino.length >= 2) {
      const docentes = await prisma.docente.findMany({
        where: {
          usuario: { activo: true },
          OR: [
            { codigo: { contains: termino, mode: 'insensitive' } },
            { usuario: { nombre: { contains: termino, mode: 'insensitive' } } },
            { usuario: { apellidos: { contains: termino, mode: 'insensitive' } } },
            { usuario: { email: { contains: termino, mode: 'insensitive' } } },
          ],
        },
        select: {
          id: true,
          codigo: true,
          categoria: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellidos: true,
              email: true,
            },
          },
        },
        take: 10,
      });

      return createSuccessResponse(docentes);
    }

    return createErrorResponse('BAD_REQUEST', 'Proporciona usuarioId o término de búsqueda', 400);
  } catch (error: any) {
    console.error('Error buscando docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al buscar docente', 500);
  }
}