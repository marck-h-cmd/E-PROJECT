'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
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
import { Pagination } from '@/components/data/Pagination';
import { SearchBar } from '@/components/data/SearchBar';
import { ErrorAlert } from '@/components/feedback/ErrorAlert';
import { PageHeader } from '@/components/layout/PageHeader';
import { useConfirm } from '@/hooks/useConfirm';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { apiGet, apiPost, apiRequest, ApiClientError } from '@/lib/api-client';
import { Formateadores } from '@/lib/formateadores';
import { useRequireAuth } from '@/contexts/AuthContext';
import { Rol } from '@prisma/client';
import { toast } from 'sonner';

interface CargaRow {
  id: string;
  horasAsignadas: number;
  curso: { id: string; codigo: string; nombre: string; creditos: number; ciclo: number };
  docente: {
    id: string;
    usuario: { nombre: string; apellidos: string; email: string };
  };
}

interface DocenteOpt {
  id: string;
  codigo: string;
  usuario: { nombre: string; apellidos: string };
}

interface CursoOpt {
  id: string;
  codigo: string;
  nombre: string;
}

export default function CargaAcademicaPage() {
  const { loading: authLoading } = useRequireAuth([Rol.SUPER_ADMIN, Rol.ADMINISTRADOR]);
  const { confirm, state: confirmState, handleClose: handleConfirmClose } = useConfirm();

  const [qInput, setQInput] = useState('');
  const [search, setSearch] = useState('');
  const listParams = useMemo(() => ({ search: search || undefined }), [search]);
  const { data, meta, loading, error, page, setPage, refresh } = usePaginatedQuery<CargaRow>(
    '/api/carga-academica',
    listParams
  );

  const [assignOpen, setAssignOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [docentes, setDocentes] = useState<DocenteOpt[]>([]);
  const [cursos, setCursos] = useState<CursoOpt[]>([]);
  const [selDocente, setSelDocente] = useState('');
  const [selCurso, setSelCurso] = useState('');
  const [horas, setHoras] = useState(4);

  useEffect(() => setPage(1), [search, setPage]);

  useEffect(() => {
    if (!assignOpen) return;
    (async () => {
      try {
        const [d, c] = await Promise.all([
          apiGet<DocenteOpt[]>('/api/docentes', { limit: 100, page: 1 }),
          apiGet<CursoOpt[]>('/api/cursos', { limit: 100, page: 1 }),
        ]);
        const dList = Array.isArray(d.data) ? d.data : [];
        const cList = Array.isArray(c.data) ? c.data : [];
        setDocentes(dList);
        setCursos(cList);
        if (dList[0]) setSelDocente(dList[0].id);
        if (cList[0]) setSelCurso(cList[0].id);
      } catch {
        toast.error('No se pudieron cargar listas para asignar');
      }
    })();
  }, [assignOpen]);

  const handleAssign = async () => {
    if (!selCurso || !selDocente) return;
    setSaving(true);
    try {
      await apiPost(`/api/cursos/${selCurso}/docentes`, {
        docenteId: selDocente,
        horasAsignadas: horas,
      });
      toast.success('Docente asignado al curso');
      setAssignOpen(false);
      refresh();
    } catch (e) {
      toast.error(e instanceof ApiClientError ? e.message : 'Error al asignar');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (row: CargaRow) => {
    const ok = await confirm({
      title: 'Quitar asignación',
      message: `¿Remover a ${Formateadores.nombreUsuario(row.docente.usuario)} del curso ${row.curso.codigo}?`,
      variant: 'destructive',
      confirmLabel: 'Quitar',
    });
    if (!ok) return;
    try {
      await apiRequest(`/api/cursos/${row.curso.id}/docentes`, {
        method: 'DELETE',
        params: { docenteId: row.docente.id },
      });
      toast.success('Asignación eliminada');
      refresh();
    } catch (e) {
      toast.error(e instanceof ApiClientError ? e.message : 'Error al eliminar');
    }
  };

  const columns: Column<CargaRow>[] = [
    {
      key: 'curso',
      header: 'Curso',
      cell: (r) => (
        <div>
          <div className="font-mono text-sm dark:text-slate-200">{r.curso.codigo}</div>
          <div className="text-sm text-gray-700 dark:text-slate-300">{r.curso.nombre}</div>
        </div>
      ),
    },
    {
      key: 'doc',
      header: 'Docente',
      cell: (r) => Formateadores.nombreUsuario(r.docente.usuario),
    },
    { key: 'h', header: 'Horas', cell: (r) => Formateadores.horas(r.horasAsignadas) },
    {
      key: 'acc',
      header: '',
      className: 'w-16 text-right',
      cell: (r) => (
        <Button type="button" size="sm" variant="destructive" onClick={() => handleRemove(r)}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];

  if (authLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-unt-blue" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Carga académica"
        description="Asignación de docentes a cursos y control de horas."
        actions={
          <Button
            onClick={() => setAssignOpen(true)}
            className="bg-unt-blue hover:bg-unt-blue/90 text-white"
          >
            <Plus className="h-4 w-4" />
            Asignar docente
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={qInput}
          onChange={setQInput}
          placeholder="Buscar curso o docente…"
          onSubmit={() => setSearch(qInput.trim())}
        />
        <Button type="button" variant="outline" onClick={() => setSearch(qInput.trim())}>
          Buscar
        </Button>
      </div>

      {error && <ErrorAlert message={error} className="mb-4" onRetry={refresh} />}

      <DataTable columns={columns} data={data} loading={loading} keyExtractor={(r) => r.id} />

      {meta && (
        <Pagination page={page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage} />
      )}

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar docente a curso</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div>
              <Label>Curso</Label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                value={selCurso}
                onChange={(e) => setSelCurso(e.target.value)}
              >
                {cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.codigo} — {c.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Docente</Label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm"
                value={selDocente}
                onChange={(e) => setSelDocente(e.target.value)}
              >
                {docentes.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.codigo} — {Formateadores.nombreUsuario(d.usuario)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="ha">Horas asignadas</Label>
              <Input
                id="ha"
                type="number"
                min={0}
                value={horas}
                onChange={(e) => setHoras(parseInt(e.target.value, 10) || 0)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAssignOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={saving}
              onClick={handleAssign}
              className="bg-unt-blue hover:bg-unt-blue/90 text-white"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Asignar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        variant={confirmState.variant}
        onConfirm={() => handleConfirmClose(true)}
        onCancel={() => handleConfirmClose(false)}
      />
    </div>
  );
}
