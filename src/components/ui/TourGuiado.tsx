'use client';

import * as React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Boton } from './Boton';
import { cn } from '@/lib/utilidades';

export interface PasoTour {
  elemento: string;
  titulo: string;
  descripcion: string;
}

interface TourGuiadoProps {
  pasos: PasoTour[];
  onCompletar?: () => void;
  onCerrar?: () => void;
  mostrar?: boolean;
}

export function TourGuiado({
  pasos,
  onCompletar,
  onCerrar,
  mostrar = true,
}: TourGuiadoProps) {
  const [pasoActual, setPasoActual] = React.useState(0);
  const [posicion, setPosicion] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (!mostrar || pasos.length === 0) return;

    const elemento = document.querySelector(pasos[pasoActual].elemento);
    if (elemento) {
      const rect = elemento.getBoundingClientRect();
      setPosicion({
        top: rect.bottom + window.scrollY + 10,
        left: rect.left + window.scrollX,
      });
      elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [pasoActual, pasos, mostrar]);

  if (!mostrar || pasos.length === 0) return null;

  const siguiente = () => {
    if (pasoActual < pasos.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      onCompletar?.();
    }
  };

  const anterior = () => {
    if (pasoActual > 0) {
      setPasoActual(pasoActual - 1);
    }
  };

  const pasoInfo = pasos[pasoActual];

  return (
    <>
      {/* Overlay oscuro */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onCerrar} />

      {/* Tooltip del tour */}
      <div
        className="fixed z-50 w-80 rounded-lg border bg-white p-4 shadow-xl"
        style={{
          top: `${posicion.top}px`,
          left: `${posicion.left}px`,
        }}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{pasoInfo.titulo}</h3>
            <p className="mt-1 text-sm text-gray-600">{pasoInfo.descripcion}</p>
          </div>
          <button
            onClick={onCerrar}
            className="rounded-lg p-1 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Paso {pasoActual + 1} de {pasos.length}
          </div>
          <div className="flex gap-2">
            <Boton
              variant="outline"
              size="sm"
              onClick={anterior}
              disabled={pasoActual === 0}
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Boton>
            <Boton size="sm" onClick={siguiente}>
              {pasoActual === pasos.length - 1 ? 'Finalizar' : 'Siguiente'}
              {pasoActual !== pasos.length - 1 && (
                <ChevronRight className="ml-1 h-4 w-4" />
              )}
            </Boton>
          </div>
        </div>
      </div>
    </>
  );
}