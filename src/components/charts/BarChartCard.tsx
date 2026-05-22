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
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDark } = useTheme();

  const gridColor  = isDark ? '#334155' : '#e2e8f0';
  const tickColor  = isDark ? '#94a3b8' : '#64748b';
  const barColor   = '#c9a84c';
  const tooltipBg  = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';
  const tooltipText   = isDark ? '#f1f5f9' : '#0f172a';

  const filteredData = data.filter(d => (d[dataKey] as number) > 0);

  return (
    <div className={cn('bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm', className)}>
      <div className="p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      <div className="p-6 pt-0" style={{ minHeight: CHART_MIN_HEIGHT }}>
        {loading ? (
          <div className="skeleton h-full min-h-[288px] w-full rounded-lg" />
        ) : filteredData.length === 0 ? (
          <div className="flex h-full min-h-[288px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Sin datos para mostrar
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={CHART_MIN_HEIGHT}>
            <BarChart data={filteredData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: tickColor }} />
              <YAxis tick={{ fontSize: 11, fill: tickColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  borderRadius: '8px',
                  color: tooltipText,
                  fontSize: 12,
                }}
                labelStyle={{ color: tooltipText, fontWeight: 600 }}
              />
              <Bar dataKey={dataKey} fill={barColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
