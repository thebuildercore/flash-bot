// // // // // 'use client';

// // // // // import { useState, useEffect } from 'react';
// // // // // import { BotConsole } from '@/components/bot-console';
// // // // // //import { VisualFlow } from '@/components/visual-flow';
// // // // // import  WickGuardDiagram  from '@/components/WickGuardDiagram';
// // // // // import { DashboardHeader } from '@/components/dashboard-header';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import { Wallet, Zap, RotateCcw } from 'lucide-react';
// // // // // import { BotStage, stageToPhase } from "@/lib/wickguard";

// // // // // interface LogEntry {
// // // // //   id: string;
// // // // //   message: string;
// // // // //   type: 'info' | 'success' | 'error' | 'warning' | 'alert';
// // // // //   timestamp: string;
// // // // // }

// // // // // interface TimelineEvent {
// // // // //   step: number;
// // // // //   title: string;
// // // // //   description: string;
// // // // //   status: 'pending' | 'completed';
// // // // // }

// // // // // const stageToBotStage = (stage: number): BotStage => {
// // // // //   switch (stage) {
// // // // //     case 0: return "standby";
// // // // //     case 1: return "wallet";
// // // // //     case 2: return "mint";
// // // // //     case 3: return "monitoring";
// // // // //     case 4: return "rescuing";
// // // // //     case 5: return "restored";
// // // // //     default: return "standby";
// // // // //   }
// // // // // };
// // // // // const botStage = stageToBotStage(stage);


// // // // // export default function Home() {
// // // // //   const [logs, setLogs] = useState<LogEntry[]>([]);
// // // // //   const [stage, setStage] = useState(0); // 0: idle, 1: l1-setup, 2: bridging, 3: monitoring, 4: crash, 5: recovered
// // // // //   const [userTokens, setUserTokens] = useState(0);
// // // // //   const [safeVaultTokens, setSafeVaultTokens] = useState(0);
// // // // //   const [isRunning, setIsRunning] = useState(false);
// // // // //   const [priceHistory, setPriceHistory] = useState(
// // // // //     Array(30).fill(0).map(() => 0.2847 + (Math.random() - 0.5) * 0.002)
// // // // //   );
// // // // //   const [walletConnected, setWalletConnected] = useState(false);
// // // // //   const [l2Active, setL2Active] = useState(false);
// // // // //   const [protectionActive, setProtectionActive] = useState(false);

// // // // //   const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' | 'alert') => {
// // // // //     const timestamp = new Date().toLocaleTimeString('en-US', {
// // // // //       hour: '2-digit',
// // // // //       minute: '2-digit',
// // // // //       second: '2-digit',
// // // // //       hour12: true,
// // // // //     });
// // // // //     setLogs((prev) => [...prev, {
// // // // //       id: Math.random().toString(36),
// // // // //       message,
// // // // //       type,
// // // // //       timestamp,
// // // // //     }]);
// // // // //   };

// // // // //   const handleActivateL2 = async () => {
// // // // //     // Placeholder for handleActivateL2 function
// // // // //   };

// // // // //   const handleEmergencyRescue = async () => {
// // // // //     // Placeholder for handleEmergencyRescue function
// // // // //   };

// // // // //   // Price simulation
// // // // //   useEffect(() => {
// // // // //     if (stage !== 3 && stage !== 4 && stage !== 5) return;

// // // // //     const interval = setInterval(() => {
// // // // //       setPriceHistory((prev) => {
// // // // //         const lastPrice = prev[prev.length - 1];
// // // // //         const bias = stage === 5 ? 0.3 : stage === 4 ? -0.8 : -0.45;
// // // // //         const change = (Math.random() - bias) * 0.003;
// // // // //         const newPrice = Math.max(0.15, Math.min(0.35, lastPrice + change));
// // // // //         const newHistory = [...prev.slice(1), newPrice];

// // // // //         if (newPrice < 0.22 && stage === 3) {
// // // // //           console.log('[v0] Price crash detected, triggering rescue');
// // // // //           setStage(4);
// // // // //           addLog('🚨 LIQUIDATION THRESHOLD BREACHED!', 'alert');
// // // // //           addLog('Protecting 1000 tokens...', 'warning');
// // // // //           addLog('Executing atomic rescue on L2...', 'info');
// // // // //         }

// // // // //         return newHistory;
// // // // //       });
// // // // //     }, 500);

// // // // //     return () => clearInterval(interval);
// // // // //   }, [stage]);

// // // // //   const handleConnectWallet = async () => {
// // // // //     setIsRunning(true);
// // // // //     setLogs([]);
// // // // //     addLog('🤖 WickGuard Protection System Initializing...', 'info');
    
// // // // //     await new Promise((r) => setTimeout(r, 300));
// // // // //     addLog('📂 Wallet: CVYvELNx...8uLk', 'success');
// // // // //     addLog('Balance: 4.78 SOL', 'info');
    
// // // // //     await new Promise((r) => setTimeout(r, 400));
// // // // //     setStage(1);
// // // // //     setWalletConnected(true);
// // // // //     addLog('🏦 Initializing Assets on L1...', 'info');
// // // // //   };

// // // // //   const handleActivateProtection = async () => {
// // // // //     setStage(2);
// // // // //     setL2Active(true);
// // // // //     addLog('💎 Minting 1,000 WICK tokens on Solana L1...', 'info');
    
// // // // //     await new Promise((r) => setTimeout(r, 600));
// // // // //     addLog('✅ Token mint successful!', 'success');
// // // // //     addLog('📍 User ATA (L1): 6azYrFSVvtSz51XZhV3J1zzxbYuccocrt2J2bPTTPv41', 'success');
// // // // //     addLog('💰 User balance: 1,000 WICK', 'info');
    
// // // // //     await new Promise((r) => setTimeout(r, 400));
// // // // //     addLog('📍 Safe Vault ATA (L1): 7CW7ZtSnidZPDSphTNiPm69VHoHeguq6cFtGUYVJW3Hs', 'success');
// // // // //     addLog('💰 Safe balance: 0 WICK', 'info');
    
// // // // //     await new Promise((r) => setTimeout(r, 600));
// // // // //     addLog('⚡ Delegating user account to MagicBlock Ephemeral Rollup...', 'info');
// // // // //     addLog('📡 Broadcasting delegation transaction...', 'info');
    
