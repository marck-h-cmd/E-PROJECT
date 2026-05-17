'use client';

import * as React from 'react';
import { PanelDocenteActual } from './PanelDocenteActual';
import { PanelLlamarSiguiente } from './PanelLlamarSiguiente';
import { ColaDocentes } from './ColaDocentes';
import { ControlVentana } from './ControlVentana';
import { NotificacionToast } from '@/components/ui/NotificacionToast';

interface Docente {
  id: string;
  nombre: string;
  email: string;
  categoria: string;
  horaLlegada: string;
  horaInicio?: string;
  tiempoTranscurrido?: number;
  prioridad?: 'normal' | 'alta' | 'urgente';
  departamento?: string;
  posicionCola?: number;
}

interface PantallaAtencionProps {
  ventanaId: string;
  className?: string;
}

export function PantallaAtencion({ ventanaId, className }: PantallaAtencionProps) {
  const [estadoVentana, setEstadoVentana] = React.useState<'inactiva' | 'activa' | 'pausada' | 'finalizada'>('inactiva');
  const [docenteActual, setDocenteActual] = React.useState<Docente | null>(null);
  const [colaDocentes, setColaDocentes] = React.useState<Docente[]>([
    { id: '1', nombre: 'Dr. Juan Pérez García', email: 'juan.perez@unt.edu.pe', categoria: 'Principal', horaLlegada: '08:15', prioridad: 'normal', posicionCola: 1 },
    { id: '2', nombre: 'Dra. María López Sánchez', email: 'maria.lopez@unt.edu.pe', categoria: 'Asociado', horaLlegada: '08:20', prioridad: 'alta', posicionCola: 2 },
    { id: '3', nombre: 'Mg. Carlos Rodríguez', email: 'carlos.rodriguez@unt.edu.pe', categoria: 'Auxiliar', horaLlegada: '08:25', prioridad: 'normal', posicionCola: 3 },
  ]);
  const [tiempoAtencion, setTiempoAtencion] = React.useState(0);
  const [tiempoVentana, setTiempoVentana] = React.useState(0);
  const [docentesAtendidos, setDocentesAtendidos] = React.useState(0);

  const handleIniciarVentana = () => {
    setEstadoVentana('activa');
    NotificacionToast.exito('Ventana iniciada');
  };

  const handlePausarVentana = () => {
    setEstadoVentana('pausada');
    NotificacionToast.info('Ventana pausada');
  };

  const handleReanudarVentana = () => {
    setEstadoVentana('activa');
    NotificacionToast.info('Ventana reanudada');
  };

  const handleFinalizarVentana = () => {
    setEstadoVentana('finalizada');
    NotificacionToast.exito('Ventana finalizada');
  };

  const handleLlamarDocente = () => {
    if (colaDocentes.length === 0) return;
    const siguiente = colaDocentes[0];
    setDocenteActual({
      ...siguiente,
      horaInicio: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
      tiempoTranscurrido: 0,
    });
    setColaDocentes(prev => prev.slice(1).map((d, i) => ({ ...d, posicionCola: i + 1 })));
    setTiempoAtencion(0);
    NotificacionToast.exito(`Llamando a ${siguiente.nombre}`);
  };

  const handleFinalizarAtencion = () => {
    setDocentesAtendidos(prev => prev + 1);
    NotificacionToast.exito('Atención finalizada correctamente');
    setDocenteActual(null);
    setTiempoAtencion(0);
  };

  const handleCancelarAtencion = () => {
    NotificacionToast.advertencia('Atención cancelada');
    setDocenteActual(null);
    setTiempoAtencion(0);
  };

  React.useEffect(() => {
    if (!docenteActual || estadoVentana !== 'activa') return;
    const intervalo = setInterval(() => setTiempoAtencion(prev => prev + 1), 1000);
    return () => clearInterval(intervalo);
  }, [docenteActual, estadoVentana]);

  React.useEffect(() => {
    if (estadoVentana !== 'activa') return;
    const intervalo = setInterval(() => setTiempoVentana(prev => prev + 1), 1000);
    return () => clearInterval(intervalo);
  }, [estadoVentana]);

  const siguienteDocente = colaDocentes[0] ?? null;

  // Adaptar docente al tipo que espera PanelDocenteActual
  const docenteActualAdaptado = docenteActual ? {
    id: docenteActual.id,
    nombre: docenteActual.nombre,
    email: docenteActual.email,
    categoria: docenteActual.categoria,
    horaInicio: docenteActual.horaInicio ?? '',
    tiempoTranscurrido: tiempoAtencion,
  } : null;

  // Adaptar docente al tipo que espera PanelLlamarSiguiente
  const siguienteDocenteAdaptado = siguienteDocente ? {
    id: siguienteDocente.id,
    nombre: siguienteDocente.nombre,
    email: siguienteDocente.email,
    categoria: siguienteDocente.categoria,
    horaLlegada: siguienteDocente.horaLlegada,
    posicionCola: siguienteDocente.posicionCola ?? 1,
  } : null;

  return (
    <div className={className}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Control */}
        <div className="space-y-6">
          <ControlVentana
            estado={estadoVentana}
            tiempoTranscurrido={tiempoVentana}
            onIniciar={handleIniciarVentana}
            onPausar={handlePausarVentana}
            onReanudar={handleReanudarVentana}
            onFinalizar={handleFinalizarVentana}
          />
        </div>

        {/* Columna central - Atención actual */}
        <div className="space-y-6">
          <PanelDocenteActual
            docente={docenteActualAdaptado}
            onFinalizar={handleFinalizarAtencion}
            onCancelar={handleCancelarAtencion}
          />
          <PanelLlamarSiguiente
            docenteSiguiente={siguienteDocenteAdaptado}
            onLlamar={handleLlamarDocente}
          />
        </div>

        {/* Columna derecha - Cola */}
        <div>
          <ColaDocentes docentes={colaDocentes} />
        </div>
      </div>
    </div>
  );
}