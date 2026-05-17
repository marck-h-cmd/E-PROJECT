import { useState, useCallback } from 'react';

export function useFormulario<T extends Record<string, unknown>>(valorInicial: T) {
  const [valores, setValores] = useState<T>(valorInicial);
  const [errores, setErrores] = useState<Partial<Record<keyof T, string>>>({});
  const [enviando, setEnviando] = useState(false);

  const setValor = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValores(prev => ({ ...prev, [key]: value }));
    setErrores(prev => ({ ...prev, [key]: undefined }));
  }, []);

  const setError = useCallback(<K extends keyof T>(key: K, mensaje: string) => {
    setErrores(prev => ({ ...prev, [key]: mensaje }));
  }, []);

  const reset = useCallback(() => {
    setValores(valorInicial);
    setErrores({});
    setEnviando(false);
  }, [valorInicial]);

  const handleSubmit = useCallback((fn: (valores: T) => Promise<void>) => async (e?: React.FormEvent) => {
    e?.preventDefault();
    setEnviando(true);
    try {
      await fn(valores);
    } finally {
      setEnviando(false);
    }
  }, [valores]);

  return { valores, errores, enviando, setValor, setError, reset, handleSubmit };
}