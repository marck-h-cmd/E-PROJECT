'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  {
    titulo: 'Principal',
    items: [
      { nombre: 'Dashboard', href: '/dashboard', icono: '📊' },
    ],
  },
  {
    titulo: 'Gestión',
    items: [
      { nombre: 'Docentes', href: '/dashboard/docentes', icono: '👨‍🏫' },
      { nombre: 'Cursos', href: '/dashboard/cursos', icono: '📚' },
      { nombre: 'Ambientes', href: '/dashboard/ambientes', icono: '🏫' },
      { nombre: 'Períodos', href: '/dashboard/periodos', icono: '📅' },
    ],
  },
  {
    titulo: 'Horarios',
    items: [
      { nombre: 'Horarios', href: '/dashboard/horarios', icono: '🕐' },
      { nombre: 'Ventanas', href: '/dashboard/ventanas-atencion', icono: '🪟' },
    ],
  },
  {
    titulo: 'Análisis',
    items: [
      { nombre: 'Reportes', href: '/dashboard/reportes', icono: '📄' },
      { nombre: 'Estadísticas', href: '/dashboard/estadisticas', icono: '📈' },
    ],
  },
  {
    titulo: 'Sistema',
    items: [
      { nombre: 'Notificaciones', href: '/dashboard/notificaciones', icono: '🔔' },
      { nombre: 'Auditoría', href: '/dashboard/auditoria', icono: '🔍' },
      { nombre: 'Configuración', href: '/dashboard/configuracion', icono: '⚙️' },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error('Error en logout:', error);
      }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="spinner h-10 w-10 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para desktop */}
      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-unt-blue text-white transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} hidden lg:block`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-unt-blue">UNT</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold truncate">Gestión de Horarios</h1>
              <p className="text-xs text-blue-300 truncate">Ingeniería de Sistemas</p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {menuItems.map((seccion) => (
              <div key={seccion.titulo} className="mb-4">
                <h3 className="px-3 text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2">
                  {seccion.titulo}
                </h3>
                <ul className="space-y-1">
                  {seccion.items.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'text-blue-200 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="text-lg">{item.icono}</span>
                          <span>{item.nombre}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Usuario */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-medium">
                {user.nombre?.charAt(0)}{user.apellidos?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.nombre} {user.apellidos}</p>
                <p className="text-xs text-blue-300 truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 hover:bg-white/10 rounded"
                title="Cerrar sesión"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className={`transition-all duration-200 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
        {/* Header móvil */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">UNT Horarios</h1>
            <div className="h-8 w-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user.nombre?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}