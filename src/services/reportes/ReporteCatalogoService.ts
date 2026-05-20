import { prisma } from '@/lib/prisma';
import { Formateadores } from '@/lib/formateadores';
import { GeneradorPDF, ReporteConfig } from './GeneradorPDF';
import {
  generarKpiGrid,
  generarSeccionTitulo,
  generarTablaHTML,
} from './reporte-estilos';

export type EntidadCatalogo =
  | 'docentes'
  | 'cursos'
  | 'ambientes'
  | 'periodos'
  | 'grupos'
  | 'carga-academica';

const TITULOS: Record<EntidadCatalogo, string> = {
  docentes: 'Catálogo de Docentes',
  cursos: 'Catálogo de Cursos',
  ambientes: 'Catálogo de Ambientes',
  periodos: 'Catálogo de Períodos Académicos',
  grupos: 'Catálogo de Grupos',
  'carga-academica': 'Catálogo de Carga Académica',
};

export class ReporteCatalogoService {
  private generadorPDF = new GeneradorPDF();

  async generar(entidad: EntidadCatalogo, periodoId?: string): Promise<Buffer> {
    const periodo = periodoId
      ? await prisma.periodoAcademico.findUnique({ where: { id: periodoId } })
      : null;

    let contenido = '';
    switch (entidad) {
      case 'docentes':
        contenido = await this.contenidoDocentes();
        break;
      case 'cursos':
        contenido = await this.contenidoCursos();
        break;
      case 'ambientes':
        contenido = await this.contenidoAmbientes();
        break;
      case 'periodos':
        contenido = await this.contenidoPeriodos();
        break;
      case 'grupos':
        contenido = await this.contenidoGrupos();
        break;
      case 'carga-academica':
        contenido = await this.contenidoCargaAcademica();
        break;
      default:
        throw new Error('Entidad de catálogo no válida');
    }

    const html = this.generadorPDF.generarDocumento(TITULOS[entidad], contenido, {
      periodo: periodo?.nombre,
      subtitulo: 'Listado administrativo del sistema',
    });

    const config: ReporteConfig = {
      titulo: TITULOS[entidad],
      orientacion: entidad === 'carga-academica' || entidad === 'grupos' ? 'landscape' : 'portrait',
      formato: 'A4',
    };

    return this.generadorPDF.generarPDF(html, config);
  }

  private async contenidoDocentes(): Promise<string> {
    const docentes = await prisma.docente.findMany({
      include: {
        usuario: { select: { nombre: true, apellidos: true, email: true, activo: true } },
        _count: { select: { cursos: true, horarios: true } },
      },
      orderBy: { codigo: 'asc' },
    });

    const activos = docentes.filter((d) => d.usuario.activo).length;

    const kpis = generarKpiGrid([
      { label: 'Total docentes', value: docentes.length },
      { label: 'Activos', value: activos },
      { label: 'Inactivos', value: docentes.length - activos },
    ]);

    const filas = docentes.map((d) => [
      d.codigo,
      Formateadores.nombreUsuario(d.usuario),
      d.usuario.email,
      Formateadores.categoriaDocente(d.categoria),
      d.departamento ?? '—',
      d._count.cursos.toString(),
      d.usuario.activo ? 'Sí' : 'No',
    ]);

    return (
      kpis +
      generarSeccionTitulo('Detalle de docentes') +
      generarTablaHTML(
        ['Código', 'Nombre', 'Email', 'Categoría', 'Departamento', 'Cursos asig.', 'Activo'],
        filas
      )
    );
  }

  private async contenidoCursos(): Promise<string> {
    const cursos = await prisma.curso.findMany({
      include: { _count: { select: { grupos: true, cursosDocente: true } } },
      orderBy: [{ ciclo: 'asc' }, { codigo: 'asc' }],
    });

    const activos = cursos.filter((c) => c.activo).length;
    const totalCreditos = cursos.reduce((s, c) => s + c.creditos, 0);

    const kpis = generarKpiGrid([
      { label: 'Total cursos', value: cursos.length },
      { label: 'Activos', value: activos },
      { label: 'Créditos (suma)', value: totalCreditos },
    ]);

    const filas = cursos.map((c) => [
      c.codigo,
      c.nombre,
      c.ciclo.toString(),
      c.creditos.toString(),
      `${c.horasTeoria}T / ${c.horasPractica}P / ${c.horasLaboratorio}L`,
      c._count.grupos.toString(),
      c._count.cursosDocente.toString(),
      c.activo ? 'Sí' : 'No',
    ]);

    return (
      kpis +
      generarSeccionTitulo('Detalle de cursos') +
      generarTablaHTML(
        ['Código', 'Nombre', 'Ciclo', 'Créd.', 'Horas', 'Grupos', 'Docentes', 'Activo'],
        filas
      )
    );
  }

