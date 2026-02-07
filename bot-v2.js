// Applied maths from paper: PID Controller and HJB equation
// However this has latency 4.1s (based on L1RPC) instead of 20 ms as planned with L2RPC

const fs = require("fs");
const fetch = require("cross-fetch");
const { 
    Connection, Keypair, PublicKey, Transaction
} = require("@solana/web3.js");
const { 
    createMint, getOrCreateAssociatedTokenAccount, mintTo, 
    createTransferInstruction, TOKEN_PROGRAM_ID,
    getAccount
} = require("@solana/spl-token");

const { delegateSpl } = require("@magicblock-labs/ephemeral-rollups-sdk");

// ============================================================================
// HIERARCHICAL CONTROL SYSTEM (FROM PAPER)
// ============================================================================

class ControlState {
    constructor(params = {}) {
        // Strategic parameters (equation 4)
        this.gamma = params.gamma || 4.0;    // Risk aversion
        this.sigma = params.sigma || 0.03;   // Volatility estimate
        this.eta = params.eta || 0.5;        // Market impact cost
        
        // PID parameters
        this.kp = params.kp || 3.0;          // Proportional gain
        this.ki = params.ki || 0.3;          // Integral gain
        this.kd = params.kd || 0.12;         // Derivative gain
        this.alpha = 0.7;                     // Filter coefficient
        this.dt = 0.2;                        // 200ms time step
        this.uMax = 100.0;                    // Max control signal
        
        // PID state variables
        this.lastError = 0;
        this.filteredError = 0;
        this.lastFilteredError = 0;
        this.integral = 0;
        this.lastU = 0;
        this.realizedVelocity = 0;
        
        // Statistics
        this.controlIterations = 0;
        this.totalControlSignal = 0;
        this.totalRepaid = 0;
    }
    
    // Calculate kappa = (γσ²)/(2η) from equation 4
    kappa() {
        return (this.gamma * this.sigma ** 2) / (2.0 * this.eta);
    }
    
    // Calculate optimal deleveraging velocity: v*(q) = κq
    calculateTargetVelocity(inventory) {
        return this.kappa() * inventory;
    }
    
    // Execute one PID control step 
    stepPID(vStar) {
        // 1. Calculate velocity error
        const error = vStar - this.realizedVelocity;
        
        // 2. Filtered derivative (equation 5)
        this.filteredError = this.alpha * error + (1.0 - this.alpha) * this.lastError;
        const dTerm = this.kd * (this.filteredError - this.lastFilteredError) / this.dt;
        
        // 3. Anti-windup integral (equation 6)
        if (this.lastU > 0 && this.lastU < this.uMax) {
            this.integral += this.ki * error * this.dt;
        }
        
        // 4. Compute control output
        const uK = this.kp * error + this.integral + dTerm;
        
        // 5. Update state
        this.lastError = error;
        this.lastFilteredError = this.filteredError;
        this.lastU = uK;
        
        // 6. Clamp and track
        const clampedU = Math.max(0, Math.min(this.uMax, uK));
        this.controlIterations++;
        this.totalControlSignal += clampedU;
        
        return clampedU;
    }
    
    // Update realized velocity after execution
    updateRealizedVelocity(controlSignal, executionEfficiency = 0.9) {
        this.realizedVelocity = controlSignal * executionEfficiency;
    }
    
    getAverageControlSignal() {
        return this.controlIterations > 0 
            ? this.totalControlSignal / this.controlIterations 
            : 0;
    }
}

// Realistic position that tracks actual debt
class LendingPosition {
    constructor(collateralAmount, borrowedAmount, collateralPrice) {
        this.collateralAmount = collateralAmount;
        this.borrowedAmount = borrowedAmount;
        this.collateralPrice = collateralPrice;
        this.liquidationThreshold = 0.80;  // 80% LTV
        this.maxLTV = 0.75;                // 75% max safe
    }
    
    updatePrice(newPrice) {
        this.collateralPrice = newPrice;
    }
    
