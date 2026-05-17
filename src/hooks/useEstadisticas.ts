import { useState, useCallback } from 'react';
import { apiGet } from '@/lib/api-client';

interface Estadisticas {
  totalDocentes: number;
  totalCursos: number;
  totalAmbientes: number;
  totalHorarios: number;
  horariosPublicados: number;
  conflictos: number;
}

export function useEstadisticas(periodoId?: string) {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<Estadisticas>('/api/estadisticas', { periodoId });
      setEstadisticas(res.data ?? null);
    } catch {
      setError('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  }, [periodoId]);

  return { estadisticas, loading, error, cargar };
}