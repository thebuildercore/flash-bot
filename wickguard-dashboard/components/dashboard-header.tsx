'use client';

import { useState } from 'react';
import { Wallet, Menu, X } from 'lucide-react';

interface DashboardHeaderProps {
  walletAddress?: string;
  walletConnected: boolean;
}

export function DashboardHeader({
  walletAddress,
  walletConnected,
}: DashboardHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-50 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center">
              <span className="font-bold text-slate-900">⚔</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">WickGuard</h1>
              <p className="text-xs text-slate-400">L1→L2 Protection</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-6 text-sm font-medium">
              <button className="text-slate-400 hover:text-white transition-colors">Dashboard</button>
              <button className="text-slate-400 hover:text-white transition-colors">Docs</button>
              <button className="text-slate-400 hover:text-white transition-colors">About</button>
            </nav>

            {/* Wallet Button */}
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                walletConnected
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 hover:shadow-lg hover:shadow-emerald-500/30'
                  : 'bg-slate-700 text-slate-100 hover:bg-slate-600'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>
                {walletConnected
                  ? walletAddress
                    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                    : 'Connected'
                  : 'Connect'}
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-slate-300" />
            ) : (
              <Menu className="w-6 h-6 text-slate-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-700/50 space-y-3">
            <button className="block w-full text-left px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
              Dashboard
            </button>
            <button className="block w-full text-left px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
              Docs
            </button>
            <button className="block w-full text-left px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
              About
            </button>
            <button
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                walletConnected
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-900 hover:shadow-lg'
                  : 'bg-slate-700 text-slate-100 hover:bg-slate-600'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>
                {walletConnected
                  ? walletAddress
                    ? `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`
                    : 'Connected'
                  : 'Connect'}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Animated top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    </header>
  );
}
