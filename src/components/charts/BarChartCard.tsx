'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_MIN_HEIGHT, CHART_PRIMARY } from '@/lib/chart-colors';
import { cn } from '@/lib/cn';

interface BarChartCardProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  dataKey: string;
  xKey: string;
  color?: string;
  className?: string;
  loading?: boolean;
}

export function BarChartCard({
  title,
  description,
  data,
  dataKey,
  xKey,
  color = CHART_PRIMARY,
  className,
  loading,
}: BarChartCardProps) {
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
            <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
