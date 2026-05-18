'use client';

import { useEffect, useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ErrorAlert } from '@/components/feedback/ErrorAlert';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiGet, ApiClientError, downloadFile } from '@/lib/api-client';
import { useRequireAuth } from '@/contexts/AuthContext';
import { usePeriodo } from '@/contexts/PeriodoContext';
import { Rol } from '@prisma/client';
import { toast } from 'sonner';

interface Opt {
  id: string;
  codigo?: string;
  nombre: string;
  usuario?: { nombre: string; apellidos: string };
}

export default function ReportesPage() {
  const { loading: authLoading } = useRequireAuth([Rol.SUPER_ADMIN, Rol.ADMINISTRADOR]);
  const { periodoSeleccionado, loading: periodoLoading } = usePeriodo();
  const periodoId = periodoSeleccionado?.id ?? '';

  const [docentes, setDocentes] = useState<Opt[]>([]);
  const [ambientes, setAmbientes] = useState<Opt[]>([]);
  const [selDocente, setSelDocente] = useState('');
  const [selAmbiente, setSelAmbiente] = useState('');
  const [loadingOpts, setLoadingOpts] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingOpts(true);
      setErr(null);
      try {
        const [d, a] = await Promise.all([
          apiGet<Opt[]>('/api/docentes', { limit: 200, page: 1 }),
          apiGet<Opt[]>('/api/ambientes', { limit: 200, page: 1 }),
        ]);
        const dList = d.data ?? [];
        const aList = a.data ?? [];
        setDocentes(dList);
        setAmbientes(aList);
        setSelDocente(dList[0]?.id ?? '');
        setSelAmbiente(aList[0]?.id ?? '');
      } catch (e) {
        setErr(e instanceof ApiClientError ? e.message : 'Error al cargar selectores');
      } finally {
        setLoadingOpts(false);
      }
    })();
  }, []);

  const runDownload = async (key: string, fn: () => Promise<void>) => {
    if (!periodoId) {
      toast.error('Seleccione un período');
      return;
    }
    setDownloading(key);
    try {
      await fn();
      toast.success('Descarga iniciada');
    } catch (e) {
      toast.error(e instanceof ApiClientError ? e.message : 'Error en la descarga');
    } finally {
      setDownloading(null);
    }
  };

  if (authLoading || periodoLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-unt-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes PDF"
        description="Generación de informes por docente, aula, laboratorios, gestión y conflictos."
      />

      {!periodoId && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Seleccione un período académico activo para habilitar las descargas.
        </div>
      )}

      {err && <ErrorAlert message={err} />}

      {loadingOpts ? (
        <Loader2 className="h-6 w-6 animate-spin text-unt-blue" />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-unt-blue">Reporte por docente</h3>
            </div>
            <div className="card-body space-y-3">
              <div>
                <Label>Docente</Label>
                <select
                  className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                  value={selDocente}
                  onChange={(e) => setSelDocente(e.target.value)}
                >
                  {docentes.map((d) => (
                    <option key={d.id} value={d.id}>
                      {(d.codigo ? d.codigo + ' — ' : '') +
                        (d.usuario
                          ? `${d.usuario.apellidos}, ${d.usuario.nombre}`
                          : d.nombre)}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                className="w-full bg-unt-blue hover:bg-unt-blue/90 text-white"
                disabled={!selDocente || !!downloading}
                onClick={() =>
                  runDownload('doc', () =>
                    downloadFile(
                      '/api/reportes/docente',
                      { docenteId: selDocente, periodoId },
                      `reporte-docente-${selDocente}.pdf`
                    )
                  )
                }
              >
                <FileDown className="h-4 w-4" />
                {downloading === 'doc' ? 'Generando…' : 'Descargar'}
              </Button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-unt-blue">Reporte por aula / ambiente</h3>
            </div>
            <div className="card-body space-y-3">
              <div>
                <Label>Ambiente</Label>
                <select
                  className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                  value={selAmbiente}
                  onChange={(e) => setSelAmbiente(e.target.value)}
                >
                  {ambientes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.codigo ? `${a.codigo} — ${a.nombre}` : a.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                className="w-full bg-unt-blue hover:bg-unt-blue/90 text-white"
                disabled={!selAmbiente || !!downloading}
                onClick={() =>
                  runDownload('aula', () =>
                    downloadFile(
                      '/api/reportes/aula',
                      { ambienteId: selAmbiente, periodoId },
                      `reporte-aula-${selAmbiente}.pdf`
                    )
                  )
                }
              >
                <FileDown className="h-4 w-4" />
                {downloading === 'aula' ? 'Generando…' : 'Descargar'}
              </Button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-unt-blue">
                Reporte de laboratorios
              </h3>
            </div>
            <div className="card-body">
              <p className="mb-3 text-xs text-slate-500">
                Consolidado de todos los laboratorios del período activo.
              </p>
              <Button
                className="w-full bg-unt-blue hover:bg-unt-blue/90 text-white"
                disabled={!!downloading}
                onClick={() =>
                  runDownload('lab', () =>
                    downloadFile(
                      '/api/reportes/laboratorio',
                      { periodoId },
                      `reporte-laboratorios-${periodoId}.pdf`
                    )
                  )
                }
              >
                <FileDown className="h-4 w-4" />
                {downloading === 'lab' ? 'Generando…' : 'Descargar'}
              </Button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-unt-blue">Reporte de gestión</h3>
            </div>
            <div className="card-body">
              <Button
                className="w-full bg-unt-blue hover:bg-unt-blue/90 text-white"
                disabled={!!downloading}
                onClick={() =>
                  runDownload('ges', () =>
                    downloadFile(
                      '/api/reportes/gestion',
                      { periodoId },
                      `reporte-gestion-${periodoId}.pdf`
                    )
                  )
                }
              >
                <FileDown className="h-4 w-4" />
                {downloading === 'ges' ? 'Generando…' : 'Descargar'}
              </Button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-sm font-semibold text-unt-blue">Reporte de conflictos</h3>
            </div>
            <div className="card-body">
              <Button
                className="w-full bg-unt-blue hover:bg-unt-blue/90 text-white"
                disabled={!!downloading}
                onClick={() =>
                  runDownload('conf', () =>
                    downloadFile(
                      '/api/reportes/conflictos',
                      { periodoId },
                      `reporte-conflictos-${periodoId}.pdf`
                    )
                  )
                }
              >
                <FileDown className="h-4 w-4" />
                {downloading === 'conf' ? 'Generando…' : 'Descargar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
