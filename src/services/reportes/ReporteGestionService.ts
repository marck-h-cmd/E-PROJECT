import { prisma } from '@/lib/prisma';
import { GeneradorPDF, ReporteConfig } from './GeneradorPDF';
import { ServicioEstadisticas } from '@/services/estadisticas/ServicioEstadisticas';
import { Formateadores } from '@/lib/formateadores';

export class ReporteGestionService {
  private generadorPDF: GeneradorPDF;
  private servicioEstadisticas: ServicioEstadisticas;

  constructor() {
    this.generadorPDF = new GeneradorPDF();
    this.servicioEstadisticas = new ServicioEstadisticas();
  }

  async generar(periodoId: string): Promise<Buffer> {
    const periodo = await prisma.periodoAcademico.findUnique({
      where: { id: periodoId },
      include: {
        configuraciones: true,
      },
    });

    if (!periodo) {
      throw new Error('Período no encontrado');
    }

    const resumen = await this.servicioEstadisticas.obtenerResumen(periodoId);
    const avanceCategoria = await this.servicioEstadisticas.obtenerAvanceCategoria(periodoId);
    const ocupacion = await this.servicioEstadisticas.obtenerOcupacionAmbientes(periodoId);

    // Estadísticas adicionales
    const totalDocentesPorCategoria = await prisma.docente.groupBy({
      by: ['categoria'],
      where: { usuario: { activo: true } },
      _count: true,
    });

    const docentesConHorarios = await prisma.horario.groupBy({
      by: ['docenteId'],
      where: { periodoId, estado: { not: 'CANCELADO' } },
    });

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reporte de Gestión</title>
      </head>
      <body>
        ${this.generadorPDF.generarEncabezado(
          'Reporte de Gestión de Horarios',
          periodo.nombre
        )}
        
        <h2 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">1. Resumen General</h2>
        
        <div class="resumen-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div style="padding: 10px; background: #ebf4ff; border-radius: 5px;">
            <strong>Total Docentes:</strong> ${resumen.totalDocentes}
          </div>
          <div style="padding: 10px; background: #ebf4ff; border-radius: 5px;">
            <strong>Total Cursos:</strong> ${resumen.totalCursos}
          </div>
          <div style="padding: 10px; background: #ebf4ff; border-radius: 5px;">
            <strong>Total Ambientes:</strong> ${resumen.totalAmbientes}
          </div>
          <div style="padding: 10px; background: #ebf4ff; border-radius: 5px;">
            <strong>Total Horarios:</strong> ${resumen.totalHorarios}
          </div>
          <div style="padding: 10px; background: #ebf4ff; border-radius: 5px;">
            <strong>Docentes con Horarios:</strong> ${docentesConHorarios.length}
          </div>
          <div style="padding: 10px; background: #ebf4ff; border-radius: 5px;">
            <strong>Período:</strong> ${new Date(periodo.fechaInicio).toLocaleDateString('es-PE')} - ${new Date(periodo.fechaFin).toLocaleDateString('es-PE')}
          </div>
        </div>
    `;

    // Sección de avance por categoría
    html += `
      <h2 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">2. Avance por Categoría Docente</h2>
    `;

    const filasCategoria = Object.entries(avanceCategoria).map(([categoria, datos]: [string, any]) => [
      Formateadores.categoriaDocente(categoria),
      datos.totalDocentes.toString(),
      datos.totalCursosAsignados.toString(),
      datos.horasRequeridas.toFixed(1),
      datos.horasAsignadas.toFixed(1),
      `${datos.porcentajeAvance}%`,
    ]);

    html += this.generadorPDF.generarTabla(
      ['Categoría', 'Docentes', 'Cursos', 'Horas Req.', 'Horas Asig.', 'Avance'],
      filasCategoria
    );

    // Sección de ocupación de ambientes
    html += `
      <h2 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">3. Ocupación de Ambientes</h2>
    `;

    const filasOcupacion = ocupacion.slice(0, 10).map(a => [
      a.codigo,
      a.nombre,
      Formateadores.tipoAmbiente(a.tipo),
      a.horariosOcupados.toString(),
      `${a.porcentajeOcupacion}%`,
    ]);

    html += this.generadorPDF.generarTabla(
      ['Código', 'Nombre', 'Tipo', 'Horarios', '% Ocupación'],
      filasOcupacion
    );

    // Sección de configuración del período
    if (periodo.configuraciones) {
      html += `
        <h2 style="color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px;">4. Configuración del Período</h2>
        
        <div style="padding: 15px; background: #f7fafc; border-radius: 5px;">
          <p><strong>Horas máximas diarias por docente:</strong> ${periodo.configuraciones.horasMaxDiariasDocente}</p>
          <p><strong>Horas máximas continuas:</strong> ${periodo.configuraciones.horasMaxContinuas}</p>
          <p><strong>Descanso mínimo entre horas:</strong> ${periodo.configuraciones.descansoMinEntreHoras}h</p>
          <p><strong>Orden de atención:</strong> ${(periodo.configuraciones.ordenCategorias as string[]).map(c => Formateadores.categoriaDocente(c)).join(' → ')}</p>
        </div>
      `;
    }

    html += `
        ${this.generadorPDF.generarPiePagina()}
      </body>
      </html>
    `;

    const config: ReporteConfig = {
      titulo: 'Reporte de Gestión',
      orientacion: 'portrait',
      formato: 'A4',
    };

    return await this.generadorPDF.generarPDF(html, config);
  }
}