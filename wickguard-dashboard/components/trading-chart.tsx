'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface TradingChartProps {
  priceHistory: number[];
  status: 'idle' | 'monitoring' | 'secured' | 'recovered';
}

export function TradingChart({ priceHistory, status }: TradingChartProps) {
  const chartData = useMemo(() => {
    return priceHistory.map((price, idx) => ({
      time: `${idx}s`,
      price: Math.round(price * 10000) / 10000,
      timestamp: idx,
    }));
  }, [priceHistory]);

  const avgPrice =
    priceHistory.reduce((a, b) => a + b, 0) / priceHistory.length;
  const minPrice = Math.min(...priceHistory);
  const maxPrice = Math.max(...priceHistory);

  const getChartColor = () => {
    switch (status) {
      case 'secured':
        return '#ff4757';
      case 'recovered':
        return '#65ddb9';
      case 'monitoring':
        return '#84cc16';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm text-slate-500 mb-1">Current Price</p>
            <p className="text-4xl font-bold text-white">
              ${priceHistory[priceHistory.length - 1].toFixed(4)}
            </p>
            <p className="text-xs text-slate-400 mt-2">WICK/SOL</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-xs text-slate-500 mb-1">24H High</p>
              <p className="text-lg font-semibold text-emerald-400">
                ${maxPrice.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">24H Low</p>
              <p className="text-lg font-semibold text-red-400">
                ${minPrice.toFixed(4)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Average</p>
              <p className="text-lg font-semibold text-blue-400">
                ${avgPrice.toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.3} />
                <stop offset="95%" stopColor={getChartColor()} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="time"
              stroke="rgba(148, 163, 184, 0.5)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgba(148, 163, 184, 0.5)"
              style={{ fontSize: '12px' }}
              domain="dataMin - 0.01"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(226, 232, 240, 0.2)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#f1f5f9' }}
              formatter={(value: number) => `$${value.toFixed(4)}`}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={getChartColor()}
              strokeWidth={2}
              fill="url(#gradientColor)"
              dot={false}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-2">24H Change</p>
          <p
            className={`text-lg font-bold ${
              priceHistory[priceHistory.length - 1] >= priceHistory[0]
                ? 'text-emerald-400'
                : 'text-red-400'
            }`}
          >
            {(
              (
                (priceHistory[priceHistory.length - 1] - priceHistory[0]) /
                priceHistory[0]
              ) * 100
            ).toFixed(2)}
            %
          </p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-2">Volume</p>
          <p className="text-lg font-bold text-blue-400">1.2M SOL</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-xs text-slate-500 mb-2">Status</p>
          <p
            className={`text-lg font-bold capitalize ${
              status === 'secured'
                ? 'text-red-400'
                : status === 'monitoring'
                  ? 'text-emerald-400'
                  : 'text-slate-400'
            }`}
          >
            {status}
          </p>
        </div>
      </div>
    </div>
  );
}
