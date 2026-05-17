'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/dashboard' },
    ];

    let currentPath = '';
    paths.forEach((path, index) => {
      if (path === 'dashboard') return; // Skip dashboard in breadcrumb

      currentPath += `/${path}`;
      
      // Formatear etiquetas
      const label = path
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {breadcrumbs.slice(1).map((crumb, index) => (
        <React.Fragment key={crumb.href}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {index === breadcrumbs.length - 2 ? (
            <span className="font-medium text-gray-900">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="hover:text-blue-600 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}