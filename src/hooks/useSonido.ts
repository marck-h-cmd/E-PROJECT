import { useCallback, useRef } from 'react';

type TipoSonido = 'llamada' | 'exito' | 'error' | 'notificacion';

const FRECUENCIAS: Record<TipoSonido, number[]> = {
  llamada: [440, 550, 660],
  exito: [523, 659, 784],
  error: [300, 200],
  notificacion: [880],
};

export function useSonido() {
  const contextoRef = useRef<AudioContext | null>(null);

  const reproducir = useCallback((tipo: TipoSonido) => {
    try {
      if (!contextoRef.current) {
        contextoRef.current = new AudioContext();
      }
      const ctx = contextoRef.current;
      const frecuencias = FRECUENCIAS[tipo];
      frecuencias.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.3);
        osc.start(ctx.currentTime + i * 0.15);
        osc.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
    } catch {
      // Silenciar errores de audio
    }
  }, []);

  return { reproducir };
}