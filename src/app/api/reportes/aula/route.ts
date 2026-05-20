import { NextRequest, NextResponse } from 'next/server';
import { ReporteAulaService } from '@/services/reportes/ReporteAulaService';
import { createErrorResponse } from '@/lib/respuestas';

const reporteAulaService = new ReporteAulaService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId');
    const ambienteId = searchParams.get('ambienteId');
    const todos =
      searchParams.get('todos') === 'true' ||
      ambienteId === 'todos' ||
      ambienteId === '__todos__';

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere periodoId', 400);
    }

    if (!todos && !ambienteId) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        'Indique ambienteId o todos=true',
        400
      );
    }

    const pdfBuffer = todos
      ? await reporteAulaService.generarTodos(periodoId)
      : await reporteAulaService.generar(ambienteId!, periodoId);

    const filename = todos
      ? `reporte-ambientes-todos-${periodoId}.pdf`
      : `reporte-aula-${ambienteId}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    console.error('Error generando reporte de aula:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al generar reporte de aula', 500);
  }
}
