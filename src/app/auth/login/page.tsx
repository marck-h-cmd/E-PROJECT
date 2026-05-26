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
import { DEMO_USERS } from '@/lib/demo-users';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import type { DemoUser } from '@/lib/demo-users';

const ROLE_COLORS: Record<string, { dot: string; initials: string }> = {
  'super':    { dot: '#a78bfa', initials: 'SA' },
  'admin':    { dot: '#3b82f6', initials: 'AD' },
  'operador': { dot: '#f59e0b', initials: 'OP' },
  'docente':  { dot: '#10b981', initials: 'DC' },
  'monitor':  { dot: '#ec4899', initials: 'MO' },
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
    <div className="flex min-h-screen lg:h-screen lg:overflow-hidden select-none w-full">

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
        className="relative hidden lg:flex lg:flex-col lg:justify-between overflow-hidden lg:h-full"
        style={{ width: '50%', background: '#020617' }}
      >
        {/* Malla de red tecnológica / Grid moderno */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 75%)'
        }} />

        {/* Orbes de luz brillante difuminados */}
        <div className="absolute -top-40 -right-40 w-[650px] h-[650px] rounded-full pointer-events-none opacity-40 blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgba(55,138,221,0.5) 0%, rgba(15,45,85,0) 70%)' }} />

        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30 blur-[110px]"
          style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, rgba(15,45,85,0) 70%)' }} />

        <div className="absolute left-0 top-0 h-full w-px pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.3) 35%, rgba(55,138,221,0.3) 70%, transparent)' }} />

        <div className="relative z-10 flex flex-col gap-5 p-10 xl:p-12 pt-10">

          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all hover:scale-105 cursor-default shadow-lg shadow-[#c9a84c]/5"
              style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.05) 100%)', border: '1px solid rgba(201,168,76,0.3)' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="1" y="1" width="9" height="9" rx="2" fill="#c9a84c"/>
                <rect x="12" y="1" width="9" height="9" rx="2" fill="rgba(255,255,255,0.4)"/>
                <rect x="1" y="12" width="9" height="9" rx="2" fill="rgba(255,255,255,0.2)"/>
                <rect x="12" y="12" width="9" height="9" rx="2" fill="#378add"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '3px', color: '#c9a84c', textTransform: 'uppercase', fontWeight: 700 }}>
                UNT · Ingeniería de Sistemas
              </p>
              <p style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.5px', marginTop: '1px' }}>
                Sistema de Gestión de Horarios Académicos
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1"
            style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: '#c9a84c' }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: '#c9a84c' }} />
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: '#c9a84c', letterSpacing: 0.8 }}>
              Período Académico 2026-I · Activo
            </span>
          </div>

          <div style={{ lineHeight: 1.15 }} className="select-none">
            <h2 style={{ fontSize: 'clamp(1.8rem, 2.6vw, 3.2rem)', fontWeight: 800, color: '#ffffff', letterSpacing: -1.5, margin: 0 }}>
              Gestión
            </h2>
            <h2 style={{ fontSize: 'clamp(1.8rem, 2.6vw, 3.2rem)', fontWeight: 800, color: '#c9a84c', letterSpacing: -1.5, margin: 0 }}
              className="bg-gradient-to-r from-[#c9a84c] to-[#e4c975] bg-clip-text text-transparent">
              inteligente
            </h2>
            <h2 style={{ fontSize: 'clamp(1.8rem, 2.6vw, 3.2rem)', fontWeight: 800, color: 'rgba(255,255,255,0.9)', letterSpacing: -1.5, margin: 0 }}>
              de horarios académicos.
            </h2>
          </div>

          <p style={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,0.45)', maxWidth: 430 }}>
            Plataforma institucional unificada para la programación y optimización de clases, distribución de aulas, laboratorios y atención docente en Ingeniería de Sistemas.
          </p>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="mt-1">
            {[
              { n: '01', icon: CalendarDays, text: 'Calendario semanal interactivo y libre de conflictos' },
              { n: '02', icon: Shield,        text: 'Accesos seguros para Directores, Docentes y Alumnos' },
              { n: '03', icon: GraduationCap, text: 'Reportes oficiales, notificaciones y control de colas' },
            ].map(({ n, icon: Icon, text }) => (
              <div key={n} className="group flex items-center gap-4 transition-all duration-300 hover:pl-2 cursor-default"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '11px 0' }}>
                <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'rgba(201,168,76,0.3)', minWidth: 18 }}
                  className="transition-colors group-hover:text-[#c9a84c]">
                  {n}
                </span>
                <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                <Icon style={{ width: 14, height: 14, flexShrink: 0 }} className="transition-colors duration-300 text-white/20 group-hover:text-white/80" />
                <span style={{ fontSize: 12.5, lineHeight: 1.4 }} className="transition-colors duration-300 text-white/40 group-hover:text-white/80">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 px-10 pb-6 xl:px-12">
          <div className="grid grid-cols-4 rounded-2xl p-4 backdrop-blur-md mb-4"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.02)'
            }}>
            {[
              { n: '30',  l: 'Docentes' },
              { n: '82',  l: 'Cursos' },
              { n: '12',  l: 'Ambientes' },
              { n: '246', l: 'Grupos' },
            ].map((s, i) => (
              <div key={s.l} className="text-center group cursor-default"
                style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#c9a84c', letterSpacing: -0.5 }}
                  className="transition-transform duration-300 group-hover:scale-110 inline-block bg-gradient-to-b from-[#e4c975] to-[#c9a84c] bg-clip-text text-transparent">
                  {s.n}
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 3, fontWeight: 650 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-3">
            {['Soporte', 'Documentación', 'Privacidad'].map(link => (
              <button key={link}
                className="text-[11px] tracking-wide transition-colors hover:text-[#c9a84c]"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                {link}
              </button>
            ))}
          </div>

          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: 0.8 }}>
            © {new Date().getFullYear()} UNT · Escuela de Ingeniería de Sistemas
          </p>
        </div>
      </div>

      {/* ════════════════════════════════
          PANEL DERECHO — formulario
      ════════════════════════════════ */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-6 lg:py-0
        bg-slate-50 dark:bg-[#030712] transition-colors duration-300 lg:h-full lg:overflow-y-auto">

        {/* Ambient background glows for Light Mode */}
        <div className="absolute inset-0 dark:hidden pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(55,138,221,0.04) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(201,168,76,0.02) 0%, transparent 50%)',
        }} />

        {/* Grid pattern for Light Mode */}
        <div className="absolute inset-0 dark:hidden pointer-events-none opacity-[0.3]" style={{
          backgroundImage: 'radial-gradient(rgba(15,23,42,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* Ambient background glows for Dark Mode */}
        <div className="absolute inset-0 hidden dark:block pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(55,138,221,0.08) 0%, transparent 40%), radial-gradient(circle at 0% 100%, rgba(201,168,76,0.05) 0%, transparent 45%)',
        }} />

        {/* Grid pattern for Dark Mode */}
        <div className="absolute inset-0 hidden dark:block pointer-events-none opacity-[0.2]" style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        <div className="absolute right-6 top-6 z-10">
          <ThemeToggle variant="login" />
        </div>

        {/* Logo mobile */}
        <div className="mb-6 text-center lg:hidden animate-[fadeIn_0.5s_ease-out]">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl shadow-md border border-slate-200/50 dark:border-slate-800"
            style={{ background: 'linear-gradient(135deg, #091326 0%, #030712 100%)' }}>
            <svg width="26" height="26" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="9" height="9" rx="2" fill="#c9a84c"/>
              <rect x="12" y="1" width="9" height="9" rx="2" fill="rgba(255,255,255,0.45)"/>
              <rect x="1" y="12" width="9" height="9" rx="2" fill="rgba(255,255,255,0.2)"/>
              <rect x="12" y="12" width="9" height="9" rx="2" fill="#378add"/>
            </svg>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            UNT · Ingeniería de Sistemas
          </h2>
          <p className="text-xs font-semibold text-[#c9a84c] tracking-[1.5px] uppercase mt-1">
            Gestión de Horarios Académicos
          </p>
        </div>

        {/* CARD */}
        <div className={`relative z-10 w-full transition-all duration-500 max-w-[540px] lg:max-w-[620px] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          <div className="
            overflow-hidden rounded-2xl
            bg-white/95 dark:bg-[#0b1329]/80
            border border-slate-200/60 dark:border-slate-800/80
            backdrop-blur-xl
            shadow-[0_20px_50px_rgba(0,0,0,0.05)]
            dark:shadow-[0_25px_60px_rgba(0,0,0,0.45)]">

            <div className="px-8 py-7 sm:px-10 sm:py-8">

              {/* Header */}
              <div className="hidden lg:block mb-4">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                  Acceso al Sistema
                </h2>
                <p className="mt-1 text-[12.5px] text-slate-500 dark:text-slate-400">
                  Ingrese sus credenciales de Ingeniería de Sistemas para continuar
                </p>
              </div>

              {/* ROLES */}
              <div className="mb-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200/60 dark:bg-slate-800/80" />
                  <span className="text-[10px] font-bold tracking-[2px] uppercase text-slate-400 dark:text-slate-500">
                    Acceso rápido por rol
                  </span>
                  <div className="h-px flex-1 bg-slate-200/60 dark:bg-slate-800/80" />
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-2.5">
                  {DEMO_USERS.map((u, idx) => {
                    const c = ROLE_COLORS[u.id] ?? ROLE_COLORS['admin'];
                    const sel = selectedDemo === u.id;
                    const colSpan = idx < 3
                      ? 'col-span-1 lg:col-span-2'
                      : idx === 3
                        ? 'col-span-1 lg:col-span-3'
                        : 'col-span-2 lg:col-span-3';
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => fillDemo(u)}
                        style={{ animationDelay: `${idx * 30}ms` }}
                        className={`
                          group relative rounded-xl p-2.5 text-left border
                          transition-all duration-300
                          animate-[slideUp_0.4s_ease-out_backwards]
                          flex gap-2 items-center
                          ${colSpan}
                          ${sel
                            ? 'border-[#c9a84c] dark:border-[#c9a84c] bg-[#c9a84c]/5 dark:bg-[#c9a84c]/10 shadow-[0_4px_15px_rgba(201,168,76,0.12)] scale-[1.01]'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-350 dark:hover:border-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-900/80 hover:scale-[1.01]'
                          }
                        `}
                      >
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold transition-all duration-300"
                          style={{
                            background: sel ? '#c9a84c' : `${c.dot}20`,
                            color: sel ? '#ffffff' : c.dot,
                            border: sel ? '1px solid #c9a84c' : `1px solid ${c.dot}30`,
                            boxShadow: sel ? '0 0 8px rgba(201,168,76,0.4)' : 'none'
                          }}
                        >
                          {c.initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 truncate leading-none">
                            {u.label}
                          </span>
                          <span className="block truncate text-[9.5px] text-slate-400 dark:text-slate-500 mt-1 leading-none">
                            {u.description}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Banner de demostración institucional en reemplazo de contraseña en texto plano */}
                <div className="mt-3.5 flex items-center justify-center gap-2 px-3 py-2 rounded-xl
                  bg-slate-50 dark:bg-slate-900/50
                  border border-slate-100 dark:border-slate-800/80
                  text-[11px] text-slate-500 dark:text-slate-400">
                  <Shield className="h-3.5 w-3.5 text-[#c9a84c] shrink-0" />
                  <span className="leading-tight">
                    Entorno institucional de pruebas. Las credenciales se autocompletan de manera segura al seleccionar un rol.
                  </span>
                </div>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200/60 dark:bg-slate-800/80" />
                <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                  O ingrese manualmente
                </span>
                <div className="h-px flex-1 bg-slate-200/60 dark:bg-slate-800/80" />
              </div>

              {error && (
                <div className="mb-3.5 flex items-start gap-3 rounded-xl p-3
                  bg-red-50 dark:bg-red-950/30
                  border border-red-100 dark:border-red-900/40
                  animate-[shake_0.4s_ease-in-out]">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  </div>
                  <p className="text-[13px] text-red-700 dark:text-red-400 m-0 leading-snug">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div>
                  <label htmlFor="email"
                    className="block mb-1 text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
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
                    className={`h-10 text-[14px] px-4 transition-all duration-300
                      bg-slate-50 dark:bg-slate-900/60
                      border-slate-200 dark:border-slate-800
                      text-slate-900 dark:text-slate-100
                      placeholder:text-slate-400 dark:placeholder:text-slate-650
                      focus-visible:ring-4 focus-visible:ring-[#0f2d55]/10 dark:focus-visible:ring-blue-500/20
                      focus-visible:border-[#0f2d55] dark:focus-visible:border-blue-500
                      ${highlightInputs ? 'ring-4 ring-emerald-500/10 border-emerald-500/50' : ''}
                    `}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password"
                      className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                      Contraseña
                    </label>
                    {capsLock && (
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-500 flex items-center gap-1.5 animate-[fadeIn_0.2s_ease-out]">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Bloq Mayús activado
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
                      className={`h-10 text-[14px] px-4 pr-12 transition-all duration-300
                        bg-slate-50 dark:bg-slate-900/60
                        border-slate-200 dark:border-slate-800
                        text-slate-900 dark:text-slate-100
                        focus-visible:ring-4 focus-visible:ring-[#0f2d55]/10 dark:focus-visible:ring-blue-500/20
                        focus-visible:border-[#0f2d55] dark:focus-visible:border-blue-500
                        ${highlightInputs ? 'ring-4 ring-emerald-500/10 border-emerald-500/50' : ''}
                      `}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                      aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5
                        text-slate-400 hover:text-slate-650
                        dark:text-slate-500 dark:hover:text-slate-350
                        hover:bg-slate-100 dark:hover:bg-slate-800/80
                        transition-all hover:scale-105"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="relative h-11 w-full gap-2 text-[14px] font-bold rounded-xl mt-2
                    bg-[#0f2d55] hover:bg-[#153e74]
                    dark:bg-[#c9a84c] dark:hover:bg-[#d9b95c]
                    text-white dark:text-[#091326]
                    shadow-[0_4px_16px_rgba(15,45,85,0.2)] dark:shadow-[0_4px_16px_rgba(201,168,76,0.15)]
                    transition-all hover:shadow-[0_6px_20px_rgba(15,45,85,0.25)] dark:hover:shadow-[0_6px_20px_rgba(201,168,76,0.25)]
                    hover:scale-[1.01] active:scale-[0.98]
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg
                    overflow-hidden group"
                >
                  {/* Hover shining light effect */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000
                    bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin relative z-10" />
                      <span className="relative z-10">Validando acceso...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4.5 w-4.5 relative z-10 transition-transform group-hover:translate-x-0.5" />
                      <span className="relative z-10">Ingresar al sistema</span>
                    </>
                  )}
                </Button>
              </form>

              <p className="mt-5 text-center text-[10.5px] text-slate-400 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                © {new Date().getFullYear()} Universidad Nacional de Trujillo · Departamento de Sistemas
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
      `}</style>
    </div>
  );
}