'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CHART_COLORS, CHART_MIN_HEIGHT } from '@/lib/chart-colors';
import { cn } from '@/lib/cn';

interface PieChartCardProps {
  title: string;
  description?: string;
  data: { name: string; value: number }[];
  className?: string;
  loading?: boolean;
}

export function PieChartCard({ title, description, data, className, loading }: PieChartCardProps) {
  const palette = data.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  return (
    <div className={cn('card', className)}>
      <div className="card-header">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <div className="card-body" style={{ minHeight: CHART_MIN_HEIGHT }}>
        {loading ? (
          <div className="skeleton h-full min-h-[288px] w-full rounded-lg" />
        ) : data.length === 0 ? (
          <div className="flex h-full min-h-[288px] items-center justify-center text-sm text-slate-500">
            Sin datos para mostrar
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={CHART_MIN_HEIGHT}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                {data.map((_, i) => (
                  <Cell key={i} fill={palette[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
