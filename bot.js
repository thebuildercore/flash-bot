
// const fs = require("fs");
// const fetch = require("cross-fetch");
// const { 
//     Connection, Keypair, PublicKey, Transaction
// } = require("@solana/web3.js");
// const { 
//     getOrCreateAssociatedTokenAccount,
//     mintTo,
//     createTransferInstruction, 
//     TOKEN_PROGRAM_ID,
//     getAccount
// } = require("@solana/spl-token");
// const { delegateSpl } = require("@magicblock-labs/ephemeral-rollups-sdk");
// const config = require("./config");

// const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // ============================================================================
// // PRICE SMOOTHING (EMA Filter)
// // ============================================================================

// class PriceFilter {
//     constructor(alpha = 0.3) {
//         this.alpha = alpha;
//         this.ema = null;
//         this.priceHistory = [];
//     }
    
//     update(rawPrice) {
//         if (this.ema === null) {
//             this.ema = rawPrice;
//         } else {
//             this.ema = (this.alpha * rawPrice) + ((1 - this.alpha) * this.ema);
//         }
        
//         this.priceHistory.push(rawPrice);
//         if (this.priceHistory.length > 50) {
//             this.priceHistory.shift();
//         }
        
//         return this.ema;
//     }
    
//     getSmoothedPrice() {
//         return this.ema;
//     }
    
//     getRawVolatility() {
//         if (this.priceHistory.length < 10) return 0;
        
//         const recent = this.priceHistory.slice(-10);
//         const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
//         const variance = recent.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / recent.length;
//         return Math.sqrt(variance) / mean;
//     }
// }

// // ============================================================================
// // DANGER ZONE TRACKER (Grace Period Logic)
// // ============================================================================
// class DangerZoneTracker {
//     constructor(gracePeriodChecks = 15) {
//         this.gracePeriodChecks = gracePeriodChecks;
//         this.dangerCounter = 0;
//         this.safeCounter = 0;
//     }
    
//     update(healthFactor, dangerThreshold = 1.03) {
//         if (healthFactor < dangerThreshold && healthFactor > 1.0) {
//             this.dangerCounter++;
//             this.safeCounter = 0;
//         } else {
//             this.safeCounter++;
//             this.dangerCounter = 0;
//         }
//     }
    
//     shouldAct() {
//         return this.dangerCounter >= this.gracePeriodChecks;
//     }
    
//     isInGracePeriod() {
//         return this.dangerCounter > 0 && this.dangerCounter < this.gracePeriodChecks;
//     }
    
//     getProgress() {
//         return `${this.dangerCounter}/${this.gracePeriodChecks}`;
//     }
    
//     reset() {
//         this.dangerCounter = 0;
//         this.safeCounter = 0;
//     }
// }

// // ============================================================================
// // HIERARCHICAL CONTROL SYSTEM
// // ============================================================================
// class ControlState {
//     constructor(params = {}) {
//         this.gamma = params.gamma || config.GAMMA;
//         this.sigma = params.sigma || config.SIGMA;
//         this.eta = params.eta || config.ETA;
        
//         this.kp = params.kp || config.KP;
//         this.ki = params.ki || config.KI;
//         this.kd = params.kd || config.KD;
//         this.alpha = params.alpha || config.ALPHA;
//         this.dt = params.dt || config.DT;
//         this.uMax = 100.0;
        
//         this.lastError = 0;
//         this.filteredError = 0;
//         this.lastFilteredError = 0;
//         this.integral = 0;
//         this.lastU = 0;
//         this.realizedVelocity = 0;
        
//         this.controlIterations = 0;
//         this.totalControlSignal = 0;
//         this.totalRepaid = 0;
//     }
    
//     kappa() {
//         return (this.gamma * this.sigma ** 2) / (2.0 * this.eta);
//     }
    
//     calculateTargetVelocity(inventory) {
//         return this.kappa() * inventory;
//     }
    
//     stepPID(vStar) {
//         const error = vStar - this.realizedVelocity;
        
//         this.filteredError = this.alpha * error + (1.0 - this.alpha) * this.lastError;
//         const dTerm = this.kd * (this.filteredError - this.lastFilteredError) / this.dt;
        
//         const integralMax = 0.1;
//         if (this.lastU > 0 && this.lastU < this.uMax && Math.abs(this.integral) < integralMax) {
//             this.integral += this.ki * error * this.dt;
//         }
        
//         const uK = this.kp * error + this.integral + dTerm;
        
//         this.lastError = error;
//         this.lastFilteredError = this.filteredError;
//         this.lastU = uK;
        
//         const clampedU = Math.max(0, Math.min(this.uMax, uK));
//         this.controlIterations++;
//         this.totalControlSignal += clampedU;
        
//         return clampedU;
//     }
    
//     updateRealizedVelocity(controlSignal, executionEfficiency = 0.9) {
//         this.realizedVelocity = controlSignal * executionEfficiency;
//     }
    
//     resetVelocity() {
//         this.realizedVelocity = 0;
//     }
    
//     getAverageControlSignal() {
//         return this.controlIterations > 0 
//             ? this.totalControlSignal / this.controlIterations 
//             : 0;
//     }
    
//     reset() {
//         this.integral = 0;
//         this.realizedVelocity = 0;
//         this.lastError = 0;
//         this.filteredError = 0;
//         this.lastFilteredError = 0;
//     }
// }

// // ============================================================================
// // LENDING POSITION
// // ============================================================================
// class LendingPosition {
//     constructor(collateralAmount, borrowedAmount, collateralPrice) {
//         this.collateralAmount = collateralAmount;
//         this.borrowedAmount = borrowedAmount;
//         this.collateralPrice = collateralPrice;
//         this.liquidationThreshold = 0.80;
//         this.maxLTV = 0.75;
//     }
    
//     updatePrice(newPrice) {
//         this.collateralPrice = newPrice;
//     }
    
//     getCollateralValue() {
//         return this.collateralAmount * this.collateralPrice;
//     }
    
//     getHealthFactor() {
//         if (this.borrowedAmount === 0) return Infinity;
//         return (this.getCollateralValue() * this.liquidationThreshold) / this.borrowedAmount;
//     }
    
//     getInventory() {
//         const collateralValue = this.getCollateralValue();
//         const maxSafeBorrow = collateralValue * this.maxLTV;
//         return maxSafeBorrow > 0 ? this.borrowedAmount / maxSafeBorrow : 0;
//     }
    
//     isYellowZone() {
//         const h = this.getHealthFactor();
//         return h > 1.0 && h < config.HEALTH_THRESHOLD;
//     }
    
