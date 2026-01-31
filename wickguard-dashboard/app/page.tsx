'use client';

import { useState, useEffect } from 'react';
import { io } from "socket.io-client"; 
import { BotConsole } from '@/components/bot-console';
import WickGuardDiagram from '@/components/WickGuardDiagram';
import { DashboardHeader } from '@/components/dashboard-header';
import { BotStage, stageToPhase } from "@/lib/wickguard";

// --- TYPES ---
interface LogEntry {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning' | 'alert';
  timestamp: string;
}

export default function Home() {
  // State
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [detailedBotStage, setDetailedBotStage] = useState<BotStage>("standby");
  const [userTokens, setUserTokens] = useState(0);
  const [safeVaultTokens, setSafeVaultTokens] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  // --- CONNECT TO SOCKET SERVER ---
  useEffect(() => {
    const socket = io("http://localhost:3001");

    socket.on("connect", () => {
      setIsConnected(true);
      addLog("Connected to Bot Bridge Server", "success");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      addLog("Disconnected from Bot Bridge Server", "error");
    });

    // 1. Listen for Logs
    socket.on("ui-log", (data) => {
      addLog(data.message, data.type);
    });

    // 2. Listen for Stage Updates
    socket.on("ui-stage", (stage: BotStage) => {
      setDetailedBotStage(stage);
    });

    // 3. Listen for Price Updates
    socket.on("ui-price", (price: number) => {
      setCurrentPrice(price);
    });

    // 4. Listen for Balance Updates
    socket.on("ui-balance", (data: { user: number, safe: number }) => {
      setUserTokens(data.user);
      setSafeVaultTokens(data.safe);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Helper to add logs locally
  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' | 'alert') => {
    setLogs((prev) => [...prev, {
      id: Math.random().toString(36),
      message, type, timestamp: new Date().toLocaleTimeString(),
    }]);
  };

  const phase = stageToPhase(detailedBotStage);

  return (
    <div className="min-h-screen bg-slate-950 text-foreground flex flex-col">
      <DashboardHeader walletConnected={isConnected} />

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 to-slate-900">
          <div className="p-8 space-y-6">
            
            {/* Status Banner */}
            {!isConnected && (
              <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-lg text-center text-red-400">
                ⚠️ Bridge Server Not Connected. Run <code>node server.js</code>
              </div>
            )}

            {/* Price Ticker */}
            <div className="text-center mb-4">
              <span className="text-slate-400">Current Asset Price: </span>
              <span className={`font-mono font-bold text-xl ${currentPrice < 136 ? 'text-red-500' : 'text-green-500'}`}>
                ${currentPrice.toFixed(2)}
              </span>
            </div>

            {/* Diagram */}
            <WickGuardDiagram 
              botStage={detailedBotStage}
              phase={phase}
              userTokens={userTokens}
              safeTokens={safeVaultTokens}
            />
          </div>
        </main>

        {/* Console Sidebar */}
        <div className="w-96 border-l border-slate-700/50 flex-shrink-0 bg-slate-900">
          <BotConsole logs={logs} isRunning={isConnected} />
        </div>
      </div>
    </div>
  );
}

