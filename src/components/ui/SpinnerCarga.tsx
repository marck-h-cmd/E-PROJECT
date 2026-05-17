import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface SpinnerCargaProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  mensaje?: string;
}

export function SpinnerCarga({ size = 'md', className, mensaje }: SpinnerCargaProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={cn('animate-spin text-primary-600', sizeClasses[size], className)} />
      {mensaje && <p className="text-sm text-gray-600">{mensaje}</p>}
    </div>
  );
}