//     isDangerZone() {
//         const h = this.getHealthFactor();
//         return h < config.HEALTH_DANGER_ZONE;
//     }
    
//     isLiquidated() {
//         return this.getHealthFactor() < 1.0;
//     }
    
//     repayDebt(usdAmount) {
//         const repaid = Math.min(usdAmount, this.borrowedAmount);
//         this.borrowedAmount -= repaid;
//         return repaid;
//     }
// }

// // ============================================================================
// // CRASH SIMULATOR
// // ============================================================================
// function simulateCrashScenario(time) {
//     let rawPrice;
//     let phase;
    
//     if (time < 150) {
//         phase = "normal";
//         const basePrice = 140;
//         const noise = (Math.random() - 0.5) * 6;
//         rawPrice = basePrice + noise;
//     }
//     else if (time >= 150 && time < 175) {
//         phase = "wick";
//         const wickProgress = (time - 150) / 25;
//         if (wickProgress < 0.4) {
//             rawPrice = 140 - (12 * wickProgress / 0.4);
//         } else {
//             rawPrice = 128 + (14 * (wickProgress - 0.4) / 0.6);
//         }
//     }
//     else if (time >= 175 && time < 200) {
//         phase = "recovery";
//         const basePrice = 141;
//         const noise = (Math.random() - 0.5) * 4;
//         rawPrice = basePrice + noise;
//     }
//     else if (time >= 200 && time < 300) {
//         phase = "crash";
//         const crashProgress = (time - 200) / 100;
//         rawPrice = 140 - (25 * crashProgress);
//         rawPrice += (Math.random() - 0.5) * 1;
//     }
//     else if (time >= 300 && time < 350) {
//         phase = "stabilize";
//         const basePrice = 115;
//         const noise = (Math.random() - 0.5) * 2;
//         rawPrice = basePrice + noise;
//     }
//     else {
//         phase = "recover";
//         const recoveryProgress = Math.min((time - 350) / 100, 1);
//         rawPrice = 115 + (25 * recoveryProgress);
//         rawPrice += (Math.random() - 0.5) * 3;
//     }
    
//     return { rawPrice, phase };
// }

// // ============================================================================
// // MAIN BOT
// // ============================================================================
// async function main() {
//     console.log("╔════════════════════════════════════════════════════════════╗");
//     console.log("║      WICKGUARD BOT v2.1 - PRODUCTION READY                 ║");
//     console.log("║   Hierarchical Control with L2 Execution (MagicBlock)      ║");
//     console.log("╚════════════════════════════════════════════════════════════╝\n");
    
//     // Load vault configuration
//     let vaultConfig;
//     try {
//         vaultConfig = JSON.parse(fs.readFileSync('./vault-config.json', 'utf-8'));
//         console.log("✅ Vault configuration loaded");
//         console.log(`   Vault: ${vaultConfig.vaultPubkey.slice(0, 12)}...`);
//         console.log(`   Mint:  ${vaultConfig.mint.slice(0, 12)}...\n`);
//     } catch (e) {
//         console.log("❌ ERROR: Run 'node vault.js' first to setup vault!");
//         return;
//     }

//     const connectionL1 = new Connection(config.L1_RPC, "confirmed");
//     const connectionL2 = new Connection(config.L2_RPC, {
//         commitment: "confirmed",
//         fetch: fetch
//     });

//     // Load wallet
//     let wallet;
//     try {
//         const secretKey = JSON.parse(fs.readFileSync(config.WALLET_PATH, "utf-8"));
//         wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
//         console.log(` Wallet: ${wallet.publicKey.toBase58().slice(0,8)}...`);
//     } catch (e) {
//         return console.log("❌ ERROR: my-wallet.json missing.");
//     }

//     const balance = await connectionL1.getBalance(wallet.publicKey);
//     console.log(` Balance: ${(balance / 10**9).toFixed(2)} SOL`);
//     if (balance < 0.05 * 10**9) return console.log("❌ Insufficient balance.");

//     // Load mint and vault from config
//     const mint = new PublicKey(vaultConfig.mint);
//     const vaultPubkey = new PublicKey(vaultConfig.vaultPubkey);
//     const vaultATA = new PublicKey(vaultConfig.vaultATA);

//     // Create user token account
//     console.log("\n Setting up user token account...");
//     const userATA = await getOrCreateAssociatedTokenAccount(
//         connectionL1, 
//         wallet, 
//         mint, 
//         wallet.publicKey
//     );
//     console.log(`✅ User ATA: ${userATA.address.toBase58().slice(0, 12)}...`);

//     // FIXED: Mint tokens with balance check
//     try {
//         console.log("\n Minting collateral tokens...");
        
//         // Check current balance
//         try {
//             const currentBalance = await getAccount(connectionL1, userATA.address);
//             const currentTokens = Number(currentBalance.amount) / 10**6;
//             console.log(`   Current balance: ${currentTokens} tokens`);
            
//             if (currentTokens < 1000) {
//                 const tokensToMint = Math.floor((1000 - currentTokens) * 10**6);
//                 await mintTo(
//                     connectionL1, 
//                     wallet, 
//                     mint, 
//                     userATA.address, 
//                     wallet.publicKey, 
//                     tokensToMint
//                 );
//                 console.log(`✅ Minted ${(tokensToMint / 10**6).toFixed(2)} tokens (Total: 1000)`);
//             } else {
//                 console.log(`✅ Already have ${currentTokens} tokens`);
//             }
//         } catch(balErr) {
//             // Account empty or doesn't exist, mint full 1000
//             await mintTo(
//                 connectionL1, 
//                 wallet, 
//                 mint, 
//                 userATA.address, 
//                 wallet.publicKey, 
//                 1000 * 10**6
//             );
//             console.log("✅ Minted 1,000 tokens to user");
//         }
//     } catch(e) {
//         console.log(`⚠️  Mint warning: ${e.message}`);
//     }

//     // FIXED: Delegate with actual balance
//     console.log("\n Delegating user account to L2...");
//     try {
//         // Get actual balance to delegate
//         const userBalance = await getAccount(connectionL1, userATA.address);
//         const balanceToDelegate = userBalance.amount;
        
//         if (balanceToDelegate === 0n || balanceToDelegate === BigInt(0)) {
//             console.log("❌ No tokens to delegate! Please check minting step.");
//             return;
//         }
        
//         console.log(`   Delegating: ${Number(balanceToDelegate) / 10**6} tokens`);
        
//         const delegateUserIx = await delegateSpl(
//             wallet.publicKey,
//             mint,
//             balanceToDelegate,  // Use actual balance
//             {
//                 payer: wallet.publicKey,
//                 validator: config.VALIDATOR_ID,
//                 initIfMissing: true
//             }
//         );
        
