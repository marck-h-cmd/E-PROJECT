import { NextRequest, NextResponse } from 'next/server';
import { ReporteHorariosConfirmadosService } from '@/services/reportes/ReporteHorariosConfirmadosService';
import { createErrorResponse } from '@/lib/respuestas';

const reporteService = new ReporteHorariosConfirmadosService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId');

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere periodoId', 400);
    }

    const pdfBuffer = await reporteService.generar(periodoId);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="horarios-confirmados-${periodoId}.pdf"`,
      },
    });
  } catch (error: unknown) {
    console.error('Error generando reporte de horarios confirmados:', error);
    return createErrorResponse(
      'INTERNAL_ERROR',
      'Error al generar reporte de horarios confirmados',
      500
    );
  }
}