// // // // //     await new Promise((r) => setTimeout(r, 500));
// // // // //     addLog('✅ User account delegation successful!', 'success');
// // // // //     addLog('📝 Delegation Tx: 3JDWux4a1J1nk2PkPhEyvktCWHmcJWxiaat6grw8uUNs4iFwXtqeAPcHRA8mfzWkmgWp2sFqoGnpjc1Mq9tKGmC8', 'success');
// // // // //     addLog('⏱️ Confirmation: 3 slots', 'info');
    
// // // // //     await new Promise((r) => setTimeout(r, 400));
// // // // //     addLog('⚡ Delegating safe vault account to MagicBlock Ephemeral Rollup...', 'info');
// // // // //     addLog('📡 Broadcasting delegation transaction...', 'info');
    
// // // // //     await new Promise((r) => setTimeout(r, 500));
// // // // //     addLog('✅ Safe vault account delegation successful!', 'success');
// // // // //     addLog('📝 Delegation Tx: 29LNWUJN29CFhM9A7fmsPMR4CPSfPvYVb35ZXEctQ6Sr69LaNYfG8jJtXEAdZzGyJaNwydcczGpCidWydujatvnL', 'success');
// // // // //     addLog('⏱️ Confirmation: 3 slots', 'info');
    
// // // // //     await new Promise((r) => setTimeout(r, 600));
// // // // //     addLog('🌉 L2 Bridge: Syncing accounts to Ephemeral Rollup...', 'info');
// // // // //     addLog('⏳ Waiting for L2 state finality (12 seconds)...', 'warning');
    
// // // // //     await new Promise((r) => setTimeout(r, 1500));
// // // // //     setStage(3);
// // // // //     setProtectionActive(true);
// // // // //     setUserTokens(1000);
// // // // //     addLog('✅ L2 State Synchronized!', 'success');
// // // // //     addLog('💎 Verifying L2 account states:', 'info');
// // // // //     addLog('📊 User ATA (L2): 1,000 WICK', 'success');
// // // // //     addLog('📊 Safe Vault ATA (L2): 0 WICK', 'success');
// // // // //     addLog('🛡️ WICKGUARD PROTECTION ACTIVE', 'success');
// // // // //     addLog('🟢 Monitoring live price feed with crash detection enabled', 'success');
// // // // //     addLog('🔍 Threshold: $0.22 | Current: $0.2847', 'info');
    
// // // // //     setIsRunning(true);
// // // // //   };

// // // // //   const handleManualRescue = async () => {
// // // // //     if (stage !== 3) return;
    
// // // // //     setStage(4);
// // // // //     addLog('🚨 MANUAL RESCUE TRIGGERED!', 'alert');
// // // // //     addLog('Protecting 1000 tokens...', 'warning');
    
// // // // //     await new Promise((r) => setTimeout(r, 600));
// // // // //     addLog('⚡ Executing atomic rescue on L2...', 'info');
// // // // //     addLog('✅ ASSETS SECURED ON L2!', 'success');
    
// // // // //     await new Promise((r) => setTimeout(r, 400));
// // // // //     addLog('⚡ Execution: 2789ms', 'info');
// // // // //     addLog('📝 Tx: 4AZURygYiezx5rDHTCi3dRXq8euq2YTEYrYbmmDiz84G1FcsF2NnGaHAN4b3ASz2eB5moDZAMC831voJ7Eb7swyJ', 'info');
// // // // //     addLog('📊 Verified - User: 0 | Safe: 1000', 'success');
    
// // // // //     setSafeVaultTokens(1000);
// // // // //     setUserTokens(0);
    
// // // // //     await new Promise((r) => setTimeout(r, 2000));
// // // // //     setStage(5);
// // // // //     addLog('📈 MARKET RECOVERY', 'success');
// // // // //     addLog('Restoring 1000 tokens...', 'info');
    
// // // // //     await new Promise((r) => setTimeout(r, 400));
// // // // //     addLog('✅ Position restored', 'success');
// // // // //     addLog('📊 Final - User: 1000 | Safe: 0', 'success');
    
// // // // //     setUserTokens(1000);
// // // // //     setSafeVaultTokens(0);
// // // // //   };

// // // // //   const handleReset = () => {
// // // // //     setStage(0);
// // // // //     setUserTokens(0);
// // // // //     setSafeVaultTokens(0);
// // // // //     setLogs([]);
// // // // //     setIsRunning(false);
// // // // //     setPriceHistory(Array(30).fill(0).map(() => 0.2847 + (Math.random() - 0.5) * 0.002));
// // // // //     setWalletConnected(false);
// // // // //     setL2Active(false);
// // // // //     setProtectionActive(false);
// // // // //   };

// // // // //   return (
// // // // //     <div className="min-h-screen bg-slate-950 text-foreground flex flex-col">
// // // // //       <DashboardHeader walletConnected={stage > 0} />

// // // // //       <div className="flex flex-1 overflow-hidden">
// // // // //         {/* Main Content */}
// // // // //         <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 to-slate-900">
// // // // //           <div className="p-8 space-y-6">
// // // // //             {/* Main Diagram */}
// // // // //             {/* <VisualFlow
// // // // //               stage={stage}
// // // // //               userTokens={userTokens}
// // // // //               safeVaultTokens={safeVaultTokens}
// // // // //             /> */}
// // // // //            <WickGuardDiagram
// // // // //   phase={
// // // // //     stage === 0 ? "standby" :
// // // // //     stage === 1 || stage === 2 ? "rescue" :  // stages where protection is activating
// // // // //     stage === 3 ? "secured" :                 // active monitoring
// // // // //     stage === 4 ? "recovery" :                // rescue triggered
// // // // //     stage === 5 ? "restored" : "standby"     // back to normal
// // // // //   }
// // // // //   userTokens={userTokens}
// // // // //   safeTokens={safeVaultTokens}
// // // // //   botStage={
// // // // //     stage === 0 ? "standby" :
// // // // //     stage === 1 ? "wallet" :
// // // // //     stage === 2 ? "mint" :
// // // // //     stage === 3 ? "monitoring" :
// // // // //     stage === 4 ? "rescuing" :
// // // // //     stage === 5 ? "restored" :
// // // // //     "standby"
// // // // //   }
// // // // // />
// // // // // const stageToBotStage = (stage: number): BotStage => {
// // // // //   switch (stage) {
// // // // //     case 0: return "standby";
// // // // //     case 1: return "wallet";
// // // // //     case 2: return "mint";
// // // // //     case 3: return "monitoring";
// // // // //     case 4: return "rescuing";
// // // // //     case 5: return "restored";
// // // // //     default: return "standby";
// // // // //   }
// // // // // };


