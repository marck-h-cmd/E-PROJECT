'use client';

import * as React from 'react';
import {
  Selector,
  SelectorContent,
  SelectorItem,
  SelectorTrigger,
  SelectorValue,
} from './Selector';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface Curso {
  id: string;
  codigo: string;
  nombre: string;
  creditos: number;
  ciclo?: number;
}

interface ComboCursoProps {
  valor?: string;
  onCambiar?: (valor: string) => void;
  cursos?: Curso[];
  placeholder?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ComboCurso({
  valor,
  onCambiar,
  cursos = [],
  placeholder = 'Seleccionar curso',
  error,
  label,
  disabled = false,
  className,
}: ComboCursoProps) {
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
            <BookOpen className="h-4 w-4" />
            <SelectorValue placeholder={placeholder} />
          </div>
        </SelectorTrigger>
        <SelectorContent>
          {cursos.map((curso) => (
            <SelectorItem key={curso.id} value={curso.id}>
              <div className="flex flex-col">
                <span className="font-medium">{curso.codigo} - {curso.nombre}</span>
                <span className="text-xs text-gray-500">
                  {curso.creditos} créditos
                  {curso.ciclo && ` • Ciclo ${curso.ciclo}`}
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