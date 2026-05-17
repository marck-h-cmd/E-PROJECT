'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CursoAsignado {
  horarioId: string;
  cursoId: string;
  cursoNombre: string;
  cursoCodigo: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  ambienteCodigo: string;
  estado: string;
  esPractica?: boolean;
}

const DIA_LABELS: Record<string,string> = {
  LUNES:'Lun', MARTES:'Mar', MIERCOLES:'Mié', JUEVES:'Jue', VIERNES:'Vie', SABADO:'Sáb',
};

interface Props {
  docenteId: string;
  periodoId?: string;
  onEliminar?: (horarioId: string) => void;
}

export default function ListaCursosAsignados({ docenteId, periodoId, onEliminar }: Props) {
  const [cursos, setCursos] = useState<CursoAsignado[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCursos = () => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ docenteId });
    if (periodoId) params.append('periodoId', periodoId);
    fetch(`/api/horarios?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setCursos(d.data?.items ?? []))
      .catch(() => setCursos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCursos(); }, [docenteId, periodoId]);

  const handleEliminar = async (horarioId: string) => {
    const token = localStorage.getItem('token');
    await fetch(`/api/horarios/${horarioId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    onEliminar?.(horarioId);
    fetchCursos();
  };

  const totalHoras = cursos.length;

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Cursos Asignados</h3>
          <p className="text-xs text-gray-500 mt-0.5">{totalHoras} sesión{totalHoras !== 1 ? 'es' : ''} en este período</p>
        </div>
      </div>
      <div className="divide-y divide-gray-50">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex gap-3">
              <div className="w-10 h-10 bg-gray-100 animate-pulse rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 animate-pulse rounded w-1/2" />
              </div>
            </div>
          ))
        ) : cursos.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">
            No hay cursos asignados aún
          </div>
        ) : (
          cursos.map(c => (
            <div key={c.horarioId} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-blue-700">{DIA_LABELS[c.dia] ?? c.dia}</span>
                <span className="text-[9px] text-blue-500">{c.horaInicio}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-medium text-gray-800 truncate">{c.cursoNombre}</p>
                  {c.esPractica && (
                    <span className="text-[9px] bg-green-100 text-green-700 px-1 py-0.5 rounded shrink-0">LAB</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500">{c.horaInicio}–{c.horaFin} · {c.ambienteCodigo}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                  c.estado === 'PUBLICADO' ? 'bg-green-100 text-green-700' :
                  c.estado === 'ASIGNADO'  ? 'bg-blue-100 text-blue-700'  :
                  'bg-yellow-100 text-yellow-700'
                }`}>{c.estado}</span>
                {onEliminar && (
                  <button
                    onClick={() => handleEliminar(c.horarioId)}
                    className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}