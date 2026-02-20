'use client';

import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-foreground/60 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/60 hover:text-foreground"
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/60 hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
