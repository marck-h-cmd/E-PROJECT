'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiGet } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';

export interface Periodo {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  activo: boolean;
}

interface PeriodoContextValue {
  periodos: Periodo[];
  periodoActivo: Periodo | null;
  periodoSeleccionado: Periodo | null;
  setPeriodoSeleccionado: (p: Periodo | null) => void;
  loading: boolean;
  refresh: () => Promise<void>;
}

const PeriodoContext = createContext<PeriodoContextValue | undefined>(undefined);

export function PeriodoProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [periodoActivo, setPeriodoActivo] = useState<Periodo | null>(null);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<Periodo | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (typeof window !== 'undefined' && !localStorage.getItem('accessToken')) {
      setPeriodos([]);
      setPeriodoActivo(null);
      setPeriodoSeleccionado(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [listaRes, activoRes] = await Promise.all([
        apiGet<Periodo[]>('/api/periodos', { limit: 50 }),
        apiGet<Periodo>('/api/periodos/activo').catch(() => null),
      ]);

      const lista = listaRes.data || [];
      setPeriodos(lista);

      const activo = activoRes?.data || lista.find((p) => p.activo) || lista[0] || null;
      setPeriodoActivo(activo);

      setPeriodoSeleccionado((prev) => {
        if (prev && lista.some((p) => p.id === prev.id)) return prev;
        return activo;
      });
    } catch {
      setPeriodos([]);
      setPeriodoActivo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      refresh();
    } else {
      setPeriodos([]);
      setPeriodoActivo(null);
      setPeriodoSeleccionado(null);
      setLoading(false);
    }
  }, [isAuthenticated, authLoading, refresh]);

  const value = useMemo(
    () => ({
      periodos,
      periodoActivo,
      periodoSeleccionado,
      setPeriodoSeleccionado,
      loading,
      refresh,
    }),
    [periodos, periodoActivo, periodoSeleccionado, loading, refresh]
  );

  return <PeriodoContext.Provider value={value}>{children}</PeriodoContext.Provider>;
}

export function usePeriodo() {
  const ctx = useContext(PeriodoContext);
  if (!ctx) throw new Error('usePeriodo debe usarse dentro de PeriodoProvider');
  return ctx;
}