// // // // //             {/* Control Buttons */}
// // // // //             <div className="flex flex-wrap gap-3 justify-center">
// // // // //               <Button
// // // // //                 onClick={handleConnectWallet}
// // // // //                 disabled={stage > 0 || isRunning}
// // // // //                 className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
// // // // //               >
// // // // //                 <Wallet className="w-4 h-4" />
// // // // //                 Connect Wallet
// // // // //               </Button>

// // // // //               <Button
// // // // //                 onClick={handleActivateProtection}
// // // // //                 disabled={stage !== 1 || isRunning}
// // // // //                 className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
// // // // //               >
// // // // //                 <Zap className="w-4 h-4" />
// // // // //                 Activate L2 Protection
// // // // //               </Button>

// // // // //               {stage >= 3 && stage < 5 && (
// // // // //                 <Button
// // // // //                   onClick={handleManualRescue}
// // // // //                   disabled={isRunning}
// // // // //                   className="gap-2 bg-red-600 hover:bg-red-700 text-white"
// // // // //                 >
// // // // //                   Manual Rescue
// // // // //                 </Button>
// // // // //               )}

// // // // //               {stage >= 5 && (
// // // // //                 <Button
// // // // //                   onClick={handleReset}
// // // // //                   className="gap-2 bg-slate-600 hover:bg-slate-700 text-white"
// // // // //                 >
// // // // //                   <RotateCcw className="w-4 h-4" />
// // // // //                   Reset
// // // // //                 </Button>
// // // // //               )}
// // // // //             </div>

// // // // //             {/* Info on idle */}
// // // // //             {stage === 0 && (
// // // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-3xl mx-auto">
// // // // //                 <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
// // // // //                   <h3 className="font-semibold text-white mb-2">What is WickGuard?</h3>
// // // // //                   <p className="text-sm text-slate-400">
// // // // //                     Institutional-grade liquidation protection system using MagicBlock Ephemeral Rollup for instant atomic rescues.
// // // // //                   </p>
// // // // //                 </div>
// // // // //                 <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
// // // // //                   <h3 className="font-semibold text-white mb-2">How It Works</h3>
// // // // //                   <p className="text-sm text-slate-400">
// // // // //                     1. Connect → 2. Mint → 3. Activate → 4. Monitor → 5. Auto-rescue or manual override
// // // // //                   </p>
// // // // //                 </div>
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         </main>

// // // // //         {/* Bot Console Sidebar */}
// // // // //         <div className="w-96 border-l border-slate-700/50 flex-shrink-0 bg-slate-900">
// // // // //           <BotConsole logs={logs} isRunning={isRunning} />
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }


// // // // // const stageToBotStage = (stage: number): BotStage => {
// // // // //   switch (stage) {
// // // // //     case 0: return "standby";
// // // // //     case 1: return "wallet";
// // // // //     case 2: return "mint";
// // // // //     case 3: return "monitoring";
// // // // //     case 4: return "rescuing";
// // // // //     case 5: return "restored";
// // // // //     default: return "standby";
// // // // //   }
// // // // // };





// // // // // ### Full Corrected Code

// // // // // Here is the clean, working file. I have moved the logic to use the helper function cleanly inside the `WickGuardDiagram` prop.


// // // // 'use client';

// // // // import { useState, useEffect } from 'react';
// // // // import { BotConsole } from '@/components/bot-console';
// // // // import WickGuardDiagram from '@/components/WickGuardDiagram';
// // // // import { DashboardHeader } from '@/components/dashboard-header';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Wallet, Zap, RotateCcw } from 'lucide-react';
// // // // import { BotStage,stageToPhase } from "@/lib/wickguard";

// // // // interface LogEntry {
// // // //   id: string;
// // // //   message: string;
// // // //   type: 'info' | 'success' | 'error' | 'warning' | 'alert';
// // // //   timestamp: string;
// // // // }

// // // // // Helper function defined outside the component is fine
// // // // const stageToBotStage = (stage: number): BotStage => {
// // // //   switch (stage) {
// // // //     case 0: return "standby";
// // // //     case 1: return "wallet";
// // // //     case 2: return "mint";
// // // //     case 3: return "monitoring";
// // // //     case 4: return "rescuing";
// // // //     case 5: return "restored";
// // // //     default: return "standby";
// // // //   }
// // // // };

// // // // export default function Home() {
// // // //   const [logs, setLogs] = useState<LogEntry[]>([]);
// // // //   const [stage, setStage] = useState(0); // 0: idle, 1: l1-setup, 2: bridging, 3: monitoring, 4: crash, 5: recovered
// // // //   const [userTokens, setUserTokens] = useState(0);
// // // //   const [safeVaultTokens, setSafeVaultTokens] = useState(0);
// // // //   const [isRunning, setIsRunning] = useState(false);
// // // //   const [priceHistory, setPriceHistory] = useState(
// // // //     Array(30).fill(0).map(() => 0.2847 + (Math.random() - 0.5) * 0.002)
// // // //   );
// // // //   const [walletConnected, setWalletConnected] = useState(false);
// // // //   const [l2Active, setL2Active] = useState(false);
// // // //   const [protectionActive, setProtectionActive] = useState(false);

// // // //   const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' | 'alert') => {
// // // //     const timestamp = new Date().toLocaleTimeString('en-US', {
// // // //       hour: '2-digit',
// // // //       minute: '2-digit',
// // // //       second: '2-digit',
// // // //       hour12: true,
// // // //     });
// // // //     setLogs((prev) => [...prev, {
// // // //       id: Math.random().toString(36),
// // // //       message,
// // // //       type,
// // // //       timestamp,
// // // //     }]);
// // // //   };

// // // //   // Price simulation
// // // //   useEffect(() => {
// // // //     if (stage !== 3 && stage !== 4 && stage !== 5) return;

// // // //     const interval = setInterval(() => {
// // // //       setPriceHistory((prev) => {
// // // //         const lastPrice = prev[prev.length - 1];
// // // //         const bias = stage === 5 ? 0.3 : stage === 4 ? -0.8 : -0.45;
// // // //         const change = (Math.random() - bias) * 0.003;
// // // //         const newPrice = Math.max(0.15, Math.min(0.35, lastPrice + change));
// // // //         const newHistory = [...prev.slice(1), newPrice];

// // // //         if (newPrice < 0.22 && stage === 3) {
// // // //           console.log('[v0] Price crash detected, triggering rescue');
// // // //           setStage(4);
// // // //           addLog('🚨 LIQUIDATION THRESHOLD BREACHED!', 'alert');
// // // //           addLog('Protecting 1000 tokens...', 'warning');
// // // //           addLog('Executing atomic rescue on L2...', 'info');
// // // //         }

