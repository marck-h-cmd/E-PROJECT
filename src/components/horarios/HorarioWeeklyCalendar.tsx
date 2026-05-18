'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/cn';
import { colorForCourseKey, DIA_HEADER_CLASS } from '@/lib/horario-colors';

const CICLO_ROMANO: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
  9: 'IX',
  10: 'X',
};

export interface HorarioCalendarItem {
  id: string;
  horaInicio: string;
  horaFin: string;
  diaSemana: string;
  curso: { codigo: string; nombre: string; ciclo: number };
  docente: { usuario: { nombre: string; apellidos: string } };
  ambiente: { codigo: string };
  grupo?: { nombre: string } | null;
}

interface HorarioWeeklyCalendarProps {
  horarios: HorarioCalendarItem[];
  dias: readonly string[];
  diaLabels: Record<string, string>;
  horas: number[];
  loading?: boolean;
}

export function HorarioWeeklyCalendar({
  horarios,
  dias,
  diaLabels,
  horas,
  loading,
}: HorarioWeeklyCalendarProps) {
  const celdas = useMemo(() => {
    const map = new Map<string, HorarioCalendarItem[]>();
    for (const h of horarios) {
      const hour = parseInt(h.horaInicio.split(':')[0], 10);
      const key = `${h.diaSemana}-${hour}`;
      const prev = map.get(key) ?? [];
      prev.push(h);
      map.set(key, prev);
    }
    return map;
  }, [horarios]);

  const leyenda = useMemo(() => {
    const seen = new Map<string, ReturnType<typeof colorForCourseKey>>();
    for (const h of horarios) {
      if (!seen.has(h.curso.codigo)) {
        seen.set(h.curso.codigo, colorForCourseKey(h.curso.codigo));
      }
    }
    return Array.from(seen.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [horarios]);

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="card-body space-y-3 p-4">
          <div className="skeleton h-6 w-48" />
          <div className="skeleton h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="card-body space-y-4 p-2 sm:p-4">
        <div className="flex flex-wrap gap-2">
          {dias.map((d) => (
            <span
              key={d}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-semibold shadow-sm',
                DIA_HEADER_CLASS[d] ?? 'bg-slate-500 text-white'
              )}
            >
              {diaLabels[d] ?? d}
            </span>
          ))}
        </div>

        <div
          className="grid min-w-[720px] gap-px overflow-x-auto rounded-lg bg-slate-200 text-xs"
          style={{ gridTemplateColumns: `80px repeat(${dias.length}, minmax(0,1fr))` }}
        >
          <div className="bg-slate-100 p-2 font-semibold text-slate-600">Hora</div>
          {dias.map((d) => (
            <div
              key={d}
              className={cn(
                'p-2 text-center font-semibold',
                DIA_HEADER_CLASS[d] ?? 'bg-unt-blue text-white'
              )}
            >
              {diaLabels[d] ?? d}
            </div>
          ))}
          {horas.map((h) => (
            <div key={h} className="contents">
              <div className="flex items-center bg-slate-50 p-2 font-mono text-slate-700">{h}:00</div>
              {dias.map((d) => {
                const list = celdas.get(`${d}-${h}`) ?? [];
                return (
                  <div
                    key={`${d}-${h}`}
                    className={cn('min-h-[52px] bg-white p-1', list.length > 1 && 'bg-amber-50/80')}
                  >
                    {list.map((x) => {
                      const style = colorForCourseKey(x.curso.codigo);
                      return (
                        <div
                          key={x.id}
                          className={cn(
                            'mb-1 rounded border px-1.5 py-1 leading-tight shadow-sm transition-colors duration-150',
                            style.bg,
                            style.border
                          )}
                          title={`${x.curso.nombre} · ${x.ambiente.codigo}`}
                        >
                          <div className={cn('font-semibold', style.title)}>
                            [Ciclo {CICLO_ROMANO[x.curso.ciclo] || x.curso.ciclo}] {x.curso.codigo}
                          </div>
                          <div className={cn('truncate text-[10px] font-medium', style.subtitle)}>
                            {x.ambiente.codigo} · {x.horaInicio.slice(0, 5)}–{x.horaFin.slice(0, 5)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {leyenda.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Leyenda de cursos
            </p>
            <div className="flex flex-wrap gap-3">
              {leyenda.map(([codigo, style]) => (
                <div key={codigo} className="flex items-center gap-2 text-xs text-slate-700">
                  <span className={cn('h-2.5 w-2.5 rounded-full', style.dot)} />
                  <span className={cn('font-semibold', style.title)}>{codigo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {horarios.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-4">
            No hay bloques en el calendario para este período.
          </p>
        )}
      </div>
    </div>
  );
}
