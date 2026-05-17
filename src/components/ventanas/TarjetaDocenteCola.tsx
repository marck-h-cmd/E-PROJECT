'use client';

import * as React from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface Docente {
  id: string;
  nombre: string;
  email: string;
  categoria: string;
  horaLlegada: string;
  prioridad?: 'normal' | 'alta' | 'urgente';
}

interface TarjetaDocenteColaProps {
  docente: Docente;
  posicion: number;
  onClick?: () => void;
  className?: string;
}

export function TarjetaDocenteCola({
  docente,
  posicion,
  onClick,
  className,
}: TarjetaDocenteColaProps) {
  const iniciales = docente.nombre
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors',
        docente.prioridad === 'urgente' && 'border-red-300 bg-red-50',
        docente.prioridad === 'alta' && 'border-yellow-300 bg-yellow-50',
        className
      )}
    >
      <div className="flex-shrink-0">
        <div className="relative">
          <Avatar fallback={iniciales} />
          <div className="absolute -top-1 -right-1 bg-primary-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {posicion}
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm truncate">{docente.nombre}</p>
          {docente.prioridad && docente.prioridad !== 'normal' && (
            <AlertCircle
              className={cn(
                'h-4 w-4',
                docente.prioridad === 'urgente' && 'text-red-600',
                docente.prioridad === 'alta' && 'text-yellow-600'
              )}
            />
          )}
        </div>
        <p className="text-xs text-gray-600 truncate">{docente.email}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {docente.categoria}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            {docente.horaLlegada}
          </div>
        </div>
      </div>
    </div>
  );
}