import { useState, useCallback } from 'react';

export interface FiltrosHorario {
  periodoId: string;
  ciclo?: string;
  cursoId?: string;
  docenteId?: string;
  ambienteId?: string;
  diaSemana?: string;
}

export function useFiltrosHorario(initialPeriodoId: string = '') {
  const [filtros, setFiltros] = useState<FiltrosHorario>({
    periodoId: initialPeriodoId,
  });

  const actualizarFiltro = useCallback((key: keyof FiltrosHorario, value: string) => {
    setFiltros(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value
    }));
  }, []);

  const limpiarFiltros = useCallback(() => {
    setFiltros(prev => ({
      periodoId: prev.periodoId, // mantenemos el periodo actual
    }));
  }, []);

  return { filtros, setFiltros, actualizarFiltro, limpiarFiltros };
}
