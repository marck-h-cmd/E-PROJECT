'use client';

import * as React from 'react';
import {
  Selector,
  SelectorContent,
  SelectorItem,
  SelectorTrigger,
  SelectorValue,
} from './Selector';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface Docente {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  categoria: string;
}

interface ComboDocenteProps {
  valor?: string;
  onCambiar?: (valor: string) => void;
  docentes?: Docente[];
  placeholder?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ComboDocente({
  valor,
  onCambiar,
  docentes = [],
  placeholder = 'Seleccionar docente',
  error,
  label,
  disabled = false,
  className,
}: ComboDocenteProps) {
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
            <Users className="h-4 w-4" />
            <SelectorValue placeholder={placeholder} />
          </div>
        </SelectorTrigger>
        <SelectorContent>
          {docentes.map((docente) => (
            <SelectorItem key={docente.id} value={docente.id}>
              <div className="flex flex-col">
                <span className="font-medium">
                  {docente.apellidos}, {docente.nombres}
                </span>
                <span className="text-xs text-gray-500">
                  {docente.categoria} • {docente.email}
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