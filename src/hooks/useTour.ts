import { useState, useCallback } from 'react';

interface PasoTour {
  id: string;
  titulo: string;
  descripcion: string;
  selector?: string;
}

export function useTour(pasos: PasoTour[]) {
  const [activo, setActivo] = useState(false);
  const [pasoActual, setPasoActual] = useState(0);

  const iniciar = useCallback(() => { setActivo(true); setPasoActual(0); }, []);
  const finalizar = useCallback(() => { setActivo(false); setPasoActual(0); }, []);
  const siguiente = useCallback(() => {
    if (pasoActual < pasos.length - 1) setPasoActual(p => p + 1);
    else finalizar();
  }, [pasoActual, pasos.length, finalizar]);
  const anterior = useCallback(() => setPasoActual(p => Math.max(0, p - 1)), []);

  return {
    activo,
    pasoActual: pasos[pasoActual],
    indicePaso: pasoActual,
    totalPasos: pasos.length,
    iniciar,
    finalizar,
    siguiente,
    anterior,
  };
}