// // // //         return newHistory;
// // // //       });
// // // //     }, 500);

// // // //     return () => clearInterval(interval);
// // // //   }, [stage]);

// // // //   const handleConnectWallet = async () => {
// // // //     setIsRunning(true);
// // // //     setLogs([]);
// // // //     addLog('🤖 WickGuard Protection System Initializing...', 'info');
    
// // // //     await new Promise((r) => setTimeout(r, 300));
// // // //     addLog('📂 Wallet: CVYvELNx...8uLk', 'success');
// // // //     addLog('Balance: 4.78 SOL', 'info');
    
// // // //     await new Promise((r) => setTimeout(r, 400));
// // // //     setStage(1);
// // // //     setWalletConnected(true);
// // // //     addLog('🏦 Initializing Assets on L1...', 'info');
// // // //   };

// // // //   const handleActivateProtection = async () => {
// // // //     setStage(2);
// // // //     setL2Active(true);
// // // //     addLog('💎 Minting 1,000 WICK tokens on Solana L1...', 'info');
    
// // // //     await new Promise((r) => setTimeout(r, 600));
// // // //     addLog('✅ Token mint successful!', 'success');
// // // //     addLog('📍 User ATA (L1): 6azYrFSVvtSz51XZhV3J1zzxbYuccocrt2J2bPTTPv41', 'success');
// // // //     addLog('💰 User balance: 1,000 WICK', 'info');
    
// // // //     await new Promise((r) => setTimeout(r, 400));
// // // //     addLog('📍 Safe Vault ATA (L1): 7CW7ZtSnidZPDSphTNiPm69VHoHeguq6cFtGUYVJW3Hs', 'success');
// // // //     addLog('💰 Safe balance: 0 WICK', 'info');
    
// // // //     await new Promise((r) => setTimeout(r, 600));
// // // //     addLog('⚡ Delegating user account to MagicBlock Ephemeral Rollup...', 'info');
// // // //     addLog('📡 Broadcasting delegation transaction...', 'info');
    
// // // //     await new Promise((r) => setTimeout(r, 500));
// // // //     addLog('✅ User account delegation successful!', 'success');
// // // //     addLog('📝 Delegation Tx: 3JDWux4a1J1nk2PkPhEyvktCWHmcJWxiaat6grw8uUNs4iFwXtqeAPcHRA8mfzWkmgWp2sFqoGnpjc1Mq9tKGmC8', 'success');
// // // //     addLog('⏱️ Confirmation: 3 slots', 'info');
    
// // // //     await new Promise((r) => setTimeout(r, 400));
// // // //     addLog('⚡ Delegating safe vault account to MagicBlock Ephemeral Rollup...', 'info');
// // // //     addLog('📡 Broadcasting delegation transaction...', 'info');
    
// // // //     await new Promise((r) => setTimeout(r, 500));
// // // //     addLog('✅ Safe vault account delegation successful!', 'success');
// // // //     addLog('📝 Delegation Tx: 29LNWUJN29CFhM9A7fmsPMR4CPSfPvYVb35ZXEctQ6Sr69LaNYfG8jJtXEAdZzGyJaNwydcczGpCidWydujatvnL', 'success');
// // // //     addLog('⏱️ Confirmation: 3 slots', 'info');
    
// // // //     await new Promise((r) => setTimeout(r, 600));
// // // //     addLog('🌉 L2 Bridge: Syncing accounts to Ephemeral Rollup...', 'info');
// // // //     addLog('⏳ Waiting for L2 state finality (12 seconds)...', 'warning');
    
// // // //     await new Promise((r) => setTimeout(r, 1500));
// // // //     setStage(3);
// // // //     setProtectionActive(true);
// // // //     setUserTokens(1000);
// // // //     addLog('✅ L2 State Synchronized!', 'success');
// // // //     addLog('💎 Verifying L2 account states:', 'info');
// // // //     addLog('📊 User ATA (L2): 1,000 WICK', 'success');
// // // //     addLog('📊 Safe Vault ATA (L2): 0 WICK', 'success');
// // // //     addLog('🛡️ WICKGUARD PROTECTION ACTIVE', 'success');
// // // //     addLog('🟢 Monitoring live price feed with crash detection enabled', 'success');
// // // //     addLog('🔍 Threshold: $0.22 | Current: $0.2847', 'info');
    
// // // //     setIsRunning(true);
// // // //   };

// // // //   const handleManualRescue = async () => {
// // // //     if (stage !== 3) return;
    
// // // //     setStage(4);
// // // //     addLog('🚨 MANUAL RESCUE TRIGGERED!', 'alert');
// // // //     addLog('Protecting 1000 tokens...', 'warning');
    
// // // //     await new Promise((r) => setTimeout(r, 600));
// // // //     addLog('⚡ Executing atomic rescue on L2...', 'info');
// // // //     addLog('✅ ASSETS SECURED ON L2!', 'success');
    
// // // //     await new Promise((r) => setTimeout(r, 400));
// // // //     addLog('⚡ Execution: 2789ms', 'info');
// // // //     addLog('📝 Tx: 4AZURygYiezx5rDHTCi3dRXq8euq2YTEYrYbmmDiz84G1FcsF2NnGaHAN4b3ASz2eB5moDZAMC831voJ7Eb7swyJ', 'info');
// // // //     addLog('📊 Verified - User: 0 | Safe: 1000', 'success');
    
// // // //     setSafeVaultTokens(1000);
// // // //     setUserTokens(0);
    
// // // //     await new Promise((r) => setTimeout(r, 2000));
// // // //     setStage(5);
// // // //     addLog('📈 MARKET RECOVERY', 'success');
// // // //     addLog('Restoring 1000 tokens...', 'info');
    
// // // //     await new Promise((r) => setTimeout(r, 400));
// // // //     addLog('✅ Position restored', 'success');
// // // //     addLog('📊 Final - User: 1000 | Safe: 0', 'success');
    
// // // //     setUserTokens(1000);
// // // //     setSafeVaultTokens(0);
// // // //   };

// // // //   const handleReset = () => {
// // // //     setStage(0);
// // // //     setUserTokens(0);
// // // //     setSafeVaultTokens(0);
// // // //     setLogs([]);
// // // //     setIsRunning(false);
// // // //     setPriceHistory(Array(30).fill(0).map(() => 0.2847 + (Math.random() - 0.5) * 0.002));
// // // //     setWalletConnected(false);
// // // //     setL2Active(false);
// // // //     setProtectionActive(false);
// // // //   };
// // // //   const botStage = stageToBotStage(stage);
// // // //   const phase = stageToPhase(botStage);

