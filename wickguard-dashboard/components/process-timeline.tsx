'use client';

import React from "react"

import {
  Wallet,
  Zap,
  Shield,
  AlertTriangle,
  Lock,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  icon: React.ReactNode;
  details?: string;
}

interface ProcessTimelineProps {
  events: TimelineEvent[];
  currentStep: number;
}

export function ProcessTimeline({ events, currentStep }: ProcessTimelineProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-xl">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-slate-400" />
        <h3 className="text-lg font-bold text-white">Protection Flow</h3>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isPending = index > currentStep;

          const statusColor = {
            pending: 'text-slate-500',
            'in-progress': 'text-emerald-400 animate-pulse',
            completed: 'text-emerald-400',
            error: 'text-red-400',
          }[event.status];

          const bgColor = {
            pending: 'bg-slate-900/30',
            'in-progress': 'bg-emerald-500/10 border-emerald-500/50',
            completed: 'bg-slate-800/50 border-slate-700/30',
            error: 'bg-red-500/10 border-red-500/50',
          }[event.status];

          return (
            <div key={event.id}>
              <div
                className={`border rounded-xl p-4 transition-all duration-300 ${bgColor} ${
                  isActive ? 'border-emerald-500/80 shadow-lg shadow-emerald-500/20' : 'border-slate-700/30'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                      isActive
                        ? 'bg-emerald-500/30 text-emerald-400'
                        : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {event.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : event.status === 'in-progress' ? (
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    ) : (
                      event.icon
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className={`font-semibold ${statusColor}`}>
                        {event.title}
                      </h4>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {event.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-slate-400 mb-2">
                      {event.description}
                    </p>

                    {event.details && (
                      <div className="bg-slate-800/50 rounded px-3 py-2 text-xs text-slate-300 font-mono">
                        {event.details}
                      </div>
                    )}

                    {isActive && (
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-emerald-400">Processing...</span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  {event.status === 'error' && (
                    <div className="flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Connector */}
              {index < events.length - 1 && (
                <div
                  className={`h-2 flex justify-center py-1 ${
                    isCompleted ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  <div
                    className={`w-0.5 ${
                      isCompleted ? 'bg-emerald-500/60' : 'bg-slate-700/40'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 pt-6 border-t border-slate-700/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">
            Progress
          </span>
          <span className="text-xs font-bold text-emerald-400">
            {currentStep + 1} / {events.length}
          </span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full transition-all duration-500"
            style={{
              width: `${((currentStep + 1) / events.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
