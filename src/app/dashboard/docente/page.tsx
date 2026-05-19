'use client';

import { useRequireAuth } from '@/contexts/AuthContext';
import { Rol } from '@prisma/client';
import { PageHeader } from '@/components/layout/PageHeader';
import { ErrorAlert } from '@/components/feedback/ErrorAlert';
import { apiGet, ApiClientError } from '@/lib/api-client';
import { Loader2, Calendar, Clock, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BarChartCard } from '@/components/charts/BarChartCard';
import { PieChartCard } from '@/components/charts/PieChartCard';

interface HorarioItem {
  id: string;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
  curso: { nombre: string; codigo: string };
  ambiente: { codigo: string; nombre: string; tipo: string };
  grupo?: { nombre: string };
}

interface VentanaAtencion {
  id: string;
  nombre: string;
  estado: string;
  posicionCola?: number;
  turnoActual?: number;
  periodo?: { nombre: string };
}

interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  canal: 'CORREO' | 'WHATSAPP' | 'TELEGRAM' | 'SISTEMA';
  estado: 'ENVIADA' | 'PENDIENTE' | 'FALLIDA' | 'LEIDA';
  createdAt: string;
}

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
const DIAS_LABEL: Record<string, string> = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
};

const HORAS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00',
];

const COLORES_CURSO = [
  { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-900', badge: 'bg-blue-500' },
  { bg: 'bg-green-100', border: 'border-green-400', text: 'text-green-900', badge: 'bg-green-500' },
  { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-900', badge: 'bg-purple-500' },
  { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-900', badge: 'bg-amber-500' },
  { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-900', badge: 'bg-rose-500' },
  { bg: 'bg-teal-100', border: 'border-teal-400', text: 'text-teal-900', badge: 'bg-teal-500' },
];

const CANAL_ICON: Record<string, string> = {
  CORREO: '📧',
  WHATSAPP: '📱',
  TELEGRAM: '✈️',
  SISTEMA: '🔔',
};

const ESTADO_NOTIF_CLASS: Record<string, string> = {
  ENVIADA: 'bg-green-100 text-green-700',
  PENDIENTE: 'bg-yellow-100 text-yellow-700',
  FALLIDA: 'bg-red-100 text-red-700',
  LEIDA: 'bg-gray-100 text-gray-500',
};

export default function DocenteDashboardPage() {
  const { user, loading: authLoading } = useRequireAuth([Rol.DOCENTE]);
  const [activeTab, setActiveTab] = useState<'horario' | 'ventana' | 'notificaciones'>('horario');
  const [horarios, setHorarios] = useState<HorarioItem[]>([]);
  const [ventana, setVentana] = useState<VentanaAtencion | null>(null);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docenteId, setDocenteId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (user?.docenteId) setDocenteId(user.docenteId);
  }, [user]);

  useEffect(() => {
    if (!authLoading && user && !docenteId && !user.docenteId) {
      const fetchDocenteId = async () => {
        try {
          const res = await apiGet<{ id: string }>(`/api/docentes/buscar`, { usuarioId: user.id });
          if (res.data?.id) {
            setDocenteId(res.data.id);
          } else {
            setError('No se pudo encontrar el registro de docente asociado a tu usuario.');
            setLoading(false);
          }
        } catch {
          setError('Error al buscar datos del docente.');
          setLoading(false);
        }
      };
      fetchDocenteId();
    }
  }, [user, authLoading, docenteId]);

  useEffect(() => {
    if (!docenteId || !user) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [horariosRes, ventanaRes, notifsRes] = await Promise.all([
          apiGet<HorarioItem[]>(`/api/horarios`, { docenteId }),
          apiGet<VentanaAtencion>(`/api/ventanas-atencion/activa`, { docenteId }),
          apiGet<Notificacion[]>(`/api/notificaciones`, { limit: 20, usuarioId: user.id }),
        ]);
        setHorarios(horariosRes.data || []);
        setVentana(ventanaRes.data || null);
        setNotificaciones(notifsRes.data || []);
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : 'Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [docenteId, user]);

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-unt-blue" />
      </div>
    );
  }

  const totalSesiones = horarios.length;
  
  const calcularHoras = (items: HorarioItem[]) => items.reduce((acc, h) => {
    const inicio = parseInt(h.horaInicio.split(':')[0]);
    const fin = parseInt(h.horaFin.split(':')[0]);
    return acc + (fin - inicio);
  }, 0);

  const cursosAsignados = new Set(horarios.map(h => h.curso?.codigo)).size;

  const matriz: Record<string, Record<string, HorarioItem>> = {};
  const ocupado: Record<string, Set<string>> = {}; // { dia: Set<hora> }

  horarios.forEach(h => {
    if (!matriz[h.diaSemana]) matriz[h.diaSemana] = {};
    matriz[h.diaSemana][h.horaInicio] = h;

    const inicio = parseInt(h.horaInicio.split(':')[0]);
    const fin = parseInt(h.horaFin.split(':')[0]);
    for (let i = inicio + 1; i < fin; i++) {
      const horaOcupada = `${i.toString().padStart(2, '0')}:00`;
      if (!ocupado[h.diaSemana]) ocupado[h.diaSemana] = new Set();
      ocupado[h.diaSemana].add(horaOcupada);
    }
  });

  const horasConClase = HORAS.filter(h => DIAS.some(d => matriz[d]?.[h] || ocupado[d]?.has(h)));

  const cursosUnicos = Array.from(new Set(horarios.map(h => h.curso?.codigo)));
  const cursoColorMap: Record<string, typeof COLORES_CURSO[0]> = {};
  cursosUnicos.forEach((codigo, index) => {
    cursoColorMap[codigo] = COLORES_CURSO[index % COLORES_CURSO.length];
  });

  const horasPorDia: Record<string, number> = {};
  horarios.forEach(h => {
    const inicio = parseInt(h.horaInicio.split(':')[0]);
    const fin = parseInt(h.horaFin.split(':')[0]);
    horasPorDia[h.diaSemana] = (horasPorDia[h.diaSemana] || 0) + (fin - inicio);
  });

  const totalHorasSemanal = Object.values(horasPorDia).reduce((acc, h) => acc + h, 0);

  const pieData = cursosUnicos.map(codigo => ({
    name: codigo,
    value: calcularHoras(horarios.filter(h => h.curso?.codigo === codigo)),
  }));

  const barData = DIAS.map(dia => ({
    dia: DIAS_LABEL[dia],
    sesiones: horasPorDia[dia] || 0,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Bienvenido, ${user?.nombre} ${user?.apellidos}`}
        actions={
          <Link
            href="/dashboard/docente/cursos"
            className="inline-flex items-center gap-2 rounded-lg bg-unt-blue px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-unt-blue/90"
          >
            Mis cursos y grupos
          </Link>
        }
      />

      {error && <ErrorAlert message={error} />}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Carga Lectiva', value: `${totalHorasSemanal}h`, icon: <Clock className="h-5 w-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Sesiones', value: totalSesiones, icon: <Calendar className="h-5 w-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Asignaturas', value: cursosAsignados, icon: <TrendingUp className="h-5 w-5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Atención', value: 'Activa', icon: <Users className="h-5 w-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((kpi, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${kpi.bg} ${kpi.color} transition-transform group-hover:scale-110`}>
                {kpi.icon}
              </div>
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{kpi.label}</p>
                <p className="text-2xl font-black tracking-tight text-slate-900">
                  {loading ? '...' : kpi.value}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 opacity-[0.03] grayscale transition-transform group-hover:scale-125">
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="animate-fadeIn">
          <PieChartCard
            title="Distribución de Horas"
            data={pieData}
            loading={loading}
          />
        </div>
        <div className="animate-fadeIn">
          <BarChartCard
            title="Actividad Semanal"
            data={barData}
            xKey="dia"
            dataKey="sesiones"
            color="#0f2d55"
            loading={loading}
          />
        </div>
      </div>

      {ventana && (
        <div className="card overflow-hidden border-l-4 border-l-unt-blue">
          <div className="p-6">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    ventana.estado === 'ABIERTA' || ventana.estado === 'EN_CURSO' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{ventana.nombre}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full ${
                        ventana.estado === 'ABIERTA' || ventana.estado === 'EN_CURSO' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
                      }`} />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{ventana.estado}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-8">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tu Posición</p>
                    <p className="text-2xl font-bold text-unt-blue">
                      {ventana.posicionCola !== undefined ? `#${ventana.posicionCola}` : '—'}
                    </p>
                  </div>
                  <div className="h-10 w-px bg-slate-100 hidden sm:block" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Turno Actual</p>
                    <p className="text-2xl font-bold text-slate-700">
                      {ventana.turnoActual !== undefined ? `#${ventana.turnoActual}` : '—'}
                    </p>
                  </div>
                </div>
              </div>
              {(ventana.estado === 'ABIERTA' || ventana.estado === 'EN_CURSO') && (
                <Link
                  href="/dashboard/horarios/seleccion"
                  className="btn-primary px-8 py-3 shadow-lg shadow-unt-blue/10"
                >
                  Seleccionar horario
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden border-none bg-transparent shadow-none">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
          {[
            { id: 'horario', label: 'Mi Horario Semanal', icon: <Calendar className="h-4 w-4" /> },
            { id: 'ventana', label: 'Ventanilla Virtual', icon: <Users className="h-4 w-4" /> },
            { id: 'notificaciones', label: 'Centro de Mensajes', icon: <TrendingUp className="h-4 w-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all rounded-xl whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-white bg-slate-900 shadow-lg shadow-slate-200'
                  : 'text-slate-400 bg-white border border-slate-100 hover:text-slate-600 hover:border-slate-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card shadow-xl shadow-slate-200/50 border-slate-100">
          <div className="p-8">
            {activeTab === 'horario' && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap gap-4">
                    {cursosUnicos.map((codigo) => {
                      const curso = horarios.find(h => h.curso.codigo === codigo)?.curso;
                      const colors = cursoColorMap[codigo];
                      return (
                        <div key={codigo} className="flex items-center gap-2 rounded-full border border-slate-100 bg-white px-3 py-1.5 shadow-sm">
                          <div className={`h-2.5 w-2.5 rounded-full ${colors.badge}`} />
                          <span className="text-[11px] font-bold text-slate-700">
                            {codigo}: {curso?.nombre}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="rounded-xl bg-slate-900 px-6 py-3 text-white shadow-xl">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-60">Total Semanal: </span>
                    <span className="text-xl font-black">{totalHorasSemanal}h</span>
                  </div>
                </div>

              {loading ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-unt-blue" />
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Generando cronograma...</p>
                </div>
              ) : horasConClase.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50/30 p-12 text-center">
                  <div className="mb-4 text-4xl">📭</div>
                  <p className="text-lg font-black text-slate-900">No tienes horarios asignados</p>
                  <p className="mt-2 text-sm text-slate-500">Tu cronograma aparecerá aquí una vez que se confirmen tus cursos.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] border-collapse">
                      <thead>
                        <tr className="bg-[#1a365d] text-white">
                          <th className="w-24 p-4 text-[10px] font-black uppercase tracking-widest opacity-60">Hora</th>
                          {DIAS.map(d => (
                            <th key={d} className="p-4 text-xs font-black uppercase tracking-widest border-l border-white/10">
                              {DIAS_LABEL[d]}
                            </th>
                          ))}
                          <th className="w-24 p-4 text-[10px] font-black uppercase tracking-widest opacity-60 border-l border-white/10">Hora</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {horasConClase.map(hora => {
                          const [hStr, m] = hora.split(':');
                          const hNum = parseInt(hStr);
                          const horaFin = `${(hNum + 1).toString().padStart(2, '0')}:${m}`;
                          return (
                            <tr key={hora} className="group transition-colors hover:bg-slate-50/50">
                              <td className="bg-slate-100/80 p-4 text-center border-r border-slate-200">
                                <span className="text-[11px] font-bold text-slate-500 tabular-nums">{hora} - {horaFin}</span>
                              </td>
                              {DIAS.map(dia => {
                                const item = matriz[dia]?.[hora];
                                const isOcupado = ocupado[dia]?.has(hora);
                                if (isOcupado) return null;
                                if (!item) return <td key={dia} className="p-1 border-l border-slate-100 bg-white transition-colors hover:bg-slate-50" />;
                                const colors = cursoColorMap[item.curso.codigo];
                                const isLab = item.ambiente?.tipo === 'LABORATORIO';
                                const hInicio = parseInt(item.horaInicio.split(':')[0]);
                                const hFin = parseInt(item.horaFin.split(':')[0]);
                                const duracion = hFin - hInicio;
                                return (
                                  <td key={dia} rowSpan={duracion} className="p-1.5 border-l border-slate-100">
                                    <div className={`group/item relative h-full flex flex-col justify-between overflow-hidden rounded-xl border-l-4 p-3 shadow-sm transition-all hover:shadow-lg ${colors.bg} ${colors.border}`}>
                                      <div className="flex items-center justify-between gap-2">
                                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white ${colors.badge}`}>
                                          {isLab ? 'LAB' : 'TEORÍA'}
                                        </span>
                                        <span className="text-[9px] font-bold text-slate-400 tabular-nums">{item.horaInicio} - {item.horaFin}</span>
                                      </div>
                                      <div className="my-2 space-y-1">
                                        <p className={`text-[13px] font-black leading-tight ${colors.text}`}>{item.curso.nombre}</p>
                                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{item.curso.codigo}</p>
                                      </div>
                                      <div className="space-y-1 border-t border-black/5 pt-2">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                                          <TrendingUp className="h-3 w-3 opacity-40" />
                                          <span>Grupo: {item.grupo?.nombre || '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-600">
                                          <Users className="h-3 w-3 opacity-40" />
                                          <span>Ambiente: {item.ambiente.codigo}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                );
                              })}
                              <td className="bg-slate-100/80 p-4 text-center border-l border-slate-200">
                                <span className="text-[11px] font-bold text-slate-500 tabular-nums">{hora} - {horaFin}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-100 border-t-2 border-slate-200">
                          <td className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Totales</td>
                          {DIAS.map(dia => (
                            <td key={dia} className="p-4 text-center border-l border-slate-200">
                              <span className="text-sm font-black text-slate-800">{horasPorDia[dia] || 0}h</span>
                            </td>
                          ))}
                          <td className="p-4 text-center border-l border-slate-200">
                            <span className="text-sm font-black text-slate-800">{totalHorasSemanal}h</span>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ventana' && (
            <div className="flex min-h-[300px] flex-col items-center justify-center">
              {!ventana ? (
                <div className="max-w-xs text-center">
                  <p className="text-sm font-bold text-slate-900">No hay procesos activos</p>
                  <p className="text-xs text-slate-400">No hay ventanas de atención abiertas en este momento.</p>
                </div>
              ) : (
                <div className="w-full max-w-lg card p-8 border-unt-blue/20 bg-slate-50/30">
                   <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <span className="inline-block rounded-full bg-unt-blue/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-unt-blue">{ventana.estado}</span>
                        <h4 className="text-2xl font-bold text-slate-900">{ventana.nombre}</h4>
                        <p className="text-xs font-medium text-slate-400">Periodo {ventana.periodo?.nombre}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="card p-5 text-center bg-white">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Tu Lugar</p>
                            <p className="text-3xl font-bold text-unt-blue">#{ventana.posicionCola ?? '—'}</p>
                         </div>
                         <div className="card p-5 text-center bg-white">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Turno</p>
                            <p className="text-3xl font-bold text-slate-700">#{ventana.turnoActual ?? '—'}</p>
                         </div>
                      </div>
                      {(ventana.estado === 'ABIERTA' || ventana.estado === 'EN_CURSO') && (
                        <Link href="/dashboard/horarios/seleccion" className="btn-primary w-full py-4 text-base">Ir a selección de horario</Link>
                      )}
                   </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notificaciones' && (
            <div className="space-y-4">
              {notificaciones.length === 0 ? (
                <div className="flex min-h-[200px] flex-col items-center justify-center py-10 text-center">
                  <p className="text-sm font-bold text-slate-400">Historial vacío</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {notificaciones.map((notif) => (
                    <div key={notif.id} className="card p-4 hover:bg-slate-50/50">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-lg">{CANAL_ICON[notif.canal] || '🔔'}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h5 className="text-sm font-bold text-slate-900 truncate">{notif.titulo}</h5>
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${ESTADO_NOTIF_CLASS[notif.estado]}`}>{notif.estado}</span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-1">{notif.mensaje}</p>
                          <p className="mt-1.5 text-[10px] font-medium text-slate-400">{new Date(notif.createdAt).toLocaleString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
