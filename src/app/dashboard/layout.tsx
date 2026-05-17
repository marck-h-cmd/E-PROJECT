'use client';

import { DashboardShell } from '@/components/layout/DashboardShell';
import { useRequireAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-unt-blue" />
      </div>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}
