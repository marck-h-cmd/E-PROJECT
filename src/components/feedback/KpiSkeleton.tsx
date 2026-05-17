import { cn } from '@/lib/cn';

interface KpiSkeletonProps {
  count?: number;
  className?: string;
}

export function KpiSkeleton({ count = 4, className }: KpiSkeletonProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <div className="card-body">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-8 w-16" />
                <div className="skeleton h-3 w-32" />
              </div>
              <div className="skeleton h-12 w-12 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
