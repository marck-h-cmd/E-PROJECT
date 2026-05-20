'use client';

import { useEffect, useMemo, useState } from 'react';
import { FileDown, Loader2, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/layout/PageHeader';
import { ErrorAlert } from '@/components/feedback/ErrorAlert';
import { apiGet, ApiClientError, downloadFile } from '@/lib/api-client';
import { useRequireAuth } from '@/contexts/AuthContext';
import { usePeriodo } from '@/contexts/PeriodoContext';
import { Rol } from '@prisma/client';
import { toast } from 'sonner';
import type { EntidadCatalogo } from '@/services/reportes/ReporteCatalogoService';

const TODOS = '__todos__';

interface Opt {
  id: string;
  codigo?: string;
  nombre: string;
  usuario?: { nombre: string; apellidos: string };
  curso?: { codigo: string; nombre: string };
}

type FiltrosCatalogo = Record<EntidadCatalogo, string>;

const CATALOGOS: {
  key: string;
  entidad: EntidadCatalogo;
  label: string;
  desc: string;
  labelFiltro: string;
}[] = [
  {
    key: 'cat-doc',
    entidad: 'docentes',
    label: 'Docentes',
    desc: 'Datos maestros de docentes',
    labelFiltro: 'Docente',
  },
  {
    key: 'cat-cur',
    entidad: 'cursos',
    label: 'Cursos',
    desc: 'Plan de estudios y horas',
    labelFiltro: 'Curso',
  },
  {
    key: 'cat-amb',
    entidad: 'ambientes',
    label: 'Ambientes',
    desc: 'Aulas y laboratorios',
    labelFiltro: 'Ambiente',
  },
  {
    key: 'cat-per',
    entidad: 'periodos',
    label: 'Períodos',
    desc: 'Períodos académicos',
    labelFiltro: 'Período',
  },
  {
    key: 'cat-gru',
    entidad: 'grupos',
    label: 'Grupos',
    desc: 'Grupos por curso',
    labelFiltro: 'Grupo',
  },
  {
    key: 'cat-car',
    entidad: 'carga-academica',
    label: 'Carga académica',
    desc: 'Asignaciones curso–docente',
    labelFiltro: 'Asignación',
  },
];

const FILTROS_INICIALES: FiltrosCatalogo = {
  docentes: TODOS,
  cursos: TODOS,
  ambientes: TODOS,
  periodos: TODOS,
  grupos: TODOS,
  'carga-academica': TODOS,
};

function etiquetaOpcion(entidad: EntidadCatalogo, item: Opt): string {
  switch (entidad) {
    case 'docentes':
      return `${item.codigo ?? ''} — ${item.usuario ? `${item.usuario.apellidos}, ${item.usuario.nombre}` : item.nombre}`;
    case 'grupos':
      return item.curso
        ? `${item.curso.codigo} — Grupo ${item.nombre}`
        : item.nombre;
    case 'carga-academica':
      return item.nombre;
    default:
      return item.codigo ? `${item.codigo} — ${item.nombre}` : item.nombre;
  }
}

export default function ReportesPage() {
  const { loading: authLoading } = useRequireAuth([Rol.SUPER_ADMIN, Rol.ADMINISTRADOR]);
  const { periodoSeleccionado, loading: periodoLoading } = usePeriodo();
  const periodoId = periodoSeleccionado?.id ?? '';
  const [downloading, setDownloading] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosCatalogo>(FILTROS_INICIALES);
  const [opciones, setOpciones] = useState<Record<EntidadCatalogo, Opt[]>>({
    docentes: [],
    cursos: [],
    ambientes: [],
    periodos: [],
    grupos: [],
    'carga-academica': [],
  });
  const [loadingCatalogos, setLoadingCatalogos] = useState(true);
  const [errCatalogos, setErrCatalogos] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoadingCatalogos(true);
      setErrCatalogos(null);
      try {
        const [docentes, cursos, ambientes, periodos, grupos, carga] = await Promise.all([
          apiGet<Opt[]>('/api/docentes', { limit: 500, page: 1 }),
          apiGet<Opt[]>('/api/cursos', { limit: 500, page: 1 }),
          apiGet<Opt[]>('/api/ambientes', { limit: 500, page: 1 }),
          apiGet<Opt[]>('/api/periodos', { limit: 100, page: 1 }),
          apiGet<{ id: string; nombre: string; curso: { codigo: string; nombre: string } }[]>(
            '/api/grupos',
            { limit: 500, page: 1 }
          ),
          apiGet<
            {
              id: string;
              docente: { codigo: string; usuario: { nombre: string; apellidos: string } };
              curso: { codigo: string; nombre: string };
            }[]
          >('/api/carga-academica', { limit: 100, page: 1 }),
        ]);

        setOpciones({
          docentes: docentes.data ?? [],
          cursos: cursos.data ?? [],
          ambientes: ambientes.data ?? [],
          periodos: periodos.data ?? [],
          grupos: (grupos.data ?? []).map((g) => ({
            id: g.id,
            nombre: g.nombre,
            curso: g.curso,
          })),
          'carga-academica': (carga.data ?? []).map((a) => ({
            id: a.id,
            nombre: `${a.docente.codigo} → ${a.curso.codigo} (${a.docente.usuario.apellidos})`,
          })),
        });
      } catch (e) {
        setErrCatalogos(
          e instanceof ApiClientError ? e.message : 'Error al cargar filtros de catálogos'
        );
      } finally {
        setLoadingCatalogos(false);
      }
    })();
  }, []);

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

  const descargarCatalogo = (cat: (typeof CATALOGOS)[number]) => {
    const seleccion = filtros[cat.entidad];
    const esTodos = seleccion === TODOS;
    const params: Record<string, string> = {};
    if (periodoId) params.periodoId = periodoId;
    if (!esTodos) params.id = seleccion;

    return downloadFile(
      `/api/reportes/catalogo/${cat.entidad}`,
      params,
      `catalogo-${cat.entidad}${esTodos ? '-todos' : `-${seleccion}`}.pdf`
    );
  };

  const resumenFiltro = useMemo(() => {
    return CATALOGOS.reduce(
      (acc, c) => {
        const sel = filtros[c.entidad];
        acc[c.entidad] =
          sel === TODOS
            ? 'Todos los registros'
            : etiquetaOpcion(
                c.entidad,
                opciones[c.entidad].find((o) => o.id === sel) ?? {
                  id: sel,
                  nombre: sel,
                }
              );
        return acc;
      },
      {} as Record<EntidadCatalogo, string>
    );
  }, [filtros, opciones]);

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
        description="Informes de gestión del período y catálogos administrativos con filtros por registro."
      />

      {!periodoId && (
        <div className="alert-warning">
          Seleccione un período académico activo para los reportes de gestión y conflictos. Los
          catálogos pueden generarse con o sin período (el período activo se refleja en el
          encabezado del PDF).
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h3 className="text-sm font-semibold text-unt-blue dark:text-unt-gold-light">
              Reporte de gestión
            </h3>
          </div>
          <div className="card-body">
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
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
            <h3 className="text-sm font-semibold text-unt-blue dark:text-unt-gold-light">
              Reporte de conflictos
            </h3>
          </div>
          <div className="card-body">
            <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
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
              <Library className="h-4 w-4 text-unt-blue dark:text-unt-gold-light" />
              <h3 className="text-sm font-semibold text-unt-blue dark:text-unt-gold-light">
                Catálogos administrativos
              </h3>
            </div>
            <div className="card-body space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Elija <strong>todos los registros</strong> o un elemento específico antes de
                generar cada PDF.
              </p>

              {errCatalogos && <ErrorAlert message={errCatalogos} />}

              {loadingCatalogos ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando filtros…
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {CATALOGOS.map((c) => {
                    const lista = opciones[c.entidad];
                    const seleccion = filtros[c.entidad];
                    const esTodos = seleccion === TODOS;

                    return (
                      <div
                        key={c.key}
                        className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-900/40"
                      >
                        <div>
                          <h4 className="font-semibold text-unt-blue dark:text-unt-gold-light">
                            {c.label}
                          </h4>
                          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            {c.desc}
                          </p>
                        </div>

                        <div>
                          <Label htmlFor={`filtro-${c.entidad}`}>{c.labelFiltro}</Label>
                          <select
                            id={`filtro-${c.entidad}`}
                            className="input mt-1"
                            value={seleccion}
                            onChange={(e) =>
                              setFiltros((prev) => ({
                                ...prev,
                                [c.entidad]: e.target.value,
                              }))
                            }
                          >
                            <option value={TODOS}>— Todos —</option>
                            {lista.map((item) => (
                              <option key={item.id} value={item.id}>
                                {etiquetaOpcion(c.entidad, item)}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1.5 truncate text-[10px] text-slate-400 dark:text-slate-500">
                            {resumenFiltro[c.entidad]}
                          </p>
                        </div>

                        <Button
                          className="mt-auto w-full bg-unt-blue hover:bg-unt-blue/90 text-white"
                          disabled={!!downloading || (!esTodos && !seleccion)}
                          onClick={() =>
                            runDownload(
                              c.key,
                              () => descargarCatalogo(c),
                              { requierePeriodo: false }
                            )
                          }
                        >
                          <FileDown className="h-4 w-4 shrink-0" />
                          {downloading === c.key
                            ? 'Generando…'
                            : esTodos
                              ? 'PDF — Todos'
                              : 'PDF — Seleccionado'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
