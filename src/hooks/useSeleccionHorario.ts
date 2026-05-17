import { useState, useCallback } from 'react';
import type { DiaSemana } from '@prisma/client';

interface SlotHorario {
  dia: DiaSemana;
  horaInicio: string;
  horaFin: string;
}

export function useSeleccionHorario() {
  const [seleccion, setSeleccion] = useState<SlotHorario | null>(null);
  const [docenteId, setDocenteId] = useState<string | null>(null);
  const [ambienteId, setAmbienteId] = useState<string | null>(null);

  const seleccionarSlot = useCallback((slot: SlotHorario) => setSeleccion(slot), []);
  const limpiar = useCallback(() => {
    setSeleccion(null);
    setDocenteId(null);
    setAmbienteId(null);
  }, []);

  const esValida = !!(seleccion && docenteId && ambienteId);

  return { seleccion, docenteId, ambienteId, esValida, seleccionarSlot, setDocenteId, setAmbienteId, limpiar };
}