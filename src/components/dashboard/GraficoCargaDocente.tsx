'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CargaData { nombre: string; categoria: string; horasAsignadas: number; horasMaximas: number; porcentaje: number; }

export default function GraficoCargaDocente({ periodoId }: { periodoId?: string }) {
  const [data, setData] = useState<CargaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ limit: String(limit) });
    if (periodoId) params.append('periodoId', periodoId);
    fetch(`/api/estadisticas/carga-docente?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d.data ?? [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [periodoId, limit]);

  const chartData = data.map(d => ({
    name: d.nombre.split(' ')[0] + ' ' + (d.nombre.split(' ').slice(-1)[0] ?? ''),
    horasAsignadas: d.horasAsignadas, horasMaximas: d.horasMaximas,
    porcentaje: d.porcentaje, categoria: d.categoria,
    fill: d.porcentaje > 100 ? '#dc2626' : d.porcentaje >= 80 ? '#d97706' : '#2563eb',
  }));

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Carga Docente</h3>
          <p className="text-xs text-gray-500 mt-0.5">Horas asignadas</p>
        </div>
        <select value={limit} onChange={e => setLimit(Number(e.target.value))}
          className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600">
          <option value={10}>Top 10</option>
          <option value={20}>Top 20</option>
          <option value={50}>Todos</option>
        </select>
      </div>
      <div className="card-body pt-2">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-5 bg-gray-100 animate-pulse rounded" style={{ width:`${40+i*8}%` }} />
            ))}
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-gray-400 text-sm">Sin datos disponibles</div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 28)}>
            <BarChart data={chartData} layout="vertical" margin={{ top:0, right:40, left:60, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize:10, fill:'#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize:10, fill:'#6b7280' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip content={({ active, payload, label }: any) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload;
                return (
                  <div className="bg-white border border-gray-200 rounded-lg shadow p-2 text-xs">
                    <p className="font-semibold">{label}</p>
                    {d && <>
                      <p className="text-gray-500 text-[10px]">{d.categoria?.replace(/_/g,' ')}</p>
                      <p>Asignadas: <b className="text-blue-700">{d.horasAsignadas}h</b></p>
                      <p>Máximas: <b>{d.horasMaximas}h</b></p>
                    </>}
                  </div>
                );
              }} />
              <Bar dataKey="horasAsignadas" radius={[0,3,3,0]} maxBarSize={14}
              label={{ position:'right', fontSize:10, fill:'#6b7280', formatter:(v: unknown)=>`${v}h` }}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}