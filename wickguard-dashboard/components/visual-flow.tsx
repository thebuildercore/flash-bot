'use client';

import { useEffect, useState } from 'react';

interface VisualFlowProps {
  stage: number;
  userTokens: number;
  safeVaultTokens: number;
}

export function VisualFlow({ stage, userTokens, safeVaultTokens }: VisualFlowProps) {
  const [animationTime, setAnimationTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime((t) => (t + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const rotate = (animationTime * 3.6) % 360;
  const flowOffset = animationTime;

  // Stage labels and notes
  const stageNotes = [
    { stage: 0, title: 'Ready to Connect', note: 'Click "Connect Wallet" to initialize' },
    { stage: 1, title: 'Wallet Connected', note: '📂 Wallet: CVYvELNx... | Balance: 4.78 SOL' },
    { stage: 2, title: 'Minting & Delegation', note: '✅ Token mint successful! | User ATA created | Safe delegation in progress...' },
    { stage: 3, title: 'Protection Active', note: '🛡️ WICKGUARD PROTECTION ACTIVE | Monitoring enabled | Threshold: $0.22' },
    { stage: 4, title: 'Liquidation Detected', note: '🚨 LIQUIDATION THRESHOLD BREACHED! | Executing atomic rescue on L2...' },
    { stage: 5, title: 'Market Recovery', note: '📈 MARKET RECOVERY | Position restored | User: 1000 WICK | Safe: 0 WICK' },
  ];

  const currentNote = stageNotes[Math.min(stage, 5)];

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl border border-slate-800/50 overflow-hidden p-8 space-y-6">
      <svg viewBox="0 0 1200 600" className="w-full h-auto" style={{ minHeight: '600px' }}>
        <defs>
          {/* Color Gradients */}
          <linearGradient id="glowBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(100, 150, 255, 0.8)" />
            <stop offset="100%" stopColor="rgba(100, 150, 255, 0.3)" />
          </linearGradient>

          <linearGradient id="glowGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(100, 200, 100, 0.8)" />
            <stop offset="100%" stopColor="rgba(100, 200, 100, 0.3)" />
          </linearGradient>

          <linearGradient id="glowYellow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 200, 50, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 200, 50, 0.3)" />
          </linearGradient>

          <linearGradient id="glowRed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 100, 100, 0.8)" />
            <stop offset="100%" stopColor="rgba(255, 100, 100, 0.3)" />
          </linearGradient>

          {/* Animated Flow Lines */}
          <pattern id="flowGreen" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1={-flowOffset} y1="0" x2={20 - flowOffset} y2="0" stroke="rgba(34, 197, 94, 1)" strokeWidth="2" />
          </pattern>

          <pattern id="flowYellow" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1={-flowOffset} y1="0" x2={20 - flowOffset} y2="0" stroke="rgba(234, 179, 8, 1)" strokeWidth="2" />
          </pattern>

          <pattern id="flowRed" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <line x1={-flowOffset} y1="0" x2={20 - flowOffset} y2="0" stroke="rgba(239, 68, 68, 1)" strokeWidth="2" />
          </pattern>

          {/* Glow Filters */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glowStrong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="1200" height="600" fill="#0f172a" />

        {/* LEFT SECTION - L1 SOLANA */}
        <g opacity={stage >= 1 ? 1 : 0.3} style={{ transition: 'opacity 0.5s' }}>
          {/* Left box */}
          <rect x="30" y="80" width="240" height="440" rx="20" fill="rgba(100, 150, 255, 0.1)" stroke={stage >= 1 ? "rgba(100, 200, 100, 0.6)" : "rgba(100, 150, 255, 0.4)"} strokeWidth="2" style={{ transition: 'stroke 0.5s' }} />

          {/* Label */}
          <rect x="80" y="60" width="140" height="35" rx="15" fill="rgba(100, 150, 255, 0.2)" stroke="rgba(100, 150, 255, 0.6)" strokeWidth="1.5" />
          <text x="150" y="85" textAnchor="middle" fill="rgba(100, 150, 255, 0.9)" fontSize="14" fontWeight="500">
            1. L1 Solana
          </text>

          {/* Solana L1 Box */}
          <rect x="70" y="120" width="160" height="50" rx="10" fill="rgba(100, 150, 255, 0.15)" stroke={stage >= 1 ? "rgba(100, 200, 100, 0.6)" : "rgba(100, 150, 255, 0.5)"} strokeWidth="1.5" style={{ transition: 'stroke 0.5s' }} filter={stage >= 1 ? "url(#glowStrong)" : "none"} />
          <text x="150" y="150" textAnchor="middle" fill="rgba(150, 200, 255, 0.9)" fontSize="12" fontWeight="600">
            Solana L1
          </text>

          {/* Phantom Wallet */}
          <g>
            <circle cx="90" cy="250" r="28" fill="rgba(100, 150, 255, 0.15)" stroke={stage >= 1 ? "rgba(100, 200, 100, 0.6)" : "rgba(100, 150, 255, 0.5)"} strokeWidth="1.5" style={{ transition: 'stroke 0.5s' }} filter={stage >= 1 ? "url(#glowStrong)" : "none"} />
            <text x="90" y="258" textAnchor="middle" fill="rgba(100, 150, 255, 0.8)" fontSize="12" fontWeight="600">
              P
            </text>

            <text x="90" y="300" textAnchor="middle" fill="rgba(100, 150, 255, 0.8)" fontSize="11">
              Phantom/
            </text>
            <text x="90" y="315" textAnchor="middle" fill="rgba(100, 150, 255, 0.8)" fontSize="11">
              Solflare Wallet
            </text>
          </g>

          {/* Mint WICK Token */}
          <g>
            <rect x="140" y="220" width="60" height="60" rx="8" fill="rgba(100, 150, 255, 0.15)" stroke={stage >= 2 ? "rgba(100, 200, 100, 0.6)" : "rgba(100, 150, 255, 0.5)"} strokeWidth="1.5" style={{ transition: 'stroke 0.5s' }} filter={stage >= 2 ? "url(#glowStrong)" : "none"} />
            <text x="170" y="245" textAnchor="middle" fill="rgba(100, 150, 255, 0.8)" fontSize="11" fontWeight="600">
              W
            </text>

            <text x="170" y="280" textAnchor="middle" fill="rgba(100, 150, 255, 0.8)" fontSize="10">
              Mint WICK
            </text>
          </g>

          {/* User ATA L1 */}
          <g>
            <rect x="65" y="340" width="160" height="80" rx="10" fill="rgba(100, 150, 255, 0.15)" stroke={stage >= 2 ? "rgba(100, 200, 100, 0.6)" : "rgba(100, 150, 255, 0.5)"} strokeWidth="2" style={{ transition: 'stroke 0.5s' }} filter={stage >= 2 ? "url(#glowStrong)" : "none"} />
            <text x="145" y="370" textAnchor="middle" fill="rgba(150, 200, 255, 0.9)" fontSize="12" fontWeight="600">
              User ATA (L1)
            </text>
            <text x="145" y="393" textAnchor="middle" fill={stage >= 2 ? "rgba(100, 200, 100, 0.9)" : "rgba(100, 150, 255, 0.7)"} fontSize="11" style={{ transition: 'fill 0.5s' }}>
              {userTokens > 0 ? '[1000 WICK] ✅' : '[0 WICK]'}
            </text>
            <text x="145" y="410" textAnchor="middle" fill="rgba(100, 150, 255, 0.6)" fontSize="9">
              6azYrFSVvtSz51...
            </text>
          </g>

          {/* Animated flow lines */}
          {stage >= 1 && <line x1="118" y1="250" x2="140" y2="250" stroke="url(#flowGreen)" strokeWidth="2.5" strokeDasharray="8,4" strokeDashoffset={-flowOffset * 2} />}
          {stage >= 2 && <line x1="170" y1="280" x2="170" y2="340" stroke="url(#flowGreen)" strokeWidth="2.5" strokeDasharray="8,4" strokeDashoffset={-flowOffset * 2} />}
        </g>

        {/* CENTER SECTION - L2 BRIDGE & PROTECTION */}
        <g>
          {/* Top label */}
          <rect x="450" y="60" width="300" height="35" rx="15" fill={stage >= 2 ? "rgba(100, 200, 100, 0.25)" : "rgba(100, 150, 255, 0.2)"} stroke={stage >= 2 ? "rgba(100, 200, 100, 0.6)" : "rgba(100, 150, 255, 0.6)"} strokeWidth="1.5" style={{ transition: 'all 0.5s' }} />
          <text x="600" y="85" textAnchor="middle" fill={stage >= 2 ? "rgba(100, 200, 100, 0.9)" : "rgba(100, 150, 255, 0.9)"} fontSize="14" fontWeight="500" style={{ transition: 'fill 0.5s' }}>
            2. L2 Protected Environment (MagicBlock)
          </text>

          {/* MagicBlock Portal - Rotating 3D effect */}
          <g opacity={stage >= 2 ? 1 : 0.2} style={{ transition: 'opacity 0.5s' }}>
            {/* Outer glow circle */}
            <circle cx="600" cy="330" r="150" fill="none" stroke={stage >= 3 ? "rgba(100, 200, 100, 0.8)" : stage >= 2 ? "rgba(255, 200, 50, 0.8)" : "rgba(100, 150, 255, 0.3)"} strokeWidth="2" style={{ transition: 'stroke 0.5s' }} filter="url(#glowStrong)" />

            {/* Rotating rings */}
            <circle cx="600" cy="330" r="120" fill="none" stroke={stage >= 2 ? "rgba(150, 100, 255, 0.4)" : "rgba(100, 150, 255, 0.2)"} strokeWidth="1.5" style={{ transform: `rotate(${rotate}deg)`, transformOrigin: '600px 330px', transition: 'stroke 0.5s' }} />
            <circle cx="600" cy="330" r="90" fill="none" stroke={stage >= 2 ? "rgba(100, 150, 255, 0.5)" : "rgba(100, 150, 255, 0.2)"} strokeWidth="1.5" style={{ transform: `rotate(${-rotate * 1.5}deg)`, transformOrigin: '600px 330px', transition: 'stroke 0.5s' }} />

            {/* Portal center glow */}
            <circle cx="600" cy="330" r="30" fill={stage >= 3 ? "rgba(100, 200, 100, 0.3)" : stage >= 2 ? "rgba(255, 200, 50, 0.2)" : "rgba(100, 150, 255, 0.1)"} style={{ transition: 'fill 0.5s' }} filter="url(#glowStrong)" />
          </g>

          {/* User ATA L2 (left of portal) */}
          <g opacity={stage >= 2 ? 1 : 0.3} style={{ transition: 'opacity 0.5s' }}>
            <rect x="420" y="280" width="100" height="100" rx="8" fill="rgba(100, 150, 255, 0.15)" stroke={stage >= 3 ? "rgba(100, 200, 100, 0.6)" : stage >= 2 ? "rgba(255, 200, 50, 0.6)" : "rgba(100, 150, 255, 0.4)"} strokeWidth="2" style={{ transition: 'stroke 0.5s' }} filter={stage >= 2 ? "url(#glow)" : "none"} />
            <text x="470" y="310" textAnchor="middle" fill="rgba(100, 150, 255, 0.8)" fontSize="10" fontWeight="600">
              User ATA (L2)
            </text>
            <text x="470" y="330" textAnchor="middle" fill={stage >= 3 ? "rgba(100, 200, 100, 0.9)" : "rgba(100, 150, 255, 0.7)"} fontSize="11" fontWeight="600" style={{ transition: 'fill 0.5s' }}>
              {stage >= 3 && stage < 4 ? '[1000 WICK]' : stage >= 4 ? '[0 WICK]' : '[Syncing...]'}
            </text>
            <text x="470" y="350" textAnchor="middle" fill="rgba(100, 150, 255, 0.5)" fontSize="8">
              Dormant
            </text>
          </g>

          {/* Safe Vault ATA L2 (right of portal) */}
          <g opacity={stage >= 2 ? 1 : 0.3} style={{ transition: 'opacity 0.5s' }}>
            <rect x="680" y="280" width="100" height="100" rx="8" fill="rgba(255, 200, 50, 0.15)" stroke={stage >= 4 ? "rgba(100, 200, 100, 0.6)" : stage >= 2 ? "rgba(255, 200, 50, 0.6)" : "rgba(255, 200, 50, 0.3)"} strokeWidth="2" style={{ transition: 'stroke 0.5s' }} filter={stage >= 4 ? "url(#glowStrong)" : stage >= 2 ? "url(#glow)" : "none"} />
            <text x="730" y="310" textAnchor="middle" fill="rgba(255, 200, 50, 0.8)" fontSize="10" fontWeight="600">
              Safe Vault (L2)
            </text>
            <text x="730" y="330" textAnchor="middle" fill={stage >= 4 ? "rgba(100, 200, 100, 0.9)" : "rgba(255, 200, 50, 0.7)"} fontSize="11" fontWeight="600" style={{ transition: 'fill 0.5s' }}>
              {stage >= 4 ? '[1000 WICK] ✅' : '[0 WICK]'}
            </text>
            <text x="730" y="350" textAnchor="middle" fill="rgba(255, 200, 50, 0.5)" fontSize="8">
              Protected
            </text>
          </g>

          {/* Animated flow from L1 to Portal */}
          {stage >= 2 && (
            <line x1="230" y1="380" x2="420" y2="330" stroke="url(#flowYellow)" strokeWidth="2.5" strokeDasharray="8,4" strokeDashoffset={-flowOffset * 2} opacity={stage >= 2 ? 1 : 0} />
          )}

          {/* Animated flow from Portal to Safe Vault (crash indicator) */}
          {stage >= 4 && (
            <line x1="630" y1="330" x2="680" y2="330" stroke="url(#flowRed)" strokeWidth="3" strokeDasharray="8,4" strokeDashoffset={-flowOffset * 2.5} />
          )}

          {/* Monitoring Active Badge */}
          {stage >= 3 && (
            <g>
              <rect x="540" y="420" width="120" height="35" rx="15" fill="rgba(100, 200, 100, 0.2)" stroke="rgba(100, 200, 100, 0.8)" strokeWidth="1.5" filter="url(#glowStrong)" />
              <text x="600" y="440" textAnchor="middle" fill="rgba(100, 200, 100, 0.9)" fontSize="12" fontWeight="600">
                ✓ Monitoring Active
              </text>
            </g>
          )}
        </g>

        {/* RIGHT SECTION - FINAL STATE & RECOVERY */}
        <g opacity={stage >= 4 ? 1 : 0.3} style={{ transition: 'opacity 0.5s' }}>
          {/* Right box */}
          <rect x="930" y="80" width="240" height="440" rx="20" fill={stage >= 4 ? "rgba(100, 200, 100, 0.1)" : "rgba(100, 150, 255, 0.1)"} stroke={stage >= 4 ? "rgba(100, 200, 100, 0.4)" : "rgba(100, 150, 255, 0.3)"} strokeWidth="2" style={{ transition: 'all 0.5s' }} />

          {/* Label */}
          <rect x="945" y="60" width="210" height="35" rx="15" fill={stage >= 4 ? "rgba(100, 200, 100, 0.2)" : "rgba(100, 150, 255, 0.2)"} stroke={stage >= 4 ? "rgba(100, 200, 100, 0.6)" : "rgba(100, 150, 255, 0.6)"} strokeWidth="1.5" style={{ transition: 'all 0.5s' }} />
          <text x="1050" y="85" textAnchor="middle" fill={stage >= 4 ? "rgba(100, 200, 100, 0.9)" : "rgba(100, 150, 255, 0.9)"} fontSize="14" fontWeight="500" style={{ transition: 'fill 0.5s' }}>
            3. Final State & Recovery
          </text>

          {/* Assets Secured Badge */}
          {stage >= 4 && (
            <g>
              <rect x="990" y="130" width="140" height="50" rx="8" fill="rgba(255, 100, 100, 0.15)" stroke="rgba(255, 100, 100, 0.6)" strokeWidth="1.5" filter="url(#glowStrong)" />
              <text x="1060" y="150" textAnchor="middle" fill="rgba(255, 100, 100, 0.9)" fontSize="11" fontWeight="600">
                Assets Secured
              </text>
              <text x="1060" y="168" textAnchor="middle" fill="rgba(255, 100, 100, 0.8)" fontSize="10">
                (Red Shield)
              </text>
            </g>
          )}

          {/* Safe Vault Summary */}
          <rect x="970" y="250" width="180" height="120" rx="10" fill="rgba(255, 200, 50, 0.15)" stroke={stage >= 4 ? "rgba(255, 200, 50, 0.6)" : "rgba(100, 150, 255, 0.3)"} strokeWidth="1.5" style={{ transition: 'all 0.5s' }} />
          <text x="1060" y="275" textAnchor="middle" fill="rgba(255, 200, 50, 0.9)" fontSize="12" fontWeight="600">
            Safe Vault ATA (L2)
          </text>
          <text x="1060" y="300" textAnchor="middle" fill={stage >= 4 ? "rgba(100, 200, 100, 0.9)" : "rgba(255, 200, 50, 0.7)"} fontSize="11" fontWeight="600" style={{ transition: 'fill 0.5s' }}>
            {safeVaultTokens > 0 ? `[${safeVaultTokens} WICK] ✅` : '[0 WICK]'}
          </text>
          <text x="1060" y="325" textAnchor="middle" fill="rgba(255, 200, 50, 0.6)" fontSize="9">
            7CW7ZtSnidZP...
          </text>

          {/* Market Recovery */}
          {stage >= 5 && (
            <g>
              <rect x="975" y="410" width="170" height="80" rx="8" fill="rgba(100, 200, 100, 0.15)" stroke="rgba(100, 200, 100, 0.6)" strokeWidth="1.5" filter="url(#glowStrong)" />
              <text x="1060" y="435" textAnchor="middle" fill="rgba(100, 200, 100, 0.9)" fontSize="12" fontWeight="600">
                📈 Market Recovery
              </text>
              <text x="1060" y="460" textAnchor="middle" fill="rgba(100, 200, 100, 0.8)" fontSize="10">
                Position Restored
              </text>
              <text x="1060" y="480" textAnchor="middle" fill="rgba(100, 200, 100, 0.7)" fontSize="9">
                User: {userTokens} WICK
              </text>
            </g>
          )}

          {/* Animated flow from Portal to Final State */}
          {stage >= 4 && (
            <line x1="800" y1="330" x2="930" y2="330" stroke={stage >= 5 ? "url(#flowGreen)" : "url(#flowYellow)"} strokeWidth="2.5" strokeDasharray="8,4" strokeDashoffset={-flowOffset * 2} style={{ transition: 'stroke 0.5s' }} />
          )}
        </g>
      </svg>

      {/* Stage Notes */}
      <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-white">{currentNote.title}</h4>
          <span className={`text-xs px-2 py-1 rounded font-mono ${
            stage === 0 ? 'bg-slate-700/50 text-slate-400' :
            stage === 1 ? 'bg-blue-500/20 text-blue-400' :
            stage === 2 ? 'bg-yellow-500/20 text-yellow-400' :
            stage === 3 ? 'bg-emerald-500/20 text-emerald-400' :
            stage === 4 ? 'bg-red-500/20 text-red-400' :
            'bg-emerald-500/20 text-emerald-400'
          }`}>
            {['Ready', 'Connected', 'Minting', 'Monitoring', 'Rescue', 'Recovery'][Math.min(stage, 5)]}
          </span>
        </div>
        <p className="text-xs text-slate-400 font-mono">{currentNote.note}</p>
      </div>
    </div>
  );
}
