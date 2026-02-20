'use client';

import { Terminal } from 'lucide-react';

const RAW_LOG = `akshaya@LAPTOP-7AG4UK0V:~/wickguard-bot$ node bot.js
╔════════════════════════════════════════════════════════════╗
║      WICKGUARD BOT v2.1 - PRODUCTION READY                 ║
║   Hierarchical Control with L2 Execution (MagicBlock)      ║
╚════════════════════════════════════════════════════════════╝

[08:22:39.968] ✅ Vault configuration loaded
[08:22:39.968]    Vault: GekZQCvohsC4...
[08:22:39.968]    Mint:  8fWh7DH7KBoW...

[08:22:40.076]  Wallet: GFwjtPEB...
[08:22:40.698]  Balance: 4.96 SOL


[08:22:40.699]  Setting up user token account...
[08:22:40.877] ✅ User ATA: 7odNWNkLmMFj...


[08:22:40.878]  Minting collateral tokens...
[08:22:41.061]    Current balance: 1000 tokens
[08:22:41.061] ✅ Already have 1000 tokens


[08:22:41.062]  Delegating user account to L2...
[08:22:41.253]    Delegating: 1000 tokens
[08:22:41.641] ✅ User already delegated


[08:22:41.641] ⏳ Waiting for L2 sync... (Polling L2 RPC)
[08:22:42.194] 🔍 Verifying on L2...
[08:22:42.194] ✅ User account visible on L2 (Exact sync time: 0.55 seconds)

  Initializing Anti-Wick Protection...
─────────────────────────────────────────
 Strategic Parameters (HJB - Equation 4):
   γ (gamma) = 4.00 - risk aversion
   σ (sigma) = 0.080 - volatility (tuned for Solana)
   η (eta)   = 0.50 - market impact
   κ (kappa) = 0.025600 - deleveraging sensitivity

  Tactical Parameters (PID - Equation 7):
   K_P = 1.00 - proportional gain
   K_I = 0.05 - integral gain
   K_D = 0.08 - derivative gain

🛡️  Anti-Wick Protection:
   Grace Period: 15 checks (3s)
   Price EMA α: 0.3 (filters wicks)
   Yellow Zone: H < 1.15
   Danger Zone: H < 1.1 (triggers action)

 Position:
   Collateral: 1000 tokens
   Debt: $92,000
   Initial H: 1.217
   Vault: Connected ✅
─────────────────────────────────────────

╔════════════════════════════════════════════════════════════╗
║        🛡️  WICKGUARD ANTI-WICK PROTECTION ACTIVE           ║
╚════════════════════════════════════════════════════════════╝

 Crash Simulation Timeline:
   0-30s:  Normal volatility (±$3)
   30-35s: Quick WICK ($140→$128→$142) ⚡ Should be FILTERED
   35-40s: Brief recovery
   40-60s: SUSTAINED CRASH ($140→$127) 💥 Should TRIGGER
   60-70s: Stabilization
   70s+:   Recovery

[08:22:43.094] 🟢 NORMAL     | $139.64 | H: 1.214 | Debt: $92,000 | 🟢 SAFE | Repayments: 0 | Wicks: 0    Repayments: 0 | Wicks: 0   
[08:22:43.697] 🟢 NORMAL     | Raw: $138.62 (-0.8%) → EMA: $139.69 | H: 1.215 | Debt: $92,000 | 🟢 SAFE | Repayments: 0 | Wicks: 0   
[08:23:16.185] ⚡ WICK       | Raw: $135.20 (-1.6%) → EMA: $137.34 | H: 1.194 | Debt: $92,000 | 🟢 SAFE | Repayments: 0 | Wicks: 0   
[08:23:17.591] ⚡ WICK       | Raw: $128.93 (-1.0%) → EMA: $130.19 | H: 1.132 | Debt: $92,000 | 🟡 YELLOW | Repayments: 0 | Wicks: 0   
[08:23:18.594] ⚡ WICK       | Raw: $133.60 (+1.2%) → EMA: $132.00 | H: 1.148 | Debt: $92,000 | 🟡 YELLOW | Repayments: 0 | Wicks: 0   
[08:23:19.997] ⚡ WICK       | Raw: $140.13 (+1.5%) → EMA: $138.00 | H: 1.200 | Debt: $92,000 | 🟢 SAFE | Repayments: 0 | Wicks: 0   
[08:23:21.201] 📈 RECOVERY   | $140.84 | H: 1.225 | Debt: $92,000 | 🟢 SAFE | Repayments: 0 | Wicks: 0    Repayments: 0 | Wicks: 0   
[08:23:23.006] 📈 RECOVERY   | $140.75 | H: 1.224 | Debt: $92,000 | 🟢 SAFE | Repayments: 0 | Wicks: 0    Repayments: 0 | Wicks: 0   
[08:23:25.818] 💥 CRASH      | $139.88 | H: 1.216 | Debt: $92,000 | 🟢 SAFE | Repayments: 0 | Wicks: 0    Repayments: 0 | Wicks: 0   
[08:23:26.620] 💥 CRASH      | $138.96 | H: 1.208 | Debt: $92,000 | 🟢 SAFE | Repayments: 0 | Wicks: 0   
[08:23:28.024] 💥 CRASH      | $137.30 | H: 1.194 | Debt: $92,000 | 🟢 SAFE | Repayments: 0 | Wicks: 0   
[08:23:33.039] 💥 CRASH      | $131.21 | H: 1.141 | Debt: $92,000 | 🟡 YELLOW | Repayments: 0 | Wicks: 0   epayments: 0 | Wicks: 0   
[08:23:35.446] 💥 CRASH      | $128.04 | H: 1.113 | Debt: $92,000 | 🟡 YELLOW | Repayments: 0 | Wicks: 0   
[08:23:37.051] ⏳ GRACE PERIOD 2/15 | Raw: $125.75 (-0.3%) | EMA: $126.17 | H: 1.097 | Vol: 0.5%   ks: 0   
[08:23:38.255] ⏳ GRACE PERIOD 8/15 | Raw: $124.01 (-0.4%) | EMA: $124.44 | H: 1.082 | Vol: 0.7%   ks: 0   
[08:23:38.857] ⏳ GRACE PERIOD 11/15 | Raw: $123.12 (-0.4%) | EMA: $123.64 | H: 1.075 | Vol: 0.7%   s: 0   
[08:23:39.460] ⏳ GRACE PERIOD 14/15 | Raw: $122.93 (-0.2%) | EMA: $123.16 | H: 1.071 | Vol: 0.5%   s: 0   
[08:23:39.660] 💥 CRASH      | $122.91 | H: 1.069 | Debt: $92,000 | 🔴 DANGER | Repayments: 0 | Wicks: 0   

🔴 DANGER ZONE - Grace Period Expired!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Price sustained below H=1.1 for 3s
   Activating continuous hierarchical control
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   📊 Control Iteration #1
   ├─ Price: Raw $122.32 → Smoothed $122.91
   ├─ Volatility: 0.45%
   ├─ Strategic (HJB): v* = 0.025550 (target velocity)
   ├─ Tactical (PID):  u_k = 0.0327 (control signal)
   ├─ Velocity Error: 0.025550
   └─ Integral State: 0.0000

   ⚡ Executing L2 Repayment (MEV Protected):
   ├─ Signal: 3.270%
   ├─ Sell: 17.471 tokens
   ├─ Price Used: $122.91 (EMA, not wick)
   ├─ Proceeds: $2147.30
   └─ Target: Vault


   ✅ REPAYMENT COMPLETE (L2)
   ├─ Execution: 4659ms (MEV protected)
   ├─ Debt reduced: $2147.30
   ├─ New H: 1.075
   ├─ Remaining Debt: $89,852.701
   └─ Tx: 3VViXsbNkhz517sCBwgn...
   📊 L2 State - User: 516.743763 | Vault: 483.256237
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:23:45.273] 💥 CRASH      | $122.59 | H: 1.072 | Debt: $89,852 | 🔴 DANGER | Repayments: 1 | Wicks: 0   
   📊 Control Iteration #2
   ├─ Price: Raw $121.86 → Smoothed $122.59
   ├─ Volatility: 0.51%
   ├─ Strategic (HJB): v* = 0.025463 (target velocity)
   ├─ Tactical (PID):  u_k = 0.0288 (control signal)
   ├─ Velocity Error: 0.025463
   └─ Integral State: 0.0003

   ⚡ Executing L2 Repayment (MEV Protected):
   ├─ Signal: 2.876%
   ├─ Sell: 14.861 tokens
   ├─ Price Used: $122.59 (EMA, not wick)
   ├─ Proceeds: $1821.82
   └─ Target: Vault

   ✅ REPAYMENT COMPLETE (L2)
   ├─ Execution: 1199ms (MEV protected)
   ├─ Debt reduced: $1821.82
   ├─ New H: 1.078
   ├─ Remaining Debt: $88,030.877
   └─ Tx: 5QsttzzUoWVM5aGCaLYA...
   📊 L2 State - User: 501.882848 | Vault: 498.117152
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:23:47.517] 💥 CRASH      | $122.31 | H: 1.076 | Debt: $88,030 | 🔴 DANGER | Repayments: 2 | Wicks: 0   
   📊 Control Iteration #3
   ├─ Price: Raw $121.66 → Smoothed $122.31
   ├─ Volatility: 0.56%
   ├─ Strategic (HJB): v* = 0.025387 (target velocity)
   ├─ Tactical (PID):  u_k = 0.0259 (control signal)
   ├─ Velocity Error: 0.025387
   └─ Integral State: 0.0005

   ⚡ Executing L2 Repayment (MEV Protected):
   ├─ Signal: 2.586%
   ├─ Sell: 12.981 tokens
   ├─ Price Used: $122.31 (EMA, not wick)
   ├─ Proceeds: $1587.71
   └─ Target: Vault

   ✅ REPAYMENT COMPLETE (L2)
   ├─ Execution: 924ms (MEV protected)
   ├─ Debt reduced: $1587.71
   ├─ New H: 1.081
   ├─ Remaining Debt: $86,443.164
   └─ Tx: 3wzmNeLNGMEhg1w1Vbpk...
   📊 L2 State - User: 488.902051 | Vault: 511.097949
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:23:49.393] 💥 CRASH      | $122.12 | H: 1.079 | Debt: $86,443 | 🔴 DANGER | Repayments: 3 | Wicks: 0   
   📊 Control Iteration #4
   ├─ Price: Raw $121.68 → Smoothed $122.12
   ├─ Volatility: 0.53%
   ├─ Strategic (HJB): v* = 0.025308 (target velocity)
   ├─ Tactical (PID):  u_k = 0.0260 (control signal)
   ├─ Velocity Error: 0.025308
   └─ Integral State: 0.0008

   ⚡ Executing L2 Repayment (MEV Protected):
   ├─ Signal: 2.604%
   ├─ Sell: 12.730 tokens
   ├─ Price Used: $122.12 (EMA, not wick)
   ├─ Proceeds: $1554.62
   └─ Target: Vault

   ✅ REPAYMENT COMPLETE (L2)
   ├─ Execution: 1113ms (MEV protected)
   ├─ Debt reduced: $1554.62
   ├─ New H: 1.084
   ├─ Remaining Debt: $84,888.547
   └─ Tx: 3xM12bpZNFonB4a4vrc4...
   📊 L2 State - User: 476.172173 | Vault: 523.827827
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:23:51.458] 💥 CRASH      | $121.83 | H: 1.081 | Debt: $84,888 | 🔴 DANGER | Repayments: 4 | Wicks: 0   
   📊 Control Iteration #5
   ├─ Price: Raw $121.13 → Smoothed $121.83
   ├─ Volatility: 0.56%
   ├─ Strategic (HJB): v* = 0.025250 (target velocity)
   ├─ Tactical (PID):  u_k = 0.0262 (control signal)
   ├─ Velocity Error: 0.025250
   └─ Integral State: 0.0010

   ⚡ Executing L2 Repayment (MEV Protected):
   ├─ Signal: 2.624%
   ├─ Sell: 12.494 tokens
   ├─ Price Used: $121.83 (EMA, not wick)
   ├─ Proceeds: $1522.08
   └─ Target: Vault

   ✅ REPAYMENT COMPLETE (L2)
   ├─ Execution: 1113ms (MEV protected)
   ├─ Debt reduced: $1522.08
   ├─ New H: 1.087
   ├─ Remaining Debt: $83,366.472
   └─ Tx: LWr7L1BTK6sDpWXBzfPZ...
   📊 L2 State - User: 463.678225 | Vault: 536.321775
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:23:53.531] 💥 CRASH      | $121.59 | H: 1.084 | Debt: $83,366 | 🔴 DANGER | Repayments: 5 | Wicks: 0   
   📊 Control Iteration #6
   ├─ Price: Raw $121.03 → Smoothed $121.59
   ├─ Volatility: 0.61%
   ├─ Strategic (HJB): v* = 0.025180 (target velocity)
   ├─ Tactical (PID):  u_k = 0.0264 (control signal)
   ├─ Velocity Error: 0.025180
   └─ Integral State: 0.0013

   ⚡ Executing L2 Repayment (MEV Protected):
   ├─ Signal: 2.642%
   ├─ Sell: 12.250 tokens
   ├─ Price Used: $121.59 (EMA, not wick)
   ├─ Proceeds: $1489.43
   └─ Target: Vault

   ✅ REPAYMENT COMPLETE (L2)
   ├─ Execution: 1105ms (MEV protected)
   ├─ Debt reduced: $1489.43
   ├─ New H: 1.090
   ├─ Remaining Debt: $81,877.04
   └─ Tx: 43ZnTiiVR62uMhrctPRX...
   📊 L2 State - User: 451.428287 | Vault: 548.571713
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:23:55.685] 💥 CRASH      | $121.22 | H: 1.086 | Debt: $81,877 | 🔴 DANGER | Repayments: 6 | Wicks: 0   
   📊 Control Iteration #7
   ├─ Price: Raw $120.37 → Smoothed $121.22
   ├─ Volatility: 0.69%
   ├─ Strategic (HJB): v* = 0.025136 (target velocity)
   ├─ Tactical (PID):  u_k = 0.0266 (control signal)
   ├─ Velocity Error: 0.025136
   └─ Integral State: 0.0015

   ⚡ Executing L2 Repayment (MEV Protected):
   ├─ Signal: 2.663%
   ├─ Sell: 12.022 tokens
   ├─ Price Used: $121.22 (EMA, not wick)
   ├─ Proceeds: $1457.39
   └─ Target: Vault

   ✅ REPAYMENT COMPLETE (L2)
   ├─ Execution: 1206ms (MEV protected)
   ├─ Debt reduced: $1457.39
   ├─ New H: 1.092
   ├─ Remaining Debt: $80,419.654
   └─ Tx: W2mB6fJ8AydBFDULxdH2...
   📊 L2 State - User: 439.405813 | Vault: 560.594187
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:23:57.846] 💥 CRASH      | $121.08 | H: 1.090 | Debt: $80,419 | 🔴 DANGER | Repayments: 7 | Wicks: 0   
   📊 Control Iteration #8
   ├─ Price: Raw $120.76 → Smoothed $121.08
   ├─ Volatility: 0.66%
   ├─ Strategic (HJB): v* = 0.025045 (target velocity)
   ├─ Tactical (PID):  u_k = 0.0268 (control signal)
   ├─ Velocity Error: 0.025045
   └─ Integral State: 0.0018

   ⚡ Executing L2 Repayment (MEV Protected):
   ├─ Signal: 2.678%
   ├─ Sell: 11.768 tokens
   ├─ Price Used: $121.08 (EMA, not wick)
   ├─ Proceeds: $1424.91
   └─ Target: Vault

   ✅ REPAYMENT COMPLETE (L2)
   ├─ Execution: 1295ms (MEV protected)
   ├─ Debt reduced: $1424.91
   ├─ New H: 1.096
   ├─ Remaining Debt: $78,994.746
   └─ Tx: 5gqUoDe27J13yD4jGtFY...
   📊 L2 State - User: 427.637901 | Vault: 572.362099
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:24:00.188] 💥 CRASH      | $120.81 | H: 1.093 | Debt: $78,994 | 🔴 DANGER | Repayments: 8 | Wicks: 0   
   📊 Control Iteration #9
   ├─ Price: Raw $120.17 → Smoothed $120.81
   ├─ Volatility: 0.68%
   ├─ Strategic (HJB): v* = 0.024981 (target velocity)
   ├─ Tactical (PID):  u_k = 0.0270 (control signal)
   ├─ Velocity Error: 0.024981
   └─ Integral State: 0.0020

   ⚡ Executing L2 Repayment (MEV Protected):
   ├─ Signal: 2.697%
   ├─ Sell: 11.533 tokens
   ├─ Price Used: $120.81 (EMA, not wick)
   ├─ Proceeds: $1393.36
   └─ Target: Vault

   ✅ REPAYMENT COMPLETE (L2)
   ├─ Execution: 1303ms (MEV protected)
   ├─ Debt reduced: $1393.36
   ├─ New H: 1.098
   ├─ Remaining Debt: $77,601.383
   └─ Tx: 4LSZDmYMB4SfJ7BrYgV6...
   📊 L2 State - User: 416.104457 | Vault: 583.895543
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:24:02.536] 💥 CRASH      | $120.44 | H: 1.095 | Debt: $77,601 | 🔴 DANGER | Repayments: 9 | Wicks: 0   
   📊 Control Iteration #10
   ├─ Price: Raw $119.56 → Smoothed $120.44
   ├─ Volatility: 0.67%
   ├─ Strategic (HJB): v* = 0.024939 (target velocity)
   ├─ Tactical (PID):  u_k = 0.0272 (control signal)
   ├─ Velocity Error: 0.024939
   └─ Integral State: 0.0023

   ⚡ Executing L2 Repayment (MEV Protected):
   ├─ Signal: 2.719%
   ├─ Sell: 11.312 tokens
   ├─ Price Used: $120.44 (EMA, not wick)
   ├─ Proceeds: $1362.41
   └─ Target: Vault

   ✅ REPAYMENT COMPLETE (L2)
   ├─ Execution: 842ms (MEV protected)
   ├─ Debt reduced: $1362.41
   ├─ New H: 1.100
   ├─ Remaining Debt: $76,238.968
   └─ Tx: 5V5oznQwtbvUbdG237Jt...
   📊 L2 State - User: 404.792113 | Vault: 595.207887
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:24:04.413] 💥 CRASH      | $120.14 | H: 1.098 | Debt: $76,238 | 🔴 DANGER | Repayments: 10 | Wicks: 0   
   📊 Control Iteration #11
   ├─ Price: Raw $119.46 → Smoothed $120.14
   ├─ Volatility: 0.68%
   ├─ Strategic (HJB): v* = 0.024880 (target velocity)
   ├─ Tactical (PID):  u_k = 0.0274 (control signal)
   ├─ Velocity Error: 0.024880
   └─ Integral State: 0.0025

   ⚡ Executing L2 Repayment (MEV Protected):
   ├─ Signal: 2.737%
   ├─ Sell: 11.081 tokens
   ├─ Price Used: $120.14 (EMA, not wick)
   ├─ Proceeds: $1331.28
   └─ Target: Vault

   ✅ REPAYMENT COMPLETE (L2)
   ├─ Execution: 934ms (MEV protected)
   ├─ Debt reduced: $1331.28
   ├─ New H: 1.103
   ├─ Remaining Debt: $74,907.688
   └─ Tx: 4jRzfREFYg7MBfRsyLab...
   📊 L2 State - User: 393.711401 | Vault: 606.288599
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[08:24:06.309] 💥 CRASH      | $119.87 | H: 1.100 | Debt: $74,907 | 🟡 YELLOW | Repayments: 11 | Wicks: 0   

✅ EXITED DANGER ZONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Control iterations: 11
   Repayments executed: 11
   Total debt repaid: $17092.31
   Wicks avoided: 0 ✅
   Avg control signal: 0.0274
   Final health factor: 1.100
   Status: Position SAVED! 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[08:24:08.117] ⏳ GRACE PERIOD 9/15 | Raw: $117.01 (-0.6%) | EMA: $117.68 | H: 1.080 | Vol: 0.7%   ^Cs: 0   `;

export default function TerminalLog() {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-zinc-800 bg-[#0c0c0e] shadow-2xl">
      {/* Terminal Header Bar */}
      <div className="flex items-center px-4 py-3 bg-[#18181b] border-b border-zinc-800">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="mx-auto flex items-center text-xs text-zinc-400 font-mono">
          <Terminal className="w-3.5 h-3.5 mr-2" />
          bash - wickguard-bot - 80x24
        </div>
      </div>
      {/* Scrollable Log Area */}
      <div className="p-4 overflow-x-auto overflow-y-auto max-h-[600px] text-xs sm:text-sm font-mono text-emerald-400 bg-[#0c0c0e] leading-relaxed custom-scrollbar">
        <pre className="whitespace-pre">
          <code>{RAW_LOG}</code>
        </pre>
      </div>
    </div>
  );
}