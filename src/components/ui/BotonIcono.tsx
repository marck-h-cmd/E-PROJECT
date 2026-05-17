import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { Boton, type BotonProps } from './Boton';
import { cn } from '@/lib/utilidades';

interface BotonIconoProps extends Omit<BotonProps, 'children'> {
  icono: LucideIcon;
  label?: string;
}

export const BotonIcono = React.forwardRef<HTMLButtonElement, BotonIconoProps>(
  ({ icono: Icono, label, className, ...props }, ref) => {
    return (
      <Boton
        ref={ref}
        size="icon"
        className={cn('shrink-0', className)}
        aria-label={label}
        {...props}
      >
        <Icono className="h-4 w-4" />
      </Boton>
    );
  }
);
BotonIcono.displayName = 'BotonIcono';