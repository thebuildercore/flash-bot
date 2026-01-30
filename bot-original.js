const fs = require("fs");
const { 
    Connection, Keypair, PublicKey, Transaction
} = require("@solana/web3.js");
const { 
    createMint, getOrCreateAssociatedTokenAccount, mintTo, 
    createTransferInstruction, TOKEN_PROGRAM_ID,
    getAccount
} = require("@solana/spl-token");

const { delegateSpl } = require("@magicblock-labs/ephemeral-rollups-sdk");

// --- CONFIGURATION ---
const MAGIC_RPC = "https://devnet-us.magicblock.app"; 
const VALIDATOR_ID = new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd");
const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log("🛡️  WICKGUARD - FINAL VERSION");
    console.log("   Institutional-Grade Liquidation Protection\n");
    
    const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
    const connectionL2 = new Connection(MAGIC_RPC, "confirmed");

    // LOAD WALLET from create-wallet.js
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
    console.log("\n🔨 Initializing Assets on L1...");
    const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
    const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
    const safeWallet = Keypair.generate();
    const safeATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, safeWallet.publicKey);
    
    try { 
        await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
        console.log("✅ Minted 1,000 tokens");
    } catch(e) {
        console.log("ℹ️  Tokens already minted");
    }
    
    console.log(`📍 User ATA: ${userATA.address.toBase58()}`);
    console.log(`📍 Safe ATA: ${safeATA.address.toBase58()}`);

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
        
        console.log(`   ✅ User delegation successful!`);
        console.log(`   📝 Tx: ${userSig}`);
    } catch(e) {
        if (e.message.includes("already")) {
            console.log("   ✅ User already delegated");
        } else {
            console.log(`   ❌ Error: ${e.message}`);
            return;
        }
    }

    // DELEGATE SAFE ACCOUNT TO L2
    console.log("\n🔗 Delegating safe account to Ephemeral Rollup...");
    try {
        // Safe account needs 0 tokens initially, just needs to exist on L2
        const delegateSafeIx = await delegateSpl(
            safeWallet.publicKey,
            mint,
            0n, // Zero tokens initially
            {
                payer: wallet.publicKey,
                validator: VALIDATOR_ID,
                initIfMissing: true
            }
        );
        
        const safeTx = new Transaction().add(...delegateSafeIx);
        const { blockhash } = await connectionL1.getLatestBlockhash();
        safeTx.recentBlockhash = blockhash;
        safeTx.feePayer = wallet.publicKey;
        safeTx.sign(wallet, safeWallet);
        
        const safeSig = await connectionL1.sendRawTransaction(safeTx.serialize(), {
            skipPreflight: false
        });
        
        await connectionL1.confirmTransaction(safeSig, "confirmed");
        
        console.log(`   ✅ Safe delegation successful!`);
        console.log(`   📝 Tx: ${safeSig}`);
    } catch(e) {
        if (e.message.includes("already")) {
            console.log("   ✅ Safe already delegated");
        } else {
            console.log(`   ❌ Error: ${e.message}`);
            return;
        }
    }

    // Wait for L2 sync
    console.log("\n⏳ Waiting for L2 sync (15s)...");
    await SLEEP(15000);

    // VERIFY L2 STATE
    console.log("\n🔍 Verifying L2 state:");
    try {
        const userL2 = await getAccount(connectionL2, userATA.address);
        const safeL2 = await getAccount(connectionL2, safeATA.address);
        console.log(`   User ATA: ${Number(userL2.amount) / 10**6} tokens`);
        console.log(`   Safe ATA: ${Number(safeL2.amount) / 10**6} tokens`);
    } catch(e) {
        console.log(`   ⚠️  ${e.message}`);
    }

    console.log("\n═══════════════════════════════════════════");
    console.log("🛡️  WICKGUARD PROTECTION ACTIVE");
    console.log("═══════════════════════════════════════════\n");
    
    let isShieldActive = false;
    let rescueCount = 0;
    let totalRescueTime = 0;

    while (true) {
        const currentPrice = 140 + (Math.random() * 10 - 5); 
        const timestamp = new Date().toLocaleTimeString();
        
        process.stdout.write(`\r[${timestamp}] Price: $${currentPrice.toFixed(2)} | Shield: ${isShieldActive ? "🟢 ACTIVE" : "⚪ STANDBY"} | Rescues: ${rescueCount}   `);

        // LIQUIDATION PROTECTION
        if (currentPrice < 136 && !isShieldActive) {
            console.log("\n\n⚠️  LIQUIDATION THRESHOLD BREACHED!");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            const start = Date.now();

            try {
                const userInfo = await getAccount(connectionL2, userATA.address);
                const userBalance = Number(userInfo.amount);
                
                if (userBalance === 0) {
                    console.log("   ℹ️  No assets to protect");
                    isShieldActive = true;
                    continue;
                }

                console.log(`   🔒 Protecting ${userBalance / 10**6} tokens...`);

                // Transfer from user ATA to safe ATA (both on L2)
                const transferIx = createTransferInstruction(
                    userATA.address,      // Source: user ATA
                    safeATA.address,      // Dest: safe ATA
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

                console.log(`   ⚡ Executing atomic rescue on L2...`);
                const sig = await connectionL2.sendRawTransaction(tx.serialize(), {
                    skipPreflight: false,
                    maxRetries: 3
                });
                
                await connectionL2.confirmTransaction(sig, "confirmed");
                
                const speed = Date.now() - start;
                rescueCount++;
                totalRescueTime += speed;
                const avgSpeed = (totalRescueTime / rescueCount).toFixed(0);
                
                console.log(`   ✅ ASSETS SECURED ON L2!`);
                console.log(`   ⚡ Execution: ${speed}ms (avg: ${avgSpeed}ms)`);
                console.log(`   📝 Tx: ${sig}`);
                console.log(`   🔗 https://explorer.solana.com/tx/${sig}?cluster=devnet`);
                
                isShieldActive = true;
                
                // Verify
                await SLEEP(1000);
                const newUser = await getAccount(connectionL2, userATA.address);
                const newSafe = await getAccount(connectionL2, safeATA.address);
                console.log(`   ✅ Verified - User: ${Number(newUser.amount) / 10**6} | Safe: ${Number(newSafe.amount) / 10**6}`);
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                
                await SLEEP(3000); 

            } catch (err) {
                console.log(`\n   ❌ Rescue failed: ${err.message}`);
                if (err.logs) {
                    err.logs.forEach(log => console.log(`      ${log}`));
                }
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            }
        }

        // MARKET RECOVERY
        if (currentPrice > 138 && isShieldActive) {
            console.log("\n\n📈 MARKET RECOVERY");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
            try {
                const safeInfo = await getAccount(connectionL2, safeATA.address);
                const safeBalance = Number(safeInfo.amount);
                
                if (safeBalance === 0) {
                    console.log("   ⚠️  Safe empty");
                    isShieldActive = false;
                    continue;
                }

                console.log(`   🔓 Restoring ${safeBalance / 10**6} tokens...`);

                // Return from safe to user (both on L2)
                const returnIx = createTransferInstruction(
                    safeATA.address,
                    userATA.address,
                    safeWallet.publicKey,
                    safeBalance,
                    [], 
                    TOKEN_PROGRAM_ID
                );
                
                const returnTx = new Transaction().add(returnIx);
                const { blockhash } = await connectionL2.getLatestBlockhash();
                returnTx.recentBlockhash = blockhash;
                returnTx.feePayer = wallet.publicKey;
                returnTx.sign(wallet, safeWallet);
                
                const returnSig = await connectionL2.sendRawTransaction(returnTx.serialize(), {
                    skipPreflight: false
                });
                await connectionL2.confirmTransaction(returnSig);

                isShieldActive = false;
                console.log("   ✅ Position restored");
                
                await SLEEP(1000);
                const finalUser = await getAccount(connectionL2, userATA.address);
                const finalSafe = await getAccount(connectionL2, safeATA.address);
                console.log(`   📊 Final - User: ${Number(finalUser.amount) / 10**6} | Safe: ${Number(finalSafe.amount) / 10**6}`);
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                
            } catch (e) { 
                console.log(`   ⚠️ ${e.message}`);
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            }
        }
        
        await SLEEP(200);
    }
}

main().catch(console.error);