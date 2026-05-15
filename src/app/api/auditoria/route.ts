import { NextRequest } from 'next/server';
import { ServicioAuditoria } from '@/services/auditoria/ServicioAuditoria';
import { createSuccessResponse, createErrorResponse, createPaginatedResponse } from '@/lib/respuestas';

const servicioAuditoria = new ServicioAuditoria();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);
    const usuarioId = searchParams.get('usuarioId') || undefined;
    const accion = searchParams.get('accion') || undefined;
    const entidad = searchParams.get('entidad') || undefined;
    const entidadId = searchParams.get('entidadId') || undefined;
    const fechaDesde = searchParams.get('fechaDesde') 
      ? new Date(searchParams.get('fechaDesde')!) 
      : undefined;
    const fechaHasta = searchParams.get('fechaHasta') 
      ? new Date(searchParams.get('fechaHasta')!) 
      : undefined;

    const resultado = await servicioAuditoria.obtenerHistorial(
      {
        usuarioId,
        accion,
        entidad,
        entidadId,
        fechaDesde,
        fechaHasta,
      },
      page,
      limit
    );

    return createPaginatedResponse(
      resultado.data,
      resultado.meta.page,
      resultado.meta.limit,
      resultado.meta.total
    );
  } catch (error: any) {
    console.error('Error obteniendo auditoría:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al obtener registros de auditoría', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = (request as any).user;
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    await servicioAuditoria.registrar({
      usuarioId: user?.userId,
      accion: body.accion,
      entidad: body.entidad,
      entidadId: body.entidadId,
      datos: body.datos,
      ipAddress,
    });

    return createSuccessResponse({ message: 'Registro de auditoría creado' }, undefined, 201);
  } catch (error: any) {
    console.error('Error registrando auditoría:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al registrar auditoría', 500);
  }
}