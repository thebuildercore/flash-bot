import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, Database, Lock, User, Wallet, Activity, AlertTriangle, CheckCircle, RefreshCw, TrendingUp, Monitor, Coins } from "lucide-react";
import type { BotStage } from "../lib/wickguard";
interface WickGuardDiagramProps {
  phase: "standby" | "rescue" | "secured" | "recovery" | "restored";
  userTokens: number;
  safeTokens: number;
  botStage: BotStage;
}

// Glowing animated line between nodes
const FlowLine = ({
  isActive,
  color = "yellow",
  direction = "horizontal",
  className = ""
}: {
  isActive: boolean;
  color?: "yellow" | "green" | "purple" | "blue";
  direction?: "horizontal" | "vertical" | "diagonal";
  className?: string;
}) => {
  const colors = {
    yellow: {
      from: "#fbbf24",
      to: "#f59e0b",
      glow: "rgba(251, 191, 36, 0.6)"
    },
    green: {
      from: "#4ade80",
      to: "#22c55e",
      glow: "rgba(74, 222, 128, 0.6)"
    },
    purple: {
      from: "#a855f7",
      to: "#7c3aed",
      glow: "rgba(168, 85, 247, 0.6)"
    },
    blue: {
      from: "#60a5fa",
      to: "#3b82f6",
      glow: "rgba(96, 165, 250, 0.6)"
    }
  };
  const c = colors[color];
  return <div className={`relative ${direction === "horizontal" ? "w-full h-1" : direction === "vertical" ? "w-1 h-full" : "w-full h-1"} ${className}`}>
      {/* Base line */}
      <div className="absolute inset-0 bg-border/30 rounded-full" />
      
      {/* Animated glow line */}
      <AnimatePresence>
        {isActive && <motion.div className="absolute inset-0 rounded-full" style={{
        background: `linear-gradient(90deg, transparent, ${c.from}, ${c.to}, transparent)`,
        boxShadow: `0 0 10px ${c.glow}, 0 0 20px ${c.glow}`
      }} initial={{
        scaleX: 0,
        opacity: 0
      }} animate={{
        scaleX: 1,
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.5,
        ease: "easeOut"
      }} />}
      </AnimatePresence>

      {/* Traveling particle */}
      <AnimatePresence>
        {isActive && <motion.div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full" style={{
        background: `radial-gradient(circle, ${c.from}, transparent)`,
        boxShadow: `0 0 15px ${c.glow}, 0 0 30px ${c.glow}`
      }} initial={{
        left: "0%",
        opacity: 0
      }} animate={{
        left: "100%",
        opacity: [0, 1, 1, 0]
      }} transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }} />}
      </AnimatePresence>
    </div>;
};

// Node component with glow effects
const DiagramNode = ({
  icon,
  label,
  sublabel,
  tokens,
  isActive,
  isHighlighted,
  glowColor = "blue",
  size = "md"
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  tokens?: number;
  isActive: boolean;
  isHighlighted?: boolean;
  glowColor?: "blue" | "green" | "yellow" | "purple" | "amber" | "red";
  size?: "sm" | "md" | "lg";
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-14 h-14",
    lg: "w-16 h-16"
  };
  const glowColors = {
    blue: {
      border: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.15)",
      glow: "rgba(59, 130, 246, 0.5)"
    },
    green: {
      border: "#22c55e",
      bg: "rgba(34, 197, 94, 0.15)",
      glow: "rgba(34, 197, 94, 0.5)"
    },
    yellow: {
      border: "#eab308",
      bg: "rgba(234, 179, 8, 0.15)",
      glow: "rgba(234, 179, 8, 0.5)"
    },
    purple: {
      border: "#a855f7",
      bg: "rgba(168, 85, 247, 0.15)",
      glow: "rgba(168, 85, 247, 0.5)"
    },
    amber: {
      border: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.15)",
      glow: "rgba(245, 158, 11, 0.5)"
    },
    red: {
      border: "#ef4444",
      bg: "rgba(239, 68, 68, 0.15)",
      glow: "rgba(239, 68, 68, 0.5)"
    }
  };
  const gc = glowColors[glowColor];
  return <motion.div className="flex flex-col items-center gap-1 relative" animate={{
    scale: isHighlighted ? 1.1 : isActive ? 1.02 : 1
  }} transition={{
    duration: 0.3
  }}>
      {/* Pulse ring for highlighted */}
      {isHighlighted && <motion.div className="absolute -inset-2 rounded-2xl" style={{
      border: `2px solid ${gc.border}`
    }} animate={{
      scale: [1, 1.2, 1],
      opacity: [0.8, 0, 0.8]
    }} transition={{
      duration: 1.5,
      repeat: Infinity
    }} />}
      
      <motion.div className={`${sizeClasses[size]} rounded-xl flex items-center justify-center border-2 backdrop-blur-sm relative overflow-hidden`} style={{
      borderColor: isActive || isHighlighted ? gc.border : 'rgba(255,255,255,0.1)',
      backgroundColor: isActive || isHighlighted ? gc.bg : 'rgba(0,0,0,0.4)',
      boxShadow: isHighlighted ? `0 0 30px ${gc.glow}, 0 0 60px ${gc.glow}` : isActive ? `0 0 15px ${gc.glow}` : 'none'
    }} animate={isHighlighted ? {
      scale: [1, 1.05, 1]
    } : {}} transition={{
      duration: 0.8,
      repeat: Infinity
    }}>
        <div className="relative z-10">{icon}</div>
      </motion.div>
      
      <span className="text-[10px] font-semibold text-foreground text-center leading-tight max-w-16">{label}</span>
      {sublabel && <span className="text-[8px] text-muted-foreground text-center">{sublabel}</span>}
      {tokens !== undefined && <motion.span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full" style={{
      backgroundColor: gc.bg,
      color: gc.border,
      border: `1px solid ${gc.border}`
    }}>
          {tokens} WICK
        </motion.span>}
    </motion.div>;
};

