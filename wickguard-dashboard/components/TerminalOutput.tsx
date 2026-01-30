import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Play, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LogEntry {
  text: string;
  type: "header" | "info" | "success" | "warning" | "error" | "divider" | "status";
  delay: number;
  stage?: string;
}

const terminalLogs: LogEntry[] = [
  { text: "🛡️ WICKGUARD - FINAL VERSION", type: "header", delay: 0, stage: "init" },
  { text: "   Institutional-Grade Liquidation Protection", type: "info", delay: 200 },
  { text: "", type: "divider", delay: 400 },
  { text: "📂 Wallet: CVYvELNx...", type: "info", delay: 600, stage: "wallet" },
  { text: "💰 Balance: 4.78 SOL", type: "info", delay: 800 },
  { text: "", type: "divider", delay: 1000 },
  { text: "🏦 Initializing Assets on L1...", type: "info", delay: 1200 },
  { text: "✅ Minted 1,000 tokens", type: "success", delay: 1600, stage: "mint" },
  { text: "📍 User ATA: 6azYrFSVvtSz51XZhV3J1zzxbYuccocrt2J2bPTTPv41", type: "info", delay: 1800, stage: "userAta" },
  { text: "📍 Safe ATA: 7CW7ZtSnidZPDSphTNiPm69VHoHeguq6cFtGUYVJW3Hs", type: "info", delay: 2000, stage: "safeAta" },
  { text: "", type: "divider", delay: 2200 },
  { text: "⚡ Delegating user account to Ephemeral Rollup...", type: "info", delay: 2400, stage: "delegating" },
  { text: "   ✅ User delegation successful!", type: "success", delay: 3000, stage: "userDelegated" },
  { text: "   📝 Tx: 3JDWux4a1J1nk2PkPhEyvktCWHmcJWxiaat6grw8uUNs", type: "info", delay: 3200 },
  { text: "", type: "divider", delay: 3400 },
  { text: "⚡ Delegating safe account to Ephemeral Rollup...", type: "info", delay: 3600, stage: "delegatingSafe" },
  { text: "   ✅ Safe delegation successful!", type: "success", delay: 4200, stage: "safeDelegated" },
  { text: "   📝 Tx: 29LNWUJN29CFhM9A7fmsPMR4CPSfPvYVb35ZXEctQ6Sr", type: "info", delay: 4400 },
  { text: "", type: "divider", delay: 4600 },
  { text: "⏳ Waiting for L2 sync (15s)...", type: "warning", delay: 4800, stage: "syncing" },
  { text: "", type: "divider", delay: 6000 },
  { text: "💎 Verifying L2 state:", type: "info", delay: 6200, stage: "verifying" },
  { text: "   User ATA: 1000 tokens", type: "info", delay: 6400 },
  { text: "   Safe ATA: 0 tokens", type: "info", delay: 6600 },
  { text: "", type: "divider", delay: 6800 },
  { text: "═══════════════════════════════════════════", type: "divider", delay: 7000 },
  { text: "🛡️  WICKGUARD PROTECTION ACTIVE", type: "header", delay: 7200, stage: "active" },
  { text: "═══════════════════════════════════════════", type: "divider", delay: 7400 },
  { text: "", type: "divider", delay: 7600 },
  { text: "[7:00:18 AM] Price: $135.32 | Shield: ⚪ STANDBY | Rescues: 0", type: "status", delay: 7800, stage: "monitoring" },
  { text: "", type: "divider", delay: 8200 },
  { text: "🚨 LIQUIDATION THRESHOLD BREACHED!", type: "error", delay: 8400, stage: "threat" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "divider", delay: 8600 },
  { text: "   📊 Protecting 1000 tokens...", type: "warning", delay: 8800, stage: "protecting" },
  { text: "   ⚡ Executing atomic rescue on L2...", type: "warning", delay: 9200, stage: "rescuing" },
  { text: "   ✅ ASSETS SECURED ON L2!", type: "success", delay: 10000, stage: "secured" },
  { text: "   ⚡ Execution: 2789ms (avg: 2789ms)", type: "info", delay: 10200 },
  { text: "   📝 Tx: 4AZURygYiezx5rDHTCi3dRXq8euq2YTEYrYbmmDiz84G", type: "info", delay: 10400 },
  { text: "   🔗 https://explorer.solana.com/tx/4AZURyg...?cluster=devnet", type: "info", delay: 10600 },
  { text: "   📊 Verified - User: 0 | Safe: 1000", type: "success", delay: 10800 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "divider", delay: 11000 },
  { text: "", type: "divider", delay: 11200 },
  { text: "[7:00:27 AM] Price: $139.56 | Shield: 🟢 ACTIVE | Rescues: 1", type: "status", delay: 11400 },
  { text: "", type: "divider", delay: 11800 },
  { text: "📈 MARKET RECOVERY", type: "success", delay: 12000, stage: "recovery" },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "divider", delay: 12200 },
  { text: "   📊 Restoring 1000 tokens...", type: "info", delay: 12400, stage: "restoring" },
  { text: "   ✅ Position restored", type: "success", delay: 13000, stage: "restored" },
  { text: "   📊 Final - User: 1000 | Safe: 0", type: "success", delay: 13200 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", type: "divider", delay: 13400 },
  { text: "", type: "divider", delay: 13600 },
  { text: "[7:00:31 AM] Price: $135.98 | Shield: ⚪ STANDBY | Rescues: 1", type: "status", delay: 13800, stage: "complete" },
];

