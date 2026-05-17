'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { cn } from '@/lib/cn';

const COLORS = ['#1a365d', '#c9a84c', '#2563eb', '#c41e3a', '#4a5568', '#10b981'];

interface PieChartCardProps {
  title: string;
  description?: string;
  data: { name: string; value: number }[];
  className?: string;
}

export function PieChartCard({ title, description, data, className }: PieChartCardProps) {
  return (
    <div className={cn('card', className)}>
      <div className="card-header">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="card-body h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
