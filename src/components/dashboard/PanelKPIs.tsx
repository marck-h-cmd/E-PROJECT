'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface KPI {
  label: string;
  value: number | string;
  subLabel?: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  text: string;
  href: string;
}

interface ResumenData {
  totalDocentes: number;
  totalCursos: number;
  totalAmbientes: number;
  totalGrupos: number;
  horariosAsignados: number;
  horariosConflicto: number;
  avancePorcentaje: number;
  periodoActivo: string | null;
}

export default function PanelKPIs({ periodoId }: { periodoId?: string }) {
  const [data, setData] = useState<ResumenData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = periodoId ? `?periodoId=${periodoId}` : '';
    fetch(`/api/estadisticas/resumen${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => setData(d.data ?? d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [periodoId]);

  const kpis: KPI[] = [
    {
      label: 'Docentes', value: data?.totalDocentes ?? 0, subLabel: 'registrados',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
      color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-600', href: '/dashboard/docentes',
    },
    {
      label: 'Cursos', value: data?.totalCursos ?? 0, subLabel: 'en catálogo',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
      color: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600', href: '/dashboard/cursos',
    },
    {
      label: 'Ambientes', value: data?.totalAmbientes ?? 0, subLabel: 'disponibles',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
      color: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-600', href: '/dashboard/ambientes',
    },
    {
      label: 'Horarios', value: data?.horariosAsignados ?? 0, subLabel: 'asignados',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>,
      color: 'bg-green-500', bg: 'bg-green-50', text: 'text-green-600', href: '/dashboard/horarios',
    },
    {
      label: 'Grupos', value: data?.totalGrupos ?? 0, subLabel: 'activos',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>,
      color: 'bg-orange-500', bg: 'bg-orange-50', text: 'text-orange-600', href: '/dashboard/grupos',
    },
    {
      label: 'Conflictos', value: data?.horariosConflicto ?? 0, subLabel: 'detectados',
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
      color: 'bg-red-500', bg: 'bg-red-50', text: 'text-red-600', href: '/dashboard/reportes/conflictos',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 animate-pulse rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-100 animate-pulse rounded w-10" />
                <div className="h-3 bg-gray-100 animate-pulse rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpis.map((kpi, i) => (
        <Link key={i} href={kpi.href}
          className="card p-4 hover:shadow-md transition-all hover:-translate-y-0.5 group">
          <div className="flex items-start gap-3">
            <div className={`${kpi.bg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <span className={kpi.text}>{kpi.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="text-xl font-bold text-gray-900 leading-none">{kpi.value}</div>
              <div className="text-xs text-gray-500 mt-1 leading-tight">{kpi.label}</div>
              {kpi.subLabel && <div className="text-[10px] text-gray-400">{kpi.subLabel}</div>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}