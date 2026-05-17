'use client';

import React from 'react';
import Link from 'next/link';

export function PiePagina() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-600">
              © {currentYear} Universidad Nacional de Trujillo
            </p>
            <p className="text-xs text-gray-500">
              Escuela de Ingeniería de Sistemas
            </p>
          </div>

          <div className="flex gap-6">
            <Link
              href="/dashboard/ayuda"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Ayuda
            </Link>
            <Link
              href="/dashboard/soporte"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Soporte
            </Link>
            <Link
              href="/dashboard/privacidad"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/dashboard/terminos"
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}