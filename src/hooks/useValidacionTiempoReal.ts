import { useState, useCallback, useEffect } from 'react';

type Validador<T> = (valor: T) => string | undefined;

export function useValidacionTiempoReal<T>(
  valor: T,
  validadores: Validador<T>[],
  delay = 300
) {
  const [error, setError] = useState<string | undefined>(undefined);
  const [validando, setValidando] = useState(false);

  const validar = useCallback(() => {
    for (const v of validadores) {
      const err = v(valor);
      if (err) { setError(err); return false; }
    }
    setError(undefined);
    return true;
  }, [valor, validadores]);

  useEffect(() => {
    setValidando(true);
    const t = setTimeout(() => { validar(); setValidando(false); }, delay);
    return () => clearTimeout(t);
  }, [valor, delay, validar]);

  return { error, validando, esValido: !error, validar };
}