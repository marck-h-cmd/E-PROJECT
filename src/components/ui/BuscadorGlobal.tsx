'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface BuscadorGlobalProps {
  placeholder?: string;
  onBuscar?: (termino: string) => void;
  className?: string;
}

export function BuscadorGlobal({
  placeholder = 'Buscar...',
  onBuscar,
  className,
}: BuscadorGlobalProps) {
  const [termino, setTermino] = React.useState('');
  const [enfocado, setEnfocado] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevoTermino = e.target.value;
    setTermino(nuevoTermino);
    onBuscar?.(nuevoTermino);
  };

  const limpiar = () => {
    setTermino('');
    onBuscar?.('');
  };

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <div
        className={cn(
          'relative flex items-center rounded-lg border bg-white transition-all',
          enfocado ? 'border-primary-500 ring-2 ring-primary-100' : 'border-gray-300'
        )}
      >
        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={termino}
          onChange={handleChange}
          onFocus={() => setEnfocado(true)}
          onBlur={() => setEnfocado(false)}
          placeholder={placeholder}
          className="w-full py-2 pl-10 pr-10 text-sm outline-none"
        />
        {termino && (
          <button
            onClick={limpiar}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}