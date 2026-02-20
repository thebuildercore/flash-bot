'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Shield,
  Wallet,
  Settings,
  LogOut,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: Home,
      exact: true,
    },
    {
      label: 'Portfolio',
      href: '/dashboard/portfolio',
      icon: Wallet,
    },
    {
      label: 'Protection',
      href: '/dashboard/protection',
      icon: Shield,
    },
    {
      label: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border fixed left-0 top-0 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
        <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
          <Shield className="w-5 h-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-sidebar-foreground">Wickguard</h1>
          <p className="text-xs text-sidebar-accent">Margin Protection</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-sidebar-primary/20 text-sidebar-primary border border-sidebar-primary/50'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Disconnect</span>
        </button>
        <div className="text-xs text-sidebar-foreground/50 px-4 py-2">
          <p>v0.1.0</p>
        </div>
      </div>
    </aside>
  );
}
