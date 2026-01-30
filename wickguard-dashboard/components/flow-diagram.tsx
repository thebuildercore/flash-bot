'use client';

import { Zap, Lock, TrendingDown, AlertTriangle, CheckCircle2, Repeat2 } from 'lucide-react';

interface FlowDiagramProps {
  stage: number; // 0: idle, 1: l1-setup, 2: bridging, 3: monitoring, 4: crash, 5: recovered
  userTokens: number;
  safeVaultTokens: number;
}

export function FlowDiagram({ stage, userTokens, safeVaultTokens }: FlowDiagramProps) {
  return (
    <div className="relative w-full bg-gradient-to-b from-slate-900/50 to-slate-950/50 rounded-2xl border border-slate-700/50 p-8 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className={`absolute top-1/2 left-1/4 w-96 h-96 rounded-full blur-3xl ${
          stage >= 1 ? 'bg-blue-500' : 'bg-slate-700'
        } transition-all duration-1000`} />
        <div className={`absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl ${
          stage >= 3 ? 'bg-emerald-500' : 'bg-slate-700'
        } transition-all duration-1000`} />
        <div className={`absolute top-1/2 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          stage >= 4 ? 'bg-red-500' : 'bg-slate-700'
        } transition-all duration-1000`} />
      </div>

      {/* Main diagram container */}
      <div className="relative z-10">
        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          WickGuard: Unified Protection & Recovery Flow
        </h2>

        {/* Three-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Column 1: Onboarding & L1 Setup */}
          <div
            className={`border-2 rounded-2xl p-6 transition-all duration-500 ${
              stage >= 1
                ? 'border-blue-500/50 bg-blue-500/10'
                : 'border-slate-600/30 bg-slate-800/20'
            }`}
          >
            <div className="text-center mb-4">
              <h3 className={`text-lg font-bold mb-1 ${stage >= 1 ? 'text-blue-400' : 'text-slate-400'}`}>
                1. Onboarding & L1 Setup
              </h3>
              <p className="text-xs text-slate-500">Solana L1 • Public Chain</p>
            </div>

            <div className="space-y-3">
              {/* Wallet */}
              <div className={`border rounded-xl p-3 transition-all ${
                stage >= 1
                  ? 'border-blue-400/50 bg-blue-900/30'
                  : 'border-slate-600/30 bg-slate-800/20'
              }`}>
                <div className="text-xs font-mono text-slate-400 mb-1">👤 Phantom/Solflare</div>
                <div className="text-xs text-slate-500">User Wallet</div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <Zap className={`w-5 h-5 ${stage >= 1 ? 'text-blue-400' : 'text-slate-600'}`} />
              </div>

              {/* Mint Token */}
              <div className={`border rounded-xl p-3 transition-all ${
                stage >= 1
                  ? 'border-blue-400/50 bg-blue-900/30'
                  : 'border-slate-600/30 bg-slate-800/20'
              }`}>
                <div className="text-xs font-mono text-slate-400 mb-1">💎 Mint WICK Token</div>
                <div className="text-xs text-slate-500">User ATA (L1)</div>
                <div className={`text-sm font-bold mt-2 ${stage >= 1 ? 'text-blue-400' : 'text-slate-600'}`}>
                  {userTokens} WICK
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: L2 Protected Environment */}
          <div
            className={`border-2 rounded-2xl p-6 transition-all duration-500 ${
              stage >= 3
                ? 'border-emerald-500/50 bg-emerald-500/10'
                : 'border-slate-600/30 bg-slate-800/20'
            }`}
          >
            <div className="text-center mb-4">
              <h3 className={`text-lg font-bold mb-1 ${stage >= 3 ? 'text-emerald-400' : 'text-slate-400'}`}>
                L2 Protected Environment
              </h3>
              <p className="text-xs text-slate-500">MagicBlock Ephemeral Rollup</p>
            </div>

            <div className="space-y-3">
              {/* Bridge Portal */}
              <div className={`border-2 rounded-xl p-4 transition-all relative overflow-hidden ${
                stage >= 2
                  ? 'border-purple-400/50 bg-purple-900/30'
                  : 'border-slate-600/30 bg-slate-800/20'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 animate-pulse" />
                <div className="relative z-10 text-center">
                  <div className="text-2xl mb-2">🌀</div>
                  <div className="text-xs font-bold text-slate-300">
                    {stage >= 2 ? 'L2 Bridge' : 'Ephemeral Rollup'}
                  </div>
                  <div className={`text-xs mt-1 ${stage >= 2 ? 'text-purple-400' : 'text-slate-500'}`}>
                    {stage >= 2 ? 'Active' : 'Ready'}
                  </div>
                </div>
              </div>

              {/* Price Monitor */}
              <div className={`border rounded-xl p-3 transition-all ${
                stage >= 3
                  ? 'border-emerald-400/50 bg-emerald-900/30'
                  : 'border-slate-600/30 bg-slate-800/20'
              }`}>
                <div className="text-xs font-mono text-slate-400 mb-1">📊 Live Price Feed</div>
                <div className={`text-xs font-bold ${stage >= 3 ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {stage >= 3 ? '🟢 Monitoring Active' : 'Waiting...'}
                </div>
              </div>

              {/* Status */}
              {stage >= 4 && (
                <div className={`border rounded-xl p-3 ${
                  stage === 4 ? 'border-red-400/50 bg-red-900/30' : 'border-slate-600/30 bg-slate-800/20'
                }`}>
                  <div className="text-xs font-mono text-slate-400 mb-1">
                    {stage === 4 ? '🚨 THREAT DETECTED' : '⚡ Rescue Executed'}
                  </div>
                  <div className={`text-xs ${stage === 4 ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                    {stage === 4 ? 'Price Crash Detected' : 'Atomic Transfer'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 3: Final State & Recovery */}
          <div
            className={`border-2 rounded-2xl p-6 transition-all duration-500 ${
              stage >= 4
                ? 'border-red-500/50 bg-red-500/10'
                : stage >= 5
                  ? 'border-orange-500/50 bg-orange-500/10'
                  : 'border-slate-600/30 bg-slate-800/20'
            }`}
          >
            <div className="text-center mb-4">
              <h3 className={`text-lg font-bold mb-1 ${
                stage >= 5 ? 'text-orange-400' : stage >= 4 ? 'text-red-400' : 'text-slate-400'
              }`}>
                Final State & Recovery
              </h3>
              <p className="text-xs text-slate-500">L2 Safe State</p>
            </div>

            <div className="space-y-3">
              {/* Assets Secured Badge */}
              {stage >= 4 && (
                <div className={`border-2 rounded-xl p-3 text-center transition-all ${
                  stage >= 4
                    ? 'border-red-400/50 bg-red-900/30'
                    : 'border-slate-600/30 bg-slate-800/20'
                }`}>
                  <div className="text-2xl mb-1">🛡️</div>
                  <div className="text-xs font-bold text-red-400">Assets Secured</div>
                  <div className="text-xs text-slate-500">Red Shield Active</div>
                </div>
              )}

              {/* User ATA */}
              <div className={`border rounded-xl p-3 transition-all ${
                stage >= 5
                  ? 'border-orange-400/50 bg-orange-900/30'
                  : 'border-slate-600/30 bg-slate-800/20'
              }`}>
                <div className="text-xs font-mono text-slate-400 mb-1">👤 User ATA (L2)</div>
                <div className={`text-sm font-bold ${stage >= 5 ? 'text-orange-400' : 'text-slate-600'}`}>
                  {stage >= 5 ? userTokens : '0'} WICK
                </div>
              </div>

              {/* Safe Vault */}
              <div className={`border-2 rounded-xl p-3 transition-all ${
                stage >= 4
                  ? 'border-yellow-400/50 bg-yellow-900/30'
                  : 'border-slate-600/30 bg-slate-800/20'
              }`}>
                <div className="text-xs font-mono text-slate-400 mb-1">🔐 Safe Vault ATA (L2)</div>
                <div className={`text-sm font-bold ${stage >= 4 ? 'text-yellow-400' : 'text-slate-600'}`}>
                  {safeVaultTokens} WICK
                </div>
              </div>

              {/* Recovery Status */}
              {stage >= 5 && (
                <div className="border rounded-xl p-3 text-center bg-emerald-900/30 border-emerald-400/50">
                  <div className="text-sm font-bold text-emerald-400">✓ Position Restored</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Connection Arrows */}
        <div className="hidden md:flex justify-between items-center mb-6 relative h-12">
          {/* Arrow 1: L1 to Bridge */}
          <div className={`absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
            stage >= 2 ? 'opacity-100' : 'opacity-30'
          }`}>
            <svg width="120" height="40" viewBox="0 0 120 40">
              <path
                d="M10,20 Q60,10 110,20"
                stroke={stage >= 2 ? '#a855f7' : '#64748b'}
                strokeWidth="2"
                fill="none"
              />
              <polygon
                points="110,20 105,15 110,25"
                fill={stage >= 2 ? '#a855f7' : '#64748b'}
              />
            </svg>
          </div>

          {/* Arrow 2: Bridge to Recovery */}
          <div className={`absolute right-1/4 top-1/2 transform translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
            stage >= 4 ? 'opacity-100' : 'opacity-30'
          }`}>
            <svg width="120" height="40" viewBox="0 0 120 40">
              <path
                d="M10,20 Q60,30 110,20"
                stroke={stage >= 4 ? '#ef4444' : '#64748b'}
                strokeWidth="2"
                fill="none"
              />
              <polygon
                points="110,20 105,15 110,25"
                fill={stage >= 4 ? '#ef4444' : '#64748b'}
              />
            </svg>
          </div>
        </div>

        {/* Stage Label */}
        <div className="text-center">
          <div className="inline-block px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <span className="text-sm font-mono text-slate-400">
              Stage: <span className="text-cyan-400 font-bold">
                {['Idle', 'L1 Setup', 'Bridging', 'Monitoring', 'Crash Detected', 'Recovered'][stage]}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
