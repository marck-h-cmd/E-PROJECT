import { cn } from '@/lib/cn';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  className?: string;
}

export function TableSkeleton({ columns = 5, rows = 5, className }: TableSkeletonProps) {
  return (
    <div className={cn('table-container', className)}>
      <div className="animate-pulse space-y-3 p-4">
        <div className="h-8 bg-gray-200 rounded w-full" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="h-6 bg-gray-100 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