export type BotStage =
  | "standby"          // bot not started
  | "init"             // booting bot
  | "wallet"           // wallet loaded
  | "mint"             // minting tokens
  | "userAta"          // user ATA created
  | "safeAta"          // safe ATA created
  | "delegating"       // delegating user
  | "userDelegated"    // user delegated
  | "delegatingSafe"   // delegating safe
  | "safeDelegated"    // safe delegated
  | "syncing"          // waiting for L2
  | "verifying"        // verify L2 state
  | "active"           // wickguard active
  | "monitoring"       // price monitoring
  | "threat"           // liquidation detected
  | "protecting"       // moving assets
  | "rescuing"         // rescue tx executing
  | "secured"          // assets secured
  | "recovery"         // market recovering
  | "restoring"        // restoring assets
  | "restored"         // fully restored
  | "complete"         // flow finished
  | "idle";
  
// export type BotStage = 
//   | "standby"
//   | "idle" 
//   | "init" 
//   | "wallet" 
//   | "mint" 
//   | "userAta" 
//   | "safeAta" 
//   | "delegating" 
//   | "userDelegated" 
//   | "delegatingSafe" 
//   | "safeDelegated" 
//   | "syncing" 
//   | "verifying" 
//   | "active" 
//   | "monitoring" 
//   | "threat" 
//   | "protecting" 
//   | "rescuing" 
//   | "secured" 
//   | "recovery" 
//   | "restoring" 
//   | "restored" 
//   | "complete"
//   | "restored";

interface TerminalOutputProps {
  onPhaseChange: (phase: "standby" | "rescue" | "secured" | "recovery" | "restored") => void;
  onTokensChange: (user: number, safe: number) => void;
  onStageChange?: (stage: BotStage) => void;
}

const TerminalOutput = ({ onPhaseChange, onTokensChange, onStageChange }: TerminalOutputProps) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  const getLogColor = (type: string) => {
    switch (type) {
      case "header": return "text-cyan-400 font-bold";
      case "success": return "text-green-400";
      case "warning": return "text-amber-400";
      case "error": return "text-red-400 font-bold animate-pulse";
      case "status": return "text-purple-400";
      case "divider": return "text-muted-foreground/50";
      default: return "text-foreground/80";
    }
  };

  const startSimulation = () => {
    setLogs([]);
    setCurrentIndex(0);
    setIsRunning(true);
    onPhaseChange("standby");
    onTokensChange(1000, 0);
    onStageChange?.("init");
  };

  const stopSimulation = () => {
    setIsRunning(false);
  };

  const resetSimulation = () => {
    setLogs([]);
    setCurrentIndex(0);
    setIsRunning(false);
    onPhaseChange("standby");
    onTokensChange(1000, 0);
    onStageChange?.("idle");
  };

  useEffect(() => {
    if (!isRunning || currentIndex >= terminalLogs.length) {
      if (currentIndex >= terminalLogs.length) {
        setIsRunning(false);
      }
      return;
    }

    const log = terminalLogs[currentIndex];
    const prevDelay = currentIndex > 0 ? terminalLogs[currentIndex - 1].delay : 0;
    const timeout = log.delay - prevDelay;

    const timer = setTimeout(() => {
      setLogs(prev => [...prev, log]);
      setCurrentIndex(prev => prev + 1);

      // Update stage
      if (log.stage) {
        onStageChange?.(log.stage as BotStage);
      }

      // Update phase based on log content
      if (log.text.includes("LIQUIDATION THRESHOLD BREACHED")) {
        onPhaseChange("rescue");
      } else if (log.text.includes("ASSETS SECURED ON L2")) {
        onPhaseChange("secured");
        onTokensChange(0, 1000);
      } else if (log.text.includes("MARKET RECOVERY")) {
        onPhaseChange("recovery");
      } else if (log.text.includes("Position restored")) {
        onPhaseChange("restored");
        onTokensChange(1000, 0);
      } else if (log.text.includes("Shield: ⚪ STANDBY") && currentIndex > 20) {
        onPhaseChange("standby");
      }

      // Auto scroll
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [isRunning, currentIndex, onPhaseChange, onTokensChange, onStageChange]);

  return (
    <div className="w-full rounded-2xl bg-black/90 border border-border/50 overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/50 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-sm font-mono text-muted-foreground">~/flash-bot$ node bot.js</span>
        </div>
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <Button 
              size="sm" 
              onClick={startSimulation}
              className="h-7 px-3 bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="w-3 h-3 mr-1" />
              Run
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={stopSimulation}
              className="h-7 px-3"
            >
              <Square className="w-3 h-3 mr-1" />
              Stop
            </Button>
          )}
          <Button 
            size="sm" 
            variant="outline"
            onClick={resetSimulation}
            className="h-7 px-3"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={terminalRef}
        className="h-80 overflow-y-auto p-4 font-mono text-xs leading-relaxed"
      >
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.1 }}
              className={`${getLogColor(log.type)} whitespace-pre-wrap`}
            >
              {log.text || "\u00A0"}
            </motion.div>
          ))}
        </AnimatePresence>
        {isRunning && (
          <motion.span
            className="inline-block w-2 h-4 bg-green-400"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
};

export default TerminalOutput;
