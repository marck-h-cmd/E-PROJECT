import { useState, useCallback } from 'react';

interface Alerta {
  id: string;
  tipo: 'success' | 'error' | 'warning' | 'info';
  titulo?: string;
  mensaje: string;
}

export function useAlerta() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  const agregar = useCallback((alerta: Omit<Alerta, 'id'>) => {
    const id = crypto.randomUUID();
    setAlertas(prev => [...prev, { ...alerta, id }]);
    setTimeout(() => eliminar(id), 5000);
    return id;
  }, []);

  const eliminar = useCallback((id: string) => {
    setAlertas(prev => prev.filter(a => a.id !== id));
  }, []);

  const exito = useCallback((mensaje: string, titulo?: string) =>
    agregar({ tipo: 'success', mensaje, titulo }), [agregar]);

  const error = useCallback((mensaje: string, titulo?: string) =>
    agregar({ tipo: 'error', mensaje, titulo }), [agregar]);

  const advertencia = useCallback((mensaje: string, titulo?: string) =>
    agregar({ tipo: 'warning', mensaje, titulo }), [agregar]);

  const info = useCallback((mensaje: string, titulo?: string) =>
    agregar({ tipo: 'info', mensaje, titulo }), [agregar]);

  return { alertas, agregar, eliminar, exito, error, advertencia, info };
}