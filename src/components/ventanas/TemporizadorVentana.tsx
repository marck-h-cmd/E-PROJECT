'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utilidades';

interface TemporizadorVentanaProps {
  tiempoTranscurrido: number; // en segundos
  estado: 'inactiva' | 'activa' | 'pausada' | 'finalizada';
  className?: string;
}

export function TemporizadorVentana({
  tiempoTranscurrido,
  estado,
  className,
}: TemporizadorVentanaProps) {
  const [tiempo, setTiempo] = React.useState(tiempoTranscurrido);

  React.useEffect(() => {
    setTiempo(tiempoTranscurrido);
  }, [tiempoTranscurrido]);

  React.useEffect(() => {
    if (estado !== 'activa') return;

    const intervalo = setInterval(() => {
      setTiempo((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [estado]);

  const formatearTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;

    return `${horas.toString().padStart(2, '0')}:${minutos
      .toString()
      .padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 rounded-lg border-2',
        estado === 'activa' && 'border-green-500 bg-green-50',
        estado === 'pausada' && 'border-yellow-500 bg-yellow-50',
        estado === 'inactiva' && 'border-gray-300 bg-gray-50',
        estado === 'finalizada' && 'border-gray-400 bg-gray-100',
        className
      )}
    >
      <Clock
        className={cn(
          'h-8 w-8 mb-2',
          estado === 'activa' && 'text-green-600',
          estado === 'pausada' && 'text-yellow-600',
          estado === 'inactiva' && 'text-gray-400',
          estado === 'finalizada' && 'text-gray-500'
        )}
      />
      <div className="text-4xl font-mono font-bold">
        {formatearTiempo(tiempo)}
      </div>
      <p className="text-sm text-gray-600 mt-2">Tiempo transcurrido</p>
    </div>
  );
}