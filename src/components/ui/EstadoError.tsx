import * as React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utilidades';
import { Boton } from './Boton';

interface EstadoErrorProps {
  titulo?: string;
  mensaje?: string;
  onReintentar?: () => void;
  className?: string;
}

export function EstadoError({
  titulo = 'Error al cargar',
  mensaje = 'Ocurrió un error al cargar la información. Por favor, inténtalo de nuevo.',
  onReintentar,
  className,
}: EstadoErrorProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-12 text-center',
        className
      )}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
        <AlertCircle className="h-10 w-10 text-red-600" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-red-900">{titulo}</h3>
      <p className="mb-4 max-w-sm text-sm text-red-700">{mensaje}</p>
      {onReintentar && (
        <Boton onClick={onReintentar} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reintentar
        </Boton>
      )}
    </div>
  );
}