// // // //   return (
// // // //     <div className="min-h-screen bg-slate-950 text-foreground flex flex-col">
// // // //       <DashboardHeader walletConnected={stage > 0} />

// // // //       <div className="flex flex-1 overflow-hidden">
// // // //         {/* Main Content */}
// // // //         <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 to-slate-900">
// // // //           <div className="p-8 space-y-6">
            
// // // //             {/* Main Diagram */}
// // // //           <WickGuardDiagram
// // // //           botStage={botStage}
// // // //           phase={phase}
// // // //           userTokens={userTokens}
// // // //           safeTokens={safeVaultTokens}
// // // //         />

// // // //             {/* Control Buttons */}
// // // //             <div className="flex flex-wrap gap-3 justify-center">
// // // //               <Button
// // // //                 onClick={handleConnectWallet}
// // // //                 disabled={stage > 0 || isRunning}
// // // //                 className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
// // // //               >
// // // //                 <Wallet className="w-4 h-4" />
// // // //                 Connect Wallet
// // // //               </Button>

// // // //               <Button
// // // //                 onClick={handleActivateProtection}
// // // //                 disabled={stage !== 1 || isRunning}
// // // //                 className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
// // // //               >
// // // //                 <Zap className="w-4 h-4" />
// // // //                 Activate L2 Protection
// // // //               </Button>

// // // //               {stage >= 3 && stage < 5 && (
// // // //                 <Button
// // // //                   onClick={handleManualRescue}
// // // //                   disabled={isRunning}
// // // //                   className="gap-2 bg-red-600 hover:bg-red-700 text-white"
// // // //                 >
// // // //                   Manual Rescue
// // // //                 </Button>
// // // //               )}

// // // //               {stage >= 5 && (
// // // //                 <Button
// // // //                   onClick={handleReset}
// // // //                   className="gap-2 bg-slate-600 hover:bg-slate-700 text-white"
// // // //                 >
// // // //                   <RotateCcw className="w-4 h-4" />
// // // //                   Reset
// // // //                 </Button>
// // // //               )}
// // // //             </div>

// // // //             {/* Info on idle */}
// // // //             {stage === 0 && (
// // // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-3xl mx-auto">
// // // //                 <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
// // // //                   <h3 className="font-semibold text-white mb-2">What is WickGuard?</h3>
// // // //                   <p className="text-sm text-slate-400">
// // // //                     Institutional-grade liquidation protection system using MagicBlock Ephemeral Rollup for instant atomic rescues.
// // // //                   </p>
// // // //                 </div>
// // // //                 <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
// // // //                   <h3 className="font-semibold text-white mb-2">How It Works</h3>
// // // //                   <p className="text-sm text-slate-400">
// // // //                     1. Connect → 2. Mint → 3. Activate → 4. Monitor → 5. Auto-rescue or manual override
// // // //                   </p>
// // // //                 </div>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </main>

// // // //         {/* Bot Console Sidebar */}
// // // //         <div className="w-96 border-l border-slate-700/50 flex-shrink-0 bg-slate-900">
// // // //           <BotConsole logs={logs} isRunning={isRunning} />
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // 'use client';

// // // import { useState, useEffect } from 'react';
// // // import { BotConsole } from '@/components/bot-console';
// // // import WickGuardDiagram from '@/components/WickGuardDiagram';
// // // import { DashboardHeader } from '@/components/dashboard-header';
// // // import { Button } from '@/components/ui/button';
// // // import { Wallet, Zap, RotateCcw, AlertTriangle } from 'lucide-react';
// // // import { BotStage, stageToPhase } from "@/lib/wickguard";

// // // interface LogEntry {
// // //   id: string;
// // //   message: string;
// // //   type: 'info' | 'success' | 'error' | 'warning' | 'alert';
// // //   timestamp: string;
// // // }

// // // export default function Home() {
// // //   const [logs, setLogs] = useState<LogEntry[]>([]);
// // //   // We use detailedBotStage to drive the specific animations
// // //   const [detailedBotStage, setDetailedBotStage] = useState<BotStage>("standby");
// // //   const [stage, setStage] = useState(0); // 0: idle, 1: setup, 2: active, 3: recovered
// // //   const [userTokens, setUserTokens] = useState(0);
// // //   const [safeVaultTokens, setSafeVaultTokens] = useState(0);
// // //   const [isRunning, setIsRunning] = useState(false);
// // //   const [priceHistory, setPriceHistory] = useState(
// // //     Array(30).fill(0).map(() => 0.2847 + (Math.random() - 0.5) * 0.002)
// // //   );

// // //   const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' | 'alert') => {
// // //     const timestamp = new Date().toLocaleTimeString('en-US', {
// // //       hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
// // //     });
// // //     setLogs((prev) => [...prev, {
// // //       id: Math.random().toString(36),
// // //       message, type, timestamp,
// // //     }]);
// // //   };

// // //   // Price simulation & Crash Detection
// // //   useEffect(() => {
// // //     if (detailedBotStage !== "monitoring" && detailedBotStage !== "threat"
// // //       && detailedBotStage !== "restored"
// // //     ) return;

// // //     const interval = setInterval(() => {
// // //       setPriceHistory((prev) => {
// // //         const lastPrice = prev[prev.length - 1];
// // //         const bias = detailedBotStage === "restored" ? 0.3 : detailedBotStage === "threat" ? -0.8 : -0.45;
// // //         const change = (Math.random() - bias) * 0.003;
// // //         const newPrice = Math.max(0.15, Math.min(0.35, lastPrice + change));
        
// // //         // Auto-Trigger Rescue on Price Crash
// // //         if (newPrice < 0.22 && detailedBotStage === "monitoring") {
// // //            // We trigger the rescue sequence automatically
// // //            handleAutoRescue();
// // //         }

// // //         return [...prev.slice(1), newPrice];
// // //       });
// // //     }, 500);

// // //     return () => clearInterval(interval);
// // //   }, [detailedBotStage]);

// // //   const handleConnectWallet = async () => {
// // //     setIsRunning(true);
// // //     setLogs([]);
// // //     addLog('🤖 WickGuard Protection System Initializing...', 'info');
    
