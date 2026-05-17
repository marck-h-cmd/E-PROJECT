'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface AulaData { codigo: string; horasOcupadas: number; capacidad: number; porcentaje: number; }

export default function GraficoOcupacionAulas({ periodoId }: { periodoId?: string }) {
  const [data, setData] = useState<AulaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ tipo: 'AULA', limit: '10' });
    if (periodoId) params.append('periodoId', periodoId);
    fetch(`/api/estadisticas/ocupacion-ambientes?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d.data?.items ?? d.data ?? [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [periodoId]);

  const chartData = data.slice(0, 10).map(d => ({
    name: d.codigo, porcentaje: d.porcentaje, horasOcupadas: d.horasOcupadas, capacidad: d.capacidad,
    fill: d.porcentaje >= 80 ? '#dc2626' : d.porcentaje >= 60 ? '#d97706' : '#2563eb',
  }));

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-gray-900">Ocupación de Aulas</h3>
        <p className="text-xs text-gray-500 mt-0.5">Top 10 · % horas ocupadas</p>
      </div>
      <div className="card-body pt-2">
        {loading ? (
          <div className="h-52 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-6 bg-gray-100 animate-pulse rounded" style={{ width: `${50+i*8}%` }} />
            ))}
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-gray-400 text-sm">Sin datos disponibles</div>
        ) : (
          <>
            <div className="flex gap-3 mb-2">
              {[['#2563eb','< 60%'],['#d97706','60-80%'],['#dc2626','> 80%']].map(([c,l]) => (
                <div key={l} className="flex items-center gap-1 text-[10px] text-gray-500">
                  <div className="w-2 h-2 rounded-full" style={{ background: c as string }} />{l}
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical" margin={{ top:0, right:30, left:10, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" domain={[0,100]} tick={{ fontSize:10, fill:'#6b7280' }} tickFormatter={v=>`${v}%`} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize:10, fill:'#6b7280' }} axisLine={false} tickLine={false} width={45} />
                <Tooltip content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow p-2 text-xs">
                      <p className="font-semibold">{label}</p>
                      <p>Ocupación: <b className="text-blue-600">{payload[0]?.value}%</b></p>
                      {d && <p className="text-gray-500">{d.horasOcupadas}h · cap. {d.capacidad}</p>}
                    </div>
                  );
                }} />
                <ReferenceLine x={80} stroke="#dc2626" strokeDasharray="3 3" strokeWidth={1} />
                <Bar 
  dataKey="horasAsignadas" 
  radius={[0,3,3,0]} 
  maxBarSize={14}
  label={{ position:'right' as const, fontSize:10, fill:'#6b7280', formatter:(v: any)=>`${v}h` }}
  fill="#2563eb"
/>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  );
}