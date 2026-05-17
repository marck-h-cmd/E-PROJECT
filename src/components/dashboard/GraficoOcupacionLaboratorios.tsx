'use client';

import { useEffect, useState } from 'react';
import { RadialBarChart, RadialBar, Tooltip, ResponsiveContainer } from 'recharts';

interface LabData { codigo: string; nombre: string; capacidad: number; horasOcupadas: number; porcentaje: number; }

const COLORS = ['#2563eb','#7c3aed','#059669','#d97706','#dc2626','#0891b2'];

export default function GraficoOcupacionLaboratorios({ periodoId }: { periodoId?: string }) {
  const [data, setData] = useState<LabData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ tipo: 'LABORATORIO', limit: '6' });
    if (periodoId) params.append('periodoId', periodoId);
    fetch(`/api/estadisticas/ocupacion-ambientes?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d.data?.items ?? d.data ?? [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [periodoId]);

  const chartData = data.map((d, i) => ({
    name: d.codigo, fullName: d.nombre, value: d.porcentaje,
    horasOcupadas: d.horasOcupadas, capacidad: d.capacidad, fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-gray-900">Ocupación de Laboratorios</h3>
        <p className="text-xs text-gray-500 mt-0.5">% de uso por laboratorio</p>
      </div>
      <div className="card-body pt-2">
        {loading ? (
          <div className="h-52 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-8 border-gray-100 animate-pulse" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-gray-400 text-sm">Sin laboratorios</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart cx="50%" cy="50%" innerRadius={20} outerRadius={80}
                data={chartData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#f3f4f6' }} />
                <Tooltip content={({ active, payload }: any) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow p-2 text-xs">
                      <p className="font-semibold">{d.fullName}</p>
                      <p>Ocupación: <b>{d.value}%</b></p>
                      <p className="text-gray-500">{d.horasOcupadas}h ocupadas</p>
                    </div>
                  );
                }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-1">
              {chartData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.fill }} />
                  <span className="text-xs text-gray-600 flex-1 truncate">{d.name}</span>
                  <div className="w-16 bg-gray-100 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${d.value}%`, background: d.fill }} />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{d.value}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}