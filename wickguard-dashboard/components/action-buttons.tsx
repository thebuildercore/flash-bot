'use client';

import { Wallet, Zap, Lock, Shield, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface ActionButtonsProps {
  onWalletConnect?: () => void;
  onMint?: () => void;
  onActivateShield?: () => void;
  onEmergencyRescue?: () => void;
  walletConnected: boolean;
  hasTokens: boolean;
  shieldActive: boolean;
  isLoading?: boolean;
}

export function ActionButtons({
  onWalletConnect,
  onMint,
  onActivateShield,
  onEmergencyRescue,
  walletConnected,
  hasTokens,
  shieldActive,
  isLoading = false,
}: ActionButtonsProps) {
  const [loadingState, setLoadingState] = useState<string | null>(null);

  const handleClick = (callback?: () => void, key?: string) => {
    if (callback && !isLoading) {
      if (key) setLoadingState(key);
      callback();
      setTimeout(() => setLoadingState(null), 1000);
    }
  };

  const buttons = [
    {
      id: 'wallet',
      icon: Wallet,
      label: 'Connect Wallet',
      description: 'Link Phantom/Solflare',
      onClick: () => handleClick(onWalletConnect, 'wallet'),
      enabled: !walletConnected,
      highlight: true,
    },
    {
      id: 'mint',
      icon: Zap,
      label: 'Mint Test Assets',
      description: '1,000 WICK Tokens',
      onClick: () => handleClick(onMint, 'mint'),
      enabled: walletConnected && !hasTokens,
      highlight: walletConnected,
    },
    {
      id: 'shield',
      icon: Shield,
      label: 'Activate Shield',
      description: 'Bridge to L2 + Safe Vault',
      onClick: () => handleClick(onActivateShield, 'shield'),
      enabled: hasTokens && !shieldActive,
      highlight: hasTokens && !shieldActive,
    },
    {
      id: 'rescue',
      icon: AlertTriangle,
      label: 'Emergency Rescue',
      description: 'Manual Override',
      onClick: () => handleClick(onEmergencyRescue, 'rescue'),
      enabled: shieldActive,
      highlight: shieldActive,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {buttons.map((button) => {
        const Icon = button.icon;
        const isLoading_ = loadingState === button.id;

        return (
          <button
            key={button.id}
            onClick={button.onClick}
            disabled={!button.enabled || isLoading}
            className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              button.highlight
                ? 'bg-gradient-to-br from-lime-500 via-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30'
                : 'bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700'
            }`}
          >
            {/* Animated background */}
            <div
              className={`absolute inset-0 ${
                button.highlight ? 'opacity-100' : 'opacity-0'
              } group-hover:opacity-100 transition-opacity duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-left">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    button.highlight
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-600 text-slate-300 group-hover:bg-slate-500'
                  }`}
                >
                  {isLoading_ ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                {button.enabled && (
                  <span className="text-xs font-semibold px-2 py-1 bg-white/10 rounded-full text-white">
                    Ready
                  </span>
                )}
              </div>

              <h3 className={`text-lg font-bold ${button.highlight ? 'text-white' : 'text-slate-100'}`}>
                {button.label}
              </h3>
              <p className={`text-sm mt-1 ${button.highlight ? 'text-white/70' : 'text-slate-400'}`}>
                {button.description}
              </p>
            </div>

            {/* Active indicator */}
            {button.enabled && !isLoading_ && (
              <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            )}
          </button>
        );
      })}
    </div>
  );
}
