import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export function KpiCard({ title, value, subtitle, icon: Icon, trend, className }: KpiCardProps) {
  return (
    <div className={cn('card', className)}>
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-1 text-2xl font-bold text-unt-blue">{value}</p>
            {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
            {trend && (
              <p className="mt-2 text-xs text-gray-500">
                <span className={trend.value >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {trend.value >= 0 ? '+' : ''}
                  {trend.value}%
                </span>{' '}
                {trend.label}
              </p>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-unt-blue/10">
            <Icon className="h-6 w-6 text-unt-blue" />
          </div>
        </div>
      </div>
    </div>
  );
}
