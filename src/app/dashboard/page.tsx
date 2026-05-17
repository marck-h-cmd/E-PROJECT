'use client';

import { useEffect, useMemo, useState } from 'react';
import { Building2, CalendarClock, GraduationCap, Loader2, Users } from 'lucide-react';
import { BarChartCard } from '@/components/charts/BarChartCard';
import { PieChartCard } from '@/components/charts/PieChartCard';
import { ErrorAlert } from '@/components/feedback/ErrorAlert';
import { KpiCard } from '@/components/feedback/KpiCard';
import { KpiSkeleton } from '@/components/feedback/KpiSkeleton';
import { CHART_PRIMARY } from '@/lib/chart-colors';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiGet, ApiClientError } from '@/lib/api-client';
import { Formateadores } from '@/lib/formateadores';
import { usePeriodo } from '@/contexts/PeriodoContext';

interface ResumenEstadisticas {
  totalDocentes: number;
  totalCursos: number;
  totalAmbientes: number;
  totalHorarios: number;
  horariosPorEstado: Record<string, number>;
  horariosPorDia: Record<string, number>;
}

interface OcupacionAmbiente {
  codigo: string;
  nombre: string;
  porcentajeOcupacion: number;
}

type AvanceCategoria = Record<
  string,
  {
    porcentajeAvance: number;
    totalDocentes: number;
  }
>;

type MapaCalor = Record<string, Record<string, number>>;

const DIAS_CORTO: Record<string, string> = {
  LUNES: 'Lun',
  MARTES: 'Mar',
  MIERCOLES: 'Mié',
  JUEVES: 'Jue',
  VIERNES: 'Vie',
};

const ORDEN_DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];

export default function DashboardPage() {
  const { periodoSeleccionado, loading: periodoLoading } = usePeriodo();
  const periodoId = periodoSeleccionado?.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumen, setResumen] = useState<ResumenEstadisticas | null>(null);
  const [ocupacion, setOcupacion] = useState<OcupacionAmbiente[]>([]);
  const [avance, setAvance] = useState<AvanceCategoria | null>(null);
  const [mapaCalor, setMapaCalor] = useState<MapaCalor | null>(null);

  useEffect(() => {
    if (!periodoId) {
      setResumen(null);
      setOcupacion([]);
      setAvance(null);
      setMapaCalor(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [r, o, a, m] = await Promise.all([
          apiGet<ResumenEstadisticas>('/api/estadisticas/resumen', { periodoId }),
          apiGet<OcupacionAmbiente[]>('/api/estadisticas/ocupacion-ambientes', { periodoId }),
          apiGet<AvanceCategoria>('/api/estadisticas/avance-categoria', { periodoId }),
          apiGet<MapaCalor>('/api/estadisticas/mapa-calor', { periodoId }),
        ]);
        if (cancelled) return;
        setResumen(r.data ?? null);
        setOcupacion(o.data ?? []);
        setAvance(a.data ?? null);
        setMapaCalor(m.data ?? null);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof ApiClientError ? e.message : 'Error al cargar el dashboard');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [periodoId]);

  const pieAvance = useMemo(() => {
    if (!avance) return [];
    return Object.entries(avance).map(([cat, v]) => ({
      name: Formateadores.categoriaDocente(cat),
      value: Math.max(0, v.porcentajeAvance),
    }));
  }, [avance]);

  const barMapaCalor = useMemo(() => {
    if (!mapaCalor) return [];
    const rows: Record<string, unknown>[] = [];
    for (const dia of ORDEN_DIAS) {
      const bloques = mapaCalor[dia];
      if (!bloques) continue;
      for (const hora of Object.keys(bloques).sort()) {
        rows.push({
          franja: `${DIAS_CORTO[dia] ?? dia} ${hora}`,
          sesiones: bloques[hora],
        });
      }
    }
    return rows;
  }, [mapaCalor]);

  const barOcupacion = useMemo(
    () =>
      ocupacion.slice(0, 12).map((a) => ({
        ambiente: `${a.codigo}`,
        pct: a.porcentajeOcupacion,
      })),
    [ocupacion]
  );

  const showPeriodoHint = !periodoLoading && !periodoId;
  const isLoadingContent = periodoLoading || (!!periodoId && loading);

  return (
    <div>
      <PageHeader
        title="Panel principal"
        description={
          periodoSeleccionado
            ? `Datos del período: ${periodoSeleccionado.nombre}`
            : 'Resumen operativo del sistema de horarios UNT.'
        }
      />

      {showPeriodoHint && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Seleccione un período académico en la barra superior para ver indicadores y gráficos
          detallados.
        </div>
      )}

      {error && <ErrorAlert message={error} className="mb-6" />}

      {isLoadingContent ? (
        <div className="space-y-8">
          <KpiSkeleton />
          <div className="grid gap-6 lg:grid-cols-2">
            <BarChartCard title=" " data={[]} dataKey="pct" xKey="a" loading />
            <PieChartCard title=" " data={[]} loading />
          </div>
          <BarChartCard title=" " data={[]} dataKey="s" xKey="f" loading />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Docentes activos"
              value={resumen?.totalDocentes ?? 0}
              subtitle="Registro general"
              icon={Users}
            />
            <KpiCard
              title="Cursos activos"
              value={resumen?.totalCursos ?? 0}
              subtitle="Catálogo vigente"
              icon={GraduationCap}
            />
            <KpiCard
              title="Ambientes"
              value={resumen?.totalAmbientes ?? 0}
              subtitle="Aulas y laboratorios"
              icon={Building2}
            />
            <KpiCard
              title="Horarios (período)"
              value={resumen?.totalHorarios ?? 0}
              subtitle="Sesiones programadas"
              icon={CalendarClock}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <BarChartCard
              title="Ocupación por ambiente"
              description="Porcentaje aproximado de franjas usadas (top 12)"
              data={barOcupacion}
              xKey="ambiente"
              dataKey="pct"
              color={CHART_PRIMARY}
              loading={false}
            />
            <PieChartCard
              title="Avance por categoría docente"
              description="Progreso de horas asignadas vs requeridas"
              data={pieAvance}
            />
          </div>

          <BarChartCard
            title="Mapa de calor — sesiones por día y hora"
            description="Conteo de inicios de clase entre 8:00 y 19:00 (Lun–Vie)"
            data={barMapaCalor}
            xKey="franja"
            dataKey="sesiones"
            color={CHART_PRIMARY}
          />
        </div>
      )}
    </div>
  );
}
