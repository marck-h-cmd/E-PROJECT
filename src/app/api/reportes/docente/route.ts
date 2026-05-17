import { NextRequest, NextResponse } from 'next/server';
import { ReporteDocenteService } from '@/services/reportes/ReporteDocenteService';
import { createErrorResponse } from '@/lib/respuestas';

const reporteDocenteService = new ReporteDocenteService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const docenteId = searchParams.get('docenteId');
    const periodoId = searchParams.get('periodoId');

    if (!docenteId || !periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requieren docenteId y periodoId', 400);
    }

    const pdfBuffer = await reporteDocenteService.generar(docenteId, periodoId);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reporte-docente-${docenteId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generando reporte de docente:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al generar reporte de docente', 500);
  }
}