'use client';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      // Intentar cargar resumen
      const response = await fetch('/api/salud', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      setError('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Bienvenido al Sistema de Gestión de Horarios
        </p>
      </div>

      {/* Estado del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">API Backend</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.services?.database === 'healthy' ? '✅ Online' : '❌ Offline'}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                stats?.services?.database === 'healthy' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-2xl">🖥️</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Base de Datos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.services?.database === 'healthy' ? '✅ Conectada' : '❌ Error'}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                stats?.services?.database === 'healthy' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-2xl">🗄️</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Redis Cache</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats?.services?.redis === 'healthy' ? '✅ Conectado' : '❌ Error'}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                stats?.services?.redis === 'healthy' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Accesos Rápidos</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { nombre: 'Docentes', href: '/dashboard/docentes', icono: '👨‍🏫', color: 'bg-blue-100 text-blue-700' },
              { nombre: 'Cursos', href: '/dashboard/cursos', icono: '📚', color: 'bg-green-100 text-green-700' },
              { nombre: 'Horarios', href: '/dashboard/horarios', icono: '🕐', color: 'bg-purple-100 text-purple-700' },
              { nombre: 'Reportes', href: '/dashboard/reportes', icono: '📄', color: 'bg-orange-100 text-orange-700' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`${item.color} rounded-lg p-4 text-center hover:opacity-80 transition-opacity`}
              >
                <span className="text-3xl block mb-2">{item.icono}</span>
                <span className="text-sm font-medium">{item.nombre}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Estado de la API */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Información del Sistema</h2>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="space-y-3">
              <div className="skeleton h-4 w-3/4"></div>
              <div className="skeleton h-4 w-1/2"></div>
              <div className="skeleton h-4 w-2/3"></div>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
              {error}
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <p><strong>Servidor:</strong> {stats?.server || 'N/A'}</p>
              <p><strong>Timestamp:</strong> {stats?.timestamp ? new Date(stats.timestamp).toLocaleString() : 'N/A'}</p>
              <p><strong>Base de Datos:</strong> {stats?.services?.database || 'unknown'}</p>
              <p><strong>Redis:</strong> {stats?.services?.redis || 'unknown'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}