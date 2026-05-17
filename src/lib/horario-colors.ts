export interface HorarioBlockStyle {
  bg: string;
  border: string;
  /** Código del curso (título del bloque) */
  title: string;
  /** Ambiente y horario (detalle) */
  subtitle: string;
  dot: string;
}

/** Fondos claros + texto oscuro para contraste WCAG AA en bloques del calendario */
const BLOCK_STYLES: HorarioBlockStyle[] = [
  {
    bg: 'bg-blue-50',
    border: 'border-unt-blue',
    title: 'text-unt-blue',
    subtitle: 'text-slate-700',
    dot: 'bg-unt-blue',
  },
  {
    bg: 'bg-amber-50',
    border: 'border-amber-500',
    title: 'text-amber-900',
    subtitle: 'text-slate-700',
    dot: 'bg-unt-gold',
  },
  {
    bg: 'bg-slate-100',
    border: 'border-slate-500',
    title: 'text-slate-900',
    subtitle: 'text-slate-600',
    dot: 'bg-slate-600',
  },
  {
    bg: 'bg-red-50',
    border: 'border-red-400',
    title: 'text-red-900',
    subtitle: 'text-red-800',
    dot: 'bg-unt-red',
  },
  {
    bg: 'bg-sky-50',
    border: 'border-sky-500',
    title: 'text-sky-900',
    subtitle: 'text-sky-800',
    dot: 'bg-sky-600',
  },
  {
    bg: 'bg-emerald-50',
    border: 'border-emerald-500',
    title: 'text-emerald-900',
    subtitle: 'text-emerald-800',
    dot: 'bg-emerald-600',
  },
];

export const DIA_HEADER_CLASS: Record<string, string> = {
  LUNES: 'bg-unt-blue text-white',
  MARTES: 'bg-[#2c5282] text-white',
  MIERCOLES: 'bg-unt-gold text-unt-blue',
  JUEVES: 'bg-slate-600 text-white',
  VIERNES: 'bg-unt-red text-white',
};

export function colorForCourseKey(key: string): HorarioBlockStyle {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash + key.charCodeAt(i) * (i + 1)) % BLOCK_STYLES.length;
  }
  return BLOCK_STYLES[hash]!;
}
