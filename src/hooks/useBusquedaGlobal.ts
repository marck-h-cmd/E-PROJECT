import { useState, useCallback, useEffect } from 'react';
import { apiGet } from '@/lib/api-client';

interface ResultadoBusqueda {
  id: string;
  tipo: 'docente' | 'curso' | 'ambiente' | 'horario';
  titulo: string;
  subtitulo?: string;
  url: string;
}

export function useBusquedaGlobal() {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([]);
  const [loading, setLoading] = useState(false);

  const buscar = useCallback(async (texto: string) => {
    if (!texto.trim() || texto.length < 2) {
      setResultados([]);
      return;
    }
    setLoading(true);
    try {
      const res = await apiGet<ResultadoBusqueda[]>('/api/busqueda', { q: texto });
      setResultados(res.data ?? []);
    } catch {
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => buscar(query), 300);
    return () => clearTimeout(timeout);
  }, [query, buscar]);

  const limpiar = useCallback(() => {
    setQuery('');
    setResultados([]);
  }, []);

  return { query, setQuery, resultados, loading, limpiar };
}