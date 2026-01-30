'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';

interface PriceMonitorProps {
  currentPrice: number;
  priceHistory: number[];
  status: 'idle' | 'monitoring' | 'secured';
}

export function PriceMonitor({ currentPrice, priceHistory, status }: PriceMonitorProps) {
  const minPrice = Math.min(...priceHistory);
  const maxPrice = Math.max(...priceHistory);
  const avgPrice = priceHistory.reduce((a, b) => a + b, 0) / priceHistory.length;

  const priceChange = ((currentPrice - priceHistory[0]) / priceHistory[0]) * 100;
  const isDown = priceChange < 0;

  // Generate SVG path for sparkline
  const getSparklinePath = () => {
    const width = 400;
    const height = 60;
    const padding = 8;

    const dataMin = minPrice;
    const dataMax = maxPrice;
    const range = dataMax - dataMin || 1;

    const points = priceHistory.map((price, i) => {
      const x = padding + (i / (priceHistory.length - 1)) * (width - padding * 2);
      const y = height - padding - ((price - dataMin) / range) * (height - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="w-full space-y-4">
      {/* Current Price Card */}
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-slate-600/50">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">WICK / SOL Price</p>
            <h2 className="text-4xl font-bold text-white">${currentPrice.toFixed(4)}</h2>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
              isDown
                ? 'bg-red-500/20 text-red-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {isDown ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )}
            <span className="font-semibold text-sm">{priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%</span>
          </div>
        </div>

        {/* Sparkline Chart */}
        <svg
          viewBox="0 0 400 60"
          className="w-full h-16 mt-4"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          <line x1="0" y1="30" x2="400" y2="30" stroke="#475569" strokeWidth="1" opacity="0.3" />

          {/* Area fill */}
          <defs>
            <linearGradient
              id="priceGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={isDown ? '#ef4444' : '#4ade80'}
                stopOpacity={status === 'monitoring' ? 0.3 : 0.15}
              />
              <stop
                offset="100%"
                stopColor={isDown ? '#ef4444' : '#4ade80'}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <path
            d={`${getSparklinePath()} L 392 60 L 8 60 Z`}
            fill="url(#priceGradient)"
          />

          {/* Price line */}
          <path
            d={getSparklinePath()}
            stroke={isDown ? '#ef4444' : '#4ade80'}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-600/30">
          <div>
            <p className="text-slate-500 text-xs font-medium mb-1">High</p>
            <p className="text-lg font-semibold text-emerald-400">${maxPrice.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium mb-1">Average</p>
            <p className="text-lg font-semibold text-slate-300">${avgPrice.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs font-medium mb-1">Low</p>
            <p className="text-lg font-semibold text-red-400">${minPrice.toFixed(4)}</p>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      {status === 'monitoring' && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-emerald-300 text-sm font-medium">
              ✓ Monitoring active • Crash detection enabled
            </p>
          </div>
        </div>
      )}

      {status === 'secured' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <p className="text-red-300 text-sm font-medium">
              ⚠ Emergency: Assets transferred to Safe Vault
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
