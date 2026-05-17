import { NextRequest, NextResponse } from 'next/server';
import { ReporteConflictosService } from '@/services/reportes/ReporteConflictosService';
import { createErrorResponse } from '@/lib/respuestas';

const reporteConflictosService = new ReporteConflictosService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId');

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere periodoId', 400);
    }

    const pdfBuffer = await reporteConflictosService.generar(periodoId);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reporte-conflictos-${periodoId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generando reporte de conflictos:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al generar reporte de conflictos', 500);
  }
}