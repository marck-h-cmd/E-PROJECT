'use client';

import Link from 'next/link';
import { ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AccesoDenegadoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <ShieldX className="mb-4 h-16 w-16 text-unt-red" />
      <h1 className="text-2xl font-bold text-gray-900">Acceso denegado</h1>
      <p className="mt-2 max-w-md text-center text-gray-500">
        No tiene permisos para acceder a esta sección del sistema.
      </p>
      <Button asChild className="mt-6 bg-unt-blue hover:bg-unt-blue/90">
        <Link href="/dashboard">Volver al dashboard</Link>
      </Button>
    </div>
  );
}
