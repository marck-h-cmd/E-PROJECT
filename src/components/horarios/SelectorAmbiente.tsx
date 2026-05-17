'use client';

import { useEffect, useState } from 'react';

interface Ambiente { id: string; codigo: string; nombre: string; tipo: string; capacidad: number; }

interface Props {
  value?: string;
  onChange: (id: string, ambiente?: Ambiente) => void;
  tipo?: 'AULA' | 'LABORATORIO' | '';
  periodoId?: string;
  dia?: string;
  hora?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function SelectorAmbiente({ value, onChange, tipo, periodoId, dia, hora, placeholder = 'Seleccionar ambiente...', disabled }: Props) {
  const [ambientes, setAmbientes] = useState<Ambiente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ limit: '100' });
    if (tipo) params.append('tipo', tipo);
    if (periodoId) params.append('periodoId', periodoId);
    if (dia) params.append('dia', dia);
    if (hora) params.append('hora', hora);
    fetch(`/api/ambientes?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setAmbientes(d.data?.items ?? []))
      .catch(() => setAmbientes([]))
      .finally(() => setLoading(false));
  }, [tipo, periodoId, dia, hora]);

  return (
    <select
      value={value ?? ''}
      onChange={e => {
        const amb = ambientes.find(a => a.id === e.target.value);
        onChange(e.target.value, amb);
      }}
      disabled={disabled || loading}
      className="input-field"
    >
      <option value="">{loading ? 'Cargando...' : placeholder}</option>
      {ambientes.map(a => (
        <option key={a.id} value={a.id}>
          {a.codigo} — {a.nombre} ({a.capacidad} per.)
        </option>
      ))}
    </select>
  );
}