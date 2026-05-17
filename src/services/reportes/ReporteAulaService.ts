import { prisma } from '@/lib/prisma';
import { GeneradorPDF, ReporteConfig } from './GeneradorPDF';
import { UtilidadesFecha } from '@/lib/utilidadesFecha';
import { Formateadores } from '@/lib/formateadores';

export class ReporteAulaService {
  private generadorPDF: GeneradorPDF;

  constructor() {
    this.generadorPDF = new GeneradorPDF();
  }

  async generar(ambienteId: string, periodoId: string): Promise<Buffer> {
    const ambiente = await prisma.ambiente.findUnique({
      where: { id: ambienteId },
      include: {
        horarios: {
          where: {
            periodoId,
            estado: { not: 'CANCELADO' },
          },
          include: {
            curso: { select: { codigo: true, nombre: true } },
            docente: {
              include: {
                usuario: { select: { nombre: true, apellidos: true } },
              },
            },
            grupo: { select: { nombre: true } },
          },
          orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
        },
      },
    });

    if (!ambiente) {
      throw new Error('Ambiente no encontrado');
    }

    const periodo = await prisma.periodoAcademico.findUnique({
      where: { id: periodoId },
    });

    const horariosPorDia: Record<string, typeof ambiente.horarios> = {};
    for (const horario of ambiente.horarios) {
      const dia = UtilidadesFecha.nombreDia(horario.diaSemana);
      if (!horariosPorDia[dia]) horariosPorDia[dia] = [];
      horariosPorDia[dia].push(horario);
    }

    let html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Reporte de Aula</title></head>
      <body>
        ${this.generadorPDF.generarEncabezado('Reporte de Horario por Aula', periodo?.nombre)}
        <div style="margin-bottom: 20px; padding: 15px; background: #f7fafc; border-radius: 5px; border-left: 4px solid #1a365d;">
          <h3 style="color: #1a365d; margin-top: 0;">${ambiente.codigo} - ${ambiente.nombre}</h3>
          <p><strong>Tipo:</strong> ${Formateadores.tipoAmbiente(ambiente.tipo)}</p>
          <p><strong>Capacidad:</strong> ${Formateadores.capacidad(ambiente.capacidad)}</p>
          <p><strong>Ubicación:</strong> ${ambiente.ubicacion || 'No especificada'}</p>
          <p><strong>Horarios asignados:</strong> ${ambiente.horarios.length}</p>
        </div>
    `;

    if (ambiente.horarios.length === 0) {
      html += '<p style="color: #a0aec0; font-style: italic;">Sin horarios asignados</p>';
    } else {
      const diasOrdenados = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      for (const dia of diasOrdenados) {
        const horariosDia = horariosPorDia[dia] || [];
        if (horariosDia.length === 0) continue;

        const filas = horariosDia.map((h) => [
          `${h.horaInicio} - ${h.horaFin}`,
          h.curso.codigo,
          h.curso.nombre,
          `${h.docente.usuario.nombre} ${h.docente.usuario.apellidos}`,
          h.grupo?.nombre || '-',
        ]);

        html += `
          <h4 style="color: #4a5568;">${dia}</h4>
          ${this.generadorPDF.generarTabla(
            ['Horario', 'Código', 'Curso', 'Docente', 'Grupo'],
            filas,
            'font-size: 8pt;'
          )}
        `;
      }

      const franjasPorDia = 12;
      const diasLaborables = 5;
      const maxFranjas = franjasPorDia * diasLaborables;
      const porcentaje =
        maxFranjas > 0 ? Math.round((ambiente.horarios.length / maxFranjas) * 100) : 0;

      html += `
        <div style="margin-top: 10px; padding: 8px; background: #ebf4ff; border-radius: 5px;">
          <strong>Ocupación:</strong> ${ambiente.horarios.length}/${maxFranjas} franjas (${porcentaje}%)
        </div>
      `;
    }

    html += `${this.generadorPDF.generarPiePagina()}</body></html>`;

    const config: ReporteConfig = {
      titulo: 'Reporte de Horario por Aula',
      orientacion: 'landscape',
      formato: 'A4',
    };

    return await this.generadorPDF.generarPDF(html, config);
  }
}
