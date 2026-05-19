'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, FileDown, LayoutList, Loader2, Plus, TableIcon, ExternalLink } from 'lucide-react';
import { HorarioWeeklyCalendar } from '@/components/horarios/HorarioWeeklyCalendar';
import { FormField, FormModalFooter, FormSection, FormSelect } from '@/components/forms';
import { formControlClass } from '@/components/forms/FormField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DataTable, type Column } from '@/components/data/DataTable';
import { ErrorAlert } from '@/components/feedback/ErrorAlert';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiGet, apiPost, ApiClientError, downloadFile } from '@/lib/api-client';
import { formatApiError, normalizeTimeHHmm } from '@/lib/format-api-error';
import {
  HORA_LIMITE_FIN_CLASES,
  validarFranjaHorariaPermitida,
} from '@/lib/horario-horas';
import { Formateadores } from '@/lib/formateadores';
import { useAuth, useRequireAuth } from '@/contexts/AuthContext';
import { usePeriodo } from '@/contexts/PeriodoContext';
import { DiaSemana, Rol } from '@prisma/client';
import { toast } from 'sonner';
import { cn } from '@/lib/cn';
import { useFiltrosHorario } from '@/hooks/useFiltrosHorario';
import { exportarHorarioPDF } from '@/utils/exportarHorarioPDF';
import { exportarHorarioExcel } from '@/utils/exportarHorarioExcel';

interface HorarioCell {
  id: string;
  horaInicio: string;
  horaFin: string;
  diaSemana: string;
  curso: { codigo: string; nombre: string; ciclo: number };
  docente: { usuario: { nombre: string; apellidos: string } };
  ambiente: { codigo: string };
  grupo?: { nombre: string } | null;
}

interface ConflictoDetalle {
  id: string;
  tipoRegla: string;
  mensaje?: string;
  horario?: HorarioCell;
}

interface ConflictosPayload {
  totalConflictos: number;
  conflictos: ConflictoDetalle[];
}

interface CursoOpt {
  id: string;
  codigo: string;
  nombre: string;
}

interface DocenteOpt {
  id: string;
  usuario: { nombre: string; apellidos: string };
}

interface AmbienteOpt {
  id: string;
  codigo: string;
  nombre: string;
}

interface GrupoOpt {
  id: string;
  nombre: string;
}

interface CargaAcademicaRow {
  horasAsignadas?: number;
  docente: DocenteOpt;
}

interface DesfaseCarga {
  docente: string;
  curso: string;
  horasCarga: number;
  horasProgramadas: number;
  diferencia: number;
  estado: 'EXCEDE' | 'INCOMPLETO' | 'OK';
}

const DIAS: DiaSemana[] = [
  DiaSemana.LUNES,
  DiaSemana.MARTES,
  DiaSemana.MIERCOLES,
  DiaSemana.JUEVES,
  DiaSemana.VIERNES,
];

/** Franjas 8:00 – 20:00 (última clase puede terminar a las 21:00) */
const HORAS = Array.from({ length: 13 }, (_, i) => i + 8);

const DIA_LABEL: Record<string, string> = {
  LUNES: 'Lun',
  MARTES: 'Mar',
  MIERCOLES: 'Mié',
  JUEVES: 'Jue',
  VIERNES: 'Vie',
};

const CICLO_OPTIONS = [
  { value: '', label: 'Todos los ciclos' },
  { value: '1', label: 'Ciclo I' },
  { value: '2', label: 'Ciclo II' },
  { value: '3', label: 'Ciclo III' },
  { value: '4', label: 'Ciclo IV' },
  { value: '5', label: 'Ciclo V' },
  { value: '6', label: 'Ciclo VI' },
  { value: '7', label: 'Ciclo VII' },
  { value: '8', label: 'Ciclo VIII' },
  { value: '9', label: 'Ciclo IX' },
  { value: '10', label: 'Ciclo X' },
];

