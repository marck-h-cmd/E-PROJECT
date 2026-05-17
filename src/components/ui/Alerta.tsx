'use client';

import * as React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface AlertaProps {
  tipo?: 'info' | 'success' | 'warning' | 'error';
  titulo?: string;
  mensaje: string;
  onCerrar?: () => void;
  className?: string;
}

export function Alerta({
  tipo = 'info',
  titulo,
  mensaje,
  onCerrar,
  className,
}: AlertaProps) {
  const iconos = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
  };

  const estilos = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  };

  const iconoColores = {
    info: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  };

  const Icono = iconos[tipo];

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4',
        estilos[tipo],
        className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <Icono className={cn('h-5 w-5 shrink-0', iconoColores[tipo])} />
        <div className="flex-1">
          {titulo && <h3 className="mb-1 font-semibold">{titulo}</h3>}
          <p className="text-sm">{mensaje}</p>
        </div>
        {onCerrar && (
          <button
            onClick={onCerrar}
            className="shrink-0 rounded-lg p-1 hover:bg-black/5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}