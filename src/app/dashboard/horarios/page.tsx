'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable, type Column } from '@/components/data/DataTable';
import { ErrorAlert } from '@/components/feedback/ErrorAlert';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiGet, apiPost, ApiClientError } from '@/lib/api-client';
import { formatApiError, normalizeTimeHHmm } from '@/lib/format-api-error';
import { Formateadores } from '@/lib/formateadores';
import { useAuth, useRequireAuth } from '@/contexts/AuthContext';
import { usePeriodo } from '@/contexts/PeriodoContext';
import { DiaSemana, Rol } from '@prisma/client';
import { toast } from 'sonner';
import { cn } from '@/lib/cn';

interface HorarioCell {
  id: string;
  horaInicio: string;
  horaFin: string;
  diaSemana: string;
  curso: { codigo: string; nombre: string };
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
  docente: DocenteOpt;
}

const DIAS: DiaSemana[] = [
  DiaSemana.LUNES,
  DiaSemana.MARTES,
  DiaSemana.MIERCOLES,
  DiaSemana.JUEVES,
  DiaSemana.VIERNES,
];

const HORAS = Array.from({ length: 12 }, (_, i) => i + 8);

const DIA_LABEL: Record<string, string> = {
  LUNES: 'Lun',
  MARTES: 'Mar',
  MIERCOLES: 'Mié',
  JUEVES: 'Jue',
  VIERNES: 'Vie',
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
    if (!periodoId) {
      setHorarios([]);
      return;
    }
    setLoadingHor(true);
    setError(null);
    try {
      const res = await apiGet<HorarioCell[]>('/api/horarios', {
        periodoId,
        limit: 500,
        page: 1,
      });
      setHorarios(res.data ?? []);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'Error al cargar horarios');
      setHorarios([]);
    } finally {
      setLoadingHor(false);
    }
  }, [periodoId]);

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

  useEffect(() => {
    fetchHorarios();
    fetchConflictos();
  }, [fetchHorarios, fetchConflictos]);

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
        setGrupos(g);

        const docentesDelCurso = (cargaRes.data ?? []).map((row) => row.docente);
        setDocentes(docentesDelCurso);
        setForm((f) => ({
          ...f,
          grupoId: g[0]?.id ?? '',
          docenteId: docentesDelCurso[0]?.id ?? '',
        }));
      } catch {
        setGrupos([]);
        setDocentes([]);
      } finally {
        setLoadingDocentesCurso(false);
      }
    })();
  }, [createOpen, form.cursoId]);

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
    if (horaInicio >= horaFin) {
      toast.error('La hora de fin debe ser posterior a la de inicio');
      return;
    }

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
    } catch (e) {
      toast.error(formatApiError(e, 'No se pudo crear el horario'));
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
    } catch (e) {
      toast.error(e instanceof ApiClientError ? e.message : 'Error al validar');
    } finally {
      setBusyAction(false);
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

  const celdas = useMemo(() => {
    const map = new Map<string, HorarioCell[]>();
    for (const h of horarios) {
      const hour = parseInt(h.horaInicio.split(':')[0], 10);
      const key = `${h.diaSemana}-${hour}`;
      const prev = map.get(key) ?? [];
      prev.push(h);
      map.set(key, prev);
    }
    return map;
  }, [horarios]);

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
        description={`Período: ${periodoSeleccionado?.nombre}. Cuadrícula Lun–Vie, 8:00–19:00.`}
        actions={
          <div className="flex flex-wrap gap-2">
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
              <Plus className="h-4 w-4" />
              Nuevo horario
            </Button>
          </div>
        }
      />

      {error && <ErrorAlert message={error} onRetry={fetchHorarios} />}

      <div className="card overflow-x-auto">
        <div className="card-body p-2">
          {loadingHor ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-unt-blue" />
            </div>
          ) : (
            <div
              className="grid min-w-[720px] gap-px bg-gray-200 text-xs"
              style={{ gridTemplateColumns: `80px repeat(${DIAS.length}, minmax(0,1fr))` }}
            >
              <div className="bg-gray-100 p-2 font-semibold text-gray-600">Hora</div>
              {DIAS.map((d) => (
                <div key={d} className="bg-unt-blue p-2 text-center font-semibold text-white">
                  {DIA_LABEL[d] ?? d}
                </div>
              ))}
              {HORAS.map((h) => (
                <div key={h} className="contents">
                  <div className="flex items-center bg-gray-50 p-2 font-mono text-gray-700">
                    {h}:00
                  </div>
                  {DIAS.map((d) => {
                    const list = celdas.get(`${d}-${h}`) ?? [];
                    return (
                      <div
                        key={`${d}-${h}`}
                        className={cn(
                          'min-h-[52px] bg-white p-1',
                          list.length > 1 ? 'bg-amber-50' : ''
                        )}
                      >
                        {list.map((x) => (
                          <div
                            key={x.id}
                            className="mb-1 rounded border border-gray-200 bg-gray-50 px-1 py-0.5 leading-tight"
                          >
                            <div className="font-semibold text-unt-blue">{x.curso.codigo}</div>
                            <div className="truncate text-[10px] text-gray-600">{x.ambiente.codigo}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo horario</DialogTitle>
          </DialogHeader>
          <div className="grid max-h-[60vh] gap-3 overflow-y-auto py-2">
            <div>
              <Label>Curso</Label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                value={form.cursoId}
                onChange={(e) => setForm((f) => ({ ...f, cursoId: e.target.value }))}
              >
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.codigo} — {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Grupo (opcional)</Label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                value={form.grupoId}
                onChange={(e) => setForm((f) => ({ ...f, grupoId: e.target.value }))}
              >
                <option value="">— Sin grupo —</option>
                {grupos.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Docente</Label>
              {loadingDocentesCurso ? (
                <p className="text-sm text-gray-500">Cargando docentes del curso…</p>
              ) : docentes.length === 0 ? (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  No hay docentes con carga académica en este curso. Asigne uno en{' '}
                  <strong>Carga académica</strong> antes de crear el horario.
                </p>
              ) : (
                <select
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                  value={form.docenteId}
                  onChange={(e) => setForm((f) => ({ ...f, docenteId: e.target.value }))}
                >
                  {docentes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {Formateadores.nombreUsuario(d.usuario)}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <Label>Ambiente</Label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                value={form.ambienteId}
                onChange={(e) => setForm((f) => ({ ...f, ambienteId: e.target.value }))}
              >
                {ambientes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.codigo} — {a.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Día</Label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                value={form.diaSemana}
                onChange={(e) => setForm((f) => ({ ...f, diaSemana: e.target.value as DiaSemana }))}
              >
                {DIAS.map((d) => (
                  <option key={d} value={d}>
                    {DIA_LABEL[d] ?? d}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Inicio</Label>
                <Input
                  type="time"
                  value={form.horaInicio}
                  onChange={(e) => setForm((f) => ({ ...f, horaInicio: e.target.value }))}
                />
              </div>
              <div>
                <Label>Fin</Label>
                <Input
                  type="time"
                  value={form.horaFin}
                  onChange={(e) => setForm((f) => ({ ...f, horaFin: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={savingCreate || loadingDocentesCurso || docentes.length === 0}
              className="bg-unt-blue hover:bg-unt-blue/90 text-white"
            >
              {savingCreate ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando…
                </>
              ) : (
                'Guardar'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