//         const userTx = new Transaction().add(...delegateUserIx);
//         const { blockhash } = await connectionL1.getLatestBlockhash();
//         userTx.recentBlockhash = blockhash;
//         userTx.feePayer = wallet.publicKey;
//         userTx.sign(wallet);
        
//         const userSig = await connectionL1.sendRawTransaction(userTx.serialize(), {
//             skipPreflight: false
//         });
//         await connectionL1.confirmTransaction(userSig, "confirmed");
//         console.log(`✅ User account delegated to L2!`);
//     } catch(e) {
//         if (e.message.includes("already")) {
//             console.log("✅ User already delegated");
//         } else {
//             console.log(`❌ Delegation error: ${e.message}`);
//             return;
//         }
//     }

//     console.log("\n⏳ Waiting for L2 sync (15s)...");
//     await SLEEP(15000);

//     // Initialize systems
//     console.log("\n  Initializing Anti-Wick Protection...");
//     console.log("─────────────────────────────────────────");
    
//     const controlState = new ControlState();
//     const priceFilter = new PriceFilter(config.PRICE_EMA_ALPHA);
//     const dangerTracker = new DangerZoneTracker(config.GRACE_PERIOD_CHECKS);
    
//     console.log(` Strategic Parameters (HJB - Equation 4):`);
//     console.log(`   γ (gamma) = ${controlState.gamma.toFixed(2)} - risk aversion`);
//     console.log(`   σ (sigma) = ${controlState.sigma.toFixed(3)} - volatility (tuned for Solana)`);
//     console.log(`   η (eta)   = ${controlState.eta.toFixed(2)} - market impact`);
//     console.log(`   κ (kappa) = ${controlState.kappa().toFixed(6)} - deleveraging sensitivity`);
//     console.log(`\n  Tactical Parameters (PID - Equation 7):`);
//     console.log(`   K_P = ${controlState.kp.toFixed(2)} - proportional gain`);
//     console.log(`   K_I = ${controlState.ki.toFixed(2)} - integral gain`);
//     console.log(`   K_D = ${controlState.kd.toFixed(2)} - derivative gain`);
//     console.log(`\n🛡️  Anti-Wick Protection:`);
//     console.log(`   Grace Period: ${config.GRACE_PERIOD_CHECKS} checks (${config.GRACE_PERIOD_CHECKS * config.MONITORING_INTERVAL_MS / 1000}s)`);
//     console.log(`   Price EMA α: ${config.PRICE_EMA_ALPHA} (filters wicks)`);
//     console.log(`   Yellow Zone: H < ${config.HEALTH_THRESHOLD}`);
//     console.log(`   Danger Zone: H < ${config.HEALTH_DANGER_ZONE} (triggers action)`);
    
//     // Initialize position
//     const position = new LendingPosition(
//         1000,      // 1000 tokens collateral
//         92000,    // $105k borrowed
//         140        // Starting price $140
//     );
    
//     console.log(`\n Position:`);
//     console.log(`   Collateral: ${position.collateralAmount} tokens`);
//     console.log(`   Debt: $${position.borrowedAmount.toLocaleString()}`);
//     console.log(`   Initial H: ${position.getHealthFactor().toFixed(3)}`);
//     console.log(`   Vault: Connected ✅`);
//     console.log("─────────────────────────────────────────\n");

//     // ========================================================================
//     // MAIN CONTROL LOOP
//     // ========================================================================
//     console.log("╔════════════════════════════════════════════════════════════╗");
//     console.log("║         🛡️  WICKGUARD ANTI-WICK PROTECTION ACTIVE          ║");
//     console.log("╚════════════════════════════════════════════════════════════╝");
//     console.log("\n Crash Simulation Timeline:");
//     console.log("   0-30s:  Normal volatility (±$3)");
//     console.log("   30-35s: Quick WICK ($140→$128→$142) ⚡ Should be FILTERED");
//     console.log("   35-40s: Brief recovery");
//     console.log("   40-60s: SUSTAINED CRASH ($140→$127) 💥 Should TRIGGER");
//     console.log("   60-70s: Stabilization");
//     console.log("   70s+:   Recovery\n");
    
//     let totalRepayments = 0;
//     let yellowZoneActivations = 0;
//     let totalRepaidUSD = 0;
//     let wicksAvoided = 0;
//     let simulationTime = 0;

//     while (true) {
//         const { rawPrice, phase: currentPhase } = simulateCrashScenario(simulationTime);
//         simulationTime++;
        
//         const smoothedPrice = priceFilter.update(rawPrice);
//         const volatility = priceFilter.getRawVolatility();
        
//         position.updatePrice(smoothedPrice);
        
//         const timestamp = new Date().toLocaleTimeString();
//         const healthFactor = position.getHealthFactor();
//         const inventory = position.getInventory();
//         const isYellowZone = position.isYellowZone();
//         const isDangerZone = position.isDangerZone();
//         const isLiquidated = position.isLiquidated();
        
//         if (!isLiquidated) {
//             dangerTracker.update(healthFactor, config.HEALTH_DANGER_ZONE);
//         }
        
//         const statusIcon = isLiquidated ? "💀" : (isDangerZone ? "🔴" : (isYellowZone ? "🟡" : "🟢"));
//         const zoneText = isLiquidated ? "LIQUIDATED" : (isDangerZone ? "DANGER" : (isYellowZone ? "YELLOW" : "SAFE"));
        
//         const priceDiff = ((rawPrice - smoothedPrice) / smoothedPrice * 100).toFixed(1);
//         const priceDisplay = Math.abs(rawPrice - smoothedPrice) > 1 
//             ? `Raw: $${rawPrice.toFixed(2)} (${priceDiff > 0 ? '+' : ''}${priceDiff}%) → EMA: $${smoothedPrice.toFixed(2)}`
//             : `$${smoothedPrice.toFixed(2)}`;
        
//         const phaseIcon = {
//             'normal': '🟢',
//             'wick': '⚡',
//             'recovery': '📈',
//             'crash': '💥',
//             'stabilize': '⏸️',
//             'recover': '🔄'
//         }[currentPhase] || '⚪';
        
//         const phaseName = currentPhase.toUpperCase().padEnd(10);
        
//         process.stdout.write(
//             `\r[${timestamp}] ${phaseIcon} ${phaseName} | ` +
//             `${priceDisplay} | ` +
//             `H: ${healthFactor.toFixed(3)} | ` +
//             `Debt: $${Math.floor(position.borrowedAmount).toLocaleString()} | ` +
//             `${statusIcon} ${zoneText} | ` +
//             `Repayments: ${totalRepayments} | ` +
//             `Wicks: ${wicksAvoided}   `
//         );

