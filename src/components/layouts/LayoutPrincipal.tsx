'use client';

import React from 'react';

interface LayoutPrincipalProps {
  children: React.ReactNode;
}

export function LayoutPrincipal({ children }: LayoutPrincipalProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}