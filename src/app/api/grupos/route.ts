import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSuccessResponse, createErrorResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursoId = searchParams.get('cursoId');

    const where: any = {};
    if (cursoId) where.cursoId = cursoId;

    const grupos = await prisma.grupo.findMany({
      where,
      include: {
        curso: {
          select: { id: true, codigo: true, nombre: true },
        },
        _count: {
          select: { horarios: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });

    return createSuccessResponse(grupos);
  } catch (error: any) {
    console.error('Error listando grupos:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al listar grupos', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const grupo = await prisma.grupo.create({
      data: {
        cursoId: body.cursoId,
        nombre: body.nombre,
        capacidad: body.capacidad,
      },
    });

    return createSuccessResponse(grupo, undefined, 201);
  } catch (error: any) {
    console.error('Error creando grupo:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al crear grupo', 500);
  }
}