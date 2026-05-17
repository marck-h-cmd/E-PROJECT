import * as React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface IndicadorKPIProps {
  titulo: string;
  valor: string | number;
  icono: LucideIcon;
  tendencia?: {
    valor: number;
    tipo: 'positivo' | 'negativo' | 'neutral';
  };
  className?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
}

export function IndicadorKPI({
  titulo,
  valor,
  icono: Icono,
  tendencia,
  className,
  color = 'blue',
}: IndicadorKPIProps) {
  const colores = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  const tendenciaColor = {
    positivo: 'text-green-600',
    negativo: 'text-red-600',
    neutral: 'text-gray-600',
  };

  return (
    <div className={cn('rounded-lg border bg-white p-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{titulo}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{valor}</p>
          {tendencia && (
            <div className={cn('mt-2 flex items-center gap-1 text-sm', tendenciaColor[tendencia.tipo])}>
              {tendencia.tipo === 'positivo' ? (
                <TrendingUp className="h-4 w-4" />
              ) : tendencia.tipo === 'negativo' ? (
                <TrendingDown className="h-4 w-4" />
              ) : null}
              <span>{Math.abs(tendencia.valor)}%</span>
            </div>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg', colores[color])}>
          <Icono className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}