'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiGet, ApiClientError } from '@/lib/api-client';
import type { PaginationMeta } from '@/lib/tipos';

interface UsePaginatedQueryOptions {
  enabled?: boolean;
  initialPage?: number;
  initialLimit?: number;
}

export function usePaginatedQuery<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
  options: UsePaginatedQueryOptions = {}
) {
  const { enabled = true, initialPage = 1, initialLimit = 20 } = options;
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [data, setData] = useState<T[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<T[]>(path, { ...params, page, limit });
      setData(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      const message =
        err instanceof ApiClientError ? err.message : 'Error al cargar datos';
      setError(message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [path, enabled, page, limit, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    meta,
    loading,
    error,
    page,
    setPage,
    limit,
    refresh: fetchData,
  };
}
