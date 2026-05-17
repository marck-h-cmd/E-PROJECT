'use client';

import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { IndicadorKPI } from '@/components/ui/IndicadorKPI';
import { Users, Clock, CheckCircle, TrendingUp, Activity } from 'lucide-react';

interface EstadisticasVentana {
  docentesAtendidos: number;
  docentesEnCola: number;
  tiempoPromedioAtencion: number;
  eficiencia: number;
  tiempoTotal: number;
}

interface MonitorVentanasProps {
  estadisticas: EstadisticasVentana;
  estado: 'inactiva' | 'activa' | 'pausada' | 'finalizada';
  className?: string;
}

export function MonitorVentanas({ estadisticas, estado, className }: MonitorVentanasProps) {
  return (
    <div className={className}>
      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monitor en Tiempo Real
            </Card.Title>
            <Badge variant={estado === 'activa' ? 'success' : estado === 'pausada' ? 'default' : 'secondary'}>
              {estado === 'activa' ? 'EN VIVO' : estado.toUpperCase()}
            </Badge>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <IndicadorKPI
              titulo="Atendidos"
              valor={estadisticas.docentesAtendidos}
              icono={CheckCircle}
              color="green"
            />
            <IndicadorKPI
              titulo="En Cola"
              valor={estadisticas.docentesEnCola}
              icono={Users}
              color="blue"
            />
            <IndicadorKPI
              titulo="Tiempo Promedio"
              valor={`${estadisticas.tiempoPromedioAtencion} min`}
              icono={Clock}
              color="yellow"
            />
            <IndicadorKPI
              titulo="Eficiencia"
              valor={`${estadisticas.eficiencia}%`}
              icono={TrendingUp}
              color={estadisticas.eficiencia >= 80 ? 'green' : 'red'}
              tendencia={{
                valor: estadisticas.eficiencia,
                tipo: estadisticas.eficiencia >= 80 ? 'positivo' : 'negativo',
              }}
            />
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Tiempo Total Operación</p>
                <p className="text-lg font-semibold">
                  {Math.floor(estadisticas.tiempoTotal / 60)}h {estadisticas.tiempoTotal % 60}m
                </p>
              </div>
              <div>
                <p className="text-gray-600">Capacidad Utilizada</p>
                <p className="text-lg font-semibold">
                  {estadisticas.docentesAtendidos} / {estadisticas.docentesAtendidos + estadisticas.docentesEnCola}
                </p>
              </div>
            </div>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}