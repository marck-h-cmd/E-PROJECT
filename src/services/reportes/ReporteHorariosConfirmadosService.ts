import { prisma } from '@/lib/prisma';
import { GeneradorPDF } from './GeneradorPDF';
import { UtilidadesFecha } from '@/lib/utilidadesFecha';
import { Formateadores } from '@/lib/formateadores';
import { calcularHorasEntre } from '@/lib/horario-horas';

export class ReporteHorariosConfirmadosService {
  private generadorPDF = new GeneradorPDF();

  async generar(periodoId: string): Promise<Buffer> {
    const periodo = await prisma.periodoAcademico.findUnique({
      where: { id: periodoId },
    });

    if (!periodo) {
      throw new Error('Período no encontrado');
    }

    const horarios = await prisma.horario.findMany({
      where: {
        periodoId,
        estado: { in: ['CONFIRMADO', 'PUBLICADO'] },
      },
      include: {
        curso: { select: { codigo: true, nombre: true } },
        docente: {
          include: {
            usuario: { select: { nombre: true, apellidos: true } },
          },
        },
        ambiente: { select: { codigo: true, nombre: true, tipo: true } },
        grupo: { select: { nombre: true } },
      },
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
    });

    let totalHoras = 0;
    const filas = horarios.map((h) => {
      const horas = calcularHorasEntre(h.horaInicio, h.horaFin);
      totalHoras += horas;
      return [
        UtilidadesFecha.nombreDia(h.diaSemana),
        `${h.horaInicio.slice(0, 5)} – ${h.horaFin.slice(0, 5)}`,
        h.curso.codigo,
        h.curso.nombre,
        Formateadores.nombreUsuario(h.docente.usuario),
        h.ambiente.codigo,
        Formateadores.tipoAmbiente(h.ambiente.tipo),
        h.grupo?.nombre ?? '—',
        h.estado,
        `${horas.toFixed(1)}h`,
      ];
    });

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Horarios confirmados</title></head>
      <body>
        ${this.generadorPDF.generarEncabezado(
          'Horarios confirmados y publicados',
          periodo.nombre
        )}
        <p style="margin-bottom:16px;color:#4a5568;">
          Total de sesiones: <strong>${horarios.length}</strong> ·
          Horas programadas: <strong>${totalHoras.toFixed(1)}</strong>
        </p>
        ${
          filas.length === 0
            ? '<p>No hay horarios confirmados en este período.</p>'
            : this.generadorPDF.generarTabla(
                [
                  'Día',
                  'Horario',
                  'Código',
                  'Curso',
                  'Docente',
                  'Ambiente',
                  'Tipo',
                  'Grupo',
                  'Estado',
                  'Horas',
                ],
                filas
              )
        }
        ${this.generadorPDF.generarPiePagina()}
      </body>
      </html>
    `;

    return this.generadorPDF.generarPDF(html, {
      titulo: 'Horarios confirmados',
      orientacion: 'landscape',
    });
  }
}
