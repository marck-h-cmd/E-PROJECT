import { useState, useCallback } from 'react';
import { downloadFile } from '@/lib/api-client';
import type { ReporteParams } from '@/lib/tipos';

export function useReportes() {
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const descargar = useCallback(async (params: ReporteParams, nombre = 'reporte') => {
    setGenerando(true);
    setError(null);
    try {
      const ext = params.formato === 'excel' ? 'xlsx' : 'pdf';
      const queryParams: Record<string, string> = Object.fromEntries(
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      );
      await downloadFile('/api/reportes/generar', queryParams, `${nombre}.${ext}`);
    } catch {
      setError('Error al generar el reporte');
    } finally {
      setGenerando(false);
    }
  }, []);

  return { generando, error, descargar };
}