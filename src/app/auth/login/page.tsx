'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  CalendarDays,
  Shield,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiClientError } from '@/lib/api-client';
import { DEMO_USERS, DEMO_PASSWORD_HINT } from '@/lib/demo-users';
import type { DemoUser } from '@/lib/demo-users';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirección automática si ya está autenticado
  useEffect(() => {
    if (user) {
      if (user.rol === 'DOCENTE') {
        router.replace('/dashboard/docente');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, router]);

  const fillDemo = (user: DemoUser) => {
    setEmail(user.email);
    setPassword(user.password);
    setSelectedDemo(user.id);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // La redirección ahora es manejada por el AuthContext.login,
      // pero agregamos una capa extra de seguridad aquí por si acaso.
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : 'Error de conexión. Verifique que el servidor esté funcionando.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel institucional */}
      <div className="relative hidden w-[44%] overflow-hidden bg-unt-blue lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,215,0,0.18),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.15)_0%,transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex flex-col gap-8 p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/25 backdrop-blur-sm">
              <span className="font-display text-xl font-bold text-unt-gold">UNT</span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-unt-gold/90">
                Universidad Nacional de Trujillo
              </p>
              <h1 className="font-display text-lg font-bold text-white">
                Horarios Académicos
              </h1>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold leading-tight text-white xl:text-4xl">
              Gestión inteligente
              <br />
              <span className="text-unt-gold">de horarios 2026</span>
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-blue-100/90">
              Programación de clases, aulas, laboratorios y notificaciones en una
              plataforma unificada para la Facultad de Ingeniería.
            </p>
          </div>

          <ul className="space-y-3 text-sm text-blue-50/90">
            <li className="flex items-center gap-3">
              <CalendarDays className="h-5 w-5 shrink-0 text-unt-gold" />
              Calendario semanal y detección de conflictos
            </li>
            <li className="flex items-center gap-3">
              <Shield className="h-5 w-5 shrink-0 text-unt-gold" />
              Roles: Admin, Operador, Docente y Monitor
            </li>
            <li className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 shrink-0 text-unt-gold" />
              Reportes PDF y notificaciones multicanal
            </li>
          </ul>
        </div>

        <p className="relative z-10 p-10 text-xs text-blue-200/70 xl:p-14">
          © {new Date().getFullYear()} UNT — Sistema de demostración académica
        </p>
      </div>

      {/* Formulario */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/80 p-4 sm:p-8">
        <div className="w-full max-w-lg animate-fadeIn">
          <div className="mb-6 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-unt-blue shadow-lg">
              <span className="font-display text-lg font-bold text-unt-gold">UNT</span>
            </div>
            <h2 className="font-display text-xl font-bold text-unt-blue">
              Iniciar sesión
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-xl shadow-slate-200/50 backdrop-blur-sm sm:p-8">
            <div className="mb-6 hidden lg:block">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Bienvenido
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Ingrese sus credenciales institucionales
              </p>
            </div>

            {/* Acceso rápido por rol */}
            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Sparkles className="h-3.5 w-3.5 text-unt-gold" />
                Acceso rápido (demostración)
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {DEMO_USERS.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => fillDemo(user)}
                    className={`rounded-xl border-2 px-3 py-2.5 text-left text-xs transition-all duration-200 ${
                      selectedDemo === user.id
                        ? `${user.accentClass} ring-2 ring-offset-1 ring-unt-blue/30 scale-[1.02]`
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <span className="block font-semibold">{user.label}</span>
                    <span className="mt-0.5 block truncate text-[10px] opacity-80">
                      {user.description}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-center text-[11px] text-slate-400">
                Contraseña de prueba:{' '}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-slate-600">
                  {DEMO_PASSWORD_HINT}
                </code>
              </p>
            </div>

            {error ? (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@unitru.edu.pe"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSelectedDemo(null);
                  }}
                  required
                  autoComplete="email"
                  className="mt-1.5 h-11 border-slate-200 focus-visible:ring-unt-blue"
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setSelectedDemo(null);
                    }}
                    required
                    autoComplete="current-password"
                    className="h-11 border-slate-200 pr-11 focus-visible:ring-unt-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-unt-blue"
                    aria-label={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="h-11 w-full bg-unt-blue text-base font-semibold shadow-md shadow-unt-blue/25 hover:bg-primary-700"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión…' : 'Ingresar al sistema'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
