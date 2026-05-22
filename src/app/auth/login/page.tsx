'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, LogIn, Loader2,
  CalendarDays, Shield, GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiClientError } from '@/lib/api-client';
import { DEMO_USERS, DEMO_PASSWORD_HINT } from '@/lib/demo-users';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import type { DemoUser } from '@/lib/demo-users';

const ROLE_COLORS: Record<string, { dot: string; bg: string; border: string; text: string }> = {
  'super-admin': { dot: '#a78bfa', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', text: '#a78bfa' },
  'admin':       { dot: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)',  text: '#60a5fa' },
  'operador':    { dot: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.2)',  text: '#fbbf24' },
  'docente':     { dot: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.2)',  text: '#34d399' },
  'monitor':     { dot: '#f472b6', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)', text: '#f472b6' },
};

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (user) {
      if (user.rol === 'DOCENTE') router.replace('/dashboard/docente');
      else router.replace('/dashboard');
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
    <div className="flex min-h-screen bg-white dark:bg-[#0a0f1a]">

      {/* ══════════════════════════════════════
          PANEL IZQUIERDO — siempre oscuro
      ══════════════════════════════════════ */}
      <div
        className="relative hidden w-[46%] lg:flex lg:flex-col lg:justify-between overflow-hidden"
        style={{ background: '#060d1a' }}
      >
        {/* Grilla de líneas estilo Vercel */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }} />

        {/* Círculo decorativo grande */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(26,54,93,0.6) 0%, transparent 65%)' }} />

        {/* Punto de luz dorado */}
        <div className="absolute -bottom-20 -left-20 w-72 h-72"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 65%)' }} />

        {/* Línea de acento izquierda */}
        <div className="absolute left-0 top-0 h-full w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.3) 40%, rgba(55,138,221,0.3) 70%, transparent)' }} />

        {/* CONTENIDO SUPERIOR */}
        <div className="relative z-10 flex flex-col gap-12 p-12 xl:p-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="1" y="1" width="9" height="9" rx="2" fill="#c9a84c"/>
                <rect x="12" y="1" width="9" height="9" rx="2" fill="rgba(255,255,255,0.35)"/>
                <rect x="1" y="12" width="9" height="9" rx="2" fill="rgba(255,255,255,0.35)"/>
                <rect x="12" y="12" width="9" height="9" rx="2" fill="#378add"/>
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[3px] uppercase"
                style={{ color: 'rgba(201,168,76,0.7)' }}>
                Universidad Nacional de Trujillo
              </p>
              <p className="text-sm font-semibold text-white/90 leading-tight">
                Horarios Académicos
              </p>
            </div>
          </div>

          {/* Hero principal */}
          <div className="space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.18)' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
              <span className="text-[11px] font-medium tracking-wider" style={{ color: '#c9a84c' }}>
                Período Académico 2026-I · Activo
              </span>
            </div>

            {/* Título tipográfico grande */}
            <div>
              <h2 className="text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                Gestión
              </h2>
              <h2 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight"
                style={{ color: '#c9a84c' }}>
                inteligente
              </h2>
              <h2 className="text-5xl xl:text-6xl font-bold text-white/60 leading-[1.05] tracking-tight">
                de horarios.
              </h2>
            </div>

            <p className="text-sm leading-relaxed max-w-sm"
              style={{ color: 'rgba(255,255,255,0.38)' }}>
              Plataforma unificada para programación de clases, aulas,
              laboratorios y notificaciones · Facultad de Ingeniería.
            </p>
          </div>

          {/* Features estilo editorial con números */}
          <div className="space-y-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {[
              { n: '01', icon: CalendarDays, text: 'Calendario semanal con detección de conflictos automática' },
              { n: '02', icon: Shield,       text: 'Roles diferenciados: Admin, Operador, Docente y Monitor' },
              { n: '03', icon: GraduationCap, text: 'Reportes PDF, notificaciones multicanal y ventanas de atención' },
            ].map(({ n, icon: Icon, text }) => (
              <div key={n} className="group flex items-center gap-5 py-4 cursor-default"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-[11px] font-mono font-bold shrink-0 transition-colors duration-200 group-hover:text-[#c9a84c]"
                  style={{ color: 'rgba(201,168,76,0.3)' }}>
                  {n}
                </span>
                <div className="h-4 w-px shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />
                <Icon className="h-4 w-4 shrink-0 transition-colors duration-200 group-hover:text-[#7fb3e8]"
                  style={{ color: 'rgba(255,255,255,0.2)' }} />
                <span className="text-sm leading-snug transition-colors duration-200 group-hover:text-white/70"
                  style={{ color: 'rgba(255,255,255,0.38)' }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* STATS + FOOTER */}
        <div className="relative z-10 px-12 pb-10 xl:px-16 space-y-5">
          <div className="grid grid-cols-4 py-5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { n: '30', l: 'Docentes' },
              { n: '82', l: 'Cursos' },
              { n: '12', l: 'Ambientes' },
              { n: '246', l: 'Grupos' },
            ].map((s, i) => (
              <div key={s.l} className="text-center"
                style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div className="text-xl font-bold tracking-tight" style={{ color: '#c9a84c' }}>
                  {s.n}
                </div>
                <div className="text-[10px] mt-0.5 tracking-wider uppercase"
                  style={{ color: 'rgba(255,255,255,0.22)' }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] tracking-wider" style={{ color: 'rgba(255,255,255,0.14)' }}>
            © {new Date().getFullYear()} UNT · Sistema de demostración académica
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PANEL DERECHO — formulario
      ══════════════════════════════════════ */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-12
        bg-[#f8fafc] dark:bg-[#0a0f1a]">

        {/* Patrón de fondo sutil en light mode */}
        <div className="absolute inset-0 dark:hidden" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* Toggle tema */}
        <div className="absolute right-5 top-5 z-10">
          <ThemeToggle variant="login" />
        </div>

        {/* Logo mobile */}
        <div className="mb-8 text-center lg:hidden">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#060d1a]">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="9" height="9" rx="2" fill="#c9a84c"/>
              <rect x="12" y="1" width="9" height="9" rx="2" fill="rgba(255,255,255,0.4)"/>
              <rect x="1" y="12" width="9" height="9" rx="2" fill="rgba(255,255,255,0.4)"/>
              <rect x="12" y="12" width="9" height="9" rx="2" fill="#378add"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Iniciar sesión</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">UNT · Horarios Académicos</p>
        </div>

        <div className={`relative z-10 w-full max-w-[420px] transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          {/* CARD PRINCIPAL */}
          <div className="rounded-2xl overflow-hidden
            bg-white dark:bg-[#0f172a]
            shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_8px_40px_rgba(0,0,0,0.08)]
            dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_8px_40px_rgba(0,0,0,0.4)]">

            {/* Barra de acento superior */}
            <div className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, #c9a84c 30%, #378add 70%, transparent)' }} />

            <div className="p-7 sm:p-8">

              {/* Header */}
              <div className="mb-7 hidden lg:block">
                <h2 className="text-[22px] font-bold text-gray-900 dark:text-white tracking-tight">
                  Bienvenido de vuelta
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Ingrese sus credenciales institucionales para continuar
                </p>
              </div>

              {/* ACCESO RÁPIDO */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.06)' }} />
                  <span className="text-[10px] font-semibold tracking-[2px] uppercase text-gray-400 dark:text-gray-600">
                    Acceso rápido
                  </span>
                  <div className="h-px flex-1" style={{ background: 'rgba(0,0,0,0.06)' }} />
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {DEMO_USERS.map((u) => {
                    const color = ROLE_COLORS[u.id] ?? ROLE_COLORS['admin'];
                    const isSelected = selectedDemo === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => fillDemo(u)}
                        className="group relative rounded-xl px-3 py-2.5 text-left text-xs
                          transition-all duration-150 active:scale-[0.97]
                          hover:scale-[1.02]"
                        style={{
                          background: isSelected ? color.bg : 'transparent',
                          border: `1px solid ${isSelected ? color.border : 'rgba(0,0,0,0.08)'}`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="h-1.5 w-1.5 rounded-full shrink-0 transition-all duration-150"
                            style={{ background: isSelected ? color.dot : 'rgba(0,0,0,0.2)' }} />
                          <span className="font-semibold text-[11px] transition-colors duration-150"
                            style={{ color: isSelected ? color.text : 'var(--tw-prose-body, #374151)' }}
                            >
                            {u.label}
                          </span>
                        </div>
                        <span className="block truncate text-[10px] text-gray-400 dark:text-gray-500 pl-3.5">
                          {u.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 text-center text-[10px] text-gray-400 dark:text-gray-600">
                  Contraseña de prueba:{' '}
                  <code className="rounded-md px-1.5 py-0.5 font-mono text-[10px]
                    bg-gray-100 dark:bg-gray-800
                    text-gray-600 dark:text-gray-400
                    border border-gray-200 dark:border-gray-700">
                    {DEMO_PASSWORD_HINT}
                  </code>
                </p>
              </div>

              {/* SEPARADOR */}
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
                <span className="text-[10px] text-gray-300 dark:text-gray-700 tracking-wider uppercase">
                  o ingrese manualmente
                </span>
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800" />
              </div>

              {/* ERROR */}
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl p-3.5
                  bg-red-50 dark:bg-red-950/30
                  border border-red-100 dark:border-red-900/40">
                  <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-red-500/20 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* FORMULARIO */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email"
                    className="text-[12px] font-semibold tracking-wide text-gray-600 dark:text-gray-400 uppercase">
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
                    className="mt-1.5 h-11
                      bg-gray-50 dark:bg-gray-900
                      border-gray-200 dark:border-gray-800
                      text-gray-900 dark:text-white
                      placeholder:text-gray-300 dark:placeholder:text-gray-700
                      focus-visible:ring-[#1a365d] dark:focus-visible:ring-blue-500
                      focus-visible:border-[#1a365d] dark:focus-visible:border-blue-500
                      transition-all duration-150"
                  />
                </div>

                <div>
                  <Label htmlFor="password"
                    className="text-[12px] font-semibold tracking-wide text-gray-600 dark:text-gray-400 uppercase">
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
                      className="h-11 pr-11
                        bg-gray-50 dark:bg-gray-900
                        border-gray-200 dark:border-gray-800
                        text-gray-900 dark:text-white
                        focus-visible:ring-[#1a365d] dark:focus-visible:ring-blue-500
                        focus-visible:border-[#1a365d] dark:focus-visible:border-blue-500
                        transition-all duration-150"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2
                        text-gray-400 dark:text-gray-600
                        hover:text-gray-600 dark:hover:text-gray-400
                        hover:bg-gray-100 dark:hover:bg-gray-800
                        transition-all duration-150"
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

                {/* BOTÓN PRINCIPAL */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="relative h-11 w-full gap-2 font-semibold tracking-tight
                    overflow-hidden transition-all duration-150
                    active:scale-[0.99]
                    bg-[#1a365d] hover:bg-[#1e4070]
                    dark:bg-blue-600 dark:hover:bg-blue-500
                    text-white shadow-md
                    shadow-[#1a365d]/20 dark:shadow-blue-600/20"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Verificando credenciales...
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

            {/* Footer de la card */}
            <div className="px-7 sm:px-8 pb-5 -mt-1">
              <p className="text-center text-[10px] text-gray-300 dark:text-gray-700">
                © {new Date().getFullYear()} Universidad Nacional de Trujillo
                · Ing. de Sistemas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}