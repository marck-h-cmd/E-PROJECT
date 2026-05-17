import * as React from 'react';
import { FileX, Inbox } from 'lucide-react';
import { Boton } from './Boton';
import { cn } from '@/lib/utilidades';

interface EstadoVacioProps {
  icono?: React.ReactNode;
  titulo: string;
  descripcion?: string;
  accion?: {
    texto: string;
    onClick: () => void;
  };
  className?: string;
}

export function EstadoVacio({
  icono,
  titulo,
  descripcion,
  accion,
  className,
}: EstadoVacioProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed bg-gray-50 p-8 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-gray-100 p-3">
        {icono || <Inbox className="h-10 w-10 text-gray-400" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{titulo}</h3>
      {descripcion && (
        <p className="mb-4 max-w-sm text-sm text-gray-500">{descripcion}</p>
      )}
      {accion && (
        <Boton onClick={accion.onClick}>{accion.texto}</Boton>
      )}
    </div>
  );
}