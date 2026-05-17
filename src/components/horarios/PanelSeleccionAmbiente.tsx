'use client';

import { useEffect, useState } from 'react';

interface Ambiente {
  id: string;
  codigo: string;
  nombre: string;
  tipo: string;
  capacidad: number;
  disponible?: boolean;
}

interface Props {
  periodoId?: string;
  dia?: string;
  hora?: string;
  tipo?: 'AULA' | 'LABORATORIO' | '';
  ambienteSeleccionado?: Ambiente | null;
  onSelect: (ambiente: Ambiente | null) => void;
}

const TIPO_LABELS: Record<string, string> = { AULA: 'Aula', LABORATORIO: 'Laboratorio', AUDITORIO: 'Auditorio' };

export default function PanelSeleccionAmbiente({ periodoId, dia, hora, tipo, ambienteSeleccionado, onSelect }: Props) {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<'' | 'AULA' | 'LABORATORIO'>(tipo ?? '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams();
    if (periodoId) params.append('periodoId', periodoId);
    if (dia) params.append('dia', dia);
    if (hora) params.append('hora', hora);
    if (filtroTipo) params.append('tipo', filtroTipo);
    fetch(`/api/ambientes?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setAmbientes(d.data?.items ?? []))
      .catch(() => setAmbientes([]))
      .finally(() => setLoading(false));
  }, [periodoId, dia, hora, filtroTipo]);

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Seleccionar Ambiente</h3>
        <select
          value={filtroTipo}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setFiltroTipo(e.target.value as '' | 'AULA' | 'LABORATORIO')
          }
          className="text-xs border border-gray-200 rounded px-2 py-1"
        >
          <option value="">Todos</option>
          <option value="AULA">Aulas</option>
          <option value="LABORATORIO">Laboratorios</option>
        </select>
      </div>
      <div className="overflow-y-auto max-h-64 scrollbar-thin">
        {loading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 animate-pulse rounded" />
            ))}
          </div>
        ) : ambientes.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-xs">
            {dia && hora ? 'No hay ambientes disponibles en ese horario' : 'No se encontraron ambientes'}
          </div>
        ) : (
          ambientes.map(amb => {
            const selected = ambienteSeleccionado?.id === amb.id;
            const noDisponible = amb.disponible === false;
            return (
              <button
                key={amb.id}
                disabled={noDisponible}
                onClick={() => onSelect(selected ? null : amb)}
                className={`w-full text-left px-4 py-2.5 border-b border-gray-50 transition-colors
                  ${noDisponible ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-50'}
                  ${selected ? 'bg-purple-50 border-l-2 border-l-purple-500' : ''}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-medium text-gray-800">{amb.codigo}</div>
                    <div className="text-[10px] text-gray-400">{amb.nombre}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      amb.tipo === 'LABORATORIO' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'
                    }`}>{TIPO_LABELS[amb.tipo] ?? amb.tipo}</span>
                    <div className="text-[10px] text-gray-400 mt-0.5">{amb.capacidad} personas</div>
                  </div>
                </div>
                {noDisponible && <div className="text-[9px] text-red-500 mt-0.5">No disponible en ese horario</div>}
              </button>
            );
          })
        )}
      </div>
      {ambienteSeleccionado && (
        <div className="p-3 bg-purple-50 border-t border-purple-100">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-800">{ambienteSeleccionado.codigo} — {ambienteSeleccionado.nombre}</span>
            <button onClick={() => onSelect(null)} className="text-[10px] text-purple-600 hover:text-purple-800 ml-2">Quitar</button>
          </div>
        </div>
      )}
    </div>
  );
}