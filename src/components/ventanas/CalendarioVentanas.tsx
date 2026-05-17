'use client';

import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Calendario } from '@/components/ui/Calendario';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock } from 'lucide-react';

interface VentanaHoraria {
  id: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  estado: 'disponible' | 'ocupada' | 'finalizada';
  docentesAtendidos?: number;
}

interface CalendarioVentanasProps {
  ventanas: VentanaHoraria[];
  onSeleccionarFecha?: (fecha: Date) => void;
  className?: string;
}

export function CalendarioVentanas({
  ventanas,
  onSeleccionarFecha,
  className,
}: CalendarioVentanasProps) {
  const [fechaSeleccionada, setFechaSeleccionada] = React.useState<Date>(new Date());

  const ventanasDia = ventanas.filter(
    (v) => v.fecha.toDateString() === fechaSeleccionada.toDateString()
  );

  const handleSeleccionarFecha = (fecha: Date) => {
    setFechaSeleccionada(fecha);
    onSeleccionarFecha?.(fecha);
  };

  return (
    <div className={className}>
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendario de Ventanas
          </Card.Title>
          <Card.Description>
            Selecciona una fecha para ver las ventanas horarias
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Calendario
            fechaSeleccionada={fechaSeleccionada}
            onSeleccionarFecha={handleSeleccionarFecha}
          />

          {ventanasDia.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-semibold text-sm">
                Ventanas del {fechaSeleccionada.toLocaleDateString('es-PE')}
              </h3>
              {ventanasDia.map((ventana) => (
                <div
                  key={ventana.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      {ventana.horaInicio} - {ventana.horaFin}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {ventana.docentesAtendidos !== undefined && (
                      <span className="text-xs text-gray-500">
                        {ventana.docentesAtendidos} docentes
                      </span>
                    )}
                    <Badge
                      variant={
                        ventana.estado === 'disponible'
                          ? 'success'
                          : ventana.estado === 'ocupada'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {ventana.estado}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}