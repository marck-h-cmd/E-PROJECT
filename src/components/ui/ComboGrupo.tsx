'use client';

import * as React from 'react';
import {
  Selector,
  SelectorContent,
  SelectorItem,
  SelectorTrigger,
  SelectorValue,
} from './Selector';
import { Users2 } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface Grupo {
  id: string;
  numero: number;
  codigo: string;
  capacidad: number;
  tipo: string;
}

interface ComboGrupoProps {
  valor?: string;
  onCambiar?: (valor: string) => void;
  grupos?: Grupo[];
  placeholder?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ComboGrupo({
  valor,
  onCambiar,
  grupos = [],
  placeholder = 'Seleccionar grupo',
  error,
  label,
  disabled = false,
  className,
}: ComboGrupoProps) {
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
            <Users2 className="h-4 w-4" />
            <SelectorValue placeholder={placeholder} />
          </div>
        </SelectorTrigger>
        <SelectorContent>
          {grupos.map((grupo) => (
            <SelectorItem key={grupo.id} value={grupo.id}>
              <div className="flex flex-col">
                <span className="font-medium">Grupo {grupo.numero} - {grupo.codigo}</span>
                <span className="text-xs text-gray-500">
                  {grupo.tipo} • Capacidad: {grupo.capacidad}
                </span>
              </div>
            </SelectorItem>
          ))}
        </SelectorContent>
      </Selector>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}