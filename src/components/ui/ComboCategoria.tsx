'use client';

import * as React from 'react';
import {
  Selector,
  SelectorContent,
  SelectorItem,
  SelectorTrigger,
  SelectorValue,
} from './Selector';
import { Tag } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface Categoria {
  id: string;
  nombre: string;
  codigo: string;
  descripcion?: string;
}

interface ComboCategoriaProps {
  valor?: string;
  onCambiar?: (valor: string) => void;
  categorias?: Categoria[];
  placeholder?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ComboCategoria({
  valor,
  onCambiar,
  categorias = [],
  placeholder = 'Seleccionar categoría',
  error,
  label,
  disabled = false,
  className,
}: ComboCategoriaProps) {
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
            <Tag className="h-4 w-4" />
            <SelectorValue placeholder={placeholder} />
          </div>
        </SelectorTrigger>
        <SelectorContent>
          {categorias.map((categoria) => (
            <SelectorItem key={categoria.id} value={categoria.id}>
              <div className="flex flex-col">
                <span className="font-medium">{categoria.nombre}</span>
                {categoria.descripcion && (
                  <span className="text-xs text-gray-500">
                    {categoria.descripcion}
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