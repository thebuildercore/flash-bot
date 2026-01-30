'use client';

import { ScrollArea } from "@/components/ui/scroll-area"

import { useEffect, useRef } from 'react';

interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'alert';
  timestamp: string;
}

interface BotConsoleProps {
  logs: LogEntry[];
  isRunning: boolean;
}

export function BotConsole({ logs, isRunning }: BotConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-emerald-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'alert':
        return 'text-red-500';
      default:
        return 'text-slate-300';
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'alert':
        return '🚨';
      default:
        return '📝';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 border-l border-slate-700/50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between sticky top-0 bg-slate-950 z-10">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
          WickGuard Bot
        </h3>
        <span className="text-xs text-slate-500">LIVE</span>
      </div>

      {/* Console Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-slate-500">
            <div>🤖 WickGuard Protection System</div>
            <div className="mt-2">Ready to connect wallet...</div>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`${getLogColor(log.type)} whitespace-pre-wrap break-words animate-fade-in`}>
              <span className="text-slate-500">[{log.timestamp}]</span> {getLogIcon(log.type)} {log.message}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-700/50 text-xs text-slate-500 sticky bottom-0 bg-slate-950">
        {logs.length > 0 && `${logs.length} events logged`}
      </div>
    </div>
  );
}
