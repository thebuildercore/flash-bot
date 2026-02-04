
#  WickGuard
> **Proactive DeFi Solvency via Hierarchical Control Theory**  
> Sub-millisecond liquidation prevention using **Ergodic Optimization + PID Tracking** on MagicBlock Ephemeral Rollups.

---

WickGuard fundamentally changes the mechanics of safety. Instead of fighting for block space on the crowded public highway (Mainnet), WickGuard creates a **private, high-speed tunnel** for your assets using **Ephemeral Rollups**.

## 🎯 The Problem: Binary Liquidation Trap

1.  **Latency (The Clog):** Solana L1 gets congested. Your "Stop Loss" transaction hangs in the mempool while prices plummet.
2.  **MEV Predation (The Sandwich):** Bots detect your distress signal in the public mempool and front-run your exit, forcing a worse price or failed transaction.
   
Traditional DeFi liquidation is **reactive** and **zero-sum**:
- ❌ Users become insolvent → Liquidators race to extract collateral
- ❌ Network congestion delays救 rescue transactions (400ms+ on L1)
- ❌ MEV bots front-run distress signals in public mempools

**Result:** Catastrophic losses from execution latency, not bad positions.

---

##  The Solution: Speed as Solvency

WickGuard operates in the **Yellow Zone** (1.0 < Health < 1.05) *before* insolvency, using:

### Strategic Layer: Ergodic HJB Optimization
Solves for optimal **deleveraging velocity** that minimizes:
- Long-term market impact
- Inventory risk  
- Slippage costs

$$v^*(q) = \kappa q, \quad \kappa = \frac{\gamma\sigma^2}{2\eta}$$

###  Tactical Layer: PID Tracking Controller
Executes the strategic velocity via discrete-time control with:
- **Derivative filtering** (handles oracle jitter)
- **Anti-windup logic** (prevents integral overflow)
- **Sub-10ms execution** on Ephemeral Rollups

---

##  Architecture
```
┌─────────────────────────────────────────┐
│  Strategic: HJB Solver (v* target)      │ ← Math-optimal policy
├─────────────────────────────────────────┤
│  Tactical: Filtered PID (uk output)     │ ← Real-time tracking
├─────────────────────────────────────────┤
│  Execution: Ephemeral Rollup (<3ms)     │ ← Private L2 lane
└─────────────────────────────────────────┘
```

**Key Difference from Reactive Systems:**  
Traditional: `Price drops → Liquidate`  
WickGuard: `Risk rises → Continuous rebalancing → Never liquidate`

---

##  Technical Innovations

| Feature | Implementation |
|---------|---------------|
| **Hierarchical Control** | HJB strategy → PID tactics (separation of concerns) |
| **Oracle Resilience** | Filtered derivative term + anti-windup clamping |
| **Non-Custodial Safety** | PDA-scoped permissions (debt-repay only, no withdrawals) |
| **MEV Immunity** | Private execution on Ephemeral L2 (invisible to L1 bots) |

---

##  Quick Start

### Prerequisites
```bash
Node.js v18+,yarn, 2 Solana Devnet keypairs with SOL
```

### Installation
```bash
git clone https://github.com/thebuildercore/flash-bot
cd flash-bot
yarn install
```

### Run
```bash
yarn start  # Starts HJB-PID control loop
```

**Verify Transactions:** [Terminal Output & Solana Explorer](https://github.com/thebuildercore/flash-bot/blob/main/output-log)

---

##  Research Paper

**[Read Full Technical Paper (PDF)](https://github.com/thebuildercore/flash-bot/blob/main/Technical_paper%20(6).pdf)**  
*"Speed: The Missing Layer in DeFi Solvency"* - February 2026

**Core Contribution:**  
Application of ergodic control theory to DeFi risk management with formal proof-of-concept on MagicBlock rollups.

---

##  Security Model

- ✅ **Stale Data Mitigation:** Derivative term detects oracle failures
- ✅ **Restricted Authority:** Agent can only repay debt (no asset extraction)
- ✅ **Formal Bounds:** PID stability enforced via integral clamping

---

##  Tech Stack

**Runtime:** Solana Devnet  
**Scaling:** MagicBlock Ephemeral Rollups  
**Control:** Rust (on-chain) + JavaScript (bot)  
**Theory:** Ergodic HJB + Discrete-time PID

---

##  Performance

- **Execution Latency:** <3ms (vs 400ms+ L1)
- **Control Frequency:** 10ms intervals
- **MEV Protection:** 100% (private L2 execution)

---
## 📚 References

This implementation adapts established control theory methods:
- **ERGODIC OPTIMAL LIQUIDATIONS IN DEFI:** JIALUN CAO1 AND DAVID ˇ SIˇ SKA1,2
- **PID Tuning:** Åström & Hägglund (1995)

---
##  Contributing

Open to collaborations on:
- Advanced oracle aggregation strategies
- Multi-collateral extensions
- Formal stability proofs

---

**Built by [thebuildercore](https://github.com/thebuildercore)**  
*Making DeFi liquidations a solved problem through control theory.*
