'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye, EyeOff, LogIn, Loader2,
  CalendarDays, Shield, GraduationCap, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiClientError } from '@/lib/api-client';
import { DEMO_USERS, DEMO_PASSWORD_HINT } from '@/lib/demo-users';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import type { DemoUser } from '@/lib/demo-users';

const ROLE_COLORS: Record<string, { dot: string; initials: string }> = {
  'super-admin': { dot: '#a78bfa', initials: 'SA' },
  'admin':       { dot: '#60a5fa', initials: 'AD' },
  'operador':    { dot: '#fbbf24', initials: 'OP' },
  'docente':     { dot: '#34d399', initials: 'DC' },
  'monitor':     { dot: '#f472b6', initials: 'MO' },
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
  const [capsLock, setCapsLock] = useState(false);

  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });
  const [highlightInputs, setHighlightInputs] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (user) {
      if (user.rol === 'DOCENTE') router.replace('/dashboard/docente');
      else router.replace('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    if (toast.visible) {
      const t = setTimeout(() => setToast({ visible: false, message: '' }), 2500);
      return () => clearTimeout(t);
    }
  }, [toast.visible]);

  useEffect(() => {
    if (highlightInputs) {
      const t = setTimeout(() => setHighlightInputs(false), 800);
      return () => clearTimeout(t);
    }
  }, [highlightInputs]);

  const fillDemo = (u: DemoUser) => {
    setEmail(u.email);
    setPassword(u.password);
    setSelectedDemo(u.id);
    setError('');
    setHighlightInputs(true);
    setToast({ visible: true, message: `Credenciales de ${u.label} cargadas` });
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

  const detectCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState && e.getModifierState('CapsLock'));
  };

  return (
    <div className="flex min-h-screen">

      {/* TOAST FLOTANTE */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toast.visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2.5 rounded-full px-4 py-2.5
          bg-white dark:bg-slate-800
          border border-emerald-200 dark:border-emerald-800
          shadow-lg shadow-emerald-500/10">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
            <CheckCircle2 className="h-3 w-3 text-white" strokeWidth={3} />
          </div>
          <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">
            {toast.message}
          </span>
        </div>
      </div>

      {/* ════════════════════════════════
          PANEL IZQUIERDO — siempre oscuro
      ════════════════════════════════ */}
      <div
        className="relative hidden lg:flex lg:flex-col lg:justify-between overflow-hidden"
        style={{ width: '50%', background: '#060d1a' }}
      >
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none animate-[float_8s_ease-in-out_infinite]"
          style={{ background: 'radial-gradient(circle, rgba(26,54,93,0.5) 0%, transparent 60%)' }} />

        <div className="absolute -bottom-24 -left-24 w-96 h-96 pointer-events-none animate-[float_10s_ease-in-out_infinite_reverse]"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 65%)' }} />

        <div className="absolute left-0 top-0 h-full w-px pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4) 35%, rgba(55,138,221,0.4) 70%, transparent)' }} />

        <div className="relative z-10 flex flex-col gap-8 p-12 xl:p-14 pt-14">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform hover:scale-105 cursor-default"
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
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: '#c9a84c' }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#c9a84c' }} />
            </span>
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
              <div key={n} className="group flex items-center gap-4 transition-all duration-200 hover:pl-2 cursor-default"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 0' }}>
                <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(201,168,76,0.3)', minWidth: 18 }}
                  className="transition-colors group-hover:text-[#c9a84c]">
                  {n}
                </span>
                <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                <Icon style={{ width: 14, height: 14, flexShrink: 0 }} className="transition-colors duration-200 text-white/20 group-hover:text-white/60" />
                <span style={{ fontSize: 13, lineHeight: 1.4 }} className="transition-colors duration-200 text-white/40 group-hover:text-white/70">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-12 pb-8 xl:px-14">
          <div className="grid grid-cols-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18, marginBottom: 14 }}>
            {[
              { n: '30',  l: 'Docentes' },
              { n: '82',  l: 'Cursos' },
              { n: '12',  l: 'Ambientes' },
              { n: '246', l: 'Grupos' },
            ].map((s, i) => (
              <div key={s.l} className="text-center group cursor-default"
                style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#c9a84c', letterSpacing: -0.5 }}
                  className="transition-transform duration-200 group-hover:scale-110 inline-block">
                  {s.n}
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-3">
            {['Soporte', 'Documentación', 'Privacidad'].map(link => (
              <button key={link}
                className="text-[10px] tracking-wide transition-colors hover:text-[#c9a84c]"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                {link}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.14)', letterSpacing: 0.8 }}>
            © {new Date().getFullYear()} UNT · Sistema de demostración académica
          </p>
        </div>
      </div>

      {/* ════════════════════════════════
          PANEL DERECHO — formulario
      ════════════════════════════════ */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-8 py-10
        bg-slate-100 dark:bg-[#0a0f1a]">

        <div className="absolute inset-0 dark:hidden pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        <div className="absolute inset-0 hidden dark:block pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        <div className="absolute right-6 top-6 z-10">
          <ThemeToggle variant="login" />
        </div>

        {/* Logo mobile */}
        <div className="mb-6 text-center lg:hidden">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: '#060d1a' }}>
            <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="9" height="9" rx="2" fill="#c9a84c"/>
              <rect x="12" y="1" width="9" height="9" rx="2" fill="rgba(255,255,255,0.4)"/>
              <rect x="1" y="12" width="9" height="9" rx="2" fill="rgba(255,255,255,0.4)"/>
              <rect x="12" y="12" width="9" height="9" rx="2" fill="#378add"/>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">UNT · Horarios Académicos</h2>
        </div>

        {/* CARD */}
        <div className={`relative z-10 w-full transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ maxWidth: 600 }}>

          <div className="
            overflow-hidden rounded-2xl
            bg-white dark:bg-[#0f172a]
            shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_25px_60px_rgba(0,0,0,0.12)]
            dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_25px_60px_rgba(0,0,0,0.5)]">

            <div className="px-10 py-9">

              {/* Header */}
              <div className="hidden lg:block mb-6">
                <h2 className="text-[28px] font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Bienvenido de vuelta
                </h2>
                <p className="mt-2 text-[14px] text-slate-500 dark:text-slate-400">
                  Ingrese sus credenciales institucionales para continuar
                </p>
              </div>

              {/* ROLES */}
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                  <span className="text-[10px] font-semibold tracking-[2px] uppercase text-slate-400 dark:text-slate-500">
                    Acceso rápido
                  </span>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {DEMO_USERS.map((u, idx) => {
                    const c = ROLE_COLORS[u.id] ?? ROLE_COLORS['admin'];
                    const sel = selectedDemo === u.id;
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => fillDemo(u)}
                        style={{ animationDelay: `${idx * 60}ms` }}
                        className={`
                          group rounded-xl px-3 py-2.5 text-left border
                          transition-all duration-200
                          animate-[slideUp_0.4s_ease-out_backwards]
                          ${sel
                            ? 'border-[#1a365d] dark:border-blue-500 bg-blue-50 dark:bg-blue-950/30 scale-[1.03] shadow-md'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:scale-[1.02] hover:-translate-y-0.5'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[9px] font-bold transition-all duration-200 group-hover:scale-110 group-hover:rotate-3"
                            style={{
                              background: sel ? c.dot : `${c.dot}25`,
                              color: sel ? '#ffffff' : c.dot,
                            }}
                          >
                            {c.initials}
                          </div>
                          <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                            {u.label}
                          </span>
                        </div>
                        <span className="block truncate text-[10px] text-slate-400 dark:text-slate-500 pl-8">
                          {u.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-slate-500">
                  Contraseña de prueba:{' '}
                  <code className="rounded border px-2 py-0.5 font-mono text-[11px]
                    bg-slate-50 dark:bg-slate-800
                    border-slate-200 dark:border-slate-700
                    text-slate-600 dark:text-slate-300
                    cursor-pointer transition-colors
                    hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => {
                      navigator.clipboard.writeText(DEMO_PASSWORD_HINT);
                      setToast({ visible: true, message: 'Contraseña copiada al portapapeles' });
                    }}
                    title="Click para copiar">
                    {DEMO_PASSWORD_HINT}
                  </code>
                </p>
              </div>

              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                <span className="text-[10px] tracking-wider uppercase text-slate-300 dark:text-slate-600">
                  o ingrese manualmente
                </span>
                <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-3 rounded-xl p-3
                  bg-red-50 dark:bg-red-950/30
                  border border-red-100 dark:border-red-900/40
                  animate-[shake_0.4s_ease-in-out]">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  </div>
                  <p className="text-[13px] text-red-700 dark:text-red-400 m-0 leading-snug">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email"
                    className="block mb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-400">
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
                    className={`h-12 text-[15px] px-4 transition-all duration-300
                      bg-slate-50 dark:bg-slate-900
                      border-slate-200 dark:border-slate-700
                      text-slate-900 dark:text-white
                      placeholder:text-slate-400 dark:placeholder:text-slate-600
                      focus-visible:ring-4 focus-visible:ring-[#1a365d]/20 dark:focus-visible:ring-blue-500/30
                      focus-visible:border-[#1a365d] dark:focus-visible:border-blue-500
                      ${highlightInputs ? 'ring-4 ring-emerald-200 dark:ring-emerald-900/40 border-emerald-300 dark:border-emerald-700' : ''}
                    `}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password"
                      className="text-[11px] font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-400">
                      Contraseña
                    </label>
                    {capsLock && (
                      <span className="text-[10px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1 animate-[fadeIn_0.2s_ease-out]">
                        <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                        Mayús activado
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setSelectedDemo(null); }}
                      onKeyUp={detectCapsLock}
                      onKeyDown={detectCapsLock}
                      required
                      autoComplete="current-password"
                      className={`h-12 text-[15px] px-4 pr-12 transition-all duration-300
                        bg-slate-50 dark:bg-slate-900
                        border-slate-200 dark:border-slate-700
                        text-slate-900 dark:text-white
                        focus-visible:ring-4 focus-visible:ring-[#1a365d]/20 dark:focus-visible:ring-blue-500/30
                        focus-visible:border-[#1a365d] dark:focus-visible:border-blue-500
                        ${highlightInputs ? 'ring-4 ring-emerald-200 dark:ring-emerald-900/40 border-emerald-300 dark:border-emerald-700' : ''}
                      `}
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
                        transition-all hover:scale-110"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="relative h-12 w-full gap-2 text-[15px] font-semibold rounded-xl mt-2
                    bg-[#1a365d] hover:bg-[#1e4070]
                    dark:bg-blue-600 dark:hover:bg-blue-500
                    text-white shadow-lg shadow-[#1a365d]/25 dark:shadow-blue-600/25
                    transition-all hover:shadow-xl hover:shadow-[#1a365d]/30 dark:hover:shadow-blue-600/30
                    active:scale-[0.98]
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg
                    overflow-hidden group"
                >
                  {/* Efecto shimmer al hover */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000
                    bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin relative z-10" />
                      <span className="relative z-10">Verificando credenciales...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5 relative z-10 transition-transform group-hover:translate-x-0.5" />
                      <span className="relative z-10">Ingresar al sistema</span>
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-600 pt-4 border-t border-slate-100 dark:border-slate-800">
                © {new Date().getFullYear()} Universidad Nacional de Trujillo · Ing. de Sistemas
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
      `}</style>
    </div>
  );
}