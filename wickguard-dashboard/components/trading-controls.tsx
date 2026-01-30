'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Zap, Shield, AlertTriangle } from 'lucide-react';

interface TradingControlsProps {
  onConnectWallet: () => void;
  onActivateL2: () => void;
  onEmergencyRescue: () => void;
  walletConnected: boolean;
  l2Active: boolean;
  protectionActive: boolean;
  isLoading?: boolean;
}

export function TradingControls({
  onConnectWallet,
  onActivateL2,
  onEmergencyRescue,
  walletConnected,
  l2Active,
  protectionActive,
  isLoading = false,
}: TradingControlsProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Primary Control */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          onClick={onConnectWallet}
          disabled={walletConnected || isLoading}
          className={`h-14 text-base font-semibold transition-all duration-300 ${
            walletConnected
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-500/30'
          }`}
          onMouseEnter={() => setHoveredButton('wallet')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {walletConnected ? 'Wallet Connected' : 'Connect Wallet'}
          {hoveredButton === 'wallet' && walletConnected && (
            <span className="ml-2 text-xs">CVYvELNx...</span>
          )}
        </Button>

        <Button
          onClick={onActivateL2}
          disabled={!walletConnected || l2Active || isLoading}
          className={`h-14 text-base font-semibold transition-all duration-300 ${
            l2Active
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
              : walletConnected
                ? 'bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 text-white border border-emerald-500/30'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
          }`}
          onMouseEnter={() => setHoveredButton('l2')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <Zap className="w-4 h-4 mr-2" />
          {l2Active ? 'L2 Protection Active' : 'Activate L2 Protection'}
        </Button>
      </div>

      {/* Emergency Rescue - Only visible when protection active */}
      {protectionActive && (
        <div className="pt-2 border-t border-slate-700/30">
          <Button
            onClick={onEmergencyRescue}
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold border border-red-500/30 transition-all duration-300"
            onMouseEnter={() => setHoveredButton('emergency')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Manual Emergency Rescue
            {hoveredButton === 'emergency' && (
              <span className="ml-2 text-xs opacity-75">Instant transfer to Safe Vault</span>
            )}
          </Button>
        </div>
      )}

      {/* Info Text */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-3">
        <p className="text-xs text-slate-400">
          {!walletConnected
            ? '👛 Connect your wallet to get started'
            : !l2Active
              ? '⚡ Activate L2 Protection to mint tokens and enable automatic monitoring'
              : '✅ Protection active - your assets are being monitored for price crashes'}
        </p>
      </div>
    </div>
  );
}