// // //     await new Promise((r) => setTimeout(r, 300));
// // //     setDetailedBotStage("wallet"); // Animation: Highlight Wallet
// // //     addLog('📂 Wallet: CVYvELNx...8uLk', 'success');
// // //     addLog('Balance: 4.78 SOL', 'info');
    
// // //     await new Promise((r) => setTimeout(r, 400));
// // //     setStage(1);
// // //   };

// // //   const handleActivateProtection = async () => {
// // //     // 1. MINTING
// // //     setDetailedBotStage("mint");
// // //     addLog('💎 Minting 1,000 WICK tokens on Solana L1...', 'info');
// // //     await new Promise((r) => setTimeout(r, 800));
    
// // //     setDetailedBotStage("userAta");
// // //     addLog('✅ Token mint successful!', 'success');
// // //     addLog('📍 User ATA (L1): 6azYrFSVvtSz...', 'success');
// // //     setUserTokens(1000);
    
// // //     await new Promise((r) => setTimeout(r, 600));
// // //     setDetailedBotStage("safeAta");
// // //     addLog('📍 Safe Vault ATA (L1): 7CW7ZtSnid...', 'success');
    
// // //     // 2. DELEGATING
// // //     await new Promise((r) => setTimeout(r, 600));
// // //     setDetailedBotStage("delegating"); // Animation: Flow to Bridge
// // //     addLog('⚡ Delegating user account to MagicBlock Ephemeral Rollup...', 'info');
    
// // //     await new Promise((r) => setTimeout(r, 800));
// // //     setDetailedBotStage("userDelegated"); // Animation: Bridge shines
// // //     addLog('✅ User delegation successful (Tx: 3JDW...)', 'success');
    
// // //     await new Promise((r) => setTimeout(r, 400));
// // //     setDetailedBotStage("delegatingSafe");
// // //     addLog('⚡ Delegating safe vault to MagicBlock...', 'info');
    
// // //     await new Promise((r) => setTimeout(r, 800));
// // //     setDetailedBotStage("safeDelegated");
// // //     addLog('✅ Safe delegation successful', 'success');
    
// // //     // 3. SYNCING TO L2
// // //     await new Promise((r) => setTimeout(r, 600));
// // //     setDetailedBotStage("syncing"); // Animation: Bridge spins fast
// // //     addLog('🌉 L2 Bridge: Syncing accounts...', 'info');
    
// // //     await new Promise((r) => setTimeout(r, 1500));
// // //     setDetailedBotStage("verifying"); // Animation: L2 Circle highlights
// // //     addLog('✅ L2 State Synchronized!', 'success');
    
// // //     await new Promise((r) => setTimeout(r, 800));
// // //     setDetailedBotStage("monitoring"); // Animation: Pulse Monitor
// // //     setStage(2);
// // //     addLog('🛡️ WICKGUARD PROTECTION ACTIVE', 'success');
// // //     addLog('🟢 Monitoring live price feed...', 'success');
// // //   };

// // //   const handleAutoRescue = async () => {
// // //     setDetailedBotStage("threat"); // Animation: Red Warning
// // //     addLog('🚨 LIQUIDATION THRESHOLD BREACHED!', 'alert');
// // //     addLog('Protecting 1000 tokens...', 'warning');
    
// // //     await new Promise((r) => setTimeout(r, 600));
// // //     setDetailedBotStage("rescuing"); // Animation: Yellow Flow User -> Safe
// // //     addLog('⚡ Executing atomic rescue on L2...', 'info');
    
// // //     await new Promise((r) => setTimeout(r, 400));
// // //     setDetailedBotStage("secured"); // Animation: Green Safe
// // //     setUserTokens(0);
// // //     setSafeVaultTokens(1000);
// // //     addLog('✅ ASSETS SECURED ON L2!', 'success');
// // //     addLog('⚡ Execution: 2789ms', 'info');
// // //   };

// // //   const handleManualRescue = async () => {
// // //     if (detailedBotStage !== "monitoring") return;
// // //     handleAutoRescue();
// // //   };

// // //   const handleRecover = async () => {
// // //     setDetailedBotStage("recovery"); // Animation: Recovery Icon
// // //     addLog('📈 MARKET RECOVERY', 'success');
// // //     addLog('Restoring 1000 tokens...', 'info');
    
// // //     await new Promise((r) => setTimeout(r, 800));
// // //     setDetailedBotStage("restoring"); // Animation: Spin Restore
    
// // //     await new Promise((r) => setTimeout(r, 800));
// // //     setDetailedBotStage("restored"); // Animation: Final Check
// // //     setUserTokens(1000);
// // //     setSafeVaultTokens(0);
    
// // //     addLog('✅ Position restored', 'success');
// // //     setStage(3);
// // //   };

// // //   const handleReset = () => {
// // //     setStage(0);
// // //     setDetailedBotStage("standby");
// // //     setUserTokens(0);
// // //     setSafeVaultTokens(0);
// // //     setLogs([]);
// // //     setIsRunning(false);
// // //   };

// // //   const phase = stageToPhase(detailedBotStage);

// // //   return (
// // //     <div className="min-h-screen bg-slate-950 text-foreground flex flex-col">
// // //       <DashboardHeader walletConnected={stage > 0} />

// // //       <div className="flex flex-1 overflow-hidden">
// // //         {/* Main Content */}
// // //         <main className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-950 to-slate-900">
// // //           <div className="p-8 space-y-6">
            
// // //             {/* The Diagram receives the precise animation stage */}
// // //             <WickGuardDiagram 
// // //               botStage={detailedBotStage}
// // //               phase={phase}
// // //               userTokens={userTokens}
// // //               safeTokens={safeVaultTokens}
// // //             />

// // //             {/* Control Buttons */}
// // //             <div className="flex flex-wrap gap-3 justify-center">
// // //               <Button
// // //                 onClick={handleConnectWallet}
// // //                 disabled={stage > 0 || isRunning}
// // //                 className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
// // //               >
// // //                 <Wallet className="w-4 h-4" />
// // //                 Connect Wallet
// // //               </Button>

// // //               <Button
// // //                 onClick={handleActivateProtection}
// // //                 disabled={stage !== 1 || detailedBotStage !== "wallet"}
// // //                 className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
// // //               >
// // //                 <Zap className="w-4 h-4" />
// // //                 Activate L2 Protection
// // //               </Button>

// // //               {detailedBotStage === "monitoring" && (
// // //                 <Button
// // //                   onClick={handleManualRescue}
// // //                   className="gap-2 bg-red-600 hover:bg-red-700 text-white"
// // //                 >
// // //                   <AlertTriangle className="w-4 h-4" />
// // //                   Manual Rescue
// // //                 </Button>
// // //               )}

