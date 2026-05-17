'use client';

import * as React from 'react';
import { Calendario } from './Calendario';
import { Boton } from './Boton';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Selector,
  SelectorContent,
  SelectorTrigger,
  SelectorValue,
} from './Selector';

export interface SelectorFechaProps {
  fecha?: Date;
  onSeleccionarFecha?: (fecha: Date) => void;
  placeholder?: string;
  className?: string;
}

export function SelectorFecha({
  fecha,
  onSeleccionarFecha,
  placeholder = 'Seleccionar fecha',
  className,
}: SelectorFechaProps) {
  const [abierto, setAbierto] = React.useState(false);

  return (
    <div className={className}>
      <Boton
        variant="outline"
        className="w-full justify-start text-left font-normal"
        onClick={() => setAbierto(!abierto)}
      >
        <Calendar className="mr-2 h-4 w-4" />
        {fecha ? format(fecha, 'PPP', { locale: es }) : placeholder}
      </Boton>
      {abierto && (
        <div className="absolute z-50 mt-2">
          <Calendario
            fechaSeleccionada={fecha}
            onSeleccionarFecha={(nuevaFecha) => {
              onSeleccionarFecha?.(nuevaFecha);
              setAbierto(false);
            }}
          />
        </div>
      )}
    </div>
  );
}