const CICLO_ROMANO: Record<string, string> = {
  '1': 'I',
  '2': 'II',
  '3': 'III',
  '4': 'IV',
  '5': 'V',
  '6': 'VI',
  '7': 'VII',
  '8': 'VIII',
  '9': 'IX',
  '10': 'X',
};

export default function HorariosPage() {
  const { loading: authLoading } = useRequireAuth([
    Rol.SUPER_ADMIN,
    Rol.ADMINISTRADOR,
    Rol.OPERADOR,
  ]);
  const { can } = useAuth();
  const puedePublicar = can('PUBLICAR_HORARIOS');
  const { periodoSeleccionado, loading: periodoLoading } = usePeriodo();
  const periodoId = periodoSeleccionado?.id ?? '';

  const [horarios, setHorarios] = useState<HorarioCell[]>([]);
  const [loadingHor, setLoadingHor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflictos, setConflictos] = useState<ConflictosPayload | null>(null);
  const [loadingConf, setLoadingConf] = useState(false);
  const [busyAction, setBusyAction] = useState(false);
  const [vista, setVista] = useState<'calendario' | 'tabla'>('calendario');
  const [formError, setFormError] = useState<string | null>(null);
  
  const { filtros, setFiltros, actualizarFiltro, limpiarFiltros } = useFiltrosHorario(periodoId);
  useEffect(() => {
    if (periodoId) {
      setFiltros(prev => ({ ...prev, periodoId }));
    }
  }, [periodoId, setFiltros]);

  const [desfases, setDesfases] = useState<DesfaseCarga[]>([]);
  const [loadingDesfases, setLoadingDesfases] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [horasCargaDocente, setHorasCargaDocente] = useState<number | null>(null);
  const [cargaRows, setCargaRows] = useState<CargaAcademicaRow[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [savingCreate, setSavingCreate] = useState(false);
  const [loadingDocentesCurso, setLoadingDocentesCurso] = useState(false);
  const [cursos, setCursos] = useState<CursoOpt[]>([]);
  const [docentes, setDocentes] = useState<DocenteOpt[]>([]);
  const [ambientes, setAmbientes] = useState<AmbienteOpt[]>([]);
  const [grupos, setGrupos] = useState<GrupoOpt[]>([]);

  const [form, setForm] = useState<{
    cursoId: string;
    docenteId: string;
    ambienteId: string;
    grupoId: string;
    diaSemana: DiaSemana;
    horaInicio: string;
    horaFin: string;
  }>({
    cursoId: '',
    docenteId: '',
    ambienteId: '',
    grupoId: '',
    diaSemana: DiaSemana.LUNES,
    horaInicio: '08:00',
    horaFin: '10:00',
  });

  const fetchHorarios = useCallback(async () => {
    if (!filtros.periodoId) {
      setHorarios([]);
      return;
    }
    setLoadingHor(true);
    setError(null);
    try {
      const params: any = {
        limit: 500,
        page: 1,
        ...filtros
      };
      const res = await apiGet<HorarioCell[]>('/api/horarios', params);
      setHorarios(res.data ?? []);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'Error al cargar horarios');
      setHorarios([]);
    } finally {
      setLoadingHor(false);
    }
  }, [filtros]);

  const fetchConflictos = useCallback(async () => {
    if (!periodoId) {
      setConflictos(null);
      return;
    }
    setLoadingConf(true);
    try {
      const res = await apiGet<ConflictosPayload>('/api/horarios/conflictos', { periodoId });
      setConflictos(
        res.data
          ? {
              totalConflictos: res.data.totalConflictos,
              conflictos: res.data.conflictos ?? [],
            }
          : null
      );
    } catch {
      setConflictos(null);
    } finally {
      setLoadingConf(false);
    }
  }, [periodoId]);

  const fetchDesfases = useCallback(async () => {
    if (!periodoId) {
      setDesfases([]);
      return;
    }
    setLoadingDesfases(true);
    try {
      const res = await apiGet<DesfaseCarga[]>('/api/horarios/desfases-carga', { periodoId });
      setDesfases(res.data ?? []);
    } catch {
      setDesfases([]);
    } finally {
      setLoadingDesfases(false);
    }
  }, [periodoId]);

  useEffect(() => {
    fetchHorarios();
    fetchConflictos();
    fetchDesfases();
  }, [fetchHorarios, fetchConflictos, fetchDesfases]);

  useEffect(() => {
    if (!createOpen) return;
    (async () => {
      try {
        const [c, a] = await Promise.all([
          apiGet<CursoOpt[]>('/api/cursos', { limit: 100, page: 1 }),
          apiGet<AmbienteOpt[]>('/api/ambientes', { limit: 100, page: 1 }),
        ]);
        const cL = c.data ?? [];
        const aL = a.data ?? [];
        setCursos(cL);
        setAmbientes(aL);
        setForm((f) => ({
          ...f,
          cursoId: cL[0]?.id ?? '',
          docenteId: '',
          ambienteId: aL[0]?.id ?? '',
        }));
      } catch {
        toast.error('Error cargando datos del formulario');
      }
    })();
  }, [createOpen]);

  useEffect(() => {
    if (!createOpen || !form.cursoId) {
      setGrupos([]);
      setDocentes([]);
      return;
    }
    (async () => {
      setLoadingDocentesCurso(true);
      try {
        const [gruposRes, cargaRes] = await Promise.all([
          apiGet<GrupoOpt[]>('/api/grupos', { cursoId: form.cursoId }),
          apiGet<CargaAcademicaRow[]>('/api/carga-academica', {
            cursoId: form.cursoId,
            limit: 100,
            page: 1,
          }),
        ]);
        const g = gruposRes.data ?? [];
        const filasCarga = cargaRes.data ?? [];
        setGrupos(g);
        setCargaRows(filasCarga);

        const docentesDelCurso = filasCarga.map((row) => row.docente);
        // Deduplicar docentes (pueden venir duplicados si el backend no agrupa bien)
        const uniqueDocentes = Array.from(new Map(docentesDelCurso.map(item => [item.id, item])).values());
        
        setDocentes(uniqueDocentes);
        const primeraCarga = filasCarga[0];
        setHorasCargaDocente(primeraCarga?.horasAsignadas ?? null);
        setForm((f) => ({
          ...f,
          grupoId: g[0]?.id ?? '',
          docenteId: uniqueDocentes[0]?.id ?? '',
        }));
      } catch {
        setGrupos([]);
        setDocentes([]);
      } finally {
        setLoadingDocentesCurso(false);
      }
    })();
  }, [createOpen, form.cursoId]);

  // Variables globales para filtros
  const [cursosAll, setCursosAll] = useState<CursoOpt[]>([]);
  const [docentesAll, setDocentesAll] = useState<DocenteOpt[]>([]);
  const [ambientesAll, setAmbientesAll] = useState<AmbienteOpt[]>([]);

  useEffect(() => {
    apiGet<CursoOpt[]>('/api/cursos', { limit: 500 }).then(res => setCursosAll(res.data ?? []));
    apiGet<DocenteOpt[]>('/api/docentes', { limit: 500 }).then(res => setDocentesAll(res.data ?? []));
    apiGet<AmbienteOpt[]>('/api/ambientes', { limit: 500 }).then(res => setAmbientesAll(res.data ?? []));
  }, []);

  const handleCreate = async () => {
    if (!periodoId) return;

    if (!form.cursoId || !form.docenteId || !form.ambienteId) {
      toast.error('Complete curso, docente y ambiente');
      return;
    }

    const horaInicio = normalizeTimeHHmm(form.horaInicio);
    const horaFin = normalizeTimeHHmm(form.horaFin);
    if (!/^\d{2}:\d{2}$/.test(horaInicio) || !/^\d{2}:\d{2}$/.test(horaFin)) {
      toast.error('Use formato de hora válido (HH:mm)');
      return;
    }
    
    if (horaInicio < '07:00' || horaFin > '21:00') {
      toast.error('El horario debe estar entre las 07:00 y las 21:00');
      return;
    }

    const franja = validarFranjaHorariaPermitida(horaInicio, horaFin);
    if (!franja.valido) {
      toast.error(franja.mensaje ?? 'Franja horaria no permitida');
      setFormError(franja.mensaje ?? null);
      return;
    }

    setFormError(null);
    setSavingCreate(true);
    try {
      await apiPost('/api/horarios', {
        periodoId,
        cursoId: form.cursoId,
        docenteId: form.docenteId,
        ambienteId: form.ambienteId,
        grupoId: form.grupoId || undefined,
        diaSemana: form.diaSemana,
        horaInicio,
        horaFin,
      });
      toast.success('Horario creado correctamente');
      setCreateOpen(false);
      fetchHorarios();
      fetchConflictos();
      fetchDesfases();
    } catch (e) {
      const msg = formatApiError(e, 'No se pudo crear el horario');
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSavingCreate(false);
    }
  };

  const validarTodo = async () => {
    if (!periodoId) return;
    setBusyAction(true);
    try {
      const res = await apiPost<{ horariosConConflictos: number }>('/api/horarios/validar-todo', {
        periodoId,
      });
      toast.success(
        `Validación terminada. Con conflictos: ${res.data?.horariosConConflictos ?? '—'}`
      );
      fetchConflictos();
      fetchDesfases();
    } catch (e) {
      toast.error(e instanceof ApiClientError ? e.message : 'Error al validar');
    } finally {
      setBusyAction(false);
    }
  };

  const descargarPdfConfirmados = async () => {
    if (!periodoId || horarios.length === 0) return;
    setDownloadingPdf(true);
    try {
      const periodoNombre = periodoSeleccionado?.nombre || 'General';
      const cicloNombre = filtros.ciclo ? `Ciclo ${CICLO_ROMANO[filtros.ciclo] || filtros.ciclo}` : 'Todos los ciclos';
      await exportarHorarioPDF(horarios, 'HORARIO ACADÉMICO', `${periodoNombre} - ${cicloNombre}`);
      toast.success('PDF exportado');
    } catch (e: any) {
      toast.error('Error al generar PDF: ' + e.message);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleExportarExcel = async () => {
    if (!periodoId || horarios.length === 0) return;
    setDownloadingExcel(true);
    try {
      const titulo = `Horario Académico - ${periodoSeleccionado?.nombre || 'General'}`;
      await exportarHorarioExcel(horarios, titulo);
      toast.success('Excel exportado');
    } catch (e: any) {
      toast.error('Error al generar Excel: ' + e.message);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const publicar = async () => {
    if (!periodoId || !puedePublicar) return;
    setBusyAction(true);
    try {
      await apiPost('/api/horarios/publicar', { periodoId });
      toast.success('Horarios publicados');
      fetchHorarios();
    } catch (e) {
      toast.error(e instanceof ApiClientError ? e.message : 'Error al publicar');
    } finally {
      setBusyAction(false);
    }
  };

  const columnsHorarios: Column<HorarioCell>[] = [
    {
      key: 'dia',
      header: 'Día',
      cell: (r) => DIA_LABEL[r.diaSemana] ?? r.diaSemana,
    },
    {
      key: 'hora',
      header: 'Horario',
      cell: (r) => `${r.horaInicio.slice(0, 5)} – ${r.horaFin.slice(0, 5)}`,
    },
    {
      key: 'curso',
      header: 'Curso',
      cell: (r) => (
        <span className="font-medium text-unt-blue">{r.curso.codigo}</span>
      ),
    },
    {
      key: 'docente',
      header: 'Docente',
      cell: (r) => Formateadores.nombreUsuario(r.docente.usuario),
    },
    { key: 'amb', header: 'Ambiente', cell: (r) => r.ambiente.codigo },
  ];

  const columnsConflictos: Column<ConflictoDetalle>[] = [
    { key: 't', header: 'Tipo', cell: (r) => r.tipoRegla },
    {
      key: 'm',
      header: 'Detalle',
      cell: (r) => (
        <span className="text-sm text-gray-700">{r.mensaje || r.horario?.curso?.codigo || '—'}</span>
      ),
    },
  ];

  if (authLoading || periodoLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-unt-blue" />
      </div>
    );
  }

  if (!periodoId) {
    return (
      <div>
        <PageHeader title="Horarios" description="Programación semanal por período." />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Seleccione un período académico arriba para ver y editar horarios.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Horarios"
        description={`Período: ${periodoSeleccionado?.nombre}. Lun–Vie, 8:00–${HORA_LIMITE_FIN_CLASES} máx.`}
        actions={
          <div className="flex flex-col gap-3 w-full sm:w-auto items-end">
            <div className="flex flex-wrap gap-2 justify-end w-full">
              <Button
                variant="outline"
                disabled={downloadingPdf || horarios.length === 0}
                onClick={descargarPdfConfirmados}
                className="border-unt-blue text-unt-blue hover:bg-unt-blue/10"
              >
                <FileDown className="h-4 w-4 mr-2" />
                {downloadingPdf ? 'Generando…' : 'Exportar PDF'}
              </Button>
              <Button
                variant="outline"
                disabled={downloadingExcel || horarios.length === 0}
                onClick={handleExportarExcel}
                className="border-green-600 text-green-600 hover:bg-green-50"
              >
                <TableIcon className="h-4 w-4 mr-2" />
                {downloadingExcel ? 'Generando…' : 'Exportar Excel'}
              </Button>
              <Button
                variant="outline"
                disabled={busyAction}
                onClick={validarTodo}
                className="border-unt-blue text-unt-blue hover:bg-unt-blue/10"
              >
                Validar todo
              </Button>
              {puedePublicar && (
                <Button
                  disabled={busyAction}
                  onClick={publicar}
                  className="bg-unt-blue hover:bg-unt-blue/90 text-white"
                >
                  Publicar confirmados
                </Button>
              )}
              <Button
                onClick={() => setCreateOpen(true)}
                className="bg-unt-blue hover:bg-unt-blue/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo horario
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.open('/horarios', '_blank')}
                className="bg-slate-200 text-slate-800 hover:bg-slate-300"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ver Vista Pública
              </Button>
            </div>
            {/* Barra de Filtros */}
            <div className="flex flex-wrap gap-2 items-center bg-slate-50 p-2 rounded-md border border-slate-200 w-full">
              <span className="text-sm font-semibold text-slate-700">Filtros:</span>
              <select
                value={filtros.ciclo || ''}
                onChange={(e) => actualizarFiltro('ciclo', e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-unt-blue focus:outline-none focus:ring-1 focus:ring-unt-blue"
              >
                {CICLO_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={filtros.cursoId || ''}
                onChange={(e) => actualizarFiltro('cursoId', e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-unt-blue focus:outline-none focus:ring-1 focus:ring-unt-blue"
              >
                <option value="">Todos los cursos</option>
                {cursosAll.map((c) => (
                  <option key={c.id} value={c.id}>{c.codigo}</option>
                ))}
              </select>
              <select
                value={filtros.docenteId || ''}
                onChange={(e) => actualizarFiltro('docenteId', e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-unt-blue focus:outline-none focus:ring-1 focus:ring-unt-blue max-w-[150px] truncate"
              >
                <option value="">Todos los docentes</option>
                {docentesAll.map((d) => (
                  <option key={d.id} value={d.id}>{Formateadores.nombreUsuario(d.usuario)}</option>
                ))}
              </select>
              <select
                value={filtros.ambienteId || ''}
                onChange={(e) => actualizarFiltro('ambienteId', e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-unt-blue focus:outline-none focus:ring-1 focus:ring-unt-blue"
              >
                <option value="">Todos los ambientes</option>
                {ambientesAll.map((a) => (
                  <option key={a.id} value={a.id}>{a.codigo}</option>
                ))}
              </select>
              <select
                value={filtros.diaSemana || ''}
                onChange={(e) => actualizarFiltro('diaSemana', e.target.value)}
                className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-unt-blue focus:outline-none focus:ring-1 focus:ring-unt-blue"
              >
                <option value="">Todos los días</option>
                {DIAS.map((d) => (
                  <option key={d} value={d}>{DIA_LABEL[d] || d}</option>
                ))}
              </select>
              <button 
                onClick={limpiarFiltros} 
                className="text-xs font-medium text-unt-blue hover:underline"
              >
                Limpiar
              </button>
            </div>
          </div>
        }
      />

      <div className="rounded-lg border border-blue-200 bg-blue-50/80 px-4 py-3 text-sm text-blue-900">
        <strong>Restricción horaria:</strong> no se programan clases después de las 21:00 (9:00 p.m.).
        Las horas en horario deben coincidir con la carga académica del docente en el curso; si no, se
        muestra una alerta y se envía notificación al docente.
      </div>

      {desfases.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-900">
            <AlertTriangle className="h-4 w-4" />
            Desfases de carga horaria ({desfases.length})
          </div>
          {loadingDesfases ? (
            <Loader2 className="h-5 w-5 animate-spin text-amber-700" />
          ) : (
            <ul className="max-h-40 space-y-1 overflow-y-auto text-xs text-amber-900">
              {desfases.map((d, i) => (
                <li key={i}>
                  <strong>{d.docente}</strong> · {d.curso}: {d.horasProgramadas}h programadas /{' '}
                  {d.horasCarga}h en carga ({d.estado === 'EXCEDE' ? 'excede' : 'incompleto'}{' '}
                  {Math.abs(d.diferencia)}h)
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error && <ErrorAlert message={error} onRetry={fetchHorarios} />}

      <div className="mb-4 flex gap-2">
        <Button
          type="button"
          variant={vista === 'calendario' ? 'default' : 'outline'}
          onClick={() => setVista('calendario')}
          className={cn(
            'transition-colors duration-150',
            vista === 'calendario' && 'bg-unt-blue text-white hover:bg-primary-700'
          )}
        >
          <CalendarDays className="h-4 w-4" />
          Calendario
        </Button>
        <Button
          type="button"
          variant={vista === 'tabla' ? 'default' : 'outline'}
          onClick={() => setVista('tabla')}
          className={cn(
            'transition-colors duration-150',
            vista === 'tabla' && 'bg-unt-blue text-white hover:bg-primary-700'
          )}
        >
          <LayoutList className="h-4 w-4" />
          Tabla
        </Button>
      </div>

      {vista === 'calendario' ? (
        <HorarioWeeklyCalendar
          horarios={horarios}
          dias={DIAS}
          diaLabels={DIA_LABEL}
          horas={HORAS}
          loading={loadingHor}
        />
      ) : (
        <DataTable
          columns={columnsHorarios}
          data={horarios}
          loading={loadingHor}
          keyExtractor={(r) => r.id}
          emptyTitle="No hay horarios"
          emptyDescription="Aún no hay sesiones programadas en este período."
          emptyAction={
            <Button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="bg-unt-blue text-white hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Crear horario
            </Button>
          }
        />
      )}

      <div>
        <h2 className="mb-2 text-lg font-semibold text-unt-blue">Conflictos de validación</h2>
        {loadingConf ? (
          <Loader2 className="h-6 w-6 animate-spin text-unt-blue" />
        ) : conflictos && conflictos.totalConflictos > 0 ? (
          <DataTable
            columns={columnsConflictos}
            data={conflictos.conflictos.slice(0, 50)}
            keyExtractor={(r) => r.id}
            emptyTitle="Sin conflictos"
          />
        ) : (
          <p className="text-sm text-gray-500">No hay registros de conflicto con cumple = false.</p>
        )}
      </div>

      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) setFormError(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo horario</DialogTitle>
          </DialogHeader>

          {formError && (
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
              aria-live="polite"
            >
              {formError}
            </p>
          )}
          <div className="grid max-h-[65vh] gap-6 overflow-y-auto py-2 md:grid-cols-2">
            <FormSection title="Curso y docente">
              <FormField label="Curso" htmlFor="hor-curso" required>
                <FormSelect
                  id="hor-curso"
                  value={form.cursoId}
                  onChange={(e) => setForm((f) => ({ ...f, cursoId: e.target.value }))}
                >
                  {cursos.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.codigo} — {c.nombre}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="Grupo (opcional)" htmlFor="hor-grupo">
                <FormSelect
                  id="hor-grupo"
                  value={form.grupoId}
                  onChange={(e) => setForm((f) => ({ ...f, grupoId: e.target.value }))}
                >
                  <option value="">— Sin grupo —</option>
                  {grupos.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="Docente" htmlFor="hor-docente" required>
                {loadingDocentesCurso ? (
                  <p className="text-sm text-slate-500">Cargando docentes del curso…</p>
                ) : docentes.length === 0 ? (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    No hay docentes con carga académica en este curso. Asigne uno en{' '}
                    <strong>Carga académica</strong> antes de crear el horario.
                  </p>
                ) : (
                  <FormSelect
                    id="hor-docente"
                    value={form.docenteId}
                    onChange={(e) => {
                      const id = e.target.value;
                      const fila = cargaRows.find((r) => r.docente.id === id);
                      setHorasCargaDocente(fila?.horasAsignadas ?? null);
                      setForm((f) => ({ ...f, docenteId: id }));
                    }}
                  >
                    {docentes.map((d) => (
                      <option key={d.id} value={d.id}>
                        {Formateadores.nombreUsuario(d.usuario)}
                      </option>
                    ))}
                  </FormSelect>
                )}
                {horasCargaDocente != null && horasCargaDocente > 0 && (
                  <p className="mt-1 text-xs text-slate-600">
                    Carga académica asignada: <strong>{horasCargaDocente}h</strong> en este curso
                  </p>
                )}
              </FormField>
            </FormSection>

            <FormSection title="Fecha y hora">
              <FormField label="Ambiente" htmlFor="hor-ambiente" required>
                <FormSelect
                  id="hor-ambiente"
                  value={form.ambienteId}
                  onChange={(e) => setForm((f) => ({ ...f, ambienteId: e.target.value }))}
                >
                  {ambientes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.codigo} — {a.nombre}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <FormField label="Día" htmlFor="hor-dia" required>
                <FormSelect
                  id="hor-dia"
                  value={form.diaSemana}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, diaSemana: e.target.value as DiaSemana }))
                  }
                >
                  {DIAS.map((d) => (
                    <option key={d} value={d}>
                      {DIA_LABEL[d] ?? d}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Inicio (Mín. 07:00)" htmlFor="hor-inicio" required>
                  <Input
                    id="hor-inicio"
                    type="time"
                    min="07:00"
                    max="20:59"
                    className={cn(formControlClass(), form.horaInicio < '07:00' && 'border-red-500')}
                    value={form.horaInicio}
                    onChange={(e) => setForm((f) => ({ ...f, horaInicio: e.target.value }))}
                  />
                </FormField>
                <FormField label="Fin (Máx. 21:00)" htmlFor="hor-fin" required>
                  <Input
                    id="hor-fin"
                    type="time"
                    min="07:00"
                    max="21:00"
                    className={cn(formControlClass(), form.horaFin > '21:00' && 'border-red-500')}
                    value={form.horaFin}
                    onChange={(e) => setForm((f) => ({ ...f, horaFin: e.target.value }))}
                  />
                </FormField>
              </div>
              {(form.horaInicio < '07:00' || form.horaFin > '21:00') && (
                <p className="text-red-500 text-xs font-medium mt-1 text-center">
                  El horario debe estar entre las 07:00 y las 21:00
                </p>
              )}
            </FormSection>
          </div>
          <FormModalFooter
            onCancel={() => setCreateOpen(false)}
            onSubmit={handleCreate}
            saving={savingCreate}
            disabled={
              loadingDocentesCurso || 
              docentes.length === 0 || 
              form.horaInicio < '07:00' || 
              form.horaFin > '21:00'
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