    getCollateralValue() {
        return this.collateralAmount * this.collateralPrice;
    }
    
    getHealthFactor() {
        if (this.borrowedAmount === 0) return Infinity;
        return (this.getCollateralValue() * this.liquidationThreshold) / this.borrowedAmount;
    }
    
    getInventory() {
        const collateralValue = this.getCollateralValue();
        const maxSafeBorrow = collateralValue * this.maxLTV;
        return maxSafeBorrow > 0 ? this.borrowedAmount / maxSafeBorrow : 0;
    }
    
    isYellowZone() {
        const h = this.getHealthFactor();
        return h > 1.0 && h < 1.05;
    }
    
    // Repay debt to improve health
    repayDebt(usdAmount) {
        const repaid = Math.min(usdAmount, this.borrowedAmount);
        this.borrowedAmount -= repaid;
        return repaid;
    }
}

// --- CONFIGURATION ---
const MAGIC_RPC = "https://devnet-us.magicblock.app"; 
const VALIDATOR_ID = new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd");
const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const MIN_CONTROL_THRESHOLD = 0.001;

async function main() {
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║      WICKGUARD - REALISTIC DEBT REPAYMENT VERSION          ║");
    console.log("║        Continuous Deleveraging via L2 Execution            ║");
    console.log("╚════════════════════════════════════════════════════════════╝\n");
    
    const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
    const connectionL2 = new Connection(MAGIC_RPC, {
        commitment: "confirmed",
        fetch: fetch
    });

    // LOAD WALLET
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`📂 Wallet: ${wallet.publicKey.toBase58().slice(0,8)}...`);
    } catch (e) {
        return console.log("❌ ERROR: my-wallet.json missing.");
    }

    const balance = await connectionL1.getBalance(wallet.publicKey);
    console.log(`💰 Balance: ${(balance / 10**9).toFixed(2)} SOL`);
    if (balance < 0.05 * 10**9) return console.log("❌ Insufficient balance.");

    // SETUP ASSETS ON L1
    console.log("\n🔧 Initializing Assets on L1...");
    const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
    const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
    
    // Create a "protocol vault" that represents the lending protocol
    const protocolVault = Keypair.generate();
    const vaultATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, protocolVault.publicKey);
    
    try { 
        await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
        console.log("✅ Minted 1,000 tokens (collateral)");
    } catch(e) {
        console.log("ℹ️  Tokens already minted");
    }
    
    console.log(`   User ATA: ${userATA.address.toBase58().slice(0, 12)}...`);
    console.log(`   Vault ATA: ${vaultATA.address.toBase58().slice(0, 12)}... (protocol)`);

    // DELEGATE USER ACCOUNT TO L2
    console.log("\n🔗 Delegating user account to Ephemeral Rollup...");
    try {
        const delegateUserIx = await delegateSpl(
            wallet.publicKey,
            mint,
            1000n * 1000000n,
            {
                payer: wallet.publicKey,
                validator: VALIDATOR_ID,
                initIfMissing: true
            }
        );
        
        const userTx = new Transaction().add(...delegateUserIx);
        const { blockhash } = await connectionL1.getLatestBlockhash();
        userTx.recentBlockhash = blockhash;
        userTx.feePayer = wallet.publicKey;
        userTx.sign(wallet);
        
        const userSig = await connectionL1.sendRawTransaction(userTx.serialize(), {
            skipPreflight: false
        });
        await connectionL1.confirmTransaction(userSig, "confirmed");
        console.log(`✅ User delegation successful!`);
    } catch(e) {
        if (e.message.includes("already")) {
            console.log("✅ User already delegated");
        } else {
            console.log(`❌ Error: ${e.message}`);
            return;
        }
    }

    // DELEGATE VAULT TO L2
    console.log("\n🔗 Delegating protocol vault to Ephemeral Rollup...");
    try {
        const delegateVaultIx = await delegateSpl(
            protocolVault.publicKey,
            mint,
            0n,
            {
                payer: wallet.publicKey,
                validator: VALIDATOR_ID,
                initIfMissing: true
            }
        );
        
        const vaultTx = new Transaction().add(...delegateVaultIx);
        const { blockhash } = await connectionL1.getLatestBlockhash();
        vaultTx.recentBlockhash = blockhash;
        vaultTx.feePayer = wallet.publicKey;
        vaultTx.sign(wallet, protocolVault);
        
        const vaultSig = await connectionL1.sendRawTransaction(vaultTx.serialize(), {
            skipPreflight: false
        });
        await connectionL1.confirmTransaction(vaultSig, "confirmed");
        console.log(`✅ Vault delegation successful!`);
    } catch(e) {
        if (e.message.includes("already")) {
            console.log("✅ Vault already delegated");
        } else {
            console.log(`❌ Error: ${e.message}`);
            return;
        }
    }

    console.log("\n⏳ Waiting for L2 sync (15s)...");
    await SLEEP(15000);

    // ========================================================================
    // INITIALIZE CONTROL SYSTEM
    // ========================================================================
    console.log("\n⚙️  Initializing Control System...");
    console.log("─────────────────────────────────────────");
    
    const controlState = new ControlState({
        gamma: 4.0,
        sigma: 0.03,
        eta: 0.5,
        kp: 3.0,
        ki: 0.3,
        kd: 0.12
    });
    
    console.log(`📊 Strategic Parameters:`);
    console.log(`   γ (gamma) = ${controlState.gamma.toFixed(2)} - risk aversion`);
    console.log(`   σ (sigma) = ${controlState.sigma.toFixed(3)} - volatility estimate`);
    console.log(`   η (eta)   = ${controlState.eta.toFixed(2)} - market impact`);
    console.log(`   κ (kappa) = ${controlState.kappa().toFixed(6)} - sensitivity`);
    console.log(`\n🎛️  PID Parameters:`);
    console.log(`   K_P = ${controlState.kp.toFixed(2)} - proportional gain`);
    console.log(`   K_I = ${controlState.ki.toFixed(2)} - integral gain`);
    console.log(`   K_D = ${controlState.kd.toFixed(2)} - derivative gain`);
    
    // Create realistic position (starts in/near Yellow Zone!)
    const position = new LendingPosition(
        1000,      // 1000 tokens collateral
        105000,    // $105k borrowed (higher leverage - starts risky!)
        140        // Starting price
    );
    
    console.log(`\n💼 Lending Position:`);
    console.log(`   Collateral: ${position.collateralAmount} tokens`);
    console.log(`   Borrowed: $${position.borrowedAmount.toLocaleString()}`);
    console.log(`   Initial H: ${position.getHealthFactor().toFixed(3)}`);
    console.log(`   Strategy: Repay debt on L2 to maintain health`);
    console.log("─────────────────────────────────────────\n");

    // ========================================================================
    // MAIN CONTROL LOOP
    // ========================================================================
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║              🛡️  WICKGUARD PROTECTION ACTIVE                ║");
    console.log("╚════════════════════════════════════════════════════════════╝\n");
    
    let totalRepayments = 0;
    let yellowZoneActivations = 0;
    let totalRepaidUSD = 0;

    while (true) {
        // Simulate price movement
        const basePrice = 140;
        const drift = Math.random() * 30 - 15;
        const currentPrice = Math.max(125, Math.min(155, basePrice + drift));
        
        position.updatePrice(currentPrice);
        
        const timestamp = new Date().toLocaleTimeString();
        const healthFactor = position.getHealthFactor();
        const inventory = position.getInventory();
        const isYellowZone = position.isYellowZone();
        
        const statusIcon = isYellowZone ? "🟡" : (healthFactor < 1.0 ? "🔴" : "🟢");
        const zoneText = isYellowZone ? "YELLOW" : (healthFactor < 1.0 ? "DANGER" : "SAFE");
        
        process.stdout.write(
            `\r[${timestamp}] Price: $${currentPrice.toFixed(2)} | ` +
            `H: ${healthFactor.toFixed(3)} | ` +
            `Debt: $${Math.floor(position.borrowedAmount).toLocaleString()} | ` +
            `${statusIcon} ${zoneText} | ` +
            `Repayments: ${totalRepayments}   `
        );

        // ====================================================================
        // YELLOW ZONE CONTROL (1.0 < H < 1.05)
        // ====================================================================
        if (isYellowZone) {
            yellowZoneActivations++;
            
            if (yellowZoneActivations === 1) {
                console.log("\n\n⚠️  YELLOW ZONE ENGAGED - Continuous Deleveraging Active");
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            }

            const start = Date.now();

            try {
                // STEP 1: Strategic Layer
                const vStar = controlState.calculateTargetVelocity(inventory);
                
                // STEP 2: Tactical Layer
                const uK = controlState.stepPID(vStar);
                
                console.log(`\n   📊 Control Iteration #${controlState.controlIterations}`);
                console.log(`   ├─ Strategic: v* = ${vStar.toFixed(6)} (target velocity)`);
                console.log(`   ├─ Tactical:  u_k = ${uK.toFixed(4)} (control signal)`);
                console.log(`   ├─ Error: ${(vStar - controlState.realizedVelocity).toFixed(6)}`);
                console.log(`   └─ Integral: ${controlState.integral.toFixed(4)}`);
                
                // STEP 3: Execute if signal is strong enough
                if (Math.abs(uK) > MIN_CONTROL_THRESHOLD) {
                    const userInfo = await getAccount(connectionL2, userATA.address);
                    const userBalance = Number(userInfo.amount);
                    
                    if (userBalance === 0) {
                        console.log(`   ⚠️  No collateral to sell/repay with`);
                        await SLEEP(200);
                        continue;
                    }

                    // Calculate repayment amount
                    // uK is control signal in decimal form (e.g., 0.0131 = 1.31%)
                    const repayPercentage = Math.min(uK * 100, 100); // Convert to percentage for display
                    const tokensToSell = Math.floor(userBalance * uK); // Use uK directly as decimal
                    const usdFromSale = tokensToSell * currentPrice / 10**6;
                    
                    console.log(`\n   ⚡ Executing Debt Repayment:`);
                    console.log(`   ├─ Signal: ${repayPercentage.toFixed(3)}%`);
                    console.log(`   ├─ Sell: ${(tokensToSell / 10**6).toFixed(3)} tokens`);
                    console.log(`   ├─ Proceeds: $${usdFromSale.toFixed(2)}`);
                    console.log(`   └─ Strategy: Reduce debt to improve health`);

                    // Transfer tokens from user to vault (represents debt repayment)
                    const transferIx = createTransferInstruction(
                        userATA.address,
                        vaultATA.address,
                        wallet.publicKey,
                        tokensToSell,
                        [], 
                        TOKEN_PROGRAM_ID
                    );

                    const tx = new Transaction().add(transferIx);
                    const { blockhash } = await connectionL2.getLatestBlockhash("confirmed");
                    tx.recentBlockhash = blockhash;
                    tx.feePayer = wallet.publicKey;
                    tx.sign(wallet);

                    const sig = await connectionL2.sendRawTransaction(tx.serialize(), {
                        skipPreflight: false,
                        maxRetries: 3
                    });
                    
                    await connectionL2.confirmTransaction(sig, "confirmed");
                    
                    const speed = Date.now() - start;
                    totalRepayments++;
                    totalRepaidUSD += usdFromSale;
                    
                    // Update position: debt reduced, collateral reduced
                    const repaidDebt = position.repayDebt(usdFromSale);
                    position.collateralAmount -= (tokensToSell / 10**6);
                    
                    // Update control state
                    controlState.updateRealizedVelocity(uK, 0.9);
                    controlState.totalRepaid += repaidDebt;
                    
                    console.log(`\n   ✅ DEBT REPAYMENT COMPLETE`);
                    console.log(`   ├─ Execution: ${speed}ms`);
                    console.log(`   ├─ Debt reduced by: $${repaidDebt.toFixed(2)}`);
                    console.log(`   ├─ New H: ${position.getHealthFactor().toFixed(3)}`);
                    console.log(`   ├─ Remaining Debt: $${position.borrowedAmount.toLocaleString()}`);
                    console.log(`   └─ Tx: ${sig.slice(0, 20)}...`);
                    
                    // Verify on L2
                    await SLEEP(500);
                    const newUser = await getAccount(connectionL2, userATA.address);
                    const newVault = await getAccount(connectionL2, vaultATA.address);
                    console.log(`   📊 L2 State - User: ${Number(newUser.amount) / 10**6} | Vault: ${Number(newVault.amount) / 10**6}`);
                    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                    
                } else {
                    console.log(`   ⏸️  Signal below threshold (${uK.toFixed(4)} < ${MIN_CONTROL_THRESHOLD}), no action`);
                }

            } catch (err) {
                console.log(`\n   ❌ Control error: ${err.message}`);
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            }
        } else if (yellowZoneActivations > 0) {
            // Exited Yellow Zone
            console.log("\n\n✅ EXITED YELLOW ZONE");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(`   Control iterations: ${controlState.controlIterations}`);
            console.log(`   Total repayments: ${totalRepayments}`);
            console.log(`   Total debt repaid: $${totalRepaidUSD.toFixed(2)}`);
            console.log(`   Average control signal: ${controlState.getAverageControlSignal().toFixed(4)}`);
            console.log(`   Final health factor: ${healthFactor.toFixed(3)}`);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            yellowZoneActivations = 0;
            
            // Reset PID state
            controlState.integral = 0;
            controlState.realizedVelocity = 0;
        }
// The Emergency Exit that liquidates at once during price crash has been disabled
        // ====================================================================
        // EMERGENCY MODE (H < 1.0) - DISABLED FOR TESTING
        // ====================================================================
        // Commented out to see full control system behavior
        /*
        if (healthFactor < 1.0 && healthFactor !== Infinity) {
            console.log("\n\n🚨 EMERGENCY MODE - LIQUIDATION IMMINENT");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log("   Bypassing PID, executing maximum debt repayment...");
            
            try {
                const userInfo = await getAccount(connectionL2, userATA.address);
                const userBalance = Number(userInfo.amount);
                
                if (userBalance > 0) {
                    // Sell ALL remaining collateral to repay debt
                    const usdFromSale = userBalance * currentPrice / 10**6;
                    
                    const transferIx = createTransferInstruction(
                        userATA.address,
                        vaultATA.address,
                        wallet.publicKey,
                        userBalance,
                        [], 
                        TOKEN_PROGRAM_ID
                    );

                    const tx = new Transaction().add(transferIx);
                    const { blockhash } = await connectionL2.getLatestBlockhash("confirmed");
                    tx.recentBlockhash = blockhash;
                    tx.feePayer = wallet.publicKey;
                    tx.sign(wallet);

                    const sig = await connectionL2.sendRawTransaction(tx.serialize());
                    await connectionL2.confirmTransaction(sig, "confirmed");
                    
                    // Update position
                    const repaid = position.repayDebt(usdFromSale);
                    position.collateralAmount = 0;
                    
                    console.log(`   ✅ EMERGENCY REPAYMENT COMPLETE`);
                    console.log(`   Debt repaid: $${repaid.toFixed(2)}`);
                    console.log(`   Remaining debt: $${position.borrowedAmount.toFixed(2)}`);
                    console.log(`   New H: ${position.getHealthFactor().toFixed(3)}`);
                    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                }
            } catch (e) {
                console.log(`   ❌ Emergency failed: ${e.message}`);
            }
        }
        */
        
        await SLEEP(200);
    }
}

main().catch(console.error);
