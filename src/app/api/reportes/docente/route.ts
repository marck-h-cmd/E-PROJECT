import { NextRequest, NextResponse } from 'next/server';
import { ReporteDocenteService } from '@/services/reportes/ReporteDocenteService';
import { createErrorResponse } from '@/lib/respuestas';

const reporteDocenteService = new ReporteDocenteService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId');
    const docenteId = searchParams.get('docenteId');
    const todos =
      searchParams.get('todos') === 'true' ||
      docenteId === 'todos' ||
      docenteId === '__todos__';

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere periodoId', 400);
    }

    if (!todos && !docenteId) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Indique docenteId o todos=true',
        400
      );
    }

    const pdfBuffer = todos
      ? await reporteDocenteService.generarTodos(periodoId)
      : await reporteDocenteService.generar(docenteId!, periodoId);

    const filename = todos
      ? `reporte-docentes-todos-${periodoId}.pdf`
      : `reporte-docente-${docenteId}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    console.error('Error generando reporte de docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al generar reporte de docente', 500);
  }
}
