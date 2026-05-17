'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
import { useRequireAuth } from '@/contexts/AuthContext';
import { Rol } from '@prisma/client';
import { toast } from 'sonner';

interface GrupoRow {
  id: string;
  nombre: string;
  capacidad: number;
  cursoId: string;
  curso: { id: string; codigo: string; nombre: string };
  _count?: { horarios: number };
}

function GruposInner() {
  const { loading: authLoading } = useRequireAuth([Rol.SUPER_ADMIN, Rol.ADMINISTRADOR]);
  const searchParams = useSearchParams();
  const cursoId = searchParams.get('cursoId');

  const [data, setData] = useState<GrupoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nombre, setNombre] = useState('');
  const [capacidad, setCapacidad] = useState(40);

  const load = async () => {
    if (!cursoId) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<GrupoRow[]>('/api/grupos', { cursoId });
      setData(res.data ?? []);
    } catch (e) {
      setError(e instanceof ApiClientError ? e.message : 'Error al cargar grupos');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [cursoId]);

  const handleCreate = async () => {
    if (!cursoId) return;
    setSaving(true);
    try {
      await apiPost('/api/grupos', { cursoId, nombre, capacidad });
      toast.success('Grupo creado');
      setDialogOpen(false);
      setNombre('');
      setCapacidad(40);
      load();
    } catch (e) {
      toast.error(e instanceof ApiClientError ? e.message : 'Error al crear grupo');
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<GrupoRow>[] = useMemo(
    () => [
      { key: 'nom', header: 'Grupo', cell: (r) => <span className="font-medium">{r.nombre}</span> },
      { key: 'cap', header: 'Capacidad', cell: (r) => r.capacidad },
      {
        key: 'curso',
        header: 'Curso',
        cell: (r) => (
          <span className="text-sm">
            {r.curso.codigo} — {r.curso.nombre}
          </span>
        ),
      },
      {
        key: 'h',
        header: 'Horarios',
        cell: (r) => r._count?.horarios ?? 0,
      },
    ],
    []
  );

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-unt-blue" />
      </div>
    );
  }

  if (!cursoId) {
    return (
      <div>
        <PageHeader
          title="Grupos"
          description="Indique un curso en la URL: /dashboard/grupos?cursoId=…"
        />
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Vaya a{' '}
          <Link href="/dashboard/cursos" className="font-medium text-unt-blue underline">
            Cursos
          </Link>{' '}
          y use el enlace «Ver grupos» del curso deseado.
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Grupos del curso"
        description="Listado y creación de grupos para la asignación de horarios."
        actions={
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-unt-blue hover:bg-unt-blue/90 text-white"
          >
            <Plus className="h-4 w-4" />
            Nuevo grupo
          </Button>
        }
      />

      {error && <ErrorAlert message={error} className="mb-4" onRetry={load} />}

      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(r) => r.id} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo grupo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label htmlFor="gn">Nombre del grupo</Label>
              <Input id="gn" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="gc">Capacidad</Label>
              <Input
                id="gc"
                type="number"
                min={1}
                value={capacidad}
                onChange={(e) => setCapacidad(parseInt(e.target.value, 10) || 1)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={saving || !nombre.trim()}
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

export default function GruposPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-unt-blue" />
        </div>
      }
    >
      <GruposInner />
    </Suspense>
  );
}
