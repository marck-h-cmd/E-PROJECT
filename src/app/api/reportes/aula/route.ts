import { NextRequest, NextResponse } from 'next/server';
import { ReporteAulaService } from '@/services/reportes/ReporteAulaService';
import { createErrorResponse } from '@/lib/respuestas';

const reporteAulaService = new ReporteAulaService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ambienteId = searchParams.get('ambienteId');
    const periodoId = searchParams.get('periodoId');

    if (!ambienteId || !periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requieren ambienteId y periodoId', 400);
    }

    const pdfBuffer = await reporteAulaService.generar(ambienteId, periodoId);

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reporte-aula-${ambienteId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generando reporte de aula:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al generar reporte de aula', 500);
  }
}