//         if (isLiquidated) {
//             console.log("\n\n💀 LIQUIDATION OCCURRED!");
//             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//             console.log(`   Final Health Factor: ${healthFactor.toFixed(3)}`);
//             console.log(`   Remaining Debt: $${position.borrowedAmount.toLocaleString()}`);
//             console.log(`   Collateral: ${position.collateralAmount.toFixed(2)} tokens`);
//             console.log(`   Total Repayments: ${totalRepayments}`);
//             console.log(`   Total Repaid: $${totalRepaidUSD.toFixed(2)}`);
//             console.log(`   Wicks Avoided: ${wicksAvoided}`);
//             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
//             break;
//         }

//         if (isDangerZone && !isLiquidated) {
            
//             if (dangerTracker.isInGracePeriod()) {
//                 process.stdout.write(
//                     `\r[${timestamp}] ⏳ GRACE PERIOD ${dangerTracker.getProgress()} | ` +
//                     `Raw: $${rawPrice.toFixed(2)} (${priceDiff > 0 ? '+' : ''}${priceDiff}%) | ` +
//                     `EMA: $${smoothedPrice.toFixed(2)} | ` +
//                     `H: ${healthFactor.toFixed(3)} | ` +
//                     `Vol: ${(volatility * 100).toFixed(1)}%   `
//                 );
                
//                 if (Math.abs(rawPrice - smoothedPrice) > smoothedPrice * 0.05) {
//                     wicksAvoided++;
//                 }
                
//                 await SLEEP(config.MONITORING_INTERVAL_MS);
//                 continue;
//             }
            
//             if (dangerTracker.shouldAct()) {
//                 yellowZoneActivations++;
                
//                 if (yellowZoneActivations === 1) {
//                     console.log("\n\n🔴 DANGER ZONE - Grace Period Expired!");
//                     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//                     console.log(`   Price sustained below H=${config.HEALTH_DANGER_ZONE} for ${config.GRACE_PERIOD_CHECKS * config.MONITORING_INTERVAL_MS / 1000}s`);
//                     console.log(`   Activating continuous hierarchical control`);
//                     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//                 }

//                 const start = Date.now();

//                 try {
//                     const vStar = controlState.calculateTargetVelocity(inventory);
//                     const uK = controlState.stepPID(vStar);
                    
//                     console.log(`\n   📊 Control Iteration #${controlState.controlIterations}`);
//                     console.log(`   ├─ Price: Raw $${rawPrice.toFixed(2)} → Smoothed $${smoothedPrice.toFixed(2)}`);
//                     console.log(`   ├─ Volatility: ${(volatility * 100).toFixed(2)}%`);
//                     console.log(`   ├─ Strategic (HJB): v* = ${vStar.toFixed(6)} (target velocity)`);
//                     console.log(`   ├─ Tactical (PID):  u_k = ${uK.toFixed(4)} (control signal)`);
//                     console.log(`   ├─ Velocity Error: ${(vStar - controlState.realizedVelocity).toFixed(6)}`);
//                     console.log(`   └─ Integral State: ${controlState.integral.toFixed(4)}`);
                    
//                     if (Math.abs(uK) > config.MIN_CONTROL_THRESHOLD) {
//                         const userInfo = await getAccount(connectionL2, userATA.address);
//                         const userBalance = Number(userInfo.amount);
                        
//                         if (userBalance === 0) {
//                             console.log(`   ⚠️  No collateral remaining - cannot deleverage further`);
//                             await SLEEP(config.MONITORING_INTERVAL_MS);
//                             continue;
//                         }

//                         const repayPercentage = Math.min(uK * 100, 100);
//                         const tokensToSell = Math.floor(userBalance * uK);
//                         const usdFromSale = tokensToSell * smoothedPrice / 10**6;
                        
//                         console.log(`\n   ⚡ Executing L2 Repayment (MEV Protected):`);
//                         console.log(`   ├─ Signal: ${repayPercentage.toFixed(3)}%`);
//                         console.log(`   ├─ Sell: ${(tokensToSell / 10**6).toFixed(3)} tokens`);
//                         console.log(`   ├─ Price Used: $${smoothedPrice.toFixed(2)} (EMA, not wick)`);
//                         console.log(`   ├─ Proceeds: $${usdFromSale.toFixed(2)}`);
//                         console.log(`   └─ Target: Vault`);

//                         const transferIx = createTransferInstruction(
//                             userATA.address,
//                             vaultATA,
//                             wallet.publicKey,
//                             tokensToSell,
//                             [], 
//                             TOKEN_PROGRAM_ID
//                         );

//                         const tx = new Transaction().add(transferIx);
//                         const { blockhash } = await connectionL2.getLatestBlockhash("confirmed");
//                         tx.recentBlockhash = blockhash;
//                         tx.feePayer = wallet.publicKey;
//                         tx.sign(wallet);

//                         const sig = await connectionL2.sendRawTransaction(tx.serialize(), {
//                             skipPreflight: false,
//                             maxRetries: 3
//                         });
                        
//                         await connectionL2.confirmTransaction(sig, "confirmed");
                        
//                         const speed = Date.now() - start;
//                         totalRepayments++;
//                         totalRepaidUSD += usdFromSale;
                        
//                         const repaidDebt = position.repayDebt(usdFromSale);
//                         position.collateralAmount -= (tokensToSell / 10**6);
                        
//                         controlState.updateRealizedVelocity(uK, 0.9);
//                         controlState.totalRepaid += repaidDebt;
//                         controlState.resetVelocity();
                        
//                         console.log(`\n   ✅ REPAYMENT COMPLETE (L2)`);
//                         console.log(`   ├─ Execution: ${speed}ms (MEV protected)`);
//                         console.log(`   ├─ Debt reduced: $${repaidDebt.toFixed(2)}`);
//                         console.log(`   ├─ New H: ${position.getHealthFactor().toFixed(3)}`);
//                         console.log(`   ├─ Remaining Debt: $${position.borrowedAmount.toLocaleString()}`);
//                         console.log(`   └─ Tx: ${sig.slice(0, 20)}...`);
                        
//                         await SLEEP(500);
//                         const newUser = await getAccount(connectionL2, userATA.address);
//                         const newVault = await getAccount(connectionL2, vaultATA);
//                         console.log(`   📊 L2 State - User: ${Number(newUser.amount) / 10**6} | Vault: ${Number(newVault.amount) / 10**6}`);
//                         console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                        
//                     } else {
//                         console.log(`   ⏸️  Signal below threshold (${uK.toFixed(4)} < ${config.MIN_CONTROL_THRESHOLD}), waiting...`);
//                     }

