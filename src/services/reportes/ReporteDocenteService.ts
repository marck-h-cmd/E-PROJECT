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

    // Calcular total de horas
    let totalHoras = 0;
    for (const horario of docente.horarios) {
      const [hInicio, mInicio] = horario.horaInicio.split(':').map(Number);
      const [hFin, mFin] = horario.horaFin.split(':').map(Number);
      totalHoras += (hFin + mFin / 60) - (hInicio + mInicio / 60);
    }

    // Agrupar por día
    const horariosPorDia: Record<string, any[]> = {};
    for (const horario of docente.horarios) {
      const dia = UtilidadesFecha.nombreDia(horario.diaSemana);
      if (!horariosPorDia[dia]) {
        horariosPorDia[dia] = [];
      }
      horariosPorDia[dia].push(horario);
    }

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reporte de Horario por Docente</title>
      </head>
      <body>
        ${this.generadorPDF.generarEncabezado(
          'Horario de Docente',
          periodo?.nombre
        )}
        
        <div class="info-docente" style="margin-bottom: 20px; padding: 15px; background: #f7fafc; border-radius: 5px; border-left: 4px solid #1a365d;">
          <h3 style="color: #1a365d; margin-top: 0;">${docente.usuario.nombre} ${docente.usuario.apellidos}</h3>
          <p><strong>Código:</strong> ${docente.codigo}</p>
          <p><strong>Categoría:</strong> ${Formateadores.categoriaDocente(docente.categoria)}</p>
          <p><strong>Departamento:</strong> ${docente.departamento || 'No especificado'}</p>
          <p><strong>Email:</strong> ${docente.usuario.email}</p>
          <p><strong>Total de horas asignadas:</strong> ${totalHoras.toFixed(1)} horas</p>
        </div>
    `;

    const diasOrdenados = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    for (const dia of diasOrdenados) {
      const horariosDia = horariosPorDia[dia] || [];
      
      if (horariosDia.length === 0) continue;

      const filas = horariosDia.map(h => [
        `${h.horaInicio} - ${h.horaFin}`,
        h.curso.codigo,
        h.curso.nombre,
        h.ambiente.codigo,
        Formateadores.tipoAmbiente(h.ambiente.tipo),
        h.grupo?.nombre || '-',
        `${h.curso.creditos} créd.`,
      ]);

      html += `
        <div class="dia" style="margin-bottom: 15px;">
          <h3 style="color: #1a365d; background: #e2e8f0; padding: 8px;">${dia}</h3>
          ${this.generadorPDF.generarTabla(
            ['Horario', 'Código', 'Curso', 'Aula', 'Tipo', 'Grupo', 'Créditos'],
            filas
          )}
        </div>
      `;
    }

    // Resumen de cursos
    const cursosUnicos = [...new Set(docente.horarios.map(h => h.curso.codigo))];
    
    html += `
      <div class="resumen" style="margin-top: 30px; padding: 15px; background: #f7fafc; border-radius: 5px;">
        <h3 style="color: #1a365d;">Resumen de Cursos Asignados</h3>
        <p><strong>Total de cursos:</strong> ${cursosUnicos.length}</p>
        <p><strong>Cursos:</strong> ${cursosUnicos.join(', ')}</p>
      </div>
    `;

    html += `
        ${this.generadorPDF.generarPiePagina()}
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