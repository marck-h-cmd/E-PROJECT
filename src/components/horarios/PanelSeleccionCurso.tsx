'use client';

import { useEffect, useState } from 'react';

interface Curso {
  id: string;
  nombre: string;
  codigo: string;
  ciclo?: number;
  horasTeoria: number;
  horasPractica: number;
  creditaje?: number;
}

interface Props {
  periodoId?: string;
  docenteId?: string;
  cursoSeleccionado?: Curso | null;
  onSelect: (curso: Curso | null) => void;
}

export default function PanelSeleccionCurso({ periodoId, docenteId, cursoSeleccionado, onSelect }: Props) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!periodoId) { setLoading(false); return; }
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ periodoId });
    if (docenteId) params.append('docenteId', docenteId);
    fetch(`/api/cursos?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setCursos(d.data?.items ?? []))
      .catch(() => setCursos([]))
      .finally(() => setLoading(false));
  }, [periodoId, docenteId]);

  const filtered = cursos.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.codigo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-gray-900">Seleccionar Curso</h3>
      </div>
      <div className="p-3 border-b border-gray-100">
        <input
          type="search"
          placeholder="Buscar curso..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field text-xs py-1.5"
        />
      </div>
      <div className="overflow-y-auto max-h-64 scrollbar-thin">
        {loading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-xs">No se encontraron cursos</div>
        ) : (
          filtered.map(curso => {
            const selected = cursoSeleccionado?.id === curso.id;
            return (
              <button
                key={curso.id}
                onClick={() => onSelect(selected ? null : curso)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors hover:bg-blue-50 ${selected ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-gray-800 truncate">{curso.nombre}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{curso.codigo} {curso.ciclo ? `· Ciclo ${curso.ciclo}` : ''}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-blue-600 font-medium">{curso.horasTeoria}T / {curso.horasPractica}P</div>
                    {curso.creditaje && <div className="text-[10px] text-gray-400">{curso.creditaje} cr.</div>}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
      {cursoSeleccionado && (
        <div className="p-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-800 truncate">{cursoSeleccionado.nombre}</span>
            <button onClick={() => onSelect(null)} className="text-[10px] text-blue-600 hover:text-blue-800 shrink-0 ml-2">
              Quitar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}