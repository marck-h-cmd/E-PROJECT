import * as React from 'react';
import { cn } from '@/lib/utilidades';

interface IndicadorCargaProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function IndicadorCarga({ size = 'md', className }: IndicadorCargaProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-primary-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        sizeClasses[size],
        className
      )}
      role="status"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
}