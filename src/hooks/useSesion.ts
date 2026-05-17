import { useCallback } from 'react';
import { apiPost } from '@/lib/api-client';
import { useAuth } from './useAuth';

export function useSesion() {
  const { logout } = useAuth();

  const cerrarSesion = useCallback(async () => {
    try {
      await apiPost('/api/auth/logout');
    } finally {
      logout();
    }
  }, [logout]);

  return { cerrarSesion };
}