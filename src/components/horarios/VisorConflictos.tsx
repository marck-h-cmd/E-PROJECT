'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Conflicto {
  id: string;
  tipo: string;
  descripcion: string;
  dia: string;
  horaInicio: string;
  docenteNombre?: string;
  ambienteCodigo?: string;
  cursoNombre?: string;
  severidad: 'ALTA' | 'MEDIA' | 'BAJA';
}

const DIA_LABELS: Record<string,string> = {
  LUNES:'Lun', MARTES:'Mar', MIERCOLES:'Mié', JUEVES:'Jue', VIERNES:'Vie', SABADO:'Sáb',
};

const SEV_STYLE = {
  ALTA:  'bg-red-50 border-red-200 text-red-800',
  MEDIA: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  BAJA:  'bg-blue-50 border-blue-200 text-blue-800',
};

interface Props { periodoId?: string; limit?: number; }

export default function VisorConflictos({ periodoId, limit = 20 }: Props) {
  const [conflictos, setConflictos] = useState<Conflicto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ limit: String(limit) });
    if (periodoId) params.append('periodoId', periodoId);
    fetch(`/api/horarios/conflictos?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setConflictos(d.data?.items ?? []))
      .catch(() => setConflictos([]))
      .finally(() => setLoading(false));
  }, [periodoId, limit]);

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Conflictos de Horario</h3>
          <p className="text-xs text-gray-500 mt-0.5">{conflictos.length} conflicto{conflictos.length !== 1 ? 's' : ''} detectado{conflictos.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/horarios/validar" className="text-xs text-blue-700 hover:text-blue-800 font-medium">
          Validar todo →
        </Link>
      </div>
      <div className="card-body space-y-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />
          ))
        ) : conflictos.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Sin conflictos</p>
            <p className="text-xs text-gray-400 mt-0.5">Todos los horarios son válidos</p>
          </div>
        ) : (
          conflictos.map(c => (
            <div key={c.id} className={`p-3 rounded-lg border ${SEV_STYLE[c.severidad]}`}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs font-semibold">{c.tipo}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[9px] bg-white/60 px-1.5 py-0.5 rounded font-medium">
                    {DIA_LABELS[c.dia] ?? c.dia} {c.horaInicio}
                  </span>
                  <span className="text-[9px] font-semibold">{c.severidad}</span>
                </div>
              </div>
              <p className="text-[11px] leading-snug">{c.descripcion}</p>
              {(c.docenteNombre || c.ambienteCodigo) && (
                <div className="flex gap-3 mt-1.5 text-[10px] opacity-80">
                  {c.docenteNombre && <span>👤 {c.docenteNombre}</span>}
                  {c.ambienteCodigo && <span>🏫 {c.ambienteCodigo}</span>}
                  {c.cursoNombre && <span>📚 {c.cursoNombre}</span>}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}