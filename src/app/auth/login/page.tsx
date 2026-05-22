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

const ROLE_COLORS: Record<string, { dot: string }> = {
  'super-admin': { dot: '#a78bfa' },
  'admin':       { dot: '#60a5fa' },
  'operador':    { dot: '#fbbf24' },
  'docente':     { dot: '#34d399' },
  'monitor':     { dot: '#f472b6' },
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
    <div className="flex h-screen overflow-hidden">

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

        {/* Contenido top */}
        <div className="relative z-10 flex flex-col gap-6 p-10 xl:p-12 pt-12">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="1" y="1" width="9" height="9" rx="2" fill="#c9a84c"/>
                <rect x="12" y="1" width="9" height="9" rx="2" fill="rgba(255,255,255,0.35)"/>
                <rect x="1" y="12" width="9" height="9" rx="2" fill="rgba(255,255,255,0.35)"/>
                <rect x="12" y="12" width="9" height="9" rx="2" fill="#378add"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 10, letterSpacing: 2.5, color: 'rgba(201,168,76,0.65)', textTransform: 'uppercase', fontWeight: 500 }}>
                Universidad Nacional de Trujillo
              </p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', lineHeight: 1.3 }}>
                Horarios Académicos
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#c9a84c' }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: '#c9a84c', letterSpacing: 0.8 }}>
              Período Académico 2026-I · Activo
            </span>
          </div>

          <div style={{ lineHeight: 1 }}>
            <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)', fontWeight: 800, color: '#ffffff', letterSpacing: -2, margin: 0 }}>
              Gestión
            </h2>
            <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)', fontWeight: 800, color: '#c9a84c', letterSpacing: -2, margin: 0 }}>
              inteligente
            </h2>
            <h2 style={{ fontSize: 'clamp(2.5rem, 4vw, 4.5rem)', fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: -2, margin: 0 }}>
              de horarios.
            </h2>
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.4)', maxWidth: 360 }}>
            Plataforma unificada para programación de clases, aulas,
            laboratorios y notificaciones · Facultad de Ingeniería de Sistemas.
          </p>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { n: '01', icon: CalendarDays, text: 'Calendario semanal con detección de conflictos automática' },
              { n: '02', icon: Shield,        text: 'Roles diferenciados: Admin, Operador, Docente y Monitor' },
              { n: '03', icon: GraduationCap, text: 'Reportes PDF, notificaciones multicanal y ventanas de atención' },
            ].map(({ n, icon: Icon, text }) => (
              <div key={n} className="flex items-center gap-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
                <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(201,168,76,0.3)', minWidth: 18 }}>
                  {n}
                </span>
                <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                <Icon style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats + footer */}
        <div className="relative z-10 px-10 pb-8 xl:px-12">
          <div className="grid grid-cols-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18, marginBottom: 14 }}>
            {[
              { n: '30',  l: 'Docentes' },
              { n: '82',  l: 'Cursos' },
              { n: '12',  l: 'Ambientes' },
              { n: '246', l: 'Grupos' },
            ].map((s, i) => (
              <div key={s.l} className="text-center"
                style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#c9a84c', letterSpacing: -0.5 }}>{s.n}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.14)', letterSpacing: 0.8 }}>
            © {new Date().getFullYear()} UNT · Sistema de demostración académica
          </p>
        </div>
      </div>

      {/* ════════════════════════════════
          PANEL DERECHO — formulario compacto
      ════════════════════════════════ */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-6
        bg-slate-100 dark:bg-[#0a0f1a]">

        <div className="absolute inset-0 dark:hidden pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        <div className="absolute inset-0 hidden dark:block pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        <div className="absolute right-5 top-5 z-10">
          <ThemeToggle variant="login" />
        </div>

        {/* Logo mobile */}
        <div className="mb-4 text-center lg:hidden">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ background: '#060d1a' }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="9" height="9" rx="2" fill="#c9a84c"/>
              <rect x="12" y="1" width="9" height="9" rx="2" fill="rgba(255,255,255,0.4)"/>
              <rect x="1" y="12" width="9" height="9" rx="2" fill="rgba(255,255,255,0.4)"/>
              <rect x="12" y="12" width="9" height="9" rx="2" fill="#378add"/>
            </svg>
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">UNT · Horarios Académicos</h2>
        </div>

        {/* CARD COMPACTA */}
        <div className={`relative z-10 w-full transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ maxWidth: 440 }}>

          <div className="
            overflow-hidden rounded-2xl
            bg-white dark:bg-[#0f172a]
            shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_20px_50px_rgba(0,0,0,0.1)]
            dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.5)]">

            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c 30%, #378add 70%, transparent)' }} />

            <div className="px-7 py-6">

              {/* Header compacto */}
              <div className="hidden lg:block mb-4">
                <h2 className="text-[22px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Bienvenido de vuelta
                </h2>
                <p className="mt-1 text-[13px] text-slate-500 dark:text-slate-400">
                  Ingrese sus credenciales para continuar
                </p>
              </div>

              {/* ROLES */}
              <div className="mb-4">
                <div className="mb-2.5 flex items-center gap-2">
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                  <span className="text-[9px] font-semibold tracking-[2px] uppercase text-slate-400 dark:text-slate-500">
                    Acceso rápido
                  </span>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {DEMO_USERS.map((u) => {
                    const c = ROLE_COLORS[u.id] ?? ROLE_COLORS['admin'];
                    const sel = selectedDemo === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => fillDemo(u)}
                        className={`
                          rounded-lg px-2.5 py-2 text-left transition-all duration-150 border
                          ${sel
                            ? 'border-[#1a365d] dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.03]'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                          }
                        `}
                      >
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="block h-1.5 w-1.5 rounded-full shrink-0"
                            style={{ background: sel ? c.dot : '#cbd5e1' }} />
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {u.label}
                          </span>
                        </div>
                        <span className="block truncate text-[9px] text-slate-400 dark:text-slate-500 pl-3">
                          {u.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-2 text-center text-[10px] text-slate-400 dark:text-slate-500">
                  Contraseña de prueba:{' '}
                  <code className="rounded border px-1.5 py-0.5 font-mono text-[10px]
                    bg-slate-50 dark:bg-slate-800
                    border-slate-200 dark:border-slate-700
                    text-slate-600 dark:text-slate-300">
                    {DEMO_PASSWORD_HINT}
                  </code>
                </p>
              </div>

              {/* Separador */}
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                <span className="text-[9px] tracking-wider uppercase text-slate-300 dark:text-slate-600">
                  o ingrese manualmente
                </span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              </div>

              {error && (
                <div className="mb-3 flex items-start gap-2 rounded-lg p-2.5
                  bg-red-50 dark:bg-red-950/30
                  border border-red-100 dark:border-red-900/40">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                    <div className="h-1 w-1 rounded-full bg-red-500" />
                  </div>
                  <p className="text-[12px] text-red-700 dark:text-red-400 m-0 leading-snug">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label htmlFor="email"
                    className="block mb-1.5 text-[10px] font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-400">
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
                    className="h-10 text-sm
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
                    className="block mb-1.5 text-[10px] font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-400">
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
                      className="h-10 text-sm pr-10
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
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1
                        text-slate-400 hover:text-slate-600
                        dark:text-slate-500 dark:hover:text-slate-300
                        hover:bg-slate-100 dark:hover:bg-slate-800
                        transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-10 w-full gap-2 text-sm font-semibold rounded-lg mt-1
                    bg-[#1a365d] hover:bg-[#1e4070]
                    dark:bg-blue-600 dark:hover:bg-blue-500
                    text-white shadow-md shadow-[#1a365d]/20 dark:shadow-blue-600/20
                    transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      Ingresar al sistema
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-4 text-center text-[10px] text-slate-400 dark:text-slate-600 pt-3 border-t border-slate-100 dark:border-slate-800">
                © {new Date().getFullYear()} Universidad Nacional de Trujillo · Ing. de Sistemas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}