  private async contenidoAmbientes(): Promise<string> {
    const ambientes = await prisma.ambiente.findMany({
      include: { _count: { select: { horarios: true } } },
      orderBy: { codigo: 'asc' },
    });

    const activos = ambientes.filter((a) => a.activo).length;
    const labs = ambientes.filter((a) => a.tipo === 'LABORATORIO').length;

    const kpis = generarKpiGrid([
      { label: 'Total ambientes', value: ambientes.length },
      { label: 'Activos', value: activos },
      { label: 'Laboratorios', value: labs },
    ]);

    const filas = ambientes.map((a) => [
      a.codigo,
      a.nombre,
      Formateadores.tipoAmbiente(a.tipo),
      Formateadores.capacidad(a.capacidad),
      a.ubicacion ?? '—',
      a._count.horarios.toString(),
      a.activo ? 'Sí' : 'No',
    ]);

    return (
      kpis +
      generarSeccionTitulo('Detalle de ambientes') +
      generarTablaHTML(
        ['Código', 'Nombre', 'Tipo', 'Capacidad', 'Ubicación', 'Horarios', 'Activo'],
        filas
      )
    );
  }

  private async contenidoPeriodos(): Promise<string> {
    const periodos = await prisma.periodoAcademico.findMany({
      include: { _count: { select: { horarios: true, ventanas: true } } },
      orderBy: { fechaInicio: 'desc' },
    });

    const activo = periodos.filter((p) => p.activo).length;

    const kpis = generarKpiGrid([
      { label: 'Total períodos', value: periodos.length },
      { label: 'Marcados activos', value: activo },
      {
        label: 'Horarios registrados',
        value: periodos.reduce((s, p) => s + p._count.horarios, 0),
      },
    ]);

    const filas = periodos.map((p) => [
      p.nombre,
      new Date(p.fechaInicio).toLocaleDateString('es-PE'),
      new Date(p.fechaFin).toLocaleDateString('es-PE'),
      Formateadores.estadoPeriodo(p.estado),
      p._count.horarios.toString(),
      p._count.ventanas.toString(),
      p.activo ? 'Sí' : 'No',
    ]);

    return (
      kpis +
      generarSeccionTitulo('Detalle de períodos') +
      generarTablaHTML(
        ['Nombre', 'Inicio', 'Fin', 'Estado', 'Horarios', 'Ventanas', 'Activo'],
        filas
      )
    );
  }

  private async contenidoGrupos(): Promise<string> {
    const grupos = await prisma.grupo.findMany({
      include: {
        curso: { select: { codigo: true, nombre: true, ciclo: true } },
        _count: { select: { horarios: true, matriculas: true } },
      },
      orderBy: [{ curso: { codigo: 'asc' } }, { nombre: 'asc' }],
    });

    const activos = grupos.filter((g) => g.activo).length;

    const kpis = generarKpiGrid([
      { label: 'Total grupos', value: grupos.length },
      { label: 'Activos', value: activos },
      {
        label: 'Capacidad total',
        value: grupos.reduce((s, g) => s + g.capacidad, 0),
      },
    ]);

    const filas = grupos.map((g) => [
      g.curso.codigo,
      g.curso.nombre,
      g.curso.ciclo.toString(),
      g.nombre,
      g.capacidad.toString(),
      g._count.horarios.toString(),
      g._count.matriculas.toString(),
      g.activo ? 'Sí' : 'No',
    ]);

    return (
      kpis +
      generarSeccionTitulo('Detalle de grupos') +
      generarTablaHTML(
        ['Curso', 'Asignatura', 'Ciclo', 'Grupo', 'Capacidad', 'Horarios', 'Matrículas', 'Activo'],
        filas
      )
    );
  }

  private async contenidoCargaAcademica(): Promise<string> {
    const asignaciones = await prisma.cursoDocente.findMany({
      include: {
        curso: { select: { codigo: true, nombre: true, creditos: true, ciclo: true } },
        docente: {
          select: {
            codigo: true,
            usuario: { select: { nombre: true, apellidos: true } },
          },
        },
      },
      orderBy: [{ docente: { codigo: 'asc' } }, { curso: { codigo: 'asc' } }],
    });

    const activas = asignaciones.filter((a) => a.activo).length;
    const totalHoras = asignaciones.reduce((s, a) => s + a.horasAsignadas, 0);

    const kpis = generarKpiGrid([
      { label: 'Asignaciones', value: asignaciones.length },
      { label: 'Activas', value: activas },
      { label: 'Horas asignadas', value: totalHoras },
    ]);

    const filas = asignaciones.map((a) => [
      a.docente.codigo,
      Formateadores.nombreUsuario(a.docente.usuario),
      a.curso.codigo,
      a.curso.nombre,
      a.curso.ciclo.toString(),
      a.curso.creditos.toString(),
      a.horasAsignadas.toString(),
      a.activo ? 'Sí' : 'No',
    ]);

    return (
      kpis +
      generarSeccionTitulo('Asignaciones curso — docente') +
      generarTablaHTML(
        [
          'Cód. docente',
          'Docente',
          'Cód. curso',
          'Curso',
          'Ciclo',
          'Créd.',
          'Horas asig.',
          'Activo',
        ],
        filas
      )
    );
  }
}
