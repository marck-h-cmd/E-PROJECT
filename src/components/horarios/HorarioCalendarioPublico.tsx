'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/cn';
import { colorForCourseKey, DIA_HEADER_CLASS } from '@/lib/horario-colors';
import { minutosDesdeMedianoche } from '@/lib/horario-horas';
import { HorarioCalendarItem } from './HorarioWeeklyCalendar';

interface HorarioCalendarioPublicoProps {
  horarios: HorarioCalendarItem[];
  dias: readonly string[];
  diaLabels: Record<string, string>;
  horas: number[];
  loading?: boolean;
}

const HORA_INICIO_BASE = 7;
const PIXELES_POR_HORA = 60;

function decimalHour(timeStr: string) {
  const m = minutosDesdeMedianoche(timeStr);
  return m / 60;
}

export function HorarioCalendarioPublico({ horarios, dias, diaLabels, horas, loading }: HorarioCalendarioPublicoProps) {
  const horariosPorDia = useMemo(() => {
    const map = new Map<string, any[]>();
    for (const d of dias) {
      const delDia = horarios.filter(h => h.diaSemana === d);
      
      const ordenados = [...delDia].sort((a, b) => decimalHour(a.horaInicio) - decimalHour(b.horaInicio));
      const columnas: any[][] = [];
      
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

      const result: any[] = [];
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
      map.set(d, result);
    }
    return map;
  }, [horarios, dias]);

  if (loading) {
    return <div className="animate-pulse bg-slate-200 h-96 rounded-lg w-full"></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow border p-4 max-w-full overflow-hidden">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="text-xl font-bold text-slate-800">Horario Académico</h2>
        <button onClick={() => window.print()} className="bg-unt-blue text-white px-4 py-2 rounded shadow hover:bg-blue-700 print:hidden text-sm">
          Imprimir
        </button>
      </div>

      <div className="flex border rounded-lg bg-slate-50 overflow-x-auto min-w-[720px] print:min-w-full print:border-none print:bg-white">
        {/* Eje Y de horas */}
        <div className="w-[60px] flex-shrink-0 bg-slate-100 border-r relative print:bg-white" style={{ height: `${horas.length * PIXELES_POR_HORA}px` }}>
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
              <div className={cn("text-center font-bold py-1 border-b z-20 sticky top-0", DIA_HEADER_CLASS[d] || 'bg-slate-200')}>
                {diaLabels[d] || d}
              </div>
              {horas.map(h => (
                 <div key={h} className="absolute w-full border-b border-slate-200" style={{ top: `${(h - HORA_INICIO_BASE) * PIXELES_POR_HORA}px`, height: `${PIXELES_POR_HORA}px` }} />
              ))}
              
              {list.map((x) => {
                const style = colorForCourseKey(x.curso.codigo);
                const startHour = decimalHour(x.horaInicio);
                const endHour = decimalHour(x.horaFin);
                const top = (startHour - HORA_INICIO_BASE) * PIXELES_POR_HORA;
                const height = Math.max((endHour - startHour) * PIXELES_POR_HORA, 40);
                
                const maxCols = Math.min(x.totalColumnas, 3);
                const isExtra = x.totalColumnas > 3 && x.columna >= 2;
                const colToUse = isExtra ? 2 : x.columna;
                if (x.columna > 2) return null;
                
                const width = `calc(${100 / maxCols}% - 2px)`;
                const left = `calc(${(100 / maxCols) * colToUse}% + 1px)`;

                return (
                  <div
                    key={x.id}
                    className={cn(
                      'absolute rounded border px-1.5 py-1 shadow-sm overflow-hidden text-[10px] leading-tight z-10 print:border-slate-800 print:bg-white',
                      style.bg,
                      style.border
                    )}
                    style={{ top, height, left, width }}
                  >
                    <div className={cn('font-bold truncate print:text-black', style.title)}>
                      {x.curso.codigo} - {x.curso.nombre}
                    </div>
                    <div className="truncate text-[9px] mt-0.5 print:text-black">
                      {x.docente.usuario.nombre} {x.docente.usuario.apellidos}
                    </div>
                    <div className="truncate font-medium mt-0.5 print:text-black">
                      {x.ambiente.codigo} | {x.horaInicio.slice(0,5)}–{x.horaFin.slice(0,5)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
