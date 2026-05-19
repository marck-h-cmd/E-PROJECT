import { prisma } from '@/lib/prisma';
import { GeneradorPDF, ReporteConfig } from './GeneradorPDF';
import { UtilidadesFecha } from '@/lib/utilidadesFecha';
import { Formateadores } from '@/lib/formateadores';

export class ReporteDocenteService {
  private generadorPDF: GeneradorPDF;

  constructor() {
    this.generadorPDF = new GeneradorPDF();
  }

  async generar(docenteId: string, periodoId: string): Promise<Buffer> {
    const docente = await prisma.docente.findUnique({
      where: { id: docenteId },
      include: {
        usuario: {
          select: { nombre: true, apellidos: true, email: true },
        },
        horarios: {
          where: {
            periodoId,
            estado: { not: 'CANCELADO' },
          },
          include: {
            curso: { select: { codigo: true, nombre: true, creditos: true } },
            ambiente: { select: { codigo: true, nombre: true, tipo: true } },
            grupo: { select: { nombre: true } },
          },
          orderBy: [
            { diaSemana: 'asc' },
            { horaInicio: 'asc' },
          ],
        },
      },
    });

    if (!docente) {
      throw new Error('Docente no encontrado');
    }

    const periodo = await prisma.periodoAcademico.findUnique({
      where: { id: periodoId },
    });

    // Paleta de colores avanzada para el reporte (Estilo 2026)
    const DAY_COLORS: Record<string, string> = {
      LUNES: '#eff6ff', // Blue
      MARTES: '#f0fdf4', // Green
      MIERCOLES: '#faf5ff', // Purple
      JUEVES: '#fffbeb', // Amber
      VIERNES: '#fff1f2', // Rose
      SABADO: '#f0f9ff', // Sky
    };

    const DAY_BORDER_COLORS: Record<string, string> = {
      LUNES: '#bfdbfe',
      MARTES: '#bbf7d0',
      MIERCOLES: '#e9d5ff',
      JUEVES: '#fef3c7',
      VIERNES: '#fecdd3',
      SABADO: '#bae6fd',
    };

    const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    const DIAS_LABEL: Record<string, string> = {
      LUNES: 'Lunes',
      MARTES: 'Martes',
      MIERCOLES: 'Miércoles',
      JUEVES: 'Jueves',
      VIERNES: 'Viernes',
      SABADO: 'Sábado',
    };

    const cursosUnicos = Array.from(new Set(docente.horarios.map(h => h.curso.codigo)));
    const totalHoras = docente.horarios.reduce((acc, h) => {
      const inicio = parseInt(h.horaInicio.split(':')[0]);
      const fin = parseInt(h.horaFin.split(':')[0]);
      return acc + (fin - inicio);
    }, 0);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reporte de Horario Profesional - ${docente.usuario.nombre}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          
          body { 
            font-family: 'Inter', system-ui, sans-serif; 
            color: #0f172a; 
            background: #ffffff;
            margin: 0; 
            padding: 40px;
            line-height: 1.5;
          }
          
          .header-container {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #0f2d55;
            padding-bottom: 20px;
          }
          
          .institution {
            font-size: 0.8rem;
            font-weight: 800;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin-bottom: 8px;
          }
          
          .faculty {
            font-size: 1.5rem;
            font-weight: 900;
            color: #0f2d55;
            letter-spacing: -0.02em;
            margin: 0;
          }
          
          .report-title {
            margin-top: 15px;
            font-size: 1.1rem;
            font-weight: 600;
            color: #334155;
          }

          .docente-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            margin-bottom: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          }

          .docente-name {
            font-size: 1.25rem;
            font-weight: 800;
            color: #0f172a;
            margin: 0;
          }

          .docente-info {
            font-size: 0.875rem;
            color: #64748b;
            font-weight: 500;
            margin-top: 4px;
          }

          .stats-grid {
            display: flex;
            gap: 32px;
          }

          .stat-box {
            text-align: right;
          }

          .stat-label {
            font-size: 0.65rem;
            font-weight: 800;
            text-transform: uppercase;
            color: #94a3b8;
            letter-spacing: 0.1em;
          }

          .stat-value {
            font-size: 1.5rem;
            font-weight: 900;
            color: #0f2d55;
          }