// // //               {detailedBotStage === "secured" && (
// // //                 <Button
// // //                   onClick={handleRecover}
// // //                   className="gap-2 bg-green-600 hover:bg-green-700 text-white"
// // //                 >
// // //                   <RotateCcw className="w-4 h-4" />
// // //                   Restore Position
// // //                 </Button>
// // //               )}

// // //               {stage === 3 && (
// // //                 <Button
// // //                   onClick={handleReset}
// // //                   className="gap-2 bg-slate-600 hover:bg-slate-700 text-white"
// // //                 >
// // //                   <RotateCcw className="w-4 h-4" />
// // //                   Reset
// // //                 </Button>
// // //               )}
// // //             </div>

// // //             {/* Info Cards */}
// // //             {stage === 0 && (
// // //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-3xl mx-auto">
// // //                 <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
// // //                   <h3 className="font-semibold text-white mb-2">What is WickGuard?</h3>
// // //                   <p className="text-sm text-slate-400">
// // //                     Institutional-grade liquidation protection system using MagicBlock Ephemeral Rollup for instant atomic rescues.
// // //                   </p>
// // //                 </div>
// // //                 <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
// // //                   <h3 className="font-semibold text-white mb-2">How It Works</h3>
// // //                   <p className="text-sm text-slate-400">
// // //                     1. Connect → 2. Mint → 3. Activate (L2 Bridge) → 4. Monitor → 5. Auto-rescue
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </main>

// // //         {/* Bot Console Sidebar */}
// // //         <div className="w-96 border-l border-slate-700/50 flex-shrink-0 bg-slate-900">
// // //           <BotConsole logs={logs} isRunning={isRunning} />
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

'use client';

import { useState, useEffect } from 'react';
import { io } from "socket.io-client"; // Install this: npm install socket.io-client
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

// "use client";

// import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";

// export default function DashboardPage() {
//   const [stage, setStage] = useState("idle");
//   const [price, setPrice] = useState(140);
//   const [balance, setBalance] = useState({ user: 0, safe: 0 });
//   const [logs, setLogs] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [systemData, setSystemData] = useState({});
//   const [connected, setConnected] = useState(false);
//   const logsEndRef = useRef(null);
//   const txEndRef = useRef(null);

//   useEffect(() => {
//     const socket = io("http://localhost:3001");

//     socket.on("connect", () => {
//       console.log("Connected to server");
//       setConnected(true);
//     });

//     socket.on("disconnect", () => {
//       console.log("Disconnected from server");
//       setConnected(false);
//     });

//     // Load initial state
//     socket.on("initial-state", (data) => {
//       setStage(data.stage || "idle");
//       setPrice(data.price || 140);
//       setBalance(data.balance || { user: 0, safe: 0 });
//       setLogs(data.logs || []);
//       setTransactions(data.transactions || []);
//       setSystemData(data.systemData || {});
//     });

//     socket.on("bot-stage", (newStage) => setStage(newStage));
//     socket.on("bot-price", (newPrice) => setPrice(newPrice));
//     socket.on("bot-balance", (newBalance) => setBalance(newBalance));
    
//     socket.on("bot-log", (log) => {
//       setLogs((prev) => [...prev, log].slice(-100));
//     });

//     socket.on("bot-data", (data) => {
//       setSystemData((prev) => ({ ...prev, [data.key]: data.value }));
//     });

//     socket.on("bot-transaction", (tx) => {
//       setTransactions((prev) => [...prev, tx].slice(-50));
//     });

//     return () => socket.disconnect();
//   }, []);

//   // Auto-scroll logs
//   useEffect(() => {
//     logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [logs]);

//   // Auto-scroll transactions
//   useEffect(() => {
//     txEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [transactions]);

//   const getStageColor = (currentStage) => {
//     const colors = {
//       idle: "bg-gray-500",
//       wallet: "bg-blue-500",
//       mint: "bg-blue-500",
//       userAta: "bg-blue-500",
//       safeAta: "bg-blue-500",
//       delegating: "bg-yellow-500",
//       userDelegated: "bg-green-500",
//       delegatingSafe: "bg-yellow-500",
//       safeDelegated: "bg-green-500",
//       syncing: "bg-yellow-500",
//       verifying: "bg-blue-500",
//       monitoring: "bg-green-500",
//       threat: "bg-red-500 animate-pulse",
//       rescuing: "bg-orange-500 animate-pulse",
//       secured: "bg-green-500",
//       recovery: "bg-blue-500",
//       restoring: "bg-yellow-500",
//       restored: "bg-green-500"
//     };
//     return colors[currentStage] || "bg-gray-500";
//   };

//   const getLogIcon = (type) => {
//     const icons = {
//       success: "✅",
//       error: "❌",
//       warning: "⚠️",
//       alert: "🚨",
//       info: "ℹ️"
//     };
//     return icons[type] || "•";
//   };

//   const getLogColor = (type) => {
//     const colors = {
//       success: "text-green-400",
//       error: "text-red-400",
//       warning: "text-yellow-400",
//       alert: "text-red-500 font-bold",
//       info: "text-blue-400"
//     };
//     return colors[type] || "text-gray-400";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
//       {/* Header */}
//       <div className="max-w-7xl mx-auto mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//               🛡️ WICKGUARD
//             </h1>
//             <p className="text-gray-400 text-sm mt-1">Institutional-Grade Liquidation Protection</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"} animate-pulse`}></div>
//             <span className="text-sm text-gray-400">{connected ? "Connected" : "Disconnected"}</span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Left Column - Status & Price */}
//         <div className="space-y-6">
//           {/* Price Card */}
//           <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6">
//             <h2 className="text-sm text-gray-400 mb-2">Current Price</h2>
//             <div className="text-4xl font-bold text-white">
//               ${price.toFixed(2)}
//             </div>
//             <div className="mt-4 flex items-center gap-2">
//               <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStageColor(stage)}`}>
//                 {stage.toUpperCase()}
//               </div>
//             </div>
//           </div>

//           {/* Balance Card */}
//           <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6">
//             <h2 className="text-sm text-gray-400 mb-4">Token Balance</h2>
//             <div className="space-y-3">
//               <div>
//                 <div className="text-xs text-gray-500 mb-1">User Wallet</div>
//                 <div className="text-2xl font-bold text-blue-400">{balance.user.toFixed(2)}</div>
//               </div>
//               <div>
//                 <div className="text-xs text-gray-500 mb-1">Safe Wallet</div>
//                 <div className="text-2xl font-bold text-green-400">{balance.safe.toFixed(2)}</div>
//               </div>
//             </div>
//           </div>

