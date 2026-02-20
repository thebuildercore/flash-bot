'use client';

import { DashboardSidebar } from '@/components/dashboard-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
