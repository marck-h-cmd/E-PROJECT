'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error?.message || 'Error al iniciar sesión');
        return;
      }

      // Guardar tokens
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.usuario));

      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('Error de conexión. Verifique que el servidor esté funcionando.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-unt-blue to-primary-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full animate-fadeIn">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
            <span className="text-2xl font-bold text-unt-blue">UNT</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
          <p className="text-blue-200 text-sm mt-1">
            Sistema de Gestión de Horarios
          </p>
        </div>

        {/* Formulario */}
        <div className="card bg-white shadow-xl">
          <div className="card-body">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="label">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  placeholder="ejemplo@unitru.edu.pe"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="label">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="spinner" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>
          </div>

          <div className="card-footer text-center">
            <a href="/auth/recuperar-password" className="text-sm text-primary-600 hover:text-primary-700">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>

        {/* Credenciales de prueba */}
        <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-md text-sm text-blue-200">
          <p className="font-medium mb-1">Credenciales de prueba:</p>
          <p>Admin: admin@unitru.edu.pe / unt123456</p>
          <p>Operador: operador@unitru.edu.pe / unt123456</p>
        </div>
      </div>
    </div>
  );
}