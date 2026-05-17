'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { TableSkeleton } from '@/components/feedback/TableSkeleton';
import { EmptyState } from '@/components/feedback/EmptyState';

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  keyExtractor: (row: T) => string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  loading,
  emptyTitle = 'Sin registros',
  emptyDescription,
  emptyAction,
  keyExtractor,
  className,
}: DataTableProps<T>) {
  if (loading) return <TableSkeleton columns={columns.length} />;

  if (data.length === 0) {
    return (
      <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
    );
  }

  return (
    <div className={cn('table-container', className)}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={keyExtractor(row)} className="group">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    col.className,
                    col.key === 'actions' && 'text-right'
                  )}
                >
                  {col.key === 'actions' ? (
                    <div className="table-actions">{col.cell(row)}</div>
                  ) : (
                    col.cell(row)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
