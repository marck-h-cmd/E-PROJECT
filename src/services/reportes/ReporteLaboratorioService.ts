import { prisma } from '@/lib/prisma';
import { GeneradorPDF, ReporteConfig } from './GeneradorPDF';
import { UtilidadesFecha } from '@/lib/utilidadesFecha';
import { Formateadores } from '@/lib/formateadores';

export class ReporteLaboratorioService {
  private generadorPDF: GeneradorPDF;

  constructor() {
    this.generadorPDF = new GeneradorPDF();
  }

  async generar(periodoId: string): Promise<Buffer> {
    const periodo = await prisma.periodoAcademico.findUnique({
      where: { id: periodoId },
    });

    // Obtener solo laboratorios
    const laboratorios = await prisma.ambiente.findMany({
      where: {
        tipo: 'LABORATORIO',
        activo: true,
      },
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
          orderBy: [
            { diaSemana: 'asc' },
            { horaInicio: 'asc' },
          ],
        },
      },
      orderBy: { codigo: 'asc' },
    });

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reporte de Horarios por Laboratorio</title>
      </head>
      <body>
        ${this.generadorPDF.generarEncabezado(
          'Reporte de Horarios por Laboratorio',
          periodo?.nombre
        )}
    `;

    // Resumen general
    const totalHorarios = laboratorios.reduce((sum, l) => sum + l.horarios.length, 0);
    
    html += `
      <div class="resumen" style="margin-bottom: 20px; padding: 15px; background: #f7fafc; border-radius: 5px;">
        <h3>Resumen General</h3>
        <p><strong>Total de Laboratorios:</strong> ${laboratorios.length}</p>
        <p><strong>Total de Horarios Asignados:</strong> ${totalHorarios}</p>
      </div>
    `;

    for (const laboratorio of laboratorios) {
      html += `
        <div class="page-break"></div>
        <h2 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">
          ${laboratorio.codigo} - ${laboratorio.nombre}
        </h2>
        
        <div style="margin-bottom: 15px; padding: 10px; background: #f7fafc; border-radius: 5px;">
          <p><strong>Capacidad:</strong> ${Formateadores.capacidad(laboratorio.capacidad)}</p>
          <p><strong>Horarios asignados:</strong> ${laboratorio.horarios.length}</p>
          <p><strong>Ubicación:</strong> ${laboratorio.ubicacion || 'No especificada'}</p>
        </div>
      `;

      if (laboratorio.horarios.length === 0) {
        html += '<p style="color: #a0aec0; font-style: italic;">Sin horarios asignados</p>';
      } else {
        // Agrupar por día
        const horariosPorDia: Record<string, any[]> = {};
        for (const h of laboratorio.horarios) {
          const dia = UtilidadesFecha.nombreDia(h.diaSemana);
          if (!horariosPorDia[dia]) horariosPorDia[dia] = [];
          horariosPorDia[dia].push(h);
        }

        const diasOrdenados = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        for (const dia of diasOrdenados) {
          const horariosDia = horariosPorDia[dia] || [];
          if (horariosDia.length === 0) continue;

          const filas = horariosDia.map(h => [
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
      }

      // Estadísticas de ocupación del laboratorio
      const franjasPorDia = 12;
      const diasLaborables = 5;
      const maxFranjas = franjasPorDia * diasLaborables;
      const porcentajeOcupacion = maxFranjas > 0 
        ? Math.round((laboratorio.horarios.length / maxFranjas) * 100) 
        : 0;

      html += `
        <div style="margin-top: 10px; padding: 8px; background: #ebf4ff; border-radius: 5px;">
          <strong>Ocupación:</strong> ${laboratorio.horarios.length}/${maxFranjas} franjas (${porcentajeOcupacion}%)
          <div style="background: #e2e8f0; height: 10px; border-radius: 5px; margin-top: 5px;">
            <div style="background: ${porcentajeOcupacion > 80 ? '#e53e3e' : porcentajeOcupacion > 50 ? '#f59e0b' : '#10b981'}; 
                        width: ${porcentajeOcupacion}%; height: 100%; border-radius: 5px;"></div>
          </div>
        </div>
      `;
    }

    html += `
        ${this.generadorPDF.generarPiePagina()}
      </body>
      </html>
    `;

    const config: ReporteConfig = {
      titulo: 'Reporte de Horarios por Laboratorio',
      orientacion: 'landscape',
      formato: 'A4',
    };

    return await this.generadorPDF.generarPDF(html, config);
  }
}