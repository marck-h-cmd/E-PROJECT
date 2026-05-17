import { useState, useCallback } from 'react';

export function usePaginacion(totalInicial = 0, limitePorDefecto = 10) {
  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(limitePorDefecto);
  const [total, setTotal] = useState(totalInicial);

  const totalPaginas = Math.ceil(total / limite);
  const hayAnterior = pagina > 1;
  const haySiguiente = pagina < totalPaginas;

  const anterior = useCallback(() => setPagina(p => Math.max(1, p - 1)), []);
  const siguiente = useCallback(() => setPagina(p => Math.min(totalPaginas, p + 1)), [totalPaginas]);
  const irA = useCallback((p: number) => setPagina(Math.max(1, Math.min(totalPaginas, p))), [totalPaginas]);
  const reset = useCallback(() => setPagina(1), []);

  return { pagina, limite, total, totalPaginas, hayAnterior, haySiguiente, setPagina, setLimite, setTotal, anterior, siguiente, irA, reset };
}