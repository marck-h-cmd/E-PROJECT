'use client';

import { useCallback, useState } from 'react';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
  resolve?: (value: boolean) => void;
}

export function useConfirm() {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    message: '',
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        open: true,
        title: options.title || 'Confirmar acción',
        message: options.message,
        confirmLabel: options.confirmLabel || 'Confirmar',
        cancelLabel: options.cancelLabel || 'Cancelar',
        variant: options.variant || 'default',
        resolve,
      });
    });
  }, []);

  const handleClose = useCallback((result: boolean) => {
    state.resolve?.(result);
    setState((prev) => ({ ...prev, open: false, resolve: undefined }));
  }, [state.resolve]);

  return { confirm, state, handleClose };
}
