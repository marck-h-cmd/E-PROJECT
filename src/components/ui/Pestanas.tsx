'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utilidades';

const Pestanas = TabsPrimitive.Root;

type PestanasListaElement = React.ElementRef<typeof TabsPrimitive.List>;
type PestanasListaProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

const PestanasLista = React.forwardRef<PestanasListaElement, PestanasListaProps>(
  function PestanasLista(props, ref) {
    const { className, ...rest } = props;
    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500',
          className
        )}
        {...rest}
      />
    );
  }
);
PestanasLista.displayName = TabsPrimitive.List.displayName;

type PestanasActivadorElement = React.ElementRef<typeof TabsPrimitive.Trigger>;
type PestanasActivadorProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;

const PestanasActivador = React.forwardRef<PestanasActivadorElement, PestanasActivadorProps>(
  function PestanasActivador(props, ref) {
    const { className, ...rest } = props;
    return (
      <TabsPrimitive.Trigger
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm',
          className
        )}
        {...rest}
      />
    );
  }
);
PestanasActivador.displayName = TabsPrimitive.Trigger.displayName;

type PestanasContenidoElement = React.ElementRef<typeof TabsPrimitive.Content>;
type PestanasContenidoProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

const PestanasContenido = React.forwardRef<PestanasContenidoElement, PestanasContenidoProps>(
  function PestanasContenido(props, ref) {
    const { className, ...rest } = props;
    return (
      <TabsPrimitive.Content
        ref={ref}
        className={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...rest}
      />
    );
  }
);
PestanasContenido.displayName = TabsPrimitive.Content.displayName;

export { Pestanas, PestanasLista, PestanasActivador, PestanasContenido };