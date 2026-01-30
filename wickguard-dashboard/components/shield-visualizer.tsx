'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Lock, Shield } from 'lucide-react';

interface ShieldVisualizerProps {
  status: 'idle' | 'monitoring' | 'secured';
  priceHistory: number[];
  onEmergencyRescue?: () => void;
}

export function ShieldVisualizer({
  status,
  priceHistory,
  onEmergencyRescue,
}: ShieldVisualizerProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'monitoring':
        return 'from-lime-400 to-emerald-500';
      case 'secured':
        return 'from-red-500 to-red-600';
      default:
        return 'from-slate-600 to-slate-700';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'monitoring':
        return 'Shield Active';
      case 'secured':
        return 'Assets Secured';
      default:
        return 'Ready to Activate';
    }
  };

  return (
    <div className="relative w-full h-80 flex flex-col items-center justify-center">
      {/* Animated Shield Background */}
      <div className={`relative w-48 h-48 ${animate ? 'animate-fade-in' : ''}`}>
        {/* Outer glow */}
        <div
          className={`absolute inset-0 rounded-full blur-3xl opacity-40 transition-all duration-500 ${getStatusColor()}`}
        />

        {/* Shield SVG */}
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full relative z-10"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Shield outline */}
          <defs>
            <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={status === 'monitoring' ? 1 : 0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={status === 'monitoring' ? 1 : 0.3} />
            </linearGradient>
            <linearGradient id="shieldGradientRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={status === 'secured' ? 1 : 0.3} />
              <stop offset="100%" stopColor="#991b1b" stopOpacity={status === 'secured' ? 1 : 0.3} />
            </linearGradient>
          </defs>

          <path
            d="M 100 20 L 170 60 L 170 120 Q 100 200 100 200 Q 30 120 30 60 Z"
            fill={status === 'secured' ? 'url(#shieldGradientRed)' : 'url(#shieldGradient)'}
            stroke={status === 'secured' ? '#ef4444' : '#4ade80'}
            strokeWidth="2"
            className="transition-all duration-500"
          />

          {/* Inner shield pattern */}
          <circle cx="100" cy="80" r="35" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" />
          <circle cx="100" cy="80" r="25" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.2" />
        </svg>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          {status === 'secured' ? (
            <Lock className="w-16 h-16 text-red-500 animate-pulse" />
          ) : status === 'monitoring' ? (
            <Shield className="w-16 h-16 text-emerald-400 animate-pulse" />
          ) : (
            <Shield className="w-16 h-16 text-slate-500" />
          )}
        </div>
      </div>

      {/* Status label */}
      <div className="mt-8 text-center">
        <h2
          className={`text-3xl font-bold transition-colors duration-500 ${
            status === 'secured'
              ? 'text-red-500'
              : status === 'monitoring'
                ? 'text-emerald-400'
                : 'text-slate-400'
          }`}
        >
          {getStatusText()}
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {status === 'monitoring' && '1,000 WICK Tokens Protected'}
          {status === 'secured' && 'Transferred to Safe Vault'}
          {status === 'idle' && 'Awaiting Activation'}
        </p>
      </div>

      {/* Emergency button for secured state */}
      {status === 'secured' && onEmergencyRescue && (
        <button
          onClick={onEmergencyRescue}
          className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 group"
        >
          <AlertTriangle className="w-4 h-4" />
          Return Assets
        </button>
      )}
    </div>
  );
}
