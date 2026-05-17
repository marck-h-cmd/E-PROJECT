import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const cursoId = searchParams.get('cursoId') || undefined;
    const docenteId = searchParams.get('docenteId') || undefined;
    const search = searchParams.get('search') || undefined;

    const where: {
      activo?: boolean;
      cursoId?: string;
      docenteId?: string;
      OR?: Array<Record<string, unknown>>;
    } = { activo: true };

    if (cursoId) where.cursoId = cursoId;
    if (docenteId) where.docenteId = docenteId;

    if (search) {
      where.OR = [
        { curso: { codigo: { contains: search, mode: 'insensitive' } } },
        { curso: { nombre: { contains: search, mode: 'insensitive' } } },
        {
          docente: {
            usuario: {
              OR: [
                { nombre: { contains: search, mode: 'insensitive' } },
                { apellidos: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.cursoDocente.findMany({
        where,
        include: {
          curso: { select: { id: true, codigo: true, nombre: true, creditos: true, ciclo: true } },
          docente: {
            include: {
              usuario: { select: { nombre: true, apellidos: true, email: true } },
            },
          },
        },
        orderBy: [{ curso: { codigo: 'asc' } }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.cursoDocente.count({ where }),
    ]);

    return createPaginatedResponse(items, page, limit, total);
  } catch (error) {
    console.error('Error listando carga académica:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al listar carga académica', 500);
  }
}
