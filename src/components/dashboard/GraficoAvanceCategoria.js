'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

interface CategoriaData {
  categoria: string;
  total: number;
  asignados: number;
  porcentaje: number;
}

const COLORS: Record<string, string> = {
  PRINCIPAL_TC: '#1d4ed8', PRINCIPAL_TP: '#2563eb',
  ASOCIADO_TC: '#7c3aed',  ASOCIADO_TP: '#8b5cf6',
  AUXILIAR_TC: '#059669',  AUXILIAR_TP: '#10b981',
  CONTRATADO: '#d97706',
};
const LABELS: Record<string, string> = {
  PRINCIPAL_TC: 'Ppal. TC', PRINCIPAL_TP: 'Ppal. TP',
  ASOCIADO_TC: 'Asoc. TC', ASOCIADO_TP: 'Asoc. TP',
  AUXILIAR_TC: 'Aux. TC',  AUXILIAR_TP: 'Aux. TP',
  CONTRATADO: 'Contrat.',
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-gray-800 mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
          <span className="text-gray-600">{p.name}:</span>
          <span className="font-medium text-gray-900">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function GraficoAvanceCategoria({ periodoId }: { periodoId?: string }) {
  const [data, setData] = useState<CategoriaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = periodoId ? `?periodoId=${periodoId}` : '';
    fetch(`/api/estadisticas/avance-categoria${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d.data ?? [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [periodoId]);

  const chartData = data.map(d => ({
    name: LABELS[d.categoria] ?? d.categoria,
    Asignados: d.asignados,
    Total: d.total,
    fill: COLORS[d.categoria] ?? '#6b7280',
  }));

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Avance por Categoría</h3>
          <p className="text-xs text-gray-500 mt-0.5">Docentes con horario asignado</p>
        </div>
        {!loading && (
          <span className="badge-blue">
            {data.reduce((a, d) => a + d.asignados, 0)} / {data.reduce((a, d) => a + d.total, 0)}
          </span>
        )}
      </div>
      <div className="card-body pt-2">
        {loading ? (
          <div className="h-52 flex items-end gap-2 pb-4">
            {[60,80,95,70,85,40,55].map((h, i) => (
              <div key={i} className="flex-1 bg-gray-100 animate-pulse rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-gray-400 text-sm">Sin datos para este período</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Total" fill="#e5e7eb" radius={[3,3,0,0]} maxBarSize={28} />
              <Bar dataKey="Asignados" radius={[3,3,0,0]} maxBarSize={28}>
                {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}