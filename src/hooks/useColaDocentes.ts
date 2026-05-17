import { useState, useCallback } from 'react';
import { apiGet, apiPost } from '@/lib/api-client';

interface DocenteCola {
  id: string;
  nombre: string;
  email: string;
  categoria: string;
  horaLlegada: string;
  posicion: number;
  prioridad?: 'normal' | 'alta' | 'urgente';
}

export function useColaDocentes(ventanaId: string) {
  const [cola, setCola] = useState<DocenteCola[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarCola = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<DocenteCola[]>(`/api/ventanas-atencion/${ventanaId}/cola`);
      setCola(res.data ?? []);
    } catch {
      setError('Error al cargar la cola');
    } finally {
      setLoading(false);
    }
  }, [ventanaId]);

  const agregarDocente = useCallback(async (docenteId: string) => {
    try {
      await apiPost(`/api/ventanas-atencion/${ventanaId}/cola`, { docenteId });
      await cargarCola();
    } catch {
      setError('Error al agregar docente a la cola');
    }
  }, [ventanaId, cargarCola]);

  const siguienteDocente = cola[0] ?? null;

  return { cola, siguienteDocente, loading, error, cargarCola, agregarDocente };
}