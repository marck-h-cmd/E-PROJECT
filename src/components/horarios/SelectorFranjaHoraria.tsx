'use client';

const DIAS = [
  { value: 'LUNES',     label: 'Lunes'     },
  { value: 'MARTES',    label: 'Martes'    },
  { value: 'MIERCOLES', label: 'Miércoles' },
  { value: 'JUEVES',    label: 'Jueves'    },
  { value: 'VIERNES',   label: 'Viernes'   },
  { value: 'SABADO',    label: 'Sábado'    },
];

const HORAS = [
  '07:00','08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00',
];

interface Props {
  dia?: string;
  horaInicio?: string;
  horaFin?: string;
  onDiaChange: (dia: string) => void;
  onHoraInicioChange: (hora: string) => void;
  onHoraFinChange: (hora: string) => void;
  disabled?: boolean;
}

export default function SelectorFranjaHoraria({
  dia, horaInicio, horaFin,
  onDiaChange, onHoraInicioChange, onHoraFinChange,
  disabled = false,
}: Props) {
  const horasFin = HORAS.filter(h => !horaInicio || h > horaInicio);

  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className="label">Día</label>
        <select
          value={dia ?? ''}
          onChange={e => onDiaChange(e.target.value)}
          disabled={disabled}
          className="input-field"
        >
          <option value="">Seleccionar día</option>
          {DIAS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Hora inicio</label>
        <select
          value={horaInicio ?? ''}
          onChange={e => onHoraInicioChange(e.target.value)}
          disabled={disabled}
          className="input-field"
        >
          <option value="">Seleccionar hora</option>
          {HORAS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Hora fin</label>
        <select
          value={horaFin ?? ''}
          onChange={e => onHoraFinChange(e.target.value)}
          disabled={disabled || !horaInicio}
          className="input-field"
        >
          <option value="">Seleccionar hora</option>
          {horasFin.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>
    </div>
  );
}