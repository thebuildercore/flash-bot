'use client';

import { Database, Zap, Lock, Send } from 'lucide-react';

export function InfoCards() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Zero-cost L2 transfers with instant execution when crashes are detected',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: Lock,
      title: 'Secure Vault',
      description: 'Safe-guarded storage on MagicBlock Ephemeral Rollup with automatic transfers',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Database,
      title: 'Smart Monitoring',
      description: 'Continuous price tracking with autonomous crash detection algorithms',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Send,
      title: 'Full Control',
      description: 'Manual rescue option for complete control over your asset protection',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/30 p-6 hover:border-slate-600/50 transition-all duration-300 hover:bg-slate-800/50"
          >
            {/* Gradient background on hover */}
            <div
              className={`absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl bg-gradient-to-br ${feature.color}`}
            />

            {/* Content */}
            <div className="relative z-10">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-4 transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="w-full h-full text-white" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>

              {/* Bottom accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