//                 } catch (err) {
//                     console.log(`\n   ❌ Error: ${err.message}`);
//                     console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
//                 }
//             }
            
//         } else if (yellowZoneActivations > 0 && !isDangerZone) {
//             console.log("\n\n✅ EXITED DANGER ZONE");
//             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//             console.log(`   Control iterations: ${controlState.controlIterations}`);
//             console.log(`   Repayments executed: ${totalRepayments}`);
//             console.log(`   Total debt repaid: $${totalRepaidUSD.toFixed(2)}`);
//             console.log(`   Wicks avoided: ${wicksAvoided} ✅`);
//             console.log(`   Avg control signal: ${controlState.getAverageControlSignal().toFixed(4)}`);
//             console.log(`   Final health factor: ${healthFactor.toFixed(3)}`);
//             console.log(`   Status: Position SAVED! 🎉`);
//             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
//             yellowZoneActivations = 0;
            
//             controlState.reset();
//             dangerTracker.reset();
//         }
        
//         await SLEEP(config.MONITORING_INTERVAL_MS);
//     }
// }

// main().catch(console.error);


const fs = require("fs");
const fetch = require("cross-fetch");
const { 
    Connection, Keypair, PublicKey, Transaction
} = require("@solana/web3.js");
const { 
    getOrCreateAssociatedTokenAccount,
    mintTo,
    createTransferInstruction, 
    TOKEN_PROGRAM_ID,
    getAccount
} = require("@solana/spl-token");
const { delegateSpl } = require("@magicblock-labs/ephemeral-rollups-sdk");
const config = require("./config");

const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to print exact timestamps
function logWithTime(message) {
    const timestamp = new Date().toISOString().split('T')[1].replace('Z', '');
    console.log(`[${timestamp}] ${message}`);
}

// ============================================================================
// PRICE SMOOTHING (EMA Filter)
// ============================================================================

class PriceFilter {
    constructor(alpha = 0.3) {
        this.alpha = alpha;
        this.ema = null;
        this.priceHistory = [];
    }
    
    update(rawPrice) {
        if (this.ema === null) {
            this.ema = rawPrice;
        } else {
            this.ema = (this.alpha * rawPrice) + ((1 - this.alpha) * this.ema);
        }
        
        this.priceHistory.push(rawPrice);
        if (this.priceHistory.length > 50) {
            this.priceHistory.shift();
        }
        
        return this.ema;
    }
    
    getSmoothedPrice() {
        return this.ema;
    }
    
    getRawVolatility() {
        if (this.priceHistory.length < 10) return 0;
        
        const recent = this.priceHistory.slice(-10);
        const mean = recent.reduce((a, b) => a + b, 0) / recent.length;
        const variance = recent.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / recent.length;
        return Math.sqrt(variance) / mean;
    }
}

// ============================================================================
// DANGER ZONE TRACKER (Grace Period Logic)
// ============================================================================
class DangerZoneTracker {
    constructor(gracePeriodChecks = 15) {
        this.gracePeriodChecks = gracePeriodChecks;
        this.dangerCounter = 0;
        this.safeCounter = 0;
    }
    
    update(healthFactor, dangerThreshold = 1.03) {
        if (healthFactor < dangerThreshold && healthFactor > 1.0) {
            this.dangerCounter++;
            this.safeCounter = 0;
        } else {
            this.safeCounter++;
            this.dangerCounter = 0;
        }
    }
    
    shouldAct() {
        return this.dangerCounter >= this.gracePeriodChecks;
    }
    
    isInGracePeriod() {
        return this.dangerCounter > 0 && this.dangerCounter < this.gracePeriodChecks;
    }
    
    getProgress() {
        return `${this.dangerCounter}/${this.gracePeriodChecks}`;
    }
    
    reset() {
        this.dangerCounter = 0;
        this.safeCounter = 0;
    }
}

// ============================================================================
// HIERARCHICAL CONTROL SYSTEM
// ============================================================================
class ControlState {
    constructor(params = {}) {
        this.gamma = params.gamma || config.GAMMA;
        this.sigma = params.sigma || config.SIGMA;
        this.eta = params.eta || config.ETA;
        
        this.kp = params.kp || config.KP;
        this.ki = params.ki || config.KI;
        this.kd = params.kd || config.KD;
        this.alpha = params.alpha || config.ALPHA;
        this.dt = params.dt || config.DT;
        this.uMax = 100.0;
        
        this.lastError = 0;
        this.filteredError = 0;
        this.lastFilteredError = 0;
        this.integral = 0;
        this.lastU = 0;
        this.realizedVelocity = 0;
        
        this.controlIterations = 0;
        this.totalControlSignal = 0;
        this.totalRepaid = 0;
    }
    
    kappa() {
        return (this.gamma * this.sigma ** 2) / (2.0 * this.eta);
    }
    
    calculateTargetVelocity(inventory) {
        return this.kappa() * inventory;
    }
    
    stepPID(vStar) {
        const error = vStar - this.realizedVelocity;
        
        this.filteredError = this.alpha * error + (1.0 - this.alpha) * this.lastError;
        const dTerm = this.kd * (this.filteredError - this.lastFilteredError) / this.dt;
        
        const integralMax = 0.1;
        if (this.lastU > 0 && this.lastU < this.uMax && Math.abs(this.integral) < integralMax) {
            this.integral += this.ki * error * this.dt;
        }
        
        const uK = this.kp * error + this.integral + dTerm;
        
        this.lastError = error;
        this.lastFilteredError = this.filteredError;
        this.lastU = uK;
        
        const clampedU = Math.max(0, Math.min(this.uMax, uK));
        this.controlIterations++;
        this.totalControlSignal += clampedU;
        
        return clampedU;
    }
    
    updateRealizedVelocity(controlSignal, executionEfficiency = 0.9) {
        this.realizedVelocity = controlSignal * executionEfficiency;
    }
    
    resetVelocity() {
        this.realizedVelocity = 0;
    }
    
    getAverageControlSignal() {
        return this.controlIterations > 0 
            ? this.totalControlSignal / this.controlIterations 
            : 0;
    }
    
    reset() {
        this.integral = 0;
        this.realizedVelocity = 0;
        this.lastError = 0;
        this.filteredError = 0;
        this.lastFilteredError = 0;
    }
}

