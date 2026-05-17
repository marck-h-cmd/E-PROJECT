import { useState, useCallback } from 'react';
import { apiGet } from '@/lib/api-client';

interface SlotDisponible {
  dia: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
}

export function useDisponibilidad() {
  const [slots, setSlots] = useState<SlotDisponible[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verificar = useCallback(async (params: {
    docenteId?: string;
    ambienteId?: string;
    periodoId: string;
  }) => {
    setLoading(true);
    try {
      const res = await apiGet<SlotDisponible[]>('/api/disponibilidad', params);
      setSlots(res.data ?? []);
    } catch {
      setError('Error al verificar disponibilidad');
    } finally {
      setLoading(false);
    }
  }, []);

  return { slots, loading, error, verificar };
}