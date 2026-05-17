'use client';

import { useState } from 'react';

interface DatosHorario {
  docenteNombre: string;
  cursoNombre: string;
  ambienteCodigo: string;
  ambienteNombre: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  esPractica?: boolean;
  grupoNombre?: string;
}

const DIA_LABELS: Record<string,string> = {
  LUNES:'Lunes', MARTES:'Martes', MIERCOLES:'Miércoles',
  JUEVES:'Jueves', VIERNES:'Viernes', SABADO:'Sábado',
};

interface Props {
  datos: DatosHorario | null;
  onConfirmar: () => Promise<void>;
  onCancelar: () => void;
}

export default function ConfirmacionHorario({ datos, onConfirmar, onCancelar }: Props) {
  const [loading, setLoading] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  if (!datos) return null;

  const handleConfirmar = async () => {
    setLoading(true);
    try {
      await onConfirmar();
      setConfirmado(true);
    } finally {
      setLoading(false);
    }
  };

  if (confirmado) {
    return (
      <div className="card card-body text-center py-8">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">¡Horario confirmado!</h3>
        <p className="text-xs text-gray-500">El horario ha sido asignado exitosamente.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="text-sm font-semibold text-gray-900">Confirmar Asignación</h3>
        <p className="text-xs text-gray-500 mt-0.5">Revisa los datos antes de confirmar</p>
      </div>
      <div className="card-body space-y-3">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
          {[
            { label: 'Docente',    value: datos.docenteNombre },
            { label: 'Curso',      value: `${datos.cursoNombre}${datos.esPractica ? ' (Práctica)' : ''}` },
            { label: 'Ambiente',   value: `${datos.ambienteCodigo} — ${datos.ambienteNombre}` },
            { label: 'Día',        value: DIA_LABELS[datos.dia] ?? datos.dia },
            { label: 'Horario',    value: `${datos.horaInicio} – ${datos.horaFin}` },
            ...(datos.grupoNombre ? [{ label: 'Grupo', value: datos.grupoNombre }] : []),
          ].map((item) => (
            <div key={item.label} className="flex gap-3 text-xs">
              <span className="text-gray-500 w-20 shrink-0">{item.label}:</span>
              <span className="text-gray-900 font-medium">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={onCancelar} className="btn-secondary flex-1 justify-center">
            Cancelar
          </button>
          <button onClick={handleConfirmar} disabled={loading} className="btn-primary flex-1 justify-center">
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Confirmando...
              </>
            ) : 'Confirmar asignación'}
          </button>
        </div>
      </div>
    </div>
  );
}