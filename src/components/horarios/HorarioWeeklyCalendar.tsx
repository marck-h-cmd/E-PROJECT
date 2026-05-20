'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/cn';
import { colorForCourseKey, DIA_HEADER_CLASS } from '@/lib/horario-colors';
import { minutosDesdeMedianoche } from '@/lib/horario-horas';

const CICLO_ROMANO: Record<number, string> = {
  1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V',
  6: 'VI', 7: 'VII', 8: 'VIII', 9: 'IX', 10: 'X',
};

export interface HorarioCalendarItem {
  id: string;
  horaInicio: string;
  horaFin: string;
  diaSemana: string;
  curso: { codigo: string; fontColor?: string; nombre: string; ciclo: number };
  docente: { usuario: { nombre: string; apellidos: string } };
  ambiente: { codigo: string; tipo?: string };
  grupo?: { nombre: string } | null;
  estado?: string;
}

interface HorarioConColumna extends HorarioCalendarItem {
  columna: number;
  totalColumnas: number;
}

interface HorarioWeeklyCalendarProps {
  horarios: HorarioCalendarItem[];
  dias: readonly string[];
  diaLabels: Record<string, string>;
  horas: number[]; // e.g. [7, 8, 9, ... 20]
  loading?: boolean;
}

const HORA_INICIO_BASE = 7;
const PIXELES_POR_HORA = 60;

function decimalHour(timeStr: string) {
  const m = minutosDesdeMedianoche(timeStr);
  return m / 60;
}

function asignarColumnas(horariosDelDia: HorarioCalendarItem[]): HorarioConColumna[] {
  // Ordenar por hora de inicio
  const ordenados = [...horariosDelDia].sort((a, b) => decimalHour(a.horaInicio) - decimalHour(b.horaInicio));
  
  const columnas: HorarioCalendarItem[][] = [];
  
  ordenados.forEach(horario => {
    let colocada = false;
    for (let i = 0; i < columnas.length; i++) {
      const col = columnas[i];
      const ultimo = col[col.length - 1];
      if (decimalHour(ultimo.horaFin) <= decimalHour(horario.horaInicio)) {
        col.push(horario);
        colocada = true;
        break;
      }
    }
    if (!colocada) {
      columnas.push([horario]);
    }
  });

  const result: HorarioConColumna[] = [];
  ordenados.forEach(horario => {
    let colIndex = 0;
    for (let i = 0; i < columnas.length; i++) {
      if (columnas[i].find(h => h.id === horario.id)) {
        colIndex = i;
        break;
      }
    }
    result.push({
      ...horario,
      columna: colIndex,
      totalColumnas: columnas.length
    });
  });

  return result;
}

export function HorarioWeeklyCalendar({
  horarios,
  dias,
  diaLabels,
  horas,
  loading,
}: HorarioWeeklyCalendarProps) {
  
  const horariosPorDia = useMemo(() => {
    const map = new Map<string, HorarioConColumna[]>();
    for (const d of dias) {
      const delDia = horarios.filter(h => h.diaSemana === d);
      map.set(d, asignarColumnas(delDia));
    }
    return map;
  }, [horarios, dias]);

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

        <div className="flex border rounded-lg bg-slate-50 overflow-x-auto min-w-[720px]">
          {/* Eje Y de horas */}
          <div className="w-[60px] flex-shrink-0 bg-slate-100 border-r relative" style={{ height: `${horas.length * PIXELES_POR_HORA}px` }}>
            {horas.map(h => (
              <div 
                key={h} 
                className="absolute w-full border-b text-xs text-slate-500 text-right pr-2 font-mono"
                style={{ top: `${(h - HORA_INICIO_BASE) * PIXELES_POR_HORA}px`, height: `${PIXELES_POR_HORA}px` }}
              >
                {h}:00
              </div>
            ))}
          </div>

          {/* Días */}
          {dias.map((d) => {
            const list = horariosPorDia.get(d) ?? [];
            return (
              <div key={d} className="flex-1 min-w-[120px] relative border-r last:border-r-0" style={{ height: `${horas.length * PIXELES_POR_HORA}px` }}>
                {horas.map(h => (
                   <div key={h} className="absolute w-full border-b border-slate-200" style={{ top: `${(h - HORA_INICIO_BASE) * PIXELES_POR_HORA}px`, height: `${PIXELES_POR_HORA}px` }} />
                ))}
                
                {list.map((x) => {
                  const style = colorForCourseKey(x.curso.codigo);
                  const startHour = decimalHour(x.horaInicio);
                  const endHour = decimalHour(x.horaFin);
                  const top = (startHour - HORA_INICIO_BASE) * PIXELES_POR_HORA;
                  const height = Math.max((endHour - startHour) * PIXELES_POR_HORA, 40); // min height 40px
                  
                  const maxCols = Math.min(x.totalColumnas, 3);
                  const isExtra = x.totalColumnas > 3 && x.columna >= 2;
                  const colToUse = isExtra ? 2 : x.columna;

                  if (x.columna > 2) return null; // Ocultar si hay demasiados (simplificación, se podría hacer mejor)
                  
                  const width = `calc(${100 / maxCols}% - 2px)`;
                  const left = `calc(${(100 / maxCols) * colToUse}% + 1px)`;

                  return (
                    <div
                      key={x.id}
                      className={cn(
                        'absolute rounded border px-1.5 py-1 shadow-sm transition-all duration-200 overflow-hidden text-[10px] leading-tight z-10 hover:z-50 hover:shadow-md cursor-pointer hover:h-auto hover:min-h-fit',
                        style.bg,
                        style.border
                      )}
                      style={{ top, height, left, width }}
                      title={`${x.curso.nombre} - ${x.docente.usuario.nombre} ${x.docente.usuario.apellidos}\nAmbiente: ${x.ambiente.codigo}\nHora: ${x.horaInicio.slice(0,5)} - ${x.horaFin.slice(0,5)}`}
                    >
                      <div className={cn('font-bold truncate', style.title)}>
                        [C-{CICLO_ROMANO[x.curso.ciclo] || x.curso.ciclo}] {x.curso.codigo}
                      </div>
                      <div className={cn('truncate font-medium mt-0.5', style.subtitle)}>
                        {x.ambiente.codigo}
                      </div>
                      <div className="truncate opacity-80 mt-0.5">
                         {x.horaInicio.slice(0, 5)}–{x.horaFin.slice(0, 5)}
                      </div>
                      {isExtra && (
                        <div className="absolute bottom-0 right-0 bg-black/50 text-white text-[8px] px-1 rounded-tl">
                          +{x.totalColumnas - 2}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
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
