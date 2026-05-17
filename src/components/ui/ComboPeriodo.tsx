'use client';

import * as React from 'react';
import {
  Selector,
  SelectorContent,
  SelectorItem,
  SelectorTrigger,
  SelectorValue,
} from './Selector';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface Periodo {
  id: string;
  nombre: string;
  anio: number;
  semestre: number;
  fechaInicio: string;
  fechaFin: string;
  activo: boolean;
}

interface ComboPeriodoProps {
  valor?: string;
  onCambiar?: (valor: string) => void;
  periodos?: Periodo[];
  placeholder?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ComboPeriodo({
  valor,
  onCambiar,
  periodos = [],
  placeholder = 'Seleccionar periodo',
  error,
  label,
  disabled = false,
  className,
}: ComboPeriodoProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Selector value={valor} onValueChange={onCambiar} disabled={disabled}>
        <SelectorTrigger className={error ? 'border-red-500' : ''}>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <SelectorValue placeholder={placeholder} />
          </div>
        </SelectorTrigger>
        <SelectorContent>
          {periodos.map((periodo) => (
            <SelectorItem key={periodo.id} value={periodo.id}>
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex flex-col">
                  <span className="font-medium">{periodo.nombre}</span>
                  <span className="text-xs text-gray-500">
                    {periodo.anio} - Semestre {periodo.semestre}
                  </span>
                </div>
                {periodo.activo && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                    Activo
                  </span>
                )}
              </div>
            </SelectorItem>
          ))}
        </SelectorContent>
      </Selector>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}