'use client';

interface Validacion {
  tipo: 'ERROR' | 'ADVERTENCIA' | 'OK';
  mensaje: string;
}

interface Props {
  validaciones: Validacion[];
  loading?: boolean;
}

export default function PanelValidaciones({ validaciones, loading = false }: Props) {
  const errores   = validaciones.filter(v => v.tipo === 'ERROR');
  const advertencias = validaciones.filter(v => v.tipo === 'ADVERTENCIA');
  const oks       = validaciones.filter(v => v.tipo === 'OK');

  if (loading) {
    return (
      <div className="card card-body space-y-2">
        <div className="h-4 bg-gray-100 animate-pulse rounded w-1/3" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-100 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (validaciones.length === 0) {
    return (
      <div className="card card-body">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Selecciona una celda para ver validaciones
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Validaciones</h3>
        <div className="flex gap-2">
          {errores.length > 0 && <span className="badge-red">{errores.length} error{errores.length > 1 ? 'es' : ''}</span>}
          {advertencias.length > 0 && <span className="badge-yellow">{advertencias.length} advertencia{advertencias.length > 1 ? 's' : ''}</span>}
          {errores.length === 0 && advertencias.length === 0 && <span className="badge-green">Sin conflictos</span>}
        </div>
      </div>
      <div className="card-body space-y-2">
        {errores.map((v, i) => (
          <div key={i} className="flex items-start gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
            <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <p className="text-xs text-red-700">{v.mensaje}</p>
          </div>
        ))}
        {advertencias.map((v, i) => (
          <div key={i} className="flex items-start gap-2 p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
            <svg className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <p className="text-xs text-yellow-700">{v.mensaje}</p>
          </div>
        ))}
        {oks.map((v, i) => (
          <div key={i} className="flex items-start gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg">
            <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            <p className="text-xs text-green-700">{v.mensaje}</p>
          </div>
        ))}
      </div>
    </div>
  );
}