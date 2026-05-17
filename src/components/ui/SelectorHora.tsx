'use client';

import * as React from 'react';
import {
  Selector,
  SelectorContent,
  SelectorItem,
  SelectorTrigger,
  SelectorValue,
} from './Selector';
import { Clock } from 'lucide-react';

export interface SelectorHoraProps {
  valor?: string;
  onCambio?: (hora: string) => void;
  intervalo?: number;
  className?: string;
}

export function SelectorHora({
  valor,
  onCambio,
  intervalo = 30,
  className,
}: SelectorHoraProps) {
  const generarHoras = () => {
    const horas: string[] = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += intervalo) {
        const hora = `${h.toString().padStart(2, '0')}:${m
          .toString()
          .padStart(2, '0')}`;
        horas.push(hora);
      }
    }
    return horas;
  };

  const horas = generarHoras();

  return (
    <Selector value={valor} onValueChange={onCambio}>
      <SelectorTrigger className={className}>
        <Clock className="mr-2 h-4 w-4" />
        <SelectorValue placeholder="Seleccionar hora" />
      </SelectorTrigger>
      <SelectorContent>
        {horas.map((hora) => (
          <SelectorItem key={hora} value={hora}>
            {hora}
          </SelectorItem>
        ))}
      </SelectorContent>
    </Selector>
  );
}