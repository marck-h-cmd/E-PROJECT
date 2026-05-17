'use client';

import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Boton } from '@/components/ui/Boton';
import { Badge } from '@/components/ui/Badge';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { TemporizadorVentana } from './TemporizadorVentana';

interface ControlVentanaProps {
  estado: 'inactiva' | 'activa' | 'pausada' | 'finalizada';
  tiempoTranscurrido?: number;
  onIniciar?: () => void;
  onPausar?: () => void;
  onReanudar?: () => void;
  onFinalizar?: () => void;
  className?: string;
}

export function ControlVentana({
  estado,
  tiempoTranscurrido = 0,
  onIniciar,
  onPausar,
  onReanudar,
  onFinalizar,
  className,
}: ControlVentanaProps) {
  return (
    <Card className={className}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Control de Ventana
          </Card.Title>
          <Badge
            variant={
              estado === 'activa'
                ? 'success'
                : estado === 'pausada'
                ? 'default'
                : estado === 'finalizada'
                ? 'secondary'
                : 'outline'
            }
          >
            {estado.toUpperCase()}
          </Badge>
        </div>
      </Card.Header>
      <Card.Content className="space-y-4">
        <TemporizadorVentana
          tiempoTranscurrido={tiempoTranscurrido}
          estado={estado}
        />

        <div className="grid grid-cols-2 gap-2">
          {estado === 'inactiva' && (
            <Boton
              onClick={onIniciar}
              className="col-span-2 gap-2"
              variant="default"
            >
              <Play className="h-4 w-4" />
              Iniciar Ventana
            </Boton>
          )}

          {estado === 'activa' && (
            <>
              <Boton onClick={onPausar} variant="outline" className="gap-2">
                <Pause className="h-4 w-4" />
                Pausar
              </Boton>
              <Boton
                onClick={onFinalizar}
                variant="destructive"
                className="gap-2"
              >
                <Square className="h-4 w-4" />
                Finalizar
              </Boton>
            </>
          )}

          {estado === 'pausada' && (
            <>
              <Boton onClick={onReanudar} variant="default" className="gap-2">
                <Play className="h-4 w-4" />
                Reanudar
              </Boton>
              <Boton
                onClick={onFinalizar}
                variant="destructive"
                className="gap-2"
              >
                <Square className="h-4 w-4" />
                Finalizar
              </Boton>
            </>
          )}

          {estado === 'finalizada' && (
            <div className="col-span-2 text-center py-4 text-gray-500">
              Ventana finalizada
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
}