// Ephemeral Bridge Portal
const BridgePortal = ({
  isActive,
  isShining
}: {
  isActive: boolean;
  isShining: boolean;
}) => <div className="relative w-24 h-24 flex items-center justify-center mx-6">
    {/* Outer spinning ring */}
    <motion.div className="absolute inset-0 rounded-full" style={{
    border: isShining ? '3px solid #a855f7' : '2px solid rgba(168, 85, 247, 0.3)',
    boxShadow: isShining ? '0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(168, 85, 247, 0.4)' : 'none'
  }} animate={isActive ? {
    rotate: 360
  } : {}} transition={{
    duration: 6,
    repeat: Infinity,
    ease: "linear"
  }} />
    
    {/* Middle gradient ring */}
    <motion.div className="absolute inset-2 rounded-full overflow-hidden" animate={isActive ? {
    rotate: -360
  } : {}} transition={{
    duration: 4,
    repeat: Infinity,
    ease: "linear"
  }}>
      <div className="w-full h-full rounded-full" style={{
      background: isShining ? 'conic-gradient(from 0deg, #a855f7, #7c3aed, #6366f1, #a855f7)' : 'conic-gradient(from 0deg, rgba(168, 85, 247, 0.3), rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))'
    }} />
    </motion.div>
    
    {/* Inner core */}
    <motion.div className="absolute inset-4 rounded-full flex items-center justify-center" style={{
    background: isShining ? 'radial-gradient(circle, rgba(168, 85, 247, 0.4), rgba(0,0,0,0.9))' : 'rgba(0,0,0,0.8)'
  }} animate={isShining ? {
    scale: [1, 1.1, 1]
  } : {}} transition={{
    duration: 1,
    repeat: Infinity
  }}>
      <Zap className={`w-6 h-6 ${isShining ? 'text-purple-400' : 'text-purple-600'}`} />
    </motion.div>

    {/* Energy particles when shining */}
    {isShining && <>
        {[...Array(8)].map((_, i) => <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-purple-400" style={{
      top: '50%',
      left: '50%'
    }} animate={{
      x: [0, Math.cos(i * 45 * Math.PI / 180) * 40],
      y: [0, Math.sin(i * 45 * Math.PI / 180) * 40],
      opacity: [1, 0],
      scale: [1, 0.5]
    }} transition={{
      duration: 1,
      repeat: Infinity,
      delay: i * 0.1
    }} />)}
      </>}
    
    <span className="absolute -bottom-5 text-[8px] text-purple-400 font-semibold whitespace-nowrap">
      Ephemeral Rollup
    </span>
  </div>;

