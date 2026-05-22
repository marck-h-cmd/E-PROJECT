'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, CalendarDays, Shield, GraduationCap,
  LogIn, Loader2, Sparkles,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiClientError } from '@/lib/api-client';
import { DEMO_USERS, DEMO_PASSWORD_HINT } from '@/lib/demo-users';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
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

  useEffect(() => {
    if (user) {
      if (user.rol === 'DOCENTE') {
        router.replace('/dashboard/docente');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [user, router]);

  const fillDemo = (u: DemoUser) => {
    setEmail(u.email);
    setPassword(u.password);
    setSelectedDemo(u.id);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
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

      {/* ── Panel izquierdo institucional ── */}
      <div className="relative hidden w-[42%] lg:flex lg:flex-col lg:justify-between overflow-hidden bg-[#0d1f35] dark:bg-[#080f1a]">

        {/* Grid de puntos decorativo */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.8) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Glows de color mejorados */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #1a365d 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #c9a84c 0%, transparent 70%)' }} />

        {/* Contenido superior */}
        <div className="relative z-10 flex flex-col gap-10 p-10 xl:p-14">

          {/* Logo mejorado */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-white/20 shadow-lg"
              style={{ background: 'rgba(201,168,76,0.12)' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="1" y="1" width="10" height="10" rx="2.5" fill="#c9a84c"/>
                <rect x="13" y="1" width="10" height="10" rx="2.5" fill="rgba(255,255,255,0.55)"/>
                <rect x="1" y="13" width="10" height="10" rx="2.5" fill="rgba(255,255,255,0.55)"/>
                <rect x="13" y="13" width="10" height="10" rx="2.5" fill="#378add"/>
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[2px] uppercase text-[#c9a84c]/80">
                Universidad Nacional de Trujillo
              </p>
              <h1 className="text-base font-semibold text-white leading-tight tracking-tight">
                Horarios Académicos
              </h1>
            </div>
          </div>

          {/* Hero */}
          <div className="space-y-5">
            <div>
              <h2 className="text-3xl xl:text-4xl font-semibold text-white leading-tight tracking-tighter">
                Gestión inteligente
              </h2>
              <h2 className="text-3xl xl:text-4xl font-semibold leading-tight tracking-tighter" style={{ color: '#c9a84c' }}>
                de horarios 2026
              </h2>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Programación de clases, aulas, laboratorios y notificaciones
              para la Facultad de Ingeniería.
            </p>
          </div>

          {/* Features con iconos mejorados */}
          <ul className="space-y-4">
            {[
              { icon: CalendarDays, text: 'Calendario semanal y detección de conflictos' },
              { icon: Shield, text: 'Roles: Admin, Operador, Docente y Monitor' },
              { icon: GraduationCap, text: 'Reportes PDF y notificaciones multicanal' },
            ].map(({ icon: Icon, text }, index) => (
              <li key={index} className="group flex items-center gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl 
                  bg-gradient-to-br from-[#378add]/10 to-transparent 
                  border border-[#378add]/25 shadow-sm transition-all duration-200 
                  group-hover:from-[#378add]/15 group-hover:border-[#378add]/40 group-hover:shadow-md">
                  <Icon className="h-4 w-4 text-[#7fb3e8] transition-all duration-200 
                    group-hover:text-[#a8d0f5] group-hover:scale-110" />
                </div>
                <span className="text-sm tracking-tight" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stats + footer */}
        <div className="relative z-10 p-10 xl:p-14 space-y-6">
          <div className="flex items-center gap-0"
            style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)', paddingTop: '20px' }}>
            {[
              { n: '30', l: 'Docentes' },
              { n: '82', l: 'Cursos' },
              { n: '12', l: 'Ambientes' },
              { n: '2026-I', l: 'Período' },
            ].map((s, i) => (
              <div key={s.l} className="flex-1 text-center"
                style={{ borderRight: i < 3 ? '0.5px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div className="text-lg font-semibold tracking-tight" style={{ color: '#c9a84c' }}>{s.n}</div>
                <div className="text-[10px] tracking-wide" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.l}</div>
              </div>
            ))}
          </div>
          <p className="text-xs tracking-wide" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} UNT — Sistema de demostración académica
          </p>
        </div>
      </div>

      {/* ── Panel derecho — formulario ── */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-6 sm:p-10
        bg-white dark:bg-[#111827]">

        {/* Toggle de tema */}
        <div className="absolute right-5 top-5">
          <ThemeToggle variant="login" />
        </div>

        {/* Logo mobile */}
        <div className="mb-6 text-center lg:hidden">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a365d]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="1" width="10" height="10" rx="2.5" fill="#c9a84c"/>
              <rect x="13" y="1" width="10" height="10" rx="2.5" fill="rgba(255,255,255,0.6)"/>
              <rect x="1" y="13" width="10" height="10" rx="2.5" fill="rgba(255,255,255,0.6)"/>
              <rect x="13" y="13" width="10" height="10" rx="2.5" fill="#378add"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[#1a365d] dark:text-white">
            Iniciar sesión
          </h2>
        </div>

        <div className="w-full max-w-md">

          {/* Card formulario */}
          <div className="rounded-2xl p-7 sm:p-8
            bg-white dark:bg-[#1f2937]
            border border-gray-100 dark:border-gray-700
            shadow-xl shadow-gray-100/80 dark:shadow-black/30">

            {/* Header */}
            <div className="mb-6 hidden lg:block">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                Bienvenido
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Ingrese sus credenciales institucionales
              </p>
            </div>

            {/* Acceso rápido */}
            <div className="mb-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700" />
                <span className="flex items-center gap-1.5 text-[11px] font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500">
                  <Sparkles className="h-3 w-3 text-[#c9a84c]" />
                  Acceso rápido (demo)
                </span>
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-700" />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => fillDemo(u)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-xs transition-all duration-150 active:scale-[0.985] ${
                      selectedDemo === u.id
                        ? 'border-[#1a365d] bg-blue-50 dark:border-blue-500 dark:bg-[#1e3a5f] scale-[1.02]'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className={`block font-semibold tracking-tight ${
                      selectedDemo === u.id
                        ? 'text-[#1a365d] dark:text-blue-300'
                        : 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {u.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[10px] text-gray-400 dark:text-gray-500">
                      {u.description}
                    </span>
                  </button>
                ))}
              </div>

              <p className="mt-2.5 text-center text-[11px] text-gray-400 dark:text-gray-500">
                Contraseña de prueba:{' '}
                <code className="rounded bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 font-mono text-gray-600 dark:text-gray-300 text-[11px]">
                  {DEMO_PASSWORD_HINT}
                </code>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@unitru.edu.pe"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setSelectedDemo(null); }}
                  required
                  autoComplete="email"
                  className="mt-1.5 h-11 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus-visible:ring-[#1a365d] dark:focus-visible:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setSelectedDemo(null); }}
                    required
                    autoComplete="current-password"
                    className="h-11 border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white pr-11 focus-visible:ring-[#1a365d] dark:focus-visible:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4" aria-hidden />
                      : <Eye className="h-4 w-4" aria-hidden />
                    }
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full gap-2 bg-[#1a365d] text-white hover:bg-[#254d84] dark:bg-blue-600 dark:hover:bg-blue-700 font-semibold tracking-tight"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Ingresando...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" aria-hidden />
                    Ingresar al sistema
                  </>
                )}
              </Button>
            </form>
          </div>

          <p className="mt-4 text-center text-[11px] text-gray-300 dark:text-gray-600">
            © {new Date().getFullYear()} UNT — Sistema de demostración académica
          </p>
        </div>
      </div>
    </div>
  );
}