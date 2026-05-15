import { NextRequest, NextResponse } from 'next/server';
import { ReporteAulaService } from '@/services/reportes/ReporteAulaService';
import { ReporteDocenteService } from '@/services/reportes/ReporteDocenteService';
import { ReporteGestionService } from '@/services/reportes/ReporteGestionService';
import { ReporteConflictosService } from '@/services/reportes/ReporteConflictosService';
import { createErrorResponse } from '@/lib/respuestas';
import { z } from 'zod';

const reporteAulaService = new ReporteAulaService();
const reporteDocenteService = new ReporteDocenteService();
const reporteGestionService = new ReporteGestionService();
const reporteConflictosService = new ReporteConflictosService();

const generarSchema = z.object({
  tipo: z.enum(['aula', 'docente', 'gestion', 'conflictos']),
  periodoId: z.string().uuid(),
  ambienteId: z.string().uuid().optional(),
  docenteId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validation = generarSchema.safeParse(body);
    if (!validation.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Datos inválidos', 400, validation.error.errors);
    }

    const { tipo, periodoId, ambienteId, docenteId } = validation.data;

    let pdfBuffer: Buffer;
    let nombreArchivo: string;

    switch (tipo) {
      case 'aula':
        if (!ambienteId) {
          return createErrorResponse('VALIDATION_ERROR', 'Se requiere el ID del ambiente', 400);
        }
        pdfBuffer = await reporteAulaService.generar(ambienteId, periodoId);
        nombreArchivo = `reporte-aula-${ambienteId}.pdf`;
        break;

      case 'docente':
        if (!docenteId) {
          return createErrorResponse('VALIDATION_ERROR', 'Se requiere el ID del docente', 400);
        }
        pdfBuffer = await reporteDocenteService.generar(docenteId, periodoId);
        nombreArchivo = `reporte-docente-${docenteId}.pdf`;
        break;

      case 'gestion':
        pdfBuffer = await reporteGestionService.generar(periodoId);
        nombreArchivo = `reporte-gestion-${periodoId}.pdf`;
        break;

      case 'conflictos':
        pdfBuffer = await reporteConflictosService.generar(periodoId);
        nombreArchivo = `reporte-conflictos-${periodoId}.pdf`;
        break;

      default:
        return createErrorResponse('VALIDATION_ERROR', 'Tipo de reporte no válido', 400);
    }

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${nombreArchivo}"`,
      },
    });
  } catch (error: any) {
    console.error('Error generando reporte:', error);
    return createErrorResponse('INTERNAL_ERROR', 'Error al generar reporte', 500);
  }
}