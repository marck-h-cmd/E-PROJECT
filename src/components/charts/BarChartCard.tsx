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

  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const tickColor = '#94a3b8';

  const filteredData = data.filter(d => (d[dataKey] as number) > 0);

  return (
    <div className={cn('bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm', className)}>
      <div className="p-6">
        <h3 className="text-slate-900 dark:text-white font-semibold">{title}</h3>
        {description && <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{description}</p>}
      </div>
      <div className="p-6 pt-0" style={{ minHeight: CHART_MIN_HEIGHT }}>
        {loading ? (
          <div className="flex items-end gap-3 h-full min-h-[320px] px-4">
            <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-t-md w-full max-w-12" style={{ height: '40%' }}></div>
            <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-t-md w-full max-w-12" style={{ height: '70%' }}></div>
            <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-t-md w-full max-w-12" style={{ height: '55%' }}></div>
            <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-t-md w-full max-w-12" style={{ height: '30%' }}></div>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[320px] text-center">
            <svg className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Sin datos disponibles</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Los datos aparecerán cuando haya información registrada</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={CHART_MIN_HEIGHT}>
            <BarChart data={filteredData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: tickColor }} />
              <YAxis tick={{ fontSize: 11, fill: tickColor }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#334155' : '#0f172a',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: 12,
                }}
                labelStyle={{ color: '#ffffff', fontWeight: 600 }}
              />
              <Bar
                dataKey={dataKey}
                fill="url(#barGradient)"
                radius={[6, 6, 0, 0]}
                isAnimationActive={true}
                animationDuration={800}
                activeBar={{ fill: color, opacity: 1 }}
                onMouseEnter={(data, index) => {
                  const bars = document.querySelectorAll('.recharts-bar-rectangle');
                  bars.forEach((bar, i) => {
                    if (i !== index) {
                      (bar as HTMLElement).style.opacity = '0.6';
                    }
                  });
                }}
                onMouseLeave={() => {
                  const bars = document.querySelectorAll('.recharts-bar-rectangle');
                  bars.forEach((bar) => {
                    (bar as HTMLElement).style.opacity = '1';
                  });
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
