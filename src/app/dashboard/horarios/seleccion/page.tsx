'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRequireAuth } from '@/contexts/AuthContext';
import { Rol, DiaSemana, TipoAmbiente } from '@prisma/client';
import { PageHeader } from '@/components/layout/PageHeader';
import { ErrorAlert } from '@/components/feedback/ErrorAlert';
import { apiGet, apiPost, ApiClientError } from '@/lib/api-client';
import { 
  Loader2, ArrowLeft, BookOpen, Clock, Users, Save, 
  CheckCircle2, AlertCircle, FlaskConical, CalendarDays,
  ChevronRight, Info
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Boton } from '@/components/ui/Boton';
import { Card } from '@/components/ui/Card';
import { 
  Selector, 
  SelectorTrigger, 
  SelectorValue, 
  SelectorContent, 
  SelectorItem 
} from '@/components/ui/Selector';
import { cn } from '@/lib/cn';

interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  ciclo: number;
  horasTeoria: number;
  horasPractica: number;
  horasLaboratorio: number;
  grupos: { id: string; nombre: string }[];
  horarios?: any[];
}

interface Ambiente {
  id: string;
  codigo: string;
  nombre: string;
  tipo: TipoAmbiente;
  capacidad: number;
}

interface Periodo {
  id: string;
  nombre: string;
}

const DIAS_OPCIONES = [
  { value: DiaSemana.LUNES, label: 'LUN' },
  { value: DiaSemana.MARTES, label: 'MAR' },
  { value: DiaSemana.MIERCOLES, label: 'MIÉ' },
  { value: DiaSemana.JUEVES, label: 'JUE' },
  { value: DiaSemana.VIERNES, label: 'VIE' },
  { value: DiaSemana.SABADO, label: 'SÁB' },
];

const HORAS_OPCIONES = Array.from({ length: 14 }, (_, i) => {
  const h = i + 7;
  return { value: `${h.toString().padStart(2, '0')}:00`, label: `${h.toString().padStart(2, '0')}:00` };
});

