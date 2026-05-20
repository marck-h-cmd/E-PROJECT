import { useState } from 'react';

export interface CicloOption {
  value: string;
  label: string;
}

const CICLO_OPTIONS: CicloOption[] = [
  { value: '', label: 'Todos los ciclos' },
  { value: '1', label: 'Ciclo I' },
  { value: '2', label: 'Ciclo II' },
  { value: '3', label: 'Ciclo III' },
  { value: '4', label: 'Ciclo IV' },
  { value: '5', label: 'Ciclo V' },
  { value: '6', label: 'Ciclo VI' },
  { value: '7', label: 'Ciclo VII' },
  { value: '8', label: 'Ciclo VIII' },
  { value: '9', label: 'Ciclo IX' },
  { value: '10', label: 'Ciclo X' },
];

export const useCicloFilter = () => {
  const [cicloSeleccionado, setCicloSeleccionado] = useState<string>('');

  return {
    cicloSeleccionado,
    setCicloSeleccionado,
    cicloOptions: CICLO_OPTIONS,
  };
};
