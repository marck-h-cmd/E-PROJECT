'use client';

interface Sugerencia {
  dia: string;
  hora: string;
  ambienteCodigo: string;
  ambienteNombre: string;
  score: number;
  motivo: string;
}

interface Props {
  sugerencias: Sugerencia[];
  loading?: boolean;
  onSeleccionar: (dia: string, hora: string, ambienteId: string) => void;
}

const DIA_LABELS: Record<string, string> = {
  LUNES:'Lun', MARTES:'Mar', MIERCOLES:'Mié', JUEVES:'Jue', VIERNES:'Vie', SABADO:'Sáb',
};

export default function PanelSugerencias({ sugerencias, loading = false, onSeleccionar }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-gray-900">Sugerencias del Sistema</h3>
        <p className="text-xs text-gray-500 mt-0.5">Franjas horarias recomendadas</p>
      </div>
      <div className="card-body space-y-2">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 animate-pulse rounded-lg" />
          ))
        ) : sugerencias.length === 0 ? (
          <div className="text-center py-4 text-gray-400 text-xs">
            No hay sugerencias disponibles
          </div>
        ) : (
          sugerencias.slice(0, 5).map((s, i) => (
            <button
              key={i}
              onClick={() => onSeleccionar(s.dia, s.hora, s.ambienteCodigo)}
              className="w-full text-left p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-green-800">
                  {DIA_LABELS[s.dia] ?? s.dia} · {s.hora}
                </span>
                <span className="text-[10px] bg-green-200 text-green-800 px-1.5 py-0.5 rounded-full font-medium">
                  Score: {s.score}
                </span>
              </div>
              <div className="text-[10px] text-green-700">{s.ambienteCodigo} — {s.ambienteNombre}</div>
              <div className="text-[10px] text-green-600 mt-0.5">{s.motivo}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}