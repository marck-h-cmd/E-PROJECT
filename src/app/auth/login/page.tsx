'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ApiClientError } from '@/lib/api-client';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : 'Error de conexión. Verifique que el servidor esté funcionando.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-unt-blue to-primary-900 p-4">
      <div className="w-full max-w-md animate-fadeIn">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <span className="text-2xl font-bold text-unt-blue">UNT</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
          <p className="mt-1 text-sm text-blue-200">Sistema de Gestión de Horarios</p>
        </div>

        <div className="card bg-white shadow-xl">
          <div className="card-body">
            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@unitru.edu.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-unt-blue hover:bg-unt-blue/90" disabled={loading}>
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-4 rounded-md bg-white/10 p-3 text-sm text-blue-200 backdrop-blur-sm">
          <p className="mb-1 font-medium">Credenciales de prueba:</p>
          <p>Admin: admin@unitru.edu.pe / unt123456</p>
        </div>
      </div>
    </div>
  );
}
