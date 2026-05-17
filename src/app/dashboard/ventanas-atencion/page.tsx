'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DataTable, type Column } from '@/components/data/DataTable';
import { ErrorAlert } from '@/components/feedback/ErrorAlert';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiGet, apiPost, ApiClientError } from '@/lib/api-client';
import { Formateadores } from '@/lib/formateadores';
import { useRequireAuth } from '@/contexts/AuthContext';
import { usePeriodo } from '@/contexts/PeriodoContext';
import { CategoriaDocente, Rol } from '@prisma/client';
import { toast } from 'sonner';

interface VentanaRow {
  id: string;
  nombre: string;
  categoria: string;
  fechaInicio: string;
  fechaFin: string;
  estado?: string;
}

export default function VentanasAtencionPage() {
  const { loading: authLoading } = useRequireAuth([
    Rol.SUPER_ADMIN,
    Rol.ADMINISTRADOR,
    Rol.OPERADOR,
  ]);
  const { periodoSeleccionado, loading: periodoLoading } = usePeriodo();
  const periodoId = periodoSeleccionado?.id ?? '';

  const [data, setData] = useState<VentanaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{
    nombre: string;
    categoria: CategoriaDocente;
    fechaInicio: string;
    fechaFin: string;
  }>({
    nombre: '',
    categoria: CategoriaDocente.PRINCIPAL,
    fechaInicio: '',
    fechaFin: '',
  });

  const load = async () => {
    if (!periodoId) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<VentanaRow[]>('/api/ventanas-atencion', { periodoId });
      setData(res.data ?? []);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'Error al cargar ventanas');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [periodoId]);

  const handleCreate = async () => {
    if (!periodoId) return;
    setSaving(true);
    try {
      await apiPost('/api/ventanas-atencion', {
        periodoId,
        nombre: form.nombre,
        categoria: form.categoria,
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
      });
      toast.success('Ventana creada');
      setDialogOpen(false);
      setForm({
        nombre: '',
        categoria: CategoriaDocente.PRINCIPAL,
        fechaInicio: '',
        fechaFin: '',
      });
      load();
    } catch (e) {
      toast.error(e instanceof ApiClientError ? e.message : 'Error al crear');
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<VentanaRow>[] = useMemo(
    () => [
      { key: 'n', header: 'Nombre', cell: (r) => <span className="font-medium">{r.nombre}</span> },
      {
        key: 'c',
        header: 'Categoría',
        cell: (r) => Formateadores.categoriaDocente(r.categoria),
      },
      {
        key: 'fi',
        header: 'Inicio',
        cell: (r) => new Date(r.fechaInicio).toLocaleString('es-PE'),
      },
      {
        key: 'ff',
        header: 'Fin',
        cell: (r) => new Date(r.fechaFin).toLocaleString('es-PE'),
      },
      {
        key: 'e',
        header: 'Estado',
        cell: (r) => r.estado ?? '—',
      },
    ],
    []
  );

  if (authLoading || periodoLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-unt-blue" />
      </div>
    );
  }

  if (!periodoId) {
    return (
      <div>
        <PageHeader title="Ventanas de atención" description="Turnos por categoría docente." />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Elija un período académico para listar o crear ventanas.
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Ventanas de atención"
        description={`Período: ${periodoSeleccionado?.nombre}`}
        actions={
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-unt-blue hover:bg-unt-blue/90 text-white"
          >
            <Plus className="h-4 w-4" />
            Nueva ventana
          </Button>
        }
      />

      {error && <ErrorAlert message={error} className="mb-4" onRetry={load} />}

      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(r) => r.id} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva ventana de atención</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Nombre</Label>
              <Input value={form.nombre} onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} />
            </div>
            <div>
              <Label>Categoría atendida</Label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                value={form.categoria}
                onChange={(e) =>
                  setForm((f) => ({ ...f, categoria: e.target.value as CategoriaDocente }))
                }
              >
                {Object.values(CategoriaDocente).map((c) => (
                  <option key={c} value={c}>
                    {Formateadores.categoriaDocente(c)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Inicio</Label>
              <Input
                type="datetime-local"
                value={form.fechaInicio}
                onChange={(e) => setForm((f) => ({ ...f, fechaInicio: e.target.value }))}
              />
            </div>
            <div>
              <Label>Fin</Label>
              <Input
                type="datetime-local"
                value={form.fechaFin}
                onChange={(e) => setForm((f) => ({ ...f, fechaFin: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={saving || !form.nombre.trim()}
              onClick={handleCreate}
              className="bg-unt-blue hover:bg-unt-blue/90 text-white"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Crear'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
