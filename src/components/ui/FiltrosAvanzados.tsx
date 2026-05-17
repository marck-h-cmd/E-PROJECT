'use client';

import * as React from 'react';
import { Filter, X } from 'lucide-react';
import { Boton } from './Boton';
import { Badge } from './Badge';
import { cn } from '@/lib/utilidades';

export interface Filtro {
  id: string;
  label: string;
  valor: any;
}

interface FiltrosAvanzadosProps {
  filtros: Filtro[];
  onEliminarFiltro?: (filtroId: string) => void;
  onLimpiarFiltros?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function FiltrosAvanzados({
  filtros,
  onEliminarFiltro,
  onLimpiarFiltros,
  children,
  className,
}: FiltrosAvanzadosProps) {
  const [abierto, setAbierto] = React.useState(false);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Botón para abrir filtros */}
      <div className="flex items-center justify-between">
        <Boton
          variant="outline"
          onClick={() => setAbierto(!abierto)}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros
          {filtros.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {filtros.length}
            </Badge>
          )}
        </Boton>

        {filtros.length > 0 && (
          <Boton variant="ghost" onClick={onLimpiarFiltros}>
            Limpiar filtros
          </Boton>
        )}
      </div>

      {/* Filtros activos */}
      {filtros.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filtros.map((filtro) => (
            <Badge
              key={filtro.id}
              variant="secondary"
              className="gap-1 pr-1"
            >
              <span className="text-xs">
                {filtro.label}: {filtro.valor}
              </span>
              <button
                onClick={() => onEliminarFiltro?.(filtro.id)}
                className="ml-1 rounded-full hover:bg-gray-300"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Panel de filtros */}
      {abierto && (
        <div className="rounded-lg border bg-white p-4">
          {children}
        </div>
      )}
    </div>
  );
}