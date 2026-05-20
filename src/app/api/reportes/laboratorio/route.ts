import { NextRequest, NextResponse } from 'next/server';
import { ReporteLaboratorioService } from '@/services/reportes/ReporteLaboratorioService';
import { createErrorResponse } from '@/lib/respuestas';

const reporteLaboratorioService = new ReporteLaboratorioService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId');

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere periodoId', 400);
    }

    const pdfBuffer = await reporteLaboratorioService.generar(periodoId);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reporte-laboratorios-${periodoId}.pdf"`,
      },
    });
  } catch (error: unknown) {
    console.error('Error generando reporte de laboratorios:', error);
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Error al generar reporte de laboratorios',
      500
    );
  }
}
