'use client';

import { TrendingDown, TrendingUp, Shield, Lock, Zap } from 'lucide-react';

interface StatsDashboardProps {
  userTokens: number;
  safeVaultTokens: number;
  rescueCount: number;
  totalProtected: number;
  status: 'idle' | 'monitoring' | 'secured' | 'recovered';
}

export function StatsDashboard({
  userTokens,
  safeVaultTokens,
  rescueCount,
  totalProtected,
  status,
}: StatsDashboardProps) {
  const stats = [
    {
      label: 'User ATA (L1)',
      value: userTokens,
      unit: 'WICK',
      icon: Shield,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/30',
    },
    {
      label: 'Safe Vault (L2)',
      value: safeVaultTokens,
      unit: 'WICK',
      icon: Lock,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
    },
    {
      label: 'Rescue Events',
      value: rescueCount,
      unit: 'triggered',
      icon: Zap,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 border-orange-500/30',
    },
    {
      label: 'Total Protected',
      value: totalProtected,
      unit: 'WICK',
      icon: TrendingUp,
      color: 'text-lime-400',
      bgColor: 'bg-lime-500/10 border-lime-500/30',
    },
  ];

  const getStatusIndicator = () => {
    const indicators = {
      idle: { color: 'text-slate-400', bg: 'bg-slate-500/20', text: 'Standby' },
      monitoring: {
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/20',
        text: 'Monitoring',
      },
      secured: { color: 'text-red-400', bg: 'bg-red-500/20', text: 'Secured' },
      recovered: {
        color: 'text-lime-400',
        bg: 'bg-lime-500/20',
        text: 'Recovered',
      },
    };

    return indicators[status];
  };

  const statusInd = getStatusIndicator();

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <div
        className={`${statusInd.bg} border border-${
          status === 'idle'
            ? 'slate-700/30'
            : status === 'monitoring'
              ? 'emerald-500/30'
              : status === 'secured'
                ? 'red-500/30'
                : 'lime-500/30'
        } rounded-xl p-4 flex items-center gap-3`}
      >
        <div className={`w-3 h-3 rounded-full ${statusInd.color} animate-pulse`} />
        <div>
          <p className="text-xs text-slate-400">Current Status</p>
          <p className={`text-lg font-bold capitalize ${statusInd.color}`}>
            {statusInd.text}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`${stat.bgColor} border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-${stat.color
                .replace('text-', 'bg-')
                .replace('400', '500')}/20`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                  <p className={`text-xl font-bold ${stat.color}`}>
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400">{stat.unit}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Info */}
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-slate-700/20">
          <span className="text-sm text-slate-400">Network</span>
          <span className="text-sm font-semibold text-white">
            Solana Devnet
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-slate-700/20">
          <span className="text-sm text-slate-400">Bridge Status</span>
          <span className="text-sm font-semibold text-emerald-400">
            L1 ↔ L2 Active
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-slate-400">Transaction Cost</span>
          <span className="text-sm font-semibold text-lime-400">Zero Gas</span>
        </div>
      </div>
    </div>
  );
}
