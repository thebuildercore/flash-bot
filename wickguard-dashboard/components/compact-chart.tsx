'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CompactChartProps {
  data: number[];
  status: 'idle' | 'monitoring' | 'secured' | 'recovered';
}

export function CompactChart({ data, status }: CompactChartProps) {
  const chartData = data.map((price, i) => ({
    index: i,
    price: parseFloat(price.toFixed(4)),
  }));

  const getColor = () => {
    switch (status) {
      case 'monitoring':
        return '#10b981';
      case 'secured':
        return '#ef4444';
      case 'recovered':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getStrokeColor = () => {
    switch (status) {
      case 'monitoring':
        return 'url(#gradientGreen)';
      case 'secured':
        return 'url(#gradientRed)';
      case 'recovered':
        return 'url(#gradientOrange)';
      default:
        return 'url(#gradientGray)';
    }
  };

  return (
    <div className="w-full h-32 bg-slate-900/50 rounded-xl border border-slate-700/50 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <defs>
            <linearGradient id="gradientGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientOrange" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientGray" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#64748b" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#64748b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="index" hide />
          <YAxis hide domain={['dataMin - 0.01', 'dataMax + 0.01']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#cbd5e1' }}
            formatter={(value) => `$${Number(value).toFixed(4)}`}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={getColor()}
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
            fill={getStrokeColor()}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
