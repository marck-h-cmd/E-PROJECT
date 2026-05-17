import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utilidades';
import { Card, CardContent } from './Card';

interface TarjetaEstadisticaProps {
  titulo: string;
  valor: string | number;
  descripcion?: string;
  icono?: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  className?: string;
}

export function TarjetaEstadistica({
  titulo,
  valor,
  descripcion,
  icono: Icono,
  color = 'blue',
  className,
}: TarjetaEstadisticaProps) {
  const colores = {
    blue: {
      fondo: 'bg-blue-50',
      texto: 'text-blue-600',
      borde: 'border-blue-200',
    },
    green: {
      fondo: 'bg-green-50',
      texto: 'text-green-600',
      borde: 'border-green-200',
    },
    yellow: {
      fondo: 'bg-yellow-50',
      texto: 'text-yellow-600',
      borde: 'border-yellow-200',
    },
    red: {
      fondo: 'bg-red-50',
      texto: 'text-red-600',
      borde: 'border-red-200',
    },
    purple: {
      fondo: 'bg-purple-50',
      texto: 'text-purple-600',
      borde: 'border-purple-200',
    },
  };

  return (
    <Card className={cn(colores[color].borde, className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{titulo}</p>
            <p className={cn('mt-2 text-2xl font-bold', colores[color].texto)}>
              {valor}
            </p>
            {descripcion && (
              <p className="mt-1 text-xs text-gray-500">{descripcion}</p>
            )}
          </div>
          {Icono && (
            <div className={cn('rounded-full p-3', colores[color].fondo)}>
              <Icono className={cn('h-6 w-6', colores[color].texto)} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}