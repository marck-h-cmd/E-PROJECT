import { useState, useEffect, useCallback, useRef } from 'react';

export function useTemporizador(autoIniciar = false) {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(autoIniciar);
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activo) {
      intervaloRef.current = setInterval(() => setSegundos(s => s + 1), 1000);
    } else {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    }
    return () => { if (intervaloRef.current) clearInterval(intervaloRef.current); };
  }, [activo]);

  const iniciar = useCallback(() => setActivo(true), []);
  const pausar = useCallback(() => setActivo(false), []);
  const reset = useCallback(() => { setActivo(false); setSegundos(0); }, []);

  const formatear = useCallback(() => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }, [segundos]);

  return { segundos, activo, iniciar, pausar, reset, formatear };
}