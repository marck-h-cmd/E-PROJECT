import { useState, useCallback } from 'react';

export function useModal<T = undefined>() {
  const [abierto, setAbierto] = useState(false);
  const [datos, setDatos] = useState<T | undefined>(undefined);

  const abrir = useCallback((data?: T) => {
    setDatos(data);
    setAbierto(true);
  }, []);

  const cerrar = useCallback(() => {
    setAbierto(false);
    setDatos(undefined);
  }, []);

  return { abierto, datos, abrir, cerrar };
}