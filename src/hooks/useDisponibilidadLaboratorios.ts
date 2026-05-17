import { useState, useCallback } from 'react';
import { apiGet } from '@/lib/api-client';

interface LaboratorioDisponible {
  id: string;
  codigo: string;
  nombre: string;
  capacidad: number;
  disponible: boolean;
}

export function useDisponibilidadLaboratorios() {
  const [laboratorios, setLaboratorios] = useState<LaboratorioDisponible[]>([]);
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
      const res = await apiGet<LaboratorioDisponible[]>('/api/ambientes/disponibles', {
        ...params,
        tipo: 'LABORATORIO',
      });
      setLaboratorios(res.data ?? []);
    } catch {
      setError('Error al buscar laboratorios disponibles');
    } finally {
      setLoading(false);
    }
  }, []);

  return { laboratorios, loading, error, buscar };
}