export default function SeleccionHorarioPage() {
  const { user, loading: authLoading } = useRequireAuth([Rol.DOCENTE]);
  const [docenteId, setDocenteId] = useState<string | null>(null);
  const [periodoActivo, setPeriodoActivo] = useState<Periodo | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [horariosExistentes, setHorariosExistentes] = useState<any[]>([]);
  
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formulario de Teoría
  const [teoriaForm, setTeoriaForm] = useState({
    grupoId: '',
    dia: '' as DiaSemana | '',
    horaInicio: '',
    horaFin: '',
    ambienteId: '',
  });

  // Formulario de Laboratorio
  const [labForm, setLabForm] = useState({
    grupoId: '',
    dia: '' as DiaSemana | '',
    horaInicio: '',
    horaFin: '',
    ambienteId: '',
  });

  useEffect(() => {
    if (user?.docenteId) {
      setDocenteId(user.docenteId);
    } else if (user?.id) {
      apiGet<{ id: string }>(`/api/docentes/buscar`, { usuarioId: user.id })
        .then(res => setDocenteId(res.data?.id || null))
        .catch(() => setError('No se pudo encontrar el docente asociado'));
    }
  }, [user]);

  const fetchData = useCallback(async () => {
    if (!docenteId) return;
    setLoading(true);
    try {
      const [periodoRes, cursosRes, ambientesRes, horariosRes] = await Promise.all([
        apiGet<Periodo>('/api/periodos/activo'),
        apiGet<Curso[]>(`/api/docentes/${docenteId}/cursos`),
        apiGet<Ambiente[]>('/api/ambientes'),
        apiGet<any[]>('/api/horarios', { docenteId }),
      ]);

      setPeriodoActivo(periodoRes.data || null);
      setCursos(cursosRes.data || []);
      setAmbientes(ambientesRes.data || []);
      setHorariosExistentes(horariosRes.data || []);
    } catch (err) {
      setError('Error al cargar datos necesarios para la selección');
    } finally {
      setLoading(false);
    }
  }, [docenteId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const aulas = useMemo(() => ambientes.filter(a => a.tipo === TipoAmbiente.AULA), [ambientes]);
  const laboratorios = useMemo(() => ambientes.filter(a => a.tipo === TipoAmbiente.LABORATORIO), [ambientes]);

  const getEstadoCurso = useCallback((curso: Curso) => {
    const horariosCurso = horariosExistentes.filter(h => h.cursoId === curso.id);
    const tieneTeoria = curso.horasTeoria > 0;
    const tieneLab = curso.horasLaboratorio > 0;
    
    const countTeoria = horariosCurso.filter(h => h.ambiente?.tipo === 'AULA').length;
    const countLab = horariosCurso.filter(h => h.ambiente?.tipo === 'LABORATORIO').length;

    if (tieneTeoria && tieneLab) {
      if (countTeoria > 0 && countLab > 0) return 'Completo';
      if (countTeoria > 0 || countLab > 0) return 'Parcial';
      return 'Sin horario';
    }
    if (tieneTeoria) return countTeoria > 0 ? 'Completo' : 'Sin horario';
    if (tieneLab) return countLab > 0 ? 'Completo' : 'Sin horario';
    return 'Completo';
  }, [horariosExistentes]);

  const handleGuardarHorario = useCallback(async (tipo: 'TEORIA' | 'LAB') => {
    if (!cursoSeleccionado || !periodoActivo || !docenteId) return;
    
    const form = tipo === 'TEORIA' ? teoriaForm : labForm;
    if (!form.grupoId || !form.dia || !form.horaInicio || !form.horaFin || !form.ambienteId) {
      setError('Completa todos los campos');
      return;
    }

    const hayCruce = horariosExistentes.some(h => 
      h.diaSemana === form.dia && 
      ((form.horaInicio >= h.horaInicio && form.horaInicio < h.horaFin) ||
       (form.horaFin > h.horaInicio && form.horaFin <= h.horaFin))
    );

    if (hayCruce) {
      setError('Conflicto: ya tienes clase ese día y hora');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await apiPost('/api/horarios', {
        periodoId: periodoActivo.id,
        cursoId: cursoSeleccionado.id,
        docenteId: docenteId,
        grupoId: form.grupoId,
        ambienteId: form.ambienteId,
        diaSemana: form.dia,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        estado: 'BORRADOR'
      });

      setSuccess(`Horario de ${tipo.toLowerCase()} guardado exitosamente`);
      
      const updatedHorarios = await apiGet<any[]>('/api/horarios', { docenteId });
      setHorariosExistentes(updatedHorarios.data || []);
      
      if (tipo === 'TEORIA') setTeoriaForm({ grupoId: '', dia: '', horaInicio: '', horaFin: '', ambienteId: '' });
      else setLabForm({ grupoId: '', dia: '', horaInicio: '', horaFin: '', ambienteId: '' });

    } catch (err: any) {
      setError(err instanceof ApiClientError ? err.message : 'Error al guardar el horario');
    } finally {
      setSaving(false);
    }
  }, [cursoSeleccionado, periodoActivo, docenteId, teoriaForm, labForm, horariosExistentes]);

  if (loading || authLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-unt-blue" />
        <p className="text-slate-500 animate-pulse">Cargando carga académica y ambientes...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Link 
            href="/dashboard/docente"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-unt-blue"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Volver al Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Selección de Horario</h1>
            <Badge variant="outline" className="bg-blue-50 text-unt-blue border-blue-200">
              {periodoActivo?.nombre || '2026-I'} (Activo)
            </Badge>
          </div>
          <p className="text-slate-500">
            Elige el día, hora y ambiente para cada uno de tus cursos asignados.
          </p>
        </div>
      </div>

      {error && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <ErrorAlert message={error} />
        </div>
      )}
      
      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-700 border border-emerald-200 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5" />
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Columna Izquierda */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-unt-blue" />
              Cursos Asignados
            </h2>
            <Badge className="bg-slate-100 text-slate-600 border-none">
              {cursos.length} total
            </Badge>
          </div>
          
          <div className="space-y-3">
            {cursos.map((curso) => {
              const estado = getEstadoCurso(curso);
              const isSelected = cursoSeleccionado?.id === curso.id;
              
              return (
                <button
                  key={curso.id}
                  onClick={() => {
                    setCursoSeleccionado(curso);
                    setError(null);
                    setSuccess(null);
                  }}
                  className={cn(
                    "w-full text-left transition-all duration-200 rounded-xl border p-4 group relative overflow-hidden",
                    isSelected 
                      ? "border-unt-blue bg-blue-50/50 ring-1 ring-unt-blue shadow-md" 
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <Badge className="bg-unt-blue/10 text-unt-blue hover:bg-unt-blue/20 border-none font-bold">
                        {curso.codigo}
                      </Badge>
                      <h3 className="font-bold text-slate-900 leading-tight group-hover:text-unt-blue transition-colors">
                        {curso.nombre}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" /> Ciclo {curso.ciclo}
                        </span>
                        <span>•</span>
                        <span>{curso.horasTeoria}T · {curso.horasPractica}P · {curso.horasLaboratorio}L</span>
                      </div>
                    </div>
                    <Badge 
                      className={cn(
                        "text-[10px] uppercase font-black px-2 py-0.5",
                        estado === 'Completo' ? "bg-emerald-100 text-emerald-700" :
                        estado === 'Parcial' ? "bg-amber-100 text-amber-700" :
                        "bg-rose-100 text-rose-700"
                      )}
                    >
                      {estado}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="lg:col-span-8">
          {cursoSeleccionado ? (
            <div className="space-y-6">
              <Card className="p-6 border-slate-200">
                <div className="mb-8 border-b border-slate-100 pb-4">
                  <h2 className="text-2xl font-black text-slate-900">{cursoSeleccionado.nombre}</h2>
                </div>

                <div className="space-y-10">
                  {/* TEORÍA */}
                  {cursoSeleccionado.horasTeoria > 0 && (
                    <section className="space-y-4">
                      <h3 className="text-lg font-bold flex items-center gap-2">📖 Horario de Teoría</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Grupo</label>
                          <Selector value={teoriaForm.grupoId} onValueChange={(val) => setTeoriaForm({ ...teoriaForm, grupoId: val })}>
                            <SelectorTrigger><SelectorValue placeholder="Selecciona grupo" /></SelectorTrigger>
                            <SelectorContent>
                              {cursoSeleccionado.grupos.map(g => <SelectorItem key={g.id} value={g.id}>Grupo {g.nombre}</SelectorItem>)}
                            </SelectorContent>
                          </Selector>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Día</label>
                          <div className="flex flex-wrap gap-2">
                            {DIAS_OPCIONES.map((dia) => (
                              <button
                                key={dia.value}
                                onClick={() => setTeoriaForm({ ...teoriaForm, dia: dia.value as DiaSemana })}
                                className={cn(
                                  "flex-1 py-2 px-3 text-xs font-bold rounded-lg border transition-all",
                                  teoriaForm.dia === dia.value ? "bg-unt-blue text-white" : "bg-white text-slate-600"
                                )}
                              >
                                {dia.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Hora Inicio</label>
                          <Selector value={teoriaForm.horaInicio} onValueChange={(val) => setTeoriaForm({ ...teoriaForm, horaInicio: val })}>
                            <SelectorTrigger><SelectorValue placeholder="07:00" /></SelectorTrigger>
                            <SelectorContent>
                              {HORAS_OPCIONES.map(o => <SelectorItem key={o.value} value={o.value}>{o.label}</SelectorItem>)}
                            </SelectorContent>
                          </Selector>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Hora Fin</label>
                          <Selector value={teoriaForm.horaFin} onValueChange={(val) => setTeoriaForm({ ...teoriaForm, horaFin: val })}>
                            <SelectorTrigger><SelectorValue placeholder="09:00" /></SelectorTrigger>
                            <SelectorContent>
                              {HORAS_OPCIONES.filter(o => o.value > teoriaForm.horaInicio).map(o => <SelectorItem key={o.value} value={o.value}>{o.label}</SelectorItem>)}
                            </SelectorContent>
                          </Selector>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Aula</label>
                          <Selector value={teoriaForm.ambienteId} onValueChange={(val) => setTeoriaForm({ ...teoriaForm, ambienteId: val })}>
                            <SelectorTrigger><SelectorValue placeholder="Selecciona un aula" /></SelectorTrigger>
                            <SelectorContent>
                              {aulas.map(a => <SelectorItem key={a.id} value={a.id}>{a.codigo} - {a.nombre} (Cap: {a.capacidad})</SelectorItem>)}
                            </SelectorContent>
                          </Selector>
                        </div>
                      </div>
                      <Boton className="w-full bg-unt-blue" onClick={() => handleGuardarHorario('TEORIA')}>Guardar teoría</Boton>
                    </section>
                  )}

                  {/* LABORATORIO */}
                  {cursoSeleccionado.horasLaboratorio > 0 && (
                    <section className="space-y-4 pt-6 border-t">
                      <h3 className="text-lg font-bold flex items-center gap-2">🧪 Horario de Laboratorio</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Grupo</label>
                          <Selector value={labForm.grupoId} onValueChange={(val) => setLabForm({ ...labForm, grupoId: val })}>
                            <SelectorTrigger><SelectorValue placeholder="Selecciona grupo" /></SelectorTrigger>
                            <SelectorContent>
                              {cursoSeleccionado.grupos.map(g => <SelectorItem key={g.id} value={g.id}>Grupo {g.nombre}</SelectorItem>)}
                            </SelectorContent>
                          </Selector>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Día</label>
                          <div className="flex flex-wrap gap-2">
                            {DIAS_OPCIONES.map((dia) => (
                              <button
                                key={dia.value}
                                onClick={() => setLabForm({ ...labForm, dia: dia.value as DiaSemana })}
                                className={cn(
                                  "flex-1 py-2 px-3 text-xs font-bold rounded-lg border",
                                  labForm.dia === dia.value ? "bg-emerald-600 text-white" : "bg-white text-slate-600"
                                )}
                              >
                                {dia.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Hora Inicio</label>
                          <Selector value={labForm.horaInicio} onValueChange={(val) => setLabForm({ ...labForm, horaInicio: val })}>
                            <SelectorTrigger><SelectorValue placeholder="07:00" /></SelectorTrigger>
                            <SelectorContent>
                              {HORAS_OPCIONES.map(o => <SelectorItem key={o.value} value={o.value}>{o.label}</SelectorItem>)}
                            </SelectorContent>
                          </Selector>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Hora Fin</label>
                          <Selector value={labForm.horaFin} onValueChange={(val) => setLabForm({ ...labForm, horaFin: val })}>
                            <SelectorTrigger><SelectorValue placeholder="09:00" /></SelectorTrigger>
                            <SelectorContent>
                              {HORAS_OPCIONES.filter(o => o.value > labForm.horaInicio).map(o => <SelectorItem key={o.value} value={o.value}>{o.label}</SelectorItem>)}
                            </SelectorContent>
                          </Selector>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase">Laboratorio</label>
                          <Selector value={labForm.ambienteId} onValueChange={(val) => setLabForm({ ...labForm, ambienteId: val })}>
                            <SelectorTrigger><SelectorValue placeholder="Selecciona laboratorio" /></SelectorTrigger>
                            <SelectorContent>
                              {laboratorios.map(l => <SelectorItem key={l.id} value={l.id}>{l.codigo} - {l.nombre} (Cap: {l.capacidad})</SelectorItem>)}
                            </SelectorContent>
                          </Selector>
                        </div>
                      </div>
                      <Boton className="w-full bg-emerald-600" onClick={() => handleGuardarHorario('LAB')}>Guardar laboratorio</Boton>
                    </section>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <div className="flex h-[500px] flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
              <BookOpen className="h-12 w-12 text-slate-300" />
              <h3 className="text-lg font-bold text-slate-700">Selecciona un curso</h3>
              <p className="text-sm text-slate-500">Haz clic en uno de tus cursos de la lista para comenzar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
