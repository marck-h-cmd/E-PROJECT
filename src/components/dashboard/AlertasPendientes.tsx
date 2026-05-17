'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Alerta {
  id: string; tipo: string; titulo: string;
  descripcion: string; severidad: 'ALTA'|'MEDIA'|'BAJA'; href?: string;
}

const SEV = {
  ALTA:  { bg:'bg-red-50',    border:'border-red-200',    icon:'text-red-500',    badge:'bg-red-100 text-red-700'     },
  MEDIA: { bg:'bg-yellow-50', border:'border-yellow-200', icon:'text-yellow-500', badge:'bg-yellow-100 text-yellow-700'},
  BAJA:  { bg:'bg-blue-50',   border:'border-blue-200',   icon:'text-blue-500',   badge:'bg-blue-100 text-blue-700'   },
};

export default function AlertasPendientes() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    Promise.all([
      fetch('/api/horarios/conflictos?limit=3', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/notificaciones?estado=ERROR&limit=5', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/periodos/activo', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ])
      .then(([conflictos, notifs, periodo]) => {
        const built: Alerta[] = [];
        if (!periodo.data) built.push({ id:'sin-periodo', tipo:'SIN_PERIODO', titulo:'Sin período activo', descripcion:'No hay un período académico activo. Activa uno para gestionar horarios.', severidad:'ALTA', href:'/dashboard/periodos' });
        (conflictos.data?.items ?? []).slice(0,3).forEach((c: any, i: number) => {
          built.push({ id:`conflicto-${i}`, tipo:'CONFLICTO', titulo:'Conflicto de horario', descripcion: c.descripcion ?? `Conflicto en ${c.dia} ${c.horaInicio}`, severidad:'ALTA', href:'/dashboard/reportes/conflictos' });
        });
        const errCount = (notifs.data?.items ?? []).length;
        if (errCount > 0) built.push({ id:'notif-error', tipo:'NOTIFICACION_FALLIDA', titulo:`${errCount} notificación(es) fallida(s)`, descripcion:'Algunas notificaciones no pudieron enviarse.', severidad:'MEDIA', href:'/dashboard/notificaciones/historial' });
        setAlertas(built);
      })
      .catch(() => setAlertas([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Alertas Pendientes</h3>
          <p className="text-xs text-gray-500 mt-0.5">Requieren atención</p>
        </div>
        {alertas.length > 0 && <span className="badge-red">{alertas.length}</span>}
      </div>
      <div className="card-body space-y-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-lg" />)
        ) : alertas.length === 0 ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">Todo en orden</p>
            <p className="text-xs text-gray-400 mt-0.5">No hay alertas pendientes</p>
          </div>
        ) : (
          alertas.map(a => {
            const cfg = SEV[a.severidad];
            const inner = (
              <div className={`flex items-start gap-3 p-3 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-gray-800 truncate">{a.titulo}</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${cfg.badge}`}>{a.severidad}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">{a.descripcion}</p>
                </div>
              </div>
            );
            return a.href ? <Link key={a.id} href={a.href}>{inner}</Link> : <div key={a.id}>{inner}</div>;
          })
        )}
      </div>
    </div>
  );
}