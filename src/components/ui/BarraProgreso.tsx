'use client';

import * as React from 'react';
import { cn } from '@/lib/utilidades';

interface BarraProgresoProps {
  value: number;
  max?: number;
  className?: string;
  indicadorClassName?: string;
  mostrarPorcentaje?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function BarraProgreso({
  value,
  max = 100,
  className,
  indicadorClassName,
  mostrarPorcentaje = false,
  size = 'md',
  variant = 'default',
}: BarraProgresoProps) {
  const porcentaje = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    default: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-gray-200',
          sizeClasses[size],
          className
        )}
      >
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            variantClasses[variant],
            indicadorClassName
          )}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      {mostrarPorcentaje && (
        <p className="mt-1 text-xs text-gray-600 text-right">
          {porcentaje.toFixed(0)}%
        </p>
      )}
    </div>
  );
}