'use client';

import { useState } from 'react';
import { FileDown, Loader2, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { ApiClientError, downloadFile } from '@/lib/api-client';
import { useRequireAuth } from '@/contexts/AuthContext';
import { usePeriodo } from '@/contexts/PeriodoContext';
import { Rol } from '@prisma/client';
import { toast } from 'sonner';

export default function ReportesPage() {
  const { loading: authLoading } = useRequireAuth([Rol.SUPER_ADMIN, Rol.ADMINISTRADOR]);
  const { periodoSeleccionado, loading: periodoLoading } = usePeriodo();
  const periodoId = periodoSeleccionado?.id ?? '';
  const [downloading, setDownloading] = useState<string | null>(null);

  const runDownload = async (
    key: string,
    fn: () => Promise<void>,
    options?: { requierePeriodo?: boolean }
  ) => {
    if (options?.requierePeriodo !== false && !periodoId) {
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

  const CATALOGOS: { key: string; entidad: string; label: string; desc: string }[] = [
    { key: 'cat-doc', entidad: 'docentes', label: 'Docentes', desc: 'Listado completo de docentes' },
    { key: 'cat-cur', entidad: 'cursos', label: 'Cursos', desc: 'Plan de estudios y horas' },
    { key: 'cat-amb', entidad: 'ambientes', label: 'Ambientes', desc: 'Aulas y laboratorios' },
    { key: 'cat-per', entidad: 'periodos', label: 'Períodos', desc: 'Períodos académicos' },
    { key: 'cat-gru', entidad: 'grupos', label: 'Grupos', desc: 'Grupos por curso' },
    {
      key: 'cat-car',
      entidad: 'carga-academica',
      label: 'Carga académica',
      desc: 'Asignaciones curso–docente',
    },
  ];

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
        description="Informes de gestión del período y catálogos administrativos (CRUD)."
      />

      {!periodoId && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Seleccione un período académico activo para los reportes de gestión y conflictos.
          Los catálogos se pueden descargar sin período.
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-unt-blue">Reporte de gestión</h3>
          </div>
          <div className="card-body">
            <p className="mb-3 text-xs text-slate-500">
              Resumen del período: docentes, cursos, avance por categoría y ocupación de ambientes.
            </p>
            <Button
              className="w-full bg-unt-blue hover:bg-unt-blue/90 text-white"
              disabled={!!downloading || !periodoId}
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
            <p className="mb-3 text-xs text-slate-500">
              Validaciones que no cumplen en el período activo.
            </p>
            <Button
              className="w-full bg-unt-blue hover:bg-unt-blue/90 text-white"
              disabled={!!downloading || !periodoId}
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

        <div className="md:col-span-2">
          <div className="card">
            <div className="card-header flex items-center gap-2">
              <Library className="h-4 w-4 text-unt-blue" />
              <h3 className="text-sm font-semibold text-unt-blue">
                Catálogos administrativos
              </h3>
            </div>
            <div className="card-body">
              <p className="mb-4 text-xs text-slate-500">
                Exportación PDF de los datos maestros del sistema. El período activo se incluye en
                el encabezado cuando está seleccionado.
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CATALOGOS.map((c) => (
                  <Button
                    key={c.key}
                    variant="outline"
                    className="h-auto flex-col items-start gap-1 py-3 text-left"
                    disabled={!!downloading}
                    onClick={() =>
                      runDownload(
                        c.key,
                        () =>
                          downloadFile(
                            `/api/reportes/catalogo/${c.entidad}`,
                            periodoId ? { periodoId } : undefined,
                            `catalogo-${c.entidad}.pdf`
                          ),
                        { requierePeriodo: false }
                      )
                    }
                  >
                    <span className="font-semibold text-unt-blue">{c.label}</span>
                    <span className="text-xs font-normal text-slate-500">{c.desc}</span>
                    <span className="mt-1 text-xs text-slate-400">
                      {downloading === c.key ? 'Generando…' : 'Descargar PDF'}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