//           {/* System Data Card */}
//           <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6">
//             <h2 className="text-sm text-gray-400 mb-4">System Information</h2>
//             <div className="space-y-2 text-xs">
//               {systemData.walletAddress && (
//                 <div>
//                   <div className="text-gray-500">Wallet</div>
//                   <div className="text-blue-400 font-mono truncate">{systemData.walletAddress}</div>
//                 </div>
//               )}
//               {systemData.safeWalletAddress && (
//                 <div>
//                   <div className="text-gray-500">Safe Wallet</div>
//                   <div className="text-green-400 font-mono truncate">{systemData.safeWalletAddress}</div>
//                 </div>
//               )}
//               {systemData.mintAddress && (
//                 <div>
//                   <div className="text-gray-500">Mint</div>
//                   <div className="text-purple-400 font-mono truncate">{systemData.mintAddress}</div>
//                 </div>
//               )}
//               {systemData.userATA && (
//                 <div>
//                   <div className="text-gray-500">User ATA</div>
//                   <div className="text-blue-400 font-mono truncate">{systemData.userATA}</div>
//                 </div>
//               )}
//               {systemData.safeATA && (
//                 <div>
//                   <div className="text-gray-500">Safe ATA</div>
//                   <div className="text-green-400 font-mono truncate">{systemData.safeATA}</div>
//                 </div>
//               )}
//               {systemData.solBalance && (
//                 <div>
//                   <div className="text-gray-500">SOL Balance</div>
//                   <div className="text-yellow-400 font-bold">{systemData.solBalance} SOL</div>
//                 </div>
//               )}
//               {systemData.rescueCount !== undefined && (
//                 <div>
//                   <div className="text-gray-500">Total Rescues</div>
//                   <div className="text-orange-400 font-bold">{systemData.rescueCount}</div>
//                 </div>
//               )}
//               {systemData.avgRescueSpeed && (
//                 <div>
//                   <div className="text-gray-500">Avg Rescue Speed</div>
//                   <div className="text-green-400 font-bold">{systemData.avgRescueSpeed}ms</div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Middle Column - Transactions */}
//         <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <span>💳</span> Transactions
//           </h2>
//           <div className="space-y-3 max-h-[800px] overflow-y-auto">
//             {transactions.length === 0 ? (
//               <div className="text-center text-gray-500 py-8">
//                 No transactions yet
//               </div>
//             ) : (
//               transactions.map((tx) => (
//                 <div
//                   key={tx.id}
//                   className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors"
//                 >
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="text-sm font-semibold text-white">{tx.type}</div>
//                     <div className="text-xs text-gray-500">{tx.timestamp}</div>
//                   </div>
                  
//                   {tx.amount && (
//                     <div className="text-lg font-bold text-blue-400 mb-2">
//                       {tx.amount.toFixed(2)} tokens
//                     </div>
//                   )}
                  
//                   {tx.speed && (
//                     <div className="text-xs text-green-400 mb-2">
//                       ⚡ {tx.speed}ms {tx.avgSpeed && `(avg: ${tx.avgSpeed}ms)`}
//                     </div>
//                   )}
                  
//                   <div className="text-xs space-y-1 mb-3">
//                     {tx.from && (
//                       <div className="text-gray-400">
//                         <span className="text-gray-600">From:</span> <span className="font-mono">{tx.from.slice(0, 12)}...</span>
//                       </div>
//                     )}
//                     {tx.to && (
//                       <div className="text-gray-400">
//                         <span className="text-gray-600">To:</span> <span className="font-mono">{tx.to.slice(0, 12)}...</span>
//                       </div>
//                     )}
//                   </div>
                  
//                   <div className="text-xs font-mono text-gray-500 mb-2 break-all">
//                     {tx.signature}
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <span className={`px-2 py-1 rounded text-xs ${
//                       tx.status === "confirmed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
//                     }`}>
//                       {tx.status}
//                     </span>
//                     {tx.explorerUrl && (
//                       <a
//                         href={tx.explorerUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-xs text-blue-400 hover:text-blue-300 underline"
//                       >
//                         View on Explorer →
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               ))
//             )}
//             <div ref={txEndRef} />
//           </div>
//         </div>

//         {/* Right Column - Console Logs */}
//         <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <span>📟</span> Console Output
//           </h2>
//           <div className="bg-black/50 rounded-lg p-4 font-mono text-xs max-h-[800px] overflow-y-auto">
//             {logs.length === 0 ? (
//               <div className="text-gray-600 text-center py-8">
//                 Waiting for logs...
//               </div>
//             ) : (
//               logs.map((log) => (
//                 <div key={log.id} className="mb-2 flex items-start gap-2">
//                   <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
//                   <span className="shrink-0">{getLogIcon(log.type)}</span>
//                   <span className={getLogColor(log.type)}>{log.message}</span>
//                 </div>
//               ))
//             )}
//             <div ref={logsEndRef} />
//           </div>
//         </div>
//       </div>

//       {/* WICKGUARD Diagram Section */}
//       <div className="max-w-7xl mx-auto mt-8 bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-8">
//         <h2 className="text-2xl font-bold mb-6 text-center">System Architecture</h2>
//         <div className="flex items-center justify-center gap-8 flex-wrap">
//           <div className="text-center">
//             <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-6 w-48">
//               <div className="text-4xl mb-2">👤</div>
//               <div className="font-semibold">User Wallet</div>
//               <div className="text-sm text-gray-400 mt-1">{balance.user.toFixed(2)} tokens</div>
//             </div>
//           </div>

//           <div className="text-4xl">→</div>

//           <div className="text-center">
//             <div className={`${stage === "monitoring" || stage === "threat" || stage === "rescuing" ? "border-green-500 bg-green-500/20" : "border-gray-500 bg-gray-800"} border-2 rounded-lg p-6 w-48`}>
//               <div className="text-4xl mb-2">🛡️</div>
//               <div className="font-semibold">WICKGUARD</div>
//               <div className="text-sm text-gray-400 mt-1">{stage}</div>
//             </div>
//           </div>

//           <div className="text-4xl">→</div>

//           <div className="text-center">
//             <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-6 w-48">
//               <div className="text-4xl mb-2">🔒</div>
//               <div className="font-semibold">Safe Wallet</div>
//               <div className="text-sm text-gray-400 mt-1">{balance.safe.toFixed(2)} tokens</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }