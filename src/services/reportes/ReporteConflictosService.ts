import { prisma } from '@/lib/prisma';
import { GeneradorPDF, ReporteConfig } from './GeneradorPDF';
import { Formateadores } from '@/lib/formateadores';

export class ReporteConflictosService {
  private generadorPDF: GeneradorPDF;

  constructor() {
    this.generadorPDF = new GeneradorPDF();
  }

  async generar(periodoId: string): Promise<Buffer> {
    const periodo = await prisma.periodoAcademico.findUnique({
      where: { id: periodoId },
    });

    // Obtener todas las validaciones que no cumplen
    const conflictos = await prisma.validacionHorario.findMany({
      where: {
        cumple: false,
        horario: { periodoId },
      },
      include: {
        horario: {
          include: {
            curso: { select: { codigo: true, nombre: true } },
            docente: {
              include: {
                usuario: { select: { nombre: true, apellidos: true } },
              },
            },
            ambiente: { select: { codigo: true, nombre: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Agrupar por tipo de conflicto
    const conflictosPorTipo: Record<string, any[]> = {};
    for (const conflicto of conflictos) {
      if (!conflictosPorTipo[conflicto.tipoRegla]) {
        conflictosPorTipo[conflicto.tipoRegla] = [];
      }
      conflictosPorTipo[conflicto.tipoRegla].push(conflicto);
    }

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reporte de Conflictos</title>
      </head>
      <body>
        ${this.generadorPDF.generarEncabezado(
          'Reporte de Conflictos de Horarios',
          periodo?.nombre
        )}
        
        <div style="margin-bottom: 20px; padding: 10px; background: #fff5f5; border-radius: 5px; border-left: 4px solid #e53e3e;">
          <p><strong>Total de conflictos encontrados:</strong> ${conflictos.length}</p>
          <p><strong>Tipos de conflicto:</strong> ${Object.keys(conflictosPorTipo).length}</p>
        </div>
    `;

    // Detalle por tipo de conflicto
    for (const [tipo, lista] of Object.entries(conflictosPorTipo)) {
      html += `
        <h3 style="color: #c53030; margin-top: 20px;">${this.formatearTipoConflicto(tipo)} (${lista.length})</h3>
      `;

      const filas = lista.slice(0, 20).map(c => [
        c.horario.curso.codigo,
        c.horario.curso.nombre,
        `${c.horario.docente.usuario.nombre} ${c.horario.docente.usuario.apellidos}`,
        c.horario.ambiente.codigo,
        `${c.horario.diaSemana} ${c.horario.horaInicio}-${c.horario.horaFin}`,
        c.mensaje || 'Sin detalle',
      ]);

      html += this.generadorPDF.generarTabla(
        ['Código', 'Curso', 'Docente', 'Ambiente', 'Horario', 'Descripción'],
        filas,
        'font-size: 8pt;'
      );

      if (lista.length > 20) {
        html += `<p style="color: #a0aec0; font-style: italic;">... y ${lista.length - 20} conflictos más de este tipo</p>`;
      }
    }

    html += `
        ${this.generadorPDF.generarPiePagina()}
      </body>
      </html>
    `;

    const config: ReporteConfig = {
      titulo: 'Reporte de Conflictos',
      orientacion: 'landscape',
      formato: 'A4',
    };

    return await this.generadorPDF.generarPDF(html, config);
  }

  private formatearTipoConflicto(tipo: string): string {
    const mapa: Record<string, string> = {
      'CRUCE_DOCENTE': 'Cruce de Docente',
      'CRUCE_AMBIENTE': 'Cruce de Ambiente',
      'CRUCE_GRUPO': 'Cruce de Grupo',
      'DISPONIBILIDAD_DOCENTE': 'Disponibilidad de Docente',
      'HORAS_EXCEDIDAS': 'Horas Excedidas',
      'MANTENIMIENTO_AMBIENTE': 'Mantenimiento de Ambiente',
      'DIA_NO_LABORABLE': 'Día No Laborable',
      'ORDEN_ATENCION': 'Orden de Atención',
      'HORAS_REQUERIDAS': 'Horas Requeridas',
      'VALIDACION_COMPLETA': 'Validación Completa',
    };
    return mapa[tipo] || tipo;
  }
}