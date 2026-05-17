import { useState, useCallback } from 'react';
import { apiGet, apiPost } from '@/lib/api-client';

interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  creadoEn: string;
}

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);
  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<Notificacion[]>('/api/notificaciones');
      setNotificaciones(res.data ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  const marcarLeida = useCallback(async (id: string) => {
    await apiPost(`/api/notificaciones/${id}/leer`);
    setNotificaciones(prev =>
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  }, []);

  const marcarTodasLeidas = useCallback(async () => {
    await apiPost('/api/notificaciones/leer-todas');
    setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
  }, []);

  return { notificaciones, noLeidas, loading, cargar, marcarLeida, marcarTodasLeidas };
}