// ============================================================================
// LENDING POSITION
// ============================================================================
class LendingPosition {
    constructor(collateralAmount, borrowedAmount, collateralPrice) {
        this.collateralAmount = collateralAmount;
        this.borrowedAmount = borrowedAmount;
        this.collateralPrice = collateralPrice;
        this.liquidationThreshold = 0.80;
        this.maxLTV = 0.75;
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
        return h > 1.0 && h < config.HEALTH_THRESHOLD;
    }
    
    isDangerZone() {
        const h = this.getHealthFactor();
        return h < config.HEALTH_DANGER_ZONE;
    }
    
    isLiquidated() {
        return this.getHealthFactor() < 1.0;
    }
    
    repayDebt(usdAmount) {
        const repaid = Math.min(usdAmount, this.borrowedAmount);
        this.borrowedAmount -= repaid;
        return repaid;
    }
}

// ============================================================================
// CRASH SIMULATOR
// ============================================================================
function simulateCrashScenario(time) {
    let rawPrice;
    let phase;
    
    if (time < 150) {
        phase = "normal";
        const basePrice = 140;
        const noise = (Math.random() - 0.5) * 6;
        rawPrice = basePrice + noise;
    }
    else if (time >= 150 && time < 175) {
        phase = "wick";
        const wickProgress = (time - 150) / 25;
        if (wickProgress < 0.4) {
            rawPrice = 140 - (12 * wickProgress / 0.4);
        } else {
            rawPrice = 128 + (14 * (wickProgress - 0.4) / 0.6);
        }
    }
    else if (time >= 175 && time < 200) {
        phase = "recovery";
        const basePrice = 141;
        const noise = (Math.random() - 0.5) * 4;
        rawPrice = basePrice + noise;
    }
    else if (time >= 200 && time < 300) {
        phase = "crash";
        const crashProgress = (time - 200) / 100;
        rawPrice = 140 - (25 * crashProgress);
        rawPrice += (Math.random() - 0.5) * 1;
    }
    else if (time >= 300 && time < 350) {
        phase = "stabilize";
        const basePrice = 115;
        const noise = (Math.random() - 0.5) * 2;
        rawPrice = basePrice + noise;
    }
    else {
        phase = "recover";
        const recoveryProgress = Math.min((time - 350) / 100, 1);
        rawPrice = 115 + (25 * recoveryProgress);
        rawPrice += (Math.random() - 0.5) * 3;
    }
    
    return { rawPrice, phase };
}

