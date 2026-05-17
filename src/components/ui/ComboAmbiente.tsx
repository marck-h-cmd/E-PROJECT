'use client';

import * as React from 'react';
import {
  Selector,
  SelectorContent,
  SelectorItem,
  SelectorTrigger,
  SelectorValue,
} from './Selector';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface Ambiente {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  capacidad: number;
}

interface ComboAmbienteProps {
  valor?: string;
  onCambiar?: (valor: string) => void;
  ambientes?: Ambiente[];
  placeholder?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ComboAmbiente({
  valor,
  onCambiar,
  ambientes = [],
  placeholder = 'Seleccionar ambiente',
  error,
  label,
  disabled = false,
  className,
}: ComboAmbienteProps) {
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
            <Building2 className="h-4 w-4" />
            <SelectorValue placeholder={placeholder} />
          </div>
        </SelectorTrigger>
        <SelectorContent>
          {ambientes.map((ambiente) => (
            <SelectorItem key={ambiente.id} value={ambiente.id}>
              <div className="flex flex-col">
                <span className="font-medium">{ambiente.codigo} - {ambiente.nombre}</span>
                <span className="text-xs text-gray-500">
                  {ambiente.tipo} • Cap: {ambiente.capacidad}
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