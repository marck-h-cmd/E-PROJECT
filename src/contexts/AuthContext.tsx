'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import type { Rol } from '@prisma/client';
import { PERMISOS, ROLES } from '@/lib/constantes';
import type { UserSession } from '@/lib/tipos';
import { apiPost, apiRequest } from '@/lib/api-client';

interface AuthContextValue {
  user: UserSession | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (...roles: Rol[]) => boolean;
  can: (permission: keyof typeof PERMISOS) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function persistSession(
  accessToken: string,
  refreshToken: string,
  user: UserSession
) {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
  document.cookie = `auth_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
}

function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  document.cookie = 'auth_token=; path=/; max-age=0';
}

function toUserSession(usuario: Record<string, unknown>): UserSession {
  return {
    id: String(usuario.id),
    email: String(usuario.email),
    nombre: String(usuario.nombre),
    apellidos: String(usuario.apellidos),
    rol: usuario.rol as UserSession['rol'],
    docenteId:
      typeof usuario.docenteId === 'string'
        ? usuario.docenteId
        : (usuario.docente as { id?: string } | null | undefined)?.id,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('accessToken');
      const raw = localStorage.getItem('user');
      if (token && raw) {
        const parsed = JSON.parse(raw) as Record<string, unknown>;
        setUser(toUserSession(parsed));
        document.cookie = `auth_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      }
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await apiRequest<{
        usuario: UserSession;
        tokens: { accessToken: string; refreshToken: string };
      }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        skipAuth: true,
      });

      if (!res.data) throw new Error('Respuesta inválida del servidor');

      const sessionUser = toUserSession(
        res.data.usuario as unknown as Record<string, unknown>
      );

      persistSession(
        res.data.tokens.accessToken,
        res.data.tokens.refreshToken,
        sessionUser
      );
      setUser(sessionUser);
      router.replace('/dashboard');
      router.refresh();
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await apiPost('/api/auth/logout');
    } catch {
      /* ignorar */
    }
    clearSession();
    setUser(null);
    router.push('/auth/login');
  }, [router]);

  const hasRole = useCallback(
    (...roles: Rol[]) => {
      if (!user) return false;
      return roles.includes(user.rol);
    },
    [user]
  );

  const can = useCallback(
    (permission: keyof typeof PERMISOS) => {
      if (!user || !PERMISOS) return false;
      const allowedRoles = PERMISOS[permission];
      if (!Array.isArray(allowedRoles)) return false;
      return (allowedRoles as readonly string[]).includes(user.rol);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      hasRole,
      can,
    }),
    [user, loading, login, logout, hasRole, can]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}

export function useRequireAuth(allowedRoles?: Rol[]) {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/auth/login');
      return;
    }
    if (allowedRoles && allowedRoles.length > 0 && !hasRole(...allowedRoles)) {
      router.replace('/auth/acceso-denegado');
    }
  }, [user, loading, allowedRoles, hasRole, router]);

  return { user, loading };
}

export { ROLES };