// ============================================================================
// MAIN BOT
// ============================================================================
async function main() {
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║      WICKGUARD BOT v2.1 - PRODUCTION READY                 ║");
    console.log("║   Hierarchical Control with L2 Execution (MagicBlock)      ║");
    console.log("╚════════════════════════════════════════════════════════════╝\n");
    
    // Load vault configuration
    let vaultConfig;
    try {
        vaultConfig = JSON.parse(fs.readFileSync('./vault-config.json', 'utf-8'));
        logWithTime("✅ Vault configuration loaded");
        logWithTime(`   Vault: ${vaultConfig.vaultPubkey.slice(0, 12)}...`);
        logWithTime(`   Mint:  ${vaultConfig.mint.slice(0, 12)}...\n`);
    } catch (e) {
        logWithTime("❌ ERROR: Run 'node vault.js' first to setup vault!");
        return;
    }

    const connectionL1 = new Connection(config.L1_RPC, "confirmed");
    const connectionL2 = new Connection(config.L2_RPC, {
        commitment: "confirmed",
        fetch: fetch
    });

    // Load wallet
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync(config.WALLET_PATH, "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        logWithTime(` Wallet: ${wallet.publicKey.toBase58().slice(0,8)}...`);
    } catch (e) {
        return logWithTime("❌ ERROR: my-wallet.json missing.");
    }

    const balance = await connectionL1.getBalance(wallet.publicKey);
    logWithTime(` Balance: ${(balance / 10**9).toFixed(2)} SOL`);
    if (balance < 0.05 * 10**9) return logWithTime("❌ Insufficient balance.");

    // Load mint and vault from config
    const mint = new PublicKey(vaultConfig.mint);
    const vaultPubkey = new PublicKey(vaultConfig.vaultPubkey);
    const vaultATA = new PublicKey(vaultConfig.vaultATA);

    // Create user token account
    console.log("\n");
    logWithTime(" Setting up user token account...");
    const userATA = await getOrCreateAssociatedTokenAccount(
        connectionL1, 
        wallet, 
        mint, 
        wallet.publicKey
    );
    logWithTime(`✅ User ATA: ${userATA.address.toBase58().slice(0, 12)}...`);

    // FIXED: Mint tokens with balance check
    try {
        console.log("\n");
        logWithTime(" Minting collateral tokens...");
        
        // Check current balance
        try {
            const currentBalance = await getAccount(connectionL1, userATA.address);
            const currentTokens = Number(currentBalance.amount) / 10**6;
            logWithTime(`   Current balance: ${currentTokens} tokens`);
            
            if (currentTokens < 1000) {
                const tokensToMint = Math.floor((1000 - currentTokens) * 10**6);
                await mintTo(
                    connectionL1, 
                    wallet, 
                    mint, 
                    userATA.address, 
                    wallet.publicKey, 
                    tokensToMint
                );
                logWithTime(`✅ Minted ${(tokensToMint / 10**6).toFixed(2)} tokens (Total: 1000)`);
            } else {
                logWithTime(`✅ Already have ${currentTokens} tokens`);
            }
        } catch(balErr) {
            // Account empty or doesn't exist, mint full 1000
            await mintTo(
                connectionL1, 
                wallet, 
                mint, 
                userATA.address, 
                wallet.publicKey, 
                1000 * 10**6
            );
            logWithTime("✅ Minted 1,000 tokens to user");
        }
    } catch(e) {
        logWithTime(`⚠️  Mint warning: ${e.message}`);
    }

    // FIXED: Delegate with actual balance
    console.log("\n");
    logWithTime(" Delegating user account to L2...");
    try {
        // Get actual balance to delegate
        const userBalance = await getAccount(connectionL1, userATA.address);
        const balanceToDelegate = userBalance.amount;
        
        if (balanceToDelegate === 0n || balanceToDelegate === BigInt(0)) {
            logWithTime("❌ No tokens to delegate! Please check minting step.");
            return;
        }
        
        logWithTime(`   Delegating: ${Number(balanceToDelegate) / 10**6} tokens`);
        
        const delegateUserIx = await delegateSpl(
            wallet.publicKey,
            mint,
            balanceToDelegate,  // Use actual balance
            {
                payer: wallet.publicKey,
                validator: config.VALIDATOR_ID,
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
        logWithTime(`✅ User account delegated to L2!`);
    } catch(e) {
        if (e.message.includes("already")) {
            logWithTime("✅ User already delegated");
        } else {
            logWithTime(`❌ Delegation error: ${e.message}`);
            return;
        }
    }

    // Polling logic for L2 Sync (Replaces the 15s hardcoded wait)
    console.log("\n");
    logWithTime("⏳ Waiting for L2 sync... (Polling L2 RPC)");
    
    const syncStartTime = Date.now();
    let isSynced = false;

    while (!isSynced) {
        try {
            await getAccount(connectionL2, userATA.address);
            isSynced = true; // Succeeds when account is visible on L2
        } catch(e) {
            await SLEEP(500); // Check every 500ms
        }

        if (Date.now() - syncStartTime > 30000) {
            logWithTime("⚠️ Timeout: User account not visible on L2 after 30 seconds.");
            break;
        }
    }

    if (isSynced) {
        const timeTaken = ((Date.now() - syncStartTime) / 1000).toFixed(2);
        logWithTime(`🔍 Verifying on L2...`);
        logWithTime(`✅ User account visible on L2 (Exact sync time: ${timeTaken} seconds)`);
    }

    // Initialize systems
    console.log("\n  Initializing Anti-Wick Protection...");
    console.log("─────────────────────────────────────────");
    
    const controlState = new ControlState();
    const priceFilter = new PriceFilter(config.PRICE_EMA_ALPHA);
    const dangerTracker = new DangerZoneTracker(config.GRACE_PERIOD_CHECKS);
    
    console.log(` Strategic Parameters (HJB - Equation 4):`);
    console.log(`   γ (gamma) = ${controlState.gamma.toFixed(2)} - risk aversion`);
    console.log(`   σ (sigma) = ${controlState.sigma.toFixed(3)} - volatility (tuned for Solana)`);
    console.log(`   η (eta)   = ${controlState.eta.toFixed(2)} - market impact`);
    console.log(`   κ (kappa) = ${controlState.kappa().toFixed(6)} - deleveraging sensitivity`);
    console.log(`\n  Tactical Parameters (PID - Equation 7):`);
    console.log(`   K_P = ${controlState.kp.toFixed(2)} - proportional gain`);
    console.log(`   K_I = ${controlState.ki.toFixed(2)} - integral gain`);
    console.log(`   K_D = ${controlState.kd.toFixed(2)} - derivative gain`);
    console.log(`\n🛡️  Anti-Wick Protection:`);
    console.log(`   Grace Period: ${config.GRACE_PERIOD_CHECKS} checks (${config.GRACE_PERIOD_CHECKS * config.MONITORING_INTERVAL_MS / 1000}s)`);
    console.log(`   Price EMA α: ${config.PRICE_EMA_ALPHA} (filters wicks)`);
    console.log(`   Yellow Zone: H < ${config.HEALTH_THRESHOLD}`);
    console.log(`   Danger Zone: H < ${config.HEALTH_DANGER_ZONE} (triggers action)`);
    
    // Initialize position
    const position = new LendingPosition(
        1000,      // 1000 tokens collateral
        92000,    // $105k borrowed
        140        // Starting price $140
    );
    
    console.log(`\n Position:`);
    console.log(`   Collateral: ${position.collateralAmount} tokens`);
    console.log(`   Debt: $${position.borrowedAmount.toLocaleString()}`);
    console.log(`   Initial H: ${position.getHealthFactor().toFixed(3)}`);
    console.log(`   Vault: Connected ✅`);
    console.log("─────────────────────────────────────────\n");

    // ========================================================================
    // MAIN CONTROL LOOP
    // ========================================================================
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║        🛡️  WICKGUARD ANTI-WICK PROTECTION ACTIVE           ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log("\n Crash Simulation Timeline:");
    console.log("   0-30s:  Normal volatility (±$3)");
    console.log("   30-35s: Quick WICK ($140→$128→$142) ⚡ Should be FILTERED");
    console.log("   35-40s: Brief recovery");
    console.log("   40-60s: SUSTAINED CRASH ($140→$127) 💥 Should TRIGGER");
    console.log("   60-70s: Stabilization");
    console.log("   70s+:   Recovery\n");
    
    let totalRepayments = 0;
    let yellowZoneActivations = 0;
    let totalRepaidUSD = 0;
    let wicksAvoided = 0;
    let simulationTime = 0;

    while (true) {
        const { rawPrice, phase: currentPhase } = simulateCrashScenario(simulationTime);
        simulationTime++;
        
        const smoothedPrice = priceFilter.update(rawPrice);
        const volatility = priceFilter.getRawVolatility();
        
        position.updatePrice(smoothedPrice);
        
        // Exact millisecond timestamp replaces the simple toLocaleTimeString
        const timestamp = new Date().toISOString().split('T')[1].replace('Z', '');
        
        const healthFactor = position.getHealthFactor();
        const inventory = position.getInventory();
        const isYellowZone = position.isYellowZone();
        const isDangerZone = position.isDangerZone();
        const isLiquidated = position.isLiquidated();
        
        if (!isLiquidated) {
            dangerTracker.update(healthFactor, config.HEALTH_DANGER_ZONE);
        }
        
        const statusIcon = isLiquidated ? "💀" : (isDangerZone ? "🔴" : (isYellowZone ? "🟡" : "🟢"));
        const zoneText = isLiquidated ? "LIQUIDATED" : (isDangerZone ? "DANGER" : (isYellowZone ? "YELLOW" : "SAFE"));
        
        const priceDiff = ((rawPrice - smoothedPrice) / smoothedPrice * 100).toFixed(1);
        const priceDisplay = Math.abs(rawPrice - smoothedPrice) > 1 
            ? `Raw: $${rawPrice.toFixed(2)} (${priceDiff > 0 ? '+' : ''}${priceDiff}%) → EMA: $${smoothedPrice.toFixed(2)}`
            : `$${smoothedPrice.toFixed(2)}`;
        
        const phaseIcon = {
            'normal': '🟢',
            'wick': '⚡',
            'recovery': '📈',
            'crash': '💥',
            'stabilize': '⏸️',
            'recover': '🔄'
        }[currentPhase] || '⚪';
        
        const phaseName = currentPhase.toUpperCase().padEnd(10);
        
        process.stdout.write(
            `\r[${timestamp}] ${phaseIcon} ${phaseName} | ` +
            `${priceDisplay} | ` +
            `H: ${healthFactor.toFixed(3)} | ` +
            `Debt: $${Math.floor(position.borrowedAmount).toLocaleString()} | ` +
            `${statusIcon} ${zoneText} | ` +
            `Repayments: ${totalRepayments} | ` +
            `Wicks: ${wicksAvoided}   `
        );

        if (isLiquidated) {
            console.log("\n\n💀 LIQUIDATION OCCURRED!");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(`   Final Health Factor: ${healthFactor.toFixed(3)}`);
            console.log(`   Remaining Debt: $${position.borrowedAmount.toLocaleString()}`);
            console.log(`   Collateral: ${position.collateralAmount.toFixed(2)} tokens`);
            console.log(`   Total Repayments: ${totalRepayments}`);
            console.log(`   Total Repaid: $${totalRepaidUSD.toFixed(2)}`);
            console.log(`   Wicks Avoided: ${wicksAvoided}`);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            break;
        }

        if (isDangerZone && !isLiquidated) {
            
            if (dangerTracker.isInGracePeriod()) {
                process.stdout.write(
                    `\r[${timestamp}] ⏳ GRACE PERIOD ${dangerTracker.getProgress()} | ` +
                    `Raw: $${rawPrice.toFixed(2)} (${priceDiff > 0 ? '+' : ''}${priceDiff}%) | ` +
                    `EMA: $${smoothedPrice.toFixed(2)} | ` +
                    `H: ${healthFactor.toFixed(3)} | ` +
                    `Vol: ${(volatility * 100).toFixed(1)}%   `
                );
                
                if (Math.abs(rawPrice - smoothedPrice) > smoothedPrice * 0.05) {
                    wicksAvoided++;
                }
                
                await SLEEP(config.MONITORING_INTERVAL_MS);
                continue;
            }
            
            if (dangerTracker.shouldAct()) {
                yellowZoneActivations++;
                
                if (yellowZoneActivations === 1) {
                    console.log("\n\n🔴 DANGER ZONE - Grace Period Expired!");
                    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                    console.log(`   Price sustained below H=${config.HEALTH_DANGER_ZONE} for ${config.GRACE_PERIOD_CHECKS * config.MONITORING_INTERVAL_MS / 1000}s`);
                    console.log(`   Activating continuous hierarchical control`);
                    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                }

                const start = Date.now();

                try {
                    const vStar = controlState.calculateTargetVelocity(inventory);
                    const uK = controlState.stepPID(vStar);
                    
                    console.log(`\n   📊 Control Iteration #${controlState.controlIterations}`);
                    console.log(`   ├─ Price: Raw $${rawPrice.toFixed(2)} → Smoothed $${smoothedPrice.toFixed(2)}`);
                    console.log(`   ├─ Volatility: ${(volatility * 100).toFixed(2)}%`);
                    console.log(`   ├─ Strategic (HJB): v* = ${vStar.toFixed(6)} (target velocity)`);
                    console.log(`   ├─ Tactical (PID):  u_k = ${uK.toFixed(4)} (control signal)`);
                    console.log(`   ├─ Velocity Error: ${(vStar - controlState.realizedVelocity).toFixed(6)}`);
                    console.log(`   └─ Integral State: ${controlState.integral.toFixed(4)}`);
                    
                    if (Math.abs(uK) > config.MIN_CONTROL_THRESHOLD) {
                        const userInfo = await getAccount(connectionL2, userATA.address);
                        const userBalance = Number(userInfo.amount);
                        
                        if (userBalance === 0) {
                            console.log(`   ⚠️  No collateral remaining - cannot deleverage further`);
                            await SLEEP(config.MONITORING_INTERVAL_MS);
                            continue;
                        }

                        const repayPercentage = Math.min(uK * 100, 100);
                        const tokensToSell = Math.floor(userBalance * uK);
                        const usdFromSale = tokensToSell * smoothedPrice / 10**6;
                        
                        console.log(`\n   ⚡ Executing L2 Repayment (MEV Protected):`);
                        console.log(`   ├─ Signal: ${repayPercentage.toFixed(3)}%`);
                        console.log(`   ├─ Sell: ${(tokensToSell / 10**6).toFixed(3)} tokens`);
                        console.log(`   ├─ Price Used: $${smoothedPrice.toFixed(2)} (EMA, not wick)`);
                        console.log(`   ├─ Proceeds: $${usdFromSale.toFixed(2)}`);
                        console.log(`   └─ Target: Vault`);

                        const transferIx = createTransferInstruction(
                            userATA.address,
                            vaultATA,
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
                        
                        const repaidDebt = position.repayDebt(usdFromSale);
                        position.collateralAmount -= (tokensToSell / 10**6);
                        
                        controlState.updateRealizedVelocity(uK, 0.9);
                        controlState.totalRepaid += repaidDebt;
                        controlState.resetVelocity();
                        
                        console.log(`\n   ✅ REPAYMENT COMPLETE (L2)`);
                        console.log(`   ├─ Execution: ${speed}ms (MEV protected)`);
                        console.log(`   ├─ Debt reduced: $${repaidDebt.toFixed(2)}`);
                        console.log(`   ├─ New H: ${position.getHealthFactor().toFixed(3)}`);
                        console.log(`   ├─ Remaining Debt: $${position.borrowedAmount.toLocaleString()}`);
                        console.log(`   └─ Tx: ${sig.slice(0, 20)}...`);
                        
                        await SLEEP(500);
                        const newUser = await getAccount(connectionL2, userATA.address);
                        const newVault = await getAccount(connectionL2, vaultATA);
                        console.log(`   📊 L2 State - User: ${Number(newUser.amount) / 10**6} | Vault: ${Number(newVault.amount) / 10**6}`);
                        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                        
                    } else {
                        console.log(`   ⏸️  Signal below threshold (${uK.toFixed(4)} < ${config.MIN_CONTROL_THRESHOLD}), waiting...`);
                    }

                } catch (err) {
                    console.log(`\n   ❌ Error: ${err.message}`);
                    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                }
            }
            
        } else if (yellowZoneActivations > 0 && !isDangerZone) {
            console.log("\n\n✅ EXITED DANGER ZONE");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            console.log(`   Control iterations: ${controlState.controlIterations}`);
            console.log(`   Repayments executed: ${totalRepayments}`);
            console.log(`   Total debt repaid: $${totalRepaidUSD.toFixed(2)}`);
            console.log(`   Wicks avoided: ${wicksAvoided} ✅`);
            console.log(`   Avg control signal: ${controlState.getAverageControlSignal().toFixed(4)}`);
            console.log(`   Final health factor: ${healthFactor.toFixed(3)}`);
            console.log(`   Status: Position SAVED! 🎉`);
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            yellowZoneActivations = 0;
            
            controlState.reset();
            dangerTracker.reset();
        }
        
        await SLEEP(config.MONITORING_INTERVAL_MS);
    }
}

main().catch(console.error);