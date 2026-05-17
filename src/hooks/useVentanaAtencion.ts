import { useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut } from '@/lib/api-client';

interface VentanaAtencion {
  id: string;
  estado: 'inactiva' | 'activa' | 'pausada' | 'finalizada';
  docenteActualId?: string;
  iniciadaEn?: string;
}

export function useVentanaAtencion(ventanaId: string) {
  const [ventana, setVentana] = useState<VentanaAtencion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<VentanaAtencion>(`/api/ventanas-atencion/${ventanaId}`);
      setVentana(res.data ?? null);
    } catch {
      setError('Error al cargar la ventana');
    } finally {
      setLoading(false);
    }
  }, [ventanaId]);

  const cambiarEstado = useCallback(async (estado: VentanaAtencion['estado']) => {
    try {
      await apiPut(`/api/ventanas-atencion/${ventanaId}/estado`, { estado });
      setVentana(prev => prev ? { ...prev, estado } : null);
    } catch {
      setError('Error al cambiar estado');
    }
  }, [ventanaId]);

  const llamarSiguiente = useCallback(async () => {
    try {
      const res = await apiPost<{ docenteId: string }>(`/api/ventanas-atencion/${ventanaId}/llamar-siguiente`);
      return res.data;
    } catch {
      setError('Error al llamar al siguiente docente');
    }
  }, [ventanaId]);

  return { ventana, loading, error, cargar, cambiarEstado, llamarSiguiente };
}