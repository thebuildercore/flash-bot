# 🛡️ WickGuard

> **The Invisible Airbag for DeFi Assets.**
> Confidential, sub-millisecond liquidation protection built on **MagicBlock Ephemeral Rollups**.

---

##  Why DeFi Traders Get Wiped Out

In high-leverage DeFi, users don't just lose money because they are wrong—they lose because they are **slow** or **exposed**. When the market crashes:

1.  **Latency (The Clog):** Solana L1 gets congested. Your "Stop Loss" transaction hangs in the mempool while prices plummet.
2.  **MEV Predation (The Sandwich):** Bots detect your distress signal in the public mempool and front-run your exit, forcing a worse price or failed transaction.

##  The Solution: WickGuard

WickGuard fundamentally changes the mechanics of safety. Instead of fighting for block space on the crowded public highway (Mainnet), WickGuard creates a **private, high-speed tunnel** for your assets using **Ephemeral Rollups**.

### Key Features
* **Sub-Millisecond Execution:** Rescues execute in **<3ms** on a dedicated L2 lane (vs. 400ms+ on L1).
* **Invisible "Dark Pool" Execution:** Rescue transactions are sent to the Ephemeral L2, making them **invisible** to public L1 MEV bots and explorers.
* **Zero-Cost Safety:** No gas wars during congestion.
* **Atomic Rescue:** Assets are instantly migrated from a "Risky" User Account to a "Safe" Vault Account upon threshold breach.


---

##  Technical Architecture

WickGuard utilizes a **Hybrid L1/L2 Model** powered by the MagicBlock Ephemeral SDK.

### The Workflow
1.  **Delegate (The Lock):** The user delegates their `UserWallet` (Collateral) and `SafeWallet` (Vault) to the Ephemeral Rollup. This mirrors the state to L2.
2.  **Monitor (The Watch):** The bot monitors on-chain price feeds via standard RPCs.
3.  **Teleport (The Rescue):** When `CurrentPrice < LiquidationPrice`, the bot triggers an **Atomic Transfer** on the Ephemeral Runtime.
    * *Result:* Assets move instantly on L2. The L1 network only sees the result later, preventing front-running.
4.  **Restore (The Recovery):** Once volatility settles, assets can be undelegated or restored to the user.

### Tech Stack
* **Network:** Solana (Devnet)
* **Scaling:** MagicBlock Ephemeral Rollups (SVM)
* **Language:** TypeScript / Node.js
* **SDKs:** `@magicblock-labs/ephemeral-rollups-sdk`, `@solana/web3.js`

---
See the terminal Ouput and solana Verfication of tx : https://github.com/thebuildercore/flash-bot/blob/main/output-log

## ⚙️ Setup & Installation

### Prerequisites
* Node.js (v18+)
* Yarn or npm
* Two Solana Keypairs (User & Safe) with Devnet SOL.

### 1. Clone the Repository
```bash
git clone [https://github.com/thebuildercore/flash-bot]
cd flash-bot
