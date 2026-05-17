'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DiaDato { dia: string; totalHoras: number; docentes: number; ambientes: number; }

const DIA_LABELS: Record<string,string> = {
  LUNES:'Lun', MARTES:'Mar', MIERCOLES:'Mié', JUEVES:'Jue', VIERNES:'Vie', SABADO:'Sáb',
};

export default function GraficoDistribucionDia({ periodoId }: { periodoId?: string }) {
  const [data, setData] = useState<DiaDato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = periodoId ? `?periodoId=${periodoId}` : '';
    fetch(`/api/estadisticas/distribucion-dia${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d.data ?? [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [periodoId]);

  const chartData = data.map(d => ({
    name: DIA_LABELS[d.dia] ?? d.dia,
    'Total Horas': d.totalHoras, 'Docentes': d.docentes, 'Ambientes': d.ambientes,
  }));

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-gray-900">Distribución por Día</h3>
        <p className="text-xs text-gray-500 mt-0.5">Carga académica semanal</p>
      </div>
      <div className="card-body pt-2">
        {loading ? (
          <div className="h-52 flex items-end gap-2 pb-4">
            {[60,80,95,70,85,40].map((h,i) => (
              <div key={i} className="flex-1 bg-gray-100 animate-pulse rounded-t" style={{ height:`${h}%` }} />
            ))}
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-gray-400 text-sm">Sin datos disponibles</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top:4, right:8, left:-20, bottom:0 }}>
              <defs>
                <linearGradient id="gradHoras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gradDocentes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize:11, fill:'#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="Total Horas" stroke="#2563eb" strokeWidth={2} fill="url(#gradHoras)" dot={{ fill:'#2563eb', r:3 }} />
              <Area type="monotone" dataKey="Docentes" stroke="#7c3aed" strokeWidth={2} fill="url(#gradDocentes)" dot={{ fill:'#7c3aed', r:3 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}