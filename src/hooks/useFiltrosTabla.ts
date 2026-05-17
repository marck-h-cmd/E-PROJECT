import { useState, useCallback } from 'react';

interface FiltrosTabla<T> {
  filtros: T;
  setFiltro: <K extends keyof T>(key: K, value: T[K]) => void;
  resetFiltros: () => void;
  pagina: number;
  setPagina: (p: number) => void;
  limite: number;
  setLimite: (l: number) => void;
}

export function useFiltrosTabla<T extends Record<string, unknown>>(
  inicial: T,
  limitePorDefecto = 10
): FiltrosTabla<T> {
  const [filtros, setFiltros] = useState<T>(inicial);
  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(limitePorDefecto);

  const setFiltro = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
    setPagina(1);
  }, []);

  const resetFiltros = useCallback(() => {
    setFiltros(inicial);
    setPagina(1);
  }, [inicial]);

  return { filtros, setFiltro, resetFiltros, pagina, setPagina, limite, setLimite };
}