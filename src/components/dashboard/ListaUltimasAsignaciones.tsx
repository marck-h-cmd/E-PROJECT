'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Asignacion {
  id: string;
  docente: { nombres: string; apellidos: string; };
  curso: { nombre: string; };
  ambiente: { codigo: string; };
  dia: string;
  horaInicio: string;
  estado: string;
}

const DIA_LABELS: Record<string,string> = {
  LUNES:'Lun',MARTES:'Mar',MIERCOLES:'Mié',JUEVES:'Jue',VIERNES:'Vie',SABADO:'Sáb',
};

export default function ListaUltimasAsignaciones({ periodoId }: { periodoId?: string }) {
  const [data, setData] = useState<Asignacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ limit:'8', orderBy:'createdAt', order:'desc' });
    if (periodoId) params.append('periodoId', periodoId);
    fetch(`/api/horarios?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d.data?.items ?? [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [periodoId]);

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Últimas Asignaciones</h3>
          <p className="text-xs text-gray-500 mt-0.5">Horarios recientes</p>
        </div>
        <Link href="/dashboard/horarios" className="text-xs text-blue-700 hover:text-blue-800 font-medium">Ver todos →</Link>
      </div>
      <div className="divide-y divide-gray-50">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 animate-pulse rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 animate-pulse rounded w-1/2" />
              </div>
            </div>
          ))
        ) : data.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No hay asignaciones recientes</div>
        ) : (
          data.map(a => (
            <Link key={a.id} href={`/dashboard/horarios/${a.id}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex flex-col items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                <span className="text-[10px] font-bold text-blue-700">{DIA_LABELS[a.dia] ?? a.dia}</span>
                <span className="text-[9px] text-blue-500">{a.horaInicio}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{a.curso?.nombre}</p>
                <p className="text-[10px] text-gray-500 truncate">
                  {a.docente?.apellidos}, {a.docente?.nombres} · {a.ambiente?.codigo}
                </p>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                a.estado === 'PUBLICADO' ? 'bg-green-100 text-green-700' :
                a.estado === 'ASIGNADO'  ? 'bg-blue-100 text-blue-700'  :
                'bg-gray-100 text-gray-600'
              }`}>{a.estado}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}