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
import { ApiClientError } from '@/lib/api-client';
import { DEMO_USERS, DEMO_PASSWORD_HINT } from '@/lib/demo-users';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import type { DemoUser } from '@/lib/demo-users';

const ROLE_COLORS: Record<string, { dot: string; text: string; textDark: string }> = {
  'super-admin': { dot: '#a78bfa', text: '#6d28d9', textDark: '#c4b5fd' },
  'admin':       { dot: '#60a5fa', text: '#1d4ed8', textDark: '#93c5fd' },
  'operador':    { dot: '#fbbf24', text: '#b45309', textDark: '#fcd34d' },
  'docente':     { dot: '#34d399', text: '#065f46', textDark: '#6ee7b7' },
  'monitor':     { dot: '#f472b6', text: '#9d174d', textDark: '#f9a8d4' },
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
    <div className="flex min-h-screen">

      {/* ════════════════════════════════
          PANEL IZQUIERDO — siempre oscuro
      ════════════════════════════════ */}
      <div
        className="relative hidden lg:flex lg:flex-col lg:justify-between overflow-hidden"
        style={{ width: '52%', background: '#060d1a' }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(26,54,93,0.5) 0%, transparent 60%)' }} />

        <div className="absolute -bottom-24 -left-24 w-96 h-96 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 65%)' }} />

        <div className="absolute left-0 top-0 h-full w-px pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4) 35%, rgba(55,138,221,0.4) 70%, transparent)' }} />

        <div className="relative z-10 flex flex-col gap-10 p-12 xl:p-16 pt-14 xl:pt-16">

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <svg width="24" height="24" viewBox="0 0 22 22" fill="none">
                <rect x="1" y="1" width="9" height="9" rx="2" fill="#c9a84c"/>
                <rect x="12" y="1" width="9" height="9" rx="2" fill="rgba(255,255,255,0.35)"/>
                <rect x="1" y="12" width="9" height="9" rx="2" fill="rgba(255,255,255,0.35)"/>
                <rect x="12" y="12" width="9" height="9" rx="2" fill="#378add"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(201,168,76,0.65)', textTransform: 'uppercase', fontWeight: 500 }}>
                Universidad Nacional de Trujillo
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>
                Horarios Académicos
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2.5 rounded-full px-4 py-2"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: '#c9a84c' }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#c9a84c', letterSpacing: 1 }}>
              Período Académico 2026-I · Activo
            </span>
          </div>

          <div style={{ lineHeight: 1.05 }}>
            <h2 style={{ fontSize: 'clamp(3rem, 4.5vw, 5rem)', fontWeight: 800, color: '#ffffff', letterSpacing: -2, margin: 0 }}>
              Gestión
            </h2>
            <h2 style={{ fontSize: 'clamp(3rem, 4.5vw, 5rem)', fontWeight: 800, color: '#c9a84c', letterSpacing: -2, margin: 0 }}>
              inteligente
            </h2>
            <h2 style={{ fontSize: 'clamp(3rem, 4.5vw, 5rem)', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: -2, margin: 0 }}>
              de horarios.
            </h2>
          </div>

          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', maxWidth: 360 }}>
            Plataforma unificada para programación de clases, aulas,
            laboratorios y notificaciones · Facultad de Ingeniería de Sistemas.
          </p>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { n: '01', icon: CalendarDays, text: 'Calendario semanal con detección de conflictos automática' },
              { n: '02', icon: Shield,        text: 'Roles diferenciados: Admin, Operador, Docente y Monitor' },
              { n: '03', icon: GraduationCap, text: 'Reportes PDF, notificaciones multicanal y ventanas de atención' },
            ].map(({ n, icon: Icon, text }) => (
              <div key={n} className="flex items-center gap-5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 0' }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(201,168,76,0.3)', minWidth: 20 }}>
                  {n}
                </span>
                <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                <Icon style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-12 pb-10 xl:px-16">
          <div className="grid grid-cols-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, marginBottom: 20 }}>
            {[
              { n: '30',  l: 'Docentes' },
              { n: '82',  l: 'Cursos' },
              { n: '12',  l: 'Ambientes' },
              { n: '246', l: 'Grupos' },
            ].map((s, i) => (
              <div key={s.l} className="text-center"
                style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#c9a84c', letterSpacing: -0.5 }}>{s.n}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.14)', letterSpacing: 1 }}>
            © {new Date().getFullYear()} UNT · Sistema de demostración académica
          </p>
        </div>
      </div>

      {/* ════════════════════════════════
          PANEL DERECHO — formulario adaptable
      ════════════════════════════════ */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto px-8 py-10
        bg-slate-100 dark:bg-[#0a0f1a]">

        {/* Patrón de puntos solo light */}
        <div className="absolute inset-0 dark:hidden pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        {/* Patrón de puntos dark */}
        <div className="absolute inset-0 hidden dark:block pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        <div className="absolute right-6 top-6 z-10">
          <ThemeToggle variant="login" />
        </div>

        {/* Logo mobile */}
        <div className="mb-8 text-center lg:hidden">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: '#060d1a' }}>
            <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="9" height="9" rx="2" fill="#c9a84c"/>
              <rect x="12" y="1" width="9" height="9" rx="2" fill="rgba(255,255,255,0.4)"/>
              <rect x="1" y="12" width="9" height="9" rx="2" fill="rgba(255,255,255,0.4)"/>
              <rect x="12" y="12" width="9" height="9" rx="2" fill="#378add"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Iniciar sesión</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">UNT · Horarios Académicos</p>
        </div>

        {/* CARD adaptable */}
        <div className={`relative z-10 w-full transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ maxWidth: 480 }}>

          <div className="
            overflow-hidden rounded-[20px]
            bg-white dark:bg-[#0f172a]
            shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_4px_6px_rgba(0,0,0,0.04),0_20px_60px_rgba(0,0,0,0.1)]
            dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_rgba(0,0,0,0.5)]">

            {/* Barra de acento */}
            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c 30%, #378add 70%, transparent)' }} />

            <div className="p-9">

              {/* Header */}
              <div className="hidden lg:block mb-7">
                <h2 className="text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
                  Bienvenido de vuelta
                </h2>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                  Ingrese sus credenciales institucionales para continuar
                </p>
              </div>

              {/* ROLES */}
              <div className="mb-6">
                <div className="mb-3.5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                  <span className="text-[10px] font-semibold tracking-[2px] uppercase text-slate-400 dark:text-slate-500">
                    Acceso rápido
                  </span>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {DEMO_USERS.map((u) => {
                    const c = ROLE_COLORS[u.id] ?? ROLE_COLORS['admin'];
                    const sel = selectedDemo === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => fillDemo(u)}
                        className={`
                          rounded-xl px-3 py-2.5 text-left transition-all duration-150
                          border
                          ${sel
                            ? 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 scale-[1.02]'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                          }
                        `}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="block h-1.5 w-1.5 rounded-full shrink-0"
                            style={{ background: sel ? c.dot : '#cbd5e1' }} />
                          <span className="text-[12px] font-semibold"
                            style={{ color: sel ? (typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? c.textDark : c.text) : undefined }}>
                            <span className="block text-slate-700 dark:text-slate-200">
                              {u.label}
                            </span>
                          </span>
                        </div>
                        <span className="block truncate text-[10px] text-slate-400 dark:text-slate-500 pl-3">
                          {u.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-slate-500">
                  Contraseña de prueba:{' '}
                  <code className="rounded-md border px-1.5 py-0.5 font-mono text-[11px]
                    bg-slate-50 dark:bg-slate-800
                    border-slate-200 dark:border-slate-700
                    text-slate-600 dark:text-slate-300">
                    {DEMO_PASSWORD_HINT}
                  </code>
                </p>
              </div>

              {/* Separador */}
              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                <span className="text-[11px] tracking-wider uppercase text-slate-300 dark:text-slate-600">
                  o ingrese manualmente
                </span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl p-3.5
                  bg-red-50 dark:bg-red-950/30
                  border border-red-100 dark:border-red-900/40">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-400 m-0 leading-snug">{error}</p>
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email"
                    className="block mb-2 text-[12px] font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-400">
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@unitru.edu.pe"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setSelectedDemo(null); }}
                    required
                    autoComplete="email"
                    className="h-12 text-base
                      bg-slate-50 dark:bg-slate-900
                      border-slate-200 dark:border-slate-700
                      text-slate-900 dark:text-white
                      placeholder:text-slate-400 dark:placeholder:text-slate-600
                      focus-visible:ring-[#1a365d] dark:focus-visible:ring-blue-500
                      focus-visible:border-[#1a365d] dark:focus-visible:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="password"
                    className="block mb-2 text-[12px] font-semibold tracking-wide uppercase text-slate-600 dark:text-slate-400">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setSelectedDemo(null); }}
                      required
                      autoComplete="current-password"
                      className="h-12 text-base pr-12
                        bg-slate-50 dark:bg-slate-900
                        border-slate-200 dark:border-slate-700
                        text-slate-900 dark:text-white
                        focus-visible:ring-[#1a365d] dark:focus-visible:ring-blue-500
                        focus-visible:border-[#1a365d] dark:focus-visible:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5
                        text-slate-400 hover:text-slate-600
                        dark:text-slate-500 dark:hover:text-slate-300
                        hover:bg-slate-100 dark:hover:bg-slate-800
                        transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full gap-2 text-base font-semibold rounded-xl
                    bg-[#1a365d] hover:bg-[#1e4070]
                    dark:bg-blue-600 dark:hover:bg-blue-500
                    text-white shadow-lg shadow-[#1a365d]/20 dark:shadow-blue-600/20
                    transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      Ingresar al sistema
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Footer card */}
            <div className="px-9 pb-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-center text-[11px] text-slate-400 dark:text-slate-600">
                © {new Date().getFullYear()} Universidad Nacional de Trujillo · Ing. de Sistemas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}