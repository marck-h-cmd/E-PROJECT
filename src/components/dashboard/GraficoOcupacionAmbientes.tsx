'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface OcupacionData { tipo: string; total: number; ocupados: number; porcentaje: number; }

const COLORS = ['#2563eb','#7c3aed','#059669','#d97706','#dc2626','#0891b2'];
const TIPO_LABELS: Record<string,string> = { AULA:'Aulas', LABORATORIO:'Labs', AUDITORIO:'Auditorios', SALA:'Salas' };

export default function GraficoOcupacionAmbientes({ periodoId }: { periodoId?: string }) {
  const [data, setData] = useState<OcupacionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = periodoId ? `?periodoId=${periodoId}` : '';
    fetch(`/api/estadisticas/ocupacion-ambientes${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setData(d.data ?? [])).catch(() => setData([])).finally(() => setLoading(false));
  }, [periodoId]);

  const chartData = data.map((d, i) => ({
    name: TIPO_LABELS[d.tipo] ?? d.tipo,
    value: d.ocupados, total: d.total, porcentaje: d.porcentaje,
    fill: COLORS[i % COLORS.length],
  }));

  const totalOcupados = data.reduce((a, d) => a + d.ocupados, 0);
  const totalAmbientes = data.reduce((a, d) => a + d.total, 0);

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Ocupación de Ambientes</h3>
          <p className="text-xs text-gray-500 mt-0.5">Por tipo de ambiente</p>
        </div>
        {!loading && (
          <span className="badge-green">
            {totalAmbientes > 0 ? Math.round((totalOcupados / totalAmbientes) * 100) : 0}% ocupado
          </span>
        )}
      </div>
      <div className="card-body pt-2">
        {loading ? (
          <div className="h-52 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gray-100 animate-pulse" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-gray-400 text-sm">Sin datos disponibles</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} strokeWidth={0} />)}
                </Pie>
                <Tooltip content={({ active, payload }: any) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow p-2 text-xs">
                      <p className="font-semibold">{d.name}</p>
                      <p className="text-gray-600">Ocupados: <b>{d.value} / {d.total}</b></p>
                      <p className="text-gray-600">Porcentaje: <b>{d.porcentaje}%</b></p>
                    </div>
                  );
                }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {chartData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.fill }} />
                  <span className="text-gray-600 truncate">{d.name}</span>
                  <span className="text-gray-400 ml-auto">{d.porcentaje}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}