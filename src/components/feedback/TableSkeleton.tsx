import { cn } from '@/lib/cn';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export function TableSkeleton({ columns = 5, rows = 6, className }: TableSkeletonProps) {
  return (
    <div className={cn('table-container', className)} aria-busy="true" aria-label="Cargando tabla">
      <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="skeleton h-4 flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-100 p-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4 px-4 py-3 even:bg-slate-50/40">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="skeleton h-5 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