          .day-section {
            margin-bottom: 32px;
            page-break-inside: avoid;
          }

          .day-header {
            font-size: 1rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .day-header::after {
            content: '';
            flex: 1;
            height: 2px;
            background: #f1f5f9;
          }

          .table-container {
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.04);
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background: #ffffff;
          }

          th {
            background: #f1f5f9;
            padding: 14px 20px;
            text-align: left;
            font-size: 0.7rem;
            font-weight: 800;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #e2e8f0;
          }

          td {
            padding: 16px 20px;
            font-size: 0.875rem;
            color: #1e293b;
            border-bottom: 1px solid #f1f5f9;
          }

          .col-horario { font-weight: 700; color: #0f2d55; width: 120px; }
          .col-codigo { font-family: monospace; font-weight: 600; color: #64748b; width: 100px; }
          .col-curso { font-weight: 800; color: #0f172a; }
          .col-aula { font-weight: 700; color: #334155; }
          .badge {
            padding: 4px 10px;
            border-radius: 8px;
            font-size: 0.65rem;
            font-weight: 800;
            text-transform: uppercase;
          }

          .footer {
            margin-top: 60px;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.75rem;
            color: #94a3b8;
            font-weight: 500;
          }

          @media print {
            body { padding: 20px; }
            .docente-card { box-shadow: none; border: 1px solid #e2e8f0; }
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <div class="institution">Universidad Nacional de Trujillo</div>
          <h1 class="faculty">Escuela de Ingeniería de Sistemas</h1>
          <div class="report-title">Reporte de Horario Académico ${periodo?.nombre || ''}</div>
        </div>

        <div class="docente-card">
          <div>
            <h2 class="docente-name">${docente.usuario.nombre} ${docente.usuario.apellidos}</h2>
            <div class="docente-info">Docente de Pregrado • Código: ${docente.codigo}</div>
          </div>
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-label">Carga Lectiva</div>
              <div class="stat-value">${totalHoras.toFixed(1)}h</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Cursos</div>
              <div class="stat-value">${cursosUnicos.length}</div>
            </div>
          </div>
        </div>

        ${DIAS.map(dia => {
          const horariosDia = docente.horarios.filter(h => h.diaSemana === dia);
          if (horariosDia.length === 0) return '';
          
          return `
            <div class="day-section">
              <div class="day-header" style="color: ${DAY_BORDER_COLORS[dia]}">
                ${DIAS_LABEL[dia]}
              </div>
              <div class="table-container" style="border-top: 4px solid ${DAY_BORDER_COLORS[dia]}">
                <table>
                  <thead>
                    <tr>
                      <th>Horario</th>
                      <th>Código</th>
                      <th>Asignatura</th>
                      <th>Aula</th>
                      <th>Tipo</th>
                      <th>Grupo</th>
                      <th>Créd.</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${horariosDia.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio)).map(h => `
                      <tr style="background-color: ${DAY_COLORS[dia]}">
                        <td class="col-horario">${h.horaInicio} - ${h.horaFin}</td>
                        <td class="col-codigo">${h.curso.codigo}</td>
                        <td class="col-curso">${h.curso.nombre}</td>
                        <td class="col-aula">${h.ambiente.codigo}</td>
                        <td>
                          <span class="badge" style="background: #ffffff; border: 1px solid ${DAY_BORDER_COLORS[dia]}; color: #334155">
                            ${h.ambiente.tipo === 'LABORATORIO' ? 'LAB' : 'AULA'}
                          </span>
                        </td>
                        <td><span class="badge" style="background: #0f2d55; color: #ffffff">${h.grupo?.nombre || '-'}</span></td>
                        <td style="font-weight: 700">${h.curso.creditos || 3}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          `;
        }).join('')}

        <div class="footer">
          <div>© 2026 UNT - Gestión de Horarios</div>
          <div>Generado el ${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
          <div>Página 1 de 1</div>
        </div>
      </body>
      </html>
    `;

    const config: ReporteConfig = {
      titulo: `Horario - ${docente.usuario.nombre} ${docente.usuario.apellidos}`,
      orientacion: 'landscape',
      formato: 'A4',
    };

    return await this.generadorPDF.generarPDF(html, config);
  }
}