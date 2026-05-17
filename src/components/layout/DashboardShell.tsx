'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Formateadores } from '@/lib/formateadores';
import { MENU_SECTIONS } from '@/lib/menu-config';
import { PeriodoSelector } from '@/components/layout/PeriodoSelector';
import { cn } from '@/lib/cn';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, can } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleSections = MENU_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => !item.permission || can(item.permission)),
  })).filter((s) => s.items.length > 0);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
          <span className="text-lg font-bold text-unt-blue">UNT</span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold">Gestión de Horarios</h1>
          <p className="truncate text-xs text-blue-300">Ing. de Sistemas</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {visibleSections.map((section) => (
          <div key={section.titulo} className="mb-4">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-blue-300">
              {section.titulo}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname?.startsWith(item.href));
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                        active
                          ? 'bg-white/20 text-white'
                          : 'text-blue-200 hover:bg-white/10 hover:text-white'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.nombre}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {user && (
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-unt-gold text-xs font-bold text-unt-blue">
              {user.nombre?.charAt(0)}
              {user.apellidos?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {user.nombre} {user.apellidos}
              </p>
              <p className="truncate text-xs text-blue-300">
                {Formateadores.rolUsuario(user.rol)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              className="rounded p-1 hover:bg-white/10"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 bg-unt-blue text-white lg:block">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-unt-blue text-white shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-3 rounded p-1 hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between gap-4 px-4 py-3 lg:px-8">
            <button
              type="button"
              className="rounded-md p-2 hover:bg-gray-100 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <p className="text-sm font-medium text-gray-500 lg:hidden">UNT Horarios</p>
            <PeriodoSelector className="ml-auto" />
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
