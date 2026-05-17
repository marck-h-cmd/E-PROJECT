import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface PantallaCargaProps {
  mensaje?: string;
  tamano?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

export function PantallaCarga({
  mensaje = 'Cargando...',
  tamano = 'md',
  fullScreen = false,
  className,
}: PantallaCargaProps) {
  const tamanos = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  const contenido = (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <Loader2 className={cn('animate-spin text-primary-600', tamanos[tamano])} />
      {mensaje && <p className="text-sm text-gray-600">{mensaje}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {contenido}
      </div>
    );
  }

  return contenido;
}