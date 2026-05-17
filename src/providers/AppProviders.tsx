'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { PeriodoProvider } from '@/contexts/PeriodoContext';
import { Toaster } from 'sonner';
import type { ReactNode } from 'react';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <PeriodoProvider>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </PeriodoProvider>
    </AuthProvider>
  );
}