// L2 Protection Circle
const L2Circle = ({
  isActive,
  isGreen,
  botStage,
  userTokens,
  safeTokens
}: {
  isActive: boolean;
  isGreen: boolean;
  botStage: BotStage;
  userTokens: number;
  safeTokens: number;
}) => {
  const isThreat = botStage === "threat" || botStage === "protecting" || botStage === "rescuing";
  const isSecured = botStage === "secured";
  return <div className="relative w-52 h-52 flex items-center justify-center">
      {/* Outer protection ring */}
      <motion.div className="absolute inset-0 rounded-full border-2" style={{
      borderColor: isGreen ? '#22c55e' : isActive ? '#3b82f6' : 'rgba(255,255,255,0.1)',
      boxShadow: isGreen ? '0 0 40px rgba(34, 197, 94, 0.4), inset 0 0 30px rgba(34, 197, 94, 0.1)' : isActive ? '0 0 30px rgba(59, 130, 246, 0.3), inset 0 0 20px rgba(59, 130, 246, 0.1)' : 'none'
    }} animate={isActive ? {
      scale: [1, 1.02, 1]
    } : {}} transition={{
      duration: 2,
      repeat: Infinity
    }} />

      {/* Inner content */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        {/* Bot Monitor & Price */}
        <div className="flex items-center gap-4">
          <DiagramNode icon={<Monitor className="w-4 h-4 text-blue-400" />} label="WickGuard Bot" isActive={isActive} glowColor="blue" size="sm" />
          <motion.div className="flex flex-col items-center" animate={isThreat ? {
          scale: [1, 1.15, 1]
        } : {}} transition={{
          duration: 0.4,
          repeat: isThreat ? Infinity : 0
        }}>
            <Activity className={`w-5 h-5 ${isThreat ? 'text-red-500' : 'text-muted-foreground'}`} />
            <span className={`text-[8px] font-bold ${isThreat ? 'text-red-500' : 'text-muted-foreground'}`}>
              {isThreat ? '⚠️ THREAT' : 'Price Feed'}
            </span>
          </motion.div>
        </div>

        {/* Token ATAs with rescue flow */}
        <div className="flex items-center gap-3">
          <DiagramNode icon={<Database className="w-4 h-4 text-blue-400" />} label="User ATA" sublabel="(L2)" tokens={isSecured ? 0 : userTokens} isActive={isActive && !isSecured} isHighlighted={isThreat} glowColor={isThreat ? "red" : "blue"} size="sm" />
          
          {/* Rescue arrow */}
          <div className="flex flex-col items-center gap-0.5">
            <FlowLine isActive={isThreat || isSecured} color="yellow" className="w-8" />
            <span className="text-[7px] text-amber-400 font-bold">
              {isThreat ? 'RESCUE →' : ''}
            </span>
          </div>

          <DiagramNode icon={<Lock className="w-4 h-4 text-amber-400" />} label="Safe ATA" sublabel="(L2)" tokens={isSecured ? safeTokens : 0} isActive={isSecured} isHighlighted={isSecured} glowColor={isSecured ? "green" : "amber"} size="sm" />
        </div>

        {/* Status indicator */}
        <motion.div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold ${isSecured ? 'bg-green-500/20 text-green-400 border border-green-500/30' : isThreat ? 'bg-red-500/20 text-red-400 border border-red-500/30' : isActive ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-muted/30 text-muted-foreground'}`} animate={isThreat ? {
        scale: [1, 1.05, 1]
      } : {}} transition={{
        duration: 0.5,
        repeat: isThreat ? Infinity : 0
      }}>
          {isSecured ? <CheckCircle className="w-3 h-3" /> : isThreat ? <AlertTriangle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
          {isSecured ? 'SECURED' : isThreat ? 'RESCUING' : isActive ? 'MONITORING' : 'IDLE'}
        </motion.div>
      </div>
    </div>;
};
const WickGuardDiagram = ({
  phase,
  userTokens,
  safeTokens,
  botStage
}: WickGuardDiagramProps) => {
  // Determine which elements are active based on botStage
  const walletActive = ["wallet", "mint", "userAta", "safeAta", "delegating", "userDelegated", "delegatingSafe", "safeDelegated"].includes(botStage);
  const mintActive = ["mint", "userAta", "safeAta", "delegating", "userDelegated", "delegatingSafe", "safeDelegated"].includes(botStage);
  const userAtaActive = ["userAta", "safeAta", "delegating", "userDelegated", "delegatingSafe", "safeDelegated", "syncing", "verifying", "active", "monitoring", "restored", "complete"].includes(botStage);
  const bridgeShining = ["userDelegated", "safeDelegated", "syncing"].includes(botStage);
  const bridgeActive = ["delegating", "userDelegated", "delegatingSafe", "safeDelegated", "syncing", "verifying", "threat", "protecting", "rescuing", "recovery", "restoring"].includes(botStage);
  const l2Active = ["verifying", "active", "monitoring", "threat", "protecting", "rescuing", "secured", "recovery", "restoring"].includes(botStage);
  const l2Green = ["secured", "recovery"].includes(botStage);
  const flowToBridge = ["delegating", "userDelegated", "delegatingSafe", "safeDelegated"].includes(botStage);
  const flowToL2 = ["syncing", "verifying"].includes(botStage);
  const flowToFinal = ["secured", "recovery", "restoring", "restored"].includes(botStage);
  const finalActive = ["secured", "recovery", "restoring", "restored", "complete"].includes(botStage);
  return <div className="w-full p-4 md:p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-700/50 overflow-hidden">
      {/* Title */}
      <div className="text-center mb-6">
        <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          WickGuard: Unified Protection & Recovery Flow
        </h2>
      </div>

      {/* Section Headers */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${walletActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
            1. Onboarding & L1 Setup
          </span>
        </div>
        <div className="text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${l2Active ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
            L2 Protected Environment
          </span>
        </div>
        <div className="text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${finalActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
            Final State & Recovery
          </span>
        </div>
      </div>

      {/* Main Flow Diagram */}
      <div className="min-h-[280px] flex-row flex items-center justify-between gap-[5px]">
        
        {/* Section 1: L1 Setup */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0 bg-[#0d0c2c]">
          {/* Wallet & Mint Row */}
          <div className="flex items-center gap-3">
            <DiagramNode icon={<Wallet className="w-4 h-4 text-purple-400" />} label="Wallet" sublabel="Phantom" isActive={walletActive} isHighlighted={botStage === "wallet"} glowColor="purple" size="sm" />
            <FlowLine isActive={mintActive} color="green" className="w-6" />
            <DiagramNode icon={<Coins className="w-4 h-4 text-purple-400" />} label="Mint WICK" sublabel="Token" isActive={mintActive} isHighlighted={botStage === "mint"} glowColor="purple" size="sm" />
          </div>

          {/* Flow down to User ATA */}
          <div className="h-4 flex items-center justify-center">
            <FlowLine isActive={userAtaActive} color="green" direction="vertical" className="h-full w-1" />
          </div>

          {/* User ATA L1 */}
          <DiagramNode icon={<Database className="w-5 h-5 text-blue-400" />} label="User ATA" sublabel="(L1)" tokens={userAtaActive && !flowToL2 ? userTokens : undefined} isActive={userAtaActive} isHighlighted={botStage === "userAta"} glowColor="blue" size="md" />
        </div>

        {/* Flow to Bridge */}
        <div className="flex-1 flex items-center justify-center max-w-16">
          <FlowLine isActive={flowToBridge} color="yellow" className="w-full" />
        </div>

        {/* Bridge Portal */}
        <BridgePortal isActive={bridgeActive} isShining={bridgeShining} />

        {/* Flow to L2 */}
        <div className="flex-1 flex items-center justify-center max-w-16">
          <FlowLine isActive={flowToL2 || l2Active} color={l2Active ? "blue" : "yellow"} className="w-full" />
        </div>

        {/* L2 Protection Circle */}
        <L2Circle isActive={l2Active} isGreen={l2Green} botStage={botStage} userTokens={userTokens} safeTokens={safeTokens} />

        {/* Flow to Final */}
        <div className="flex-1 flex items-center justify-center max-w-16">
          <FlowLine isActive={flowToFinal} color="green" className="w-full" />
        </div>

        {/* Section 3: Final State */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          {/* Secured indicator */}
          <motion.div className={`flex items-center gap-1.5 ${finalActive ? 'text-green-400' : 'text-slate-600'}`} animate={finalActive ? {
          scale: [1, 1.05, 1]
        } : {}} transition={{
          duration: 1,
          repeat: Infinity
        }}>
            <Shield className="w-6 h-6" />
            <span className="text-xs font-bold">Assets Secured</span>
          </motion.div>

          {/* Safe Vault */}
          <DiagramNode icon={<Lock className="w-5 h-5 text-amber-400" />} label="Safe Vault" sublabel="ATA (L2)" tokens={finalActive ? safeTokens : undefined} isActive={finalActive} isHighlighted={botStage === "secured"} glowColor="green" size="md" />

          {/* Recovery flow */}
          <motion.div className={`flex items-center gap-1 ${["recovery", "restoring", "restored"].includes(botStage) ? 'text-green-400' : 'text-slate-600'}`} animate={botStage === "recovery" || botStage === "restoring" ? {
          y: [0, -3, 0]
        } : {}} transition={{
          duration: 0.8,
          repeat: Infinity
        }}>
            <TrendingUp className="w-4 h-4" />
            <span className="text-[9px] font-semibold">Market Recovery</span>
          </motion.div>

          {/* Restore */}
          <motion.div className={`flex items-center gap-1 ${botStage === "restored" || botStage === "complete" ? 'text-green-400' : 'text-slate-600'}`} animate={botStage === "restored" ? {
          scale: [1, 1.1, 1]
        } : {}} transition={{
          duration: 0.6,
          repeat: Infinity
        }}>
            <RefreshCw className={`w-4 h-4 ${botStage === "restoring" ? 'animate-spin' : ''}`} />
            <span className="text-[9px] font-semibold">Restore Tx</span>
          </motion.div>
        </div>
      </div>

      {/* Current Stage Display */}
      <div className="mt-4 flex justify-center">
        <motion.div className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50" key={botStage} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }}>
          <span className="text-[10px] text-slate-400">Current Stage: </span>
          <span className="text-[11px] font-mono font-bold text-primary">{botStage.toUpperCase()}</span>
        </motion.div>
      </div>
    </div>;
};
export default WickGuardDiagram;