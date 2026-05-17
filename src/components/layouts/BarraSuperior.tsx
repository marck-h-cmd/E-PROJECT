'use client';

import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { MenuUsuario } from './MenuUsuario';
import { Boton } from '@/components/ui/Boton';

interface BarraSuperiorProps {
  onMenuClick?: () => void;
  titulo?: string;
}

export function BarraSuperior({ onMenuClick, titulo }: BarraSuperiorProps) {
  const [notificacionesCount, setNotificacionesCount] = React.useState(3);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Botón menú móvil */}
        <Boton
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Boton>

        {/* Título de página */}
        {titulo && (
          <h1 className="hidden text-lg font-semibold text-gray-900 sm:block">
            {titulo}
          </h1>
        )}

        {/* Espaciador */}
        <div className="flex-1" />

        {/* Buscador global */}
        <div className="hidden w-full max-w-md md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar docentes, cursos, aulas..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Notificaciones */}
        <Boton variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificacionesCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {notificacionesCount}
            </span>
          )}
        </Boton>

        {/* Menú de usuario */}
        <MenuUsuario />
      </div>
    </header>
  );
}