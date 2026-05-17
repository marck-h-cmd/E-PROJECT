'use client';

import * as React from 'react';
import { Toaster as Sonner, toast } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function NotificacionToast({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-gray-500',
          actionButton:
            'group-[.toast]:bg-primary-600 group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-900',
        },
      }}
      {...props}
    />
  );
}

NotificacionToast.exito = (mensaje: string) => toast.success(mensaje);
NotificacionToast.error = (mensaje: string) => toast.error(mensaje);
NotificacionToast.info = (mensaje: string) => toast.info(mensaje);
NotificacionToast.advertencia = (mensaje: string) => toast.warning(mensaje);