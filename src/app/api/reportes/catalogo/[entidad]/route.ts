import { NextRequest, NextResponse } from 'next/server';
import {
  EntidadCatalogo,
  ReporteCatalogoService,
} from '@/services/reportes/ReporteCatalogoService';
import { createErrorResponse } from '@/lib/respuestas';

const ENTIDADES_VALIDAS: EntidadCatalogo[] = [
  'docentes',
  'cursos',
  'ambientes',
  'periodos',
  'grupos',
  'carga-academica',
];

const servicio = new ReporteCatalogoService();

export async function GET(
  request: NextRequest,
  { params }: { params: { entidad: string } }
) {
  try {
    const entidad = params.entidad as EntidadCatalogo;
    if (!ENTIDADES_VALIDAS.includes(entidad)) {
      return createErrorResponse(
        'VALIDATION_ERROR',
        `Entidad no válida. Use: ${ENTIDADES_VALIDAS.join(', ')}`,
        400
      );
    }

    const { searchParams } = new URL(request.url);
    const periodoId = searchParams.get('periodoId') ?? undefined;

    const pdfBuffer = await servicio.generar(entidad, periodoId);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="catalogo-${entidad}.pdf"`,
      },
    });
  } catch (error: unknown) {
    console.error('Error generando catálogo PDF:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al generar catálogo PDF', 500);
  }
}
