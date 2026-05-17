'use client';

interface Props {
  horasAsignadas: number;
  horasMaximas: number;
  horasTeoria?: number;
  horasPractica?: number;
  label?: string;
}

export default function IndicadorProgresoHoras({
  horasAsignadas, horasMaximas, horasTeoria, horasPractica, label = 'Horas asignadas',
}: Props) {
  const porcentaje = horasMaximas > 0 ? Math.min(100, Math.round((horasAsignadas / horasMaximas) * 100)) : 0;
  const color = porcentaje >= 100 ? 'bg-red-500' : porcentaje >= 80 ? 'bg-yellow-500' : 'bg-blue-500';
  const textColor = porcentaje >= 100 ? 'text-red-700' : porcentaje >= 80 ? 'text-yellow-700' : 'text-blue-700';

  return (
    <div className="card card-body">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>{horasAsignadas} / {horasMaximas}h</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-gray-500">
        <span>{porcentaje}% completado</span>
        {horasMaximas - horasAsignadas > 0
          ? <span>{horasMaximas - horasAsignadas}h restantes</span>
          : <span className="text-red-600 font-medium">Límite alcanzado</span>
        }
      </div>
      {(horasTeoria !== undefined || horasPractica !== undefined) && (
        <div className="flex gap-3 mt-2 pt-2 border-t border-gray-100">
          {horasTeoria !== undefined && (
            <div className="text-center">
              <div className="text-xs font-semibold text-blue-700">{horasTeoria}h</div>
              <div className="text-[10px] text-gray-400">Teoría</div>
            </div>
          )}
          {horasPractica !== undefined && (
            <div className="text-center">
              <div className="text-xs font-semibold text-green-700">{horasPractica}h</div>
              <div className="text-[10px] text-gray-400">Práctica</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}