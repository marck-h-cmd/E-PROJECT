import type { SelectHTMLAttributes } from 'react';
import { formControlClass } from '@/components/forms/FormField';
import { cn } from '@/lib/cn';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export function FormSelect({ hasError, className, children, ...props }: FormSelectProps) {
  return (
    <select className={cn(formControlClass(hasError), className)} {...props}>
      {children}
    </select>
  );
}
