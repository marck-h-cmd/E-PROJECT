'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { BarraSuperior } from './BarraSuperior';
import { Breadcrumbs } from './Breadcrumbs';
import { PiePagina } from './PiePagina';
import { NavegacionMovil } from './NavegacionMovil';
import { cn } from '@/lib/utilidades';

interface LayoutDashboardProps {
  children: React.ReactNode;
  titulo?: string;
}

export function LayoutDashboard({ children, titulo }: LayoutDashboardProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
        />
      </div>

      {/* Navegación Móvil */}
      <NavegacionMovil
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div
        className={cn(
          'min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        {/* Barra Superior */}
        <BarraSuperior
          titulo={titulo}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        {/* Breadcrumbs */}
        <div className="border-b bg-white px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumbs />
        </div>

        {/* Contenido Principal */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Pie de Página */}
        <PiePagina />
      </div>
    </div>
  );
}