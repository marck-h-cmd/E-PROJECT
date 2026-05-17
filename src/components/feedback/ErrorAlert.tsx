import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ErrorAlertProps {
  message: string;
  className?: string;
  onRetry?: () => void;
}

export function ErrorAlert({ message, className, onRetry }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800',
        className
      )}
    >
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p>{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 font-medium underline hover:no-underline"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}
