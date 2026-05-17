import { useState, useCallback } from 'react';
import { apiGet } from '@/lib/api-client';

interface AulaDisponible {
  id: string;
  codigo: string;
  nombre: string;
  capacidad: number;
  disponible: boolean;
}

export function useDisponibilidadAulas() {
  const [aulas, setAulas] = useState<AulaDisponible[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buscar = useCallback(async (params: {
    dia: string;
    horaInicio: string;
    horaFin: string;
    periodoId: string;
    capacidadMin?: number;
  }) => {
    setLoading(true);
    try {
      const res = await apiGet<AulaDisponible[]>('/api/ambientes/disponibles', {
        ...params,
        tipo: 'AULA',
      });
      setAulas(res.data ?? []);
    } catch {
      setError('Error al buscar aulas disponibles');
    } finally {
      setLoading(false);
    }
  }, []);

  return { aulas, loading, error, buscar };
}