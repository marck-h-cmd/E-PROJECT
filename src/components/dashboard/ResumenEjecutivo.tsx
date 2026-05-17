'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface MetricaEjecutiva {
  horariosTotal: number; horariosPublicados: number; horariosConflicto: number;
  docentesSinHorario: number; ambientesSinUso: number;
  porcentajeCompletitud: number; notificacionesPendientes: number;
}

export default function ResumenEjecutivo({ periodoId }: { periodoId?: string }) {
  const [data, setData] = useState<MetricaEjecutiva | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!periodoId) { setLoading(false); return; }
    const token = localStorage.getItem('token');
    fetch(`/api/estadisticas/descriptivas?periodoId=${periodoId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d.data ?? null)).catch(() => setData(null)).finally(() => setLoading(false));
  }, [periodoId]);

  const style = { ok:'text-green-700 bg-green-50', warn:'text-yellow-700 bg-yellow-50', error:'text-red-700 bg-red-50', info:'text-blue-700 bg-blue-50' };
  const icon  = { ok:'✓', warn:'⚠', error:'✗', info:'ℹ' };

  const metricas = data ? [
    { label:'Publicados', value:`${data.horariosPublicados}/${data.horariosTotal}`, estado: data.horariosPublicados===data.horariosTotal?'ok':'warn', href:'/dashboard/horarios/publicar' },
    { label:'Conflictos',  value:data.horariosConflicto,  estado: data.horariosConflicto===0?'ok':'error', href:'/dashboard/reportes/conflictos' },
    { label:'Sin horario', value:data.docentesSinHorario, estado: data.docentesSinHorario===0?'ok':'warn',  href:'/dashboard/docentes' },
    { label:'Sin uso',     value:data.ambientesSinUso,    estado: data.ambientesSinUso<3?'ok':'info',       href:'/dashboard/ambientes' },
    { label:'Completitud', value:`${data.porcentajeCompletitud}%`, estado: data.porcentajeCompletitud>=80?'ok':data.porcentajeCompletitud>=50?'warn':'error', href:'/dashboard/horarios' },
    { label:'Notif. pend.', value:data.notificacionesPendientes, estado: data.notificacionesPendientes===0?'ok':'info', href:'/dashboard/notificaciones/cola' },
  ] : [];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-gray-900">Resumen Ejecutivo</h3>
        <p className="text-xs text-gray-500 mt-0.5">Estado general del período</p>
      </div>
      <div className="card-body">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />)}
          </div>
        ) : !periodoId ? (
          <div className="text-center py-6 text-gray-400 text-sm">Selecciona un período</div>
        ) : !data ? (
          <div className="text-center py-6 text-gray-400 text-sm">Sin datos disponibles</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {metricas.map((m, i) => (
              <Link key={i} href={m.href}
                className={`p-3 rounded-lg text-center hover:opacity-80 transition-opacity ${style[m.estado as keyof typeof style]}`}>
                <div className="text-xs font-bold mb-0.5">{icon[m.estado as keyof typeof icon]} {m.value}</div>
                <div className="text-[10px] opacity-80">{m.label}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}