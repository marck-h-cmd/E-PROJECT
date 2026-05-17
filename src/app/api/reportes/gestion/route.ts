import { NextRequest, NextResponse } from 'next/server';
import { ReporteGestionService } from '@/services/reportes/ReporteGestionService';
import { createErrorResponse } from '@/lib/respuestas';

const reporteGestionService = new ReporteGestionService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId');

    if (!periodoId) {
      return createErrorResponse('VALIDATION_ERROR', 'Se requiere periodoId', 400);
    }

    const pdfBuffer = await reporteGestionService.generar(periodoId);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="reporte-gestion-${periodoId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generando reporte de gestión:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al generar reporte de gestión', 500);
  }
}