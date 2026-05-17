'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Periodo {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  totalDocentes?: number;
  totalCursos?: number;
  avancePorcentaje?: number;
}

export default function TarjetaResumenPeriodo({ onPeriodoChange }: { onPeriodoChange?: (id: string) => void }) {
  const [periodo, setPeriodo] = useState<Periodo | null>(null);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetch('/api/periodos/activo', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/periodos?limit=10&orderBy=fechaInicio&order=desc', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([activo, todos]) => {
        setPeriodo(activo.data ?? null);
        setPeriodos(todos.data?.items ?? []);
        if (activo.data?.id) onPeriodoChange?.(activo.data.id);
      })
      .finally(() => setLoading(false));
  }, []);

  const handlePeriodoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sel = periodos.find(p => p.id === e.target.value);
    if (sel) { setPeriodo(sel); onPeriodoChange?.(sel.id); }
  };

  const formatFecha = (f: string) =>
    new Date(f).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });

  const diasRestantes = periodo?.fechaFin
    ? Math.max(0, Math.ceil((new Date(periodo.fechaFin).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="card">
      <div className="card-body">
        {loading ? (
          <div className="space-y-3">
            <div className="h-5 bg-gray-100 animate-pulse rounded w-1/2" />
            <div className="h-8 bg-gray-100 animate-pulse rounded" />
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-100 animate-pulse rounded" />)}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${periodo?.estado === 'ACTIVO' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-xs text-gray-500 font-medium">Período académico</span>
              </div>
              {periodo && (
                <span className={`badge text-[10px] ${periodo.estado === 'ACTIVO' ? 'badge-green' : 'badge-gray'}`}>
                  {periodo.estado}
                </span>
              )}
            </div>

            <select onChange={handlePeriodoSelect} value={periodo?.id ?? ''}
              className="input-field text-sm font-semibold text-gray-900 mb-4">
              <option value="" disabled>Seleccionar período...</option>
              {periodos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>

            {periodo ? (
              <>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{periodo.totalDocentes ?? '—'}</div>
                    <div className="text-[10px] text-gray-500">Docentes</div>
                  </div>
                  <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{periodo.totalCursos ?? '—'}</div>
                    <div className="text-[10px] text-gray-500">Cursos</div>
                  </div>
                  <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-700">{diasRestantes ?? '—'}</div>
                    <div className="text-[10px] text-gray-500">Días restantes</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Avance de asignación</span>
                    <span className="font-semibold text-blue-700">{periodo.avancePorcentaje ?? 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${periodo.avancePorcentaje ?? 0}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-400">
                  <span>Inicio: {formatFecha(periodo.fechaInicio)}</span>
                  <span>Fin: {formatFecha(periodo.fechaFin)}</span>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  <Link href={`/dashboard/periodos/${periodo.id}`}
                    className="flex-1 text-center text-xs text-blue-700 hover:text-blue-800 font-medium">
                    Ver detalle
                  </Link>
                  <Link href="/dashboard/horarios/publicar"
                    className="flex-1 text-center text-xs text-green-700 hover:text-green-800 font-medium">
                    Publicar horarios
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-3">No hay período activo</p>
                <Link href="/dashboard/periodos/nuevo" className="btn-primary text-xs">Crear período</Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}