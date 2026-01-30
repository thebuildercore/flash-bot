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

// --- WEBSOCKET CONNECTION ---
let socket = null;
let isSocketConnected = false;

try {
    const io = require("socket.io-client");
    socket = io("http://localhost:3001", {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 5000
    });

    socket.on("connect", () => {
        console.log("✅ Connected to dashboard server");
        isSocketConnected = true;
    });

    socket.on("connect_error", () => {
        if (isSocketConnected) {
            console.log("⚠️  Dashboard disconnected");
        }
        isSocketConnected = false;
    });

    socket.on("disconnect", () => {
        console.log("⚠️  Dashboard disconnected");
        isSocketConnected = false;
    });
} catch (error) {
    console.log("ℹ️  Running in standalone mode (no dashboard)");
}

// Safe emit functions
function updateStage(stage) {
    if (socket && isSocketConnected) {
        try {
            socket.emit("bot-stage", stage);
        } catch (e) {}
    }
}

function updatePrice(price) {
    if (socket && isSocketConnected) {
        try {
            socket.emit("bot-price", price);
        } catch (e) {}
    }
}

function updateBalance(user, safe) {
    if (socket && isSocketConnected) {
        try {
            socket.emit("bot-balance", { user, safe });
        } catch (e) {}
    }
}

function sendLog(message, type = "info") {
    if (socket && isSocketConnected) {
        try {
            socket.emit("bot-log", {
                message,
                type,
                timestamp: new Date().toLocaleTimeString()
            });
        } catch (e) {}
    }
}

// --- CONFIGURATION ---
const MAGIC_RPC = "https://devnet-us.magicblock.app"; 
const VALIDATOR_ID = new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd");
const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log("🛡️  WICKGUARD - FINAL VERSION");
    console.log("   Institutional-Grade Liquidation Protection\n");
    
    updateStage("wallet");
    
    const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
    const connectionL2 = new Connection(MAGIC_RPC, "confirmed");

    // LOAD WALLET
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`📂 Wallet: ${wallet.publicKey.toBase58().slice(0,8)}...`);
        sendLog(`Wallet loaded: ${wallet.publicKey.toBase58().slice(0,8)}...`, "success");
    } catch (e) {
        console.log("❌ ERROR: my-wallet.json missing.");
        sendLog("ERROR: my-wallet.json missing", "error");
        return;
    }

    const balance = await connectionL1.getBalance(wallet.publicKey);
    console.log(`💰 Balance: ${(balance / 10**9).toFixed(2)} SOL`);
    sendLog(`Balance: ${(balance / 10**9).toFixed(2)} SOL`, "info");
    
    if (balance < 0.05 * 10**9) {
        console.log("❌ Insufficient balance.");
        sendLog("Insufficient balance", "error");
        return;
    }

    // LOAD OR CREATE SAFE WALLET
    let safeWallet;
    try {
        const safeKey = JSON.parse(fs.readFileSync("safe-wallet.json", "utf-8"));
        safeWallet = Keypair.fromSecretKey(new Uint8Array(safeKey));
        console.log("📂 Safe wallet loaded");
    } catch (e) {
        safeWallet = Keypair.generate();
        fs.writeFileSync("safe-wallet.json", JSON.stringify(Array.from(safeWallet.secretKey)));
        console.log("🔑 Created new safe-wallet.json");
    }

    // SETUP ASSETS ON L1
    updateStage("mint");
    console.log("\n🔨 Initializing Assets on L1...");
    sendLog("Initializing assets on L1...", "info");
    
    const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
    
    updateStage("userAta");
    const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
    
    updateStage("safeAta");
    const safeATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, safeWallet.publicKey);
    
    try { 
        await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
        console.log("✅ Minted 1,000 tokens");
        sendLog("Minted 1,000 tokens", "success");
    } catch(e) {
        console.log("ℹ️  Tokens already minted");
        sendLog("Tokens already minted", "info");
    }
    
    console.log(`📍 User ATA: ${userATA.address.toBase58()}`);
    console.log(`📍 Safe ATA: ${safeATA.address.toBase58()}`);
    
    updateBalance(1000, 0);

    // DELEGATE USER ACCOUNT TO L2
    updateStage("delegating");
    console.log("\n🔗 Delegating user account to Ephemeral Rollup...");
    sendLog("Delegating user account to L2...", "info");
    
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
        
        updateStage("userDelegated");
        console.log(`   ✅ User delegation successful!`);
        console.log(`   📝 Tx: ${userSig}`);
        sendLog("User delegation successful!", "success");
    } catch(e) {
        if (e.message.includes("already")) {
            console.log("   ✅ User already delegated");
            sendLog("User already delegated", "info");
            updateStage("userDelegated");
        } else {
            console.log(`   ❌ Error: ${e.message}`);
            sendLog(`Delegation error: ${e.message}`, "error");
            return;
        }
    }

    // DELEGATE SAFE ACCOUNT TO L2
    updateStage("delegatingSafe");
    console.log("\n🔗 Delegating safe account to Ephemeral Rollup...");
    sendLog("Delegating safe account to L2...", "info");
    
    try {
        const delegateSafeIx = await delegateSpl(
            safeWallet.publicKey,
            mint,
            0n,
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
        
        updateStage("safeDelegated");
        console.log(`   ✅ Safe delegation successful!`);
        console.log(`   📝 Tx: ${safeSig}`);
        sendLog("Safe delegation successful!", "success");
    } catch(e) {
        if (e.message.includes("already")) {
            console.log("   ✅ Safe already delegated");
            sendLog("Safe already delegated", "info");
            updateStage("safeDelegated");
        } else {
            console.log(`   ❌ Error: ${e.message}`);
            sendLog(`Safe delegation error: ${e.message}`, "error");
            return;
        }
    }

    // Wait for L2 sync
    updateStage("syncing");
    console.log("\n⏳ Waiting for L2 sync (15s)...");
    sendLog("Waiting for L2 sync (15s)...", "warning");
    await SLEEP(15000);

    // VERIFY L2 STATE
    updateStage("verifying");
    console.log("\n🔍 Verifying L2 state:");
    try {
        const userL2 = await getAccount(connectionL2, userATA.address);
        const safeL2 = await getAccount(connectionL2, safeATA.address);
        console.log(`   User ATA: ${Number(userL2.amount) / 10**6} tokens`);
        console.log(`   Safe ATA: ${Number(safeL2.amount) / 10**6} tokens`);
        sendLog("L2 state synchronized!", "success");
    } catch(e) {
        console.log(`   ⚠️  ${e.message}`);
    }

    console.log("\n═══════════════════════════════════════════");
    console.log("🛡️  WICKGUARD PROTECTION ACTIVE");
    console.log("═══════════════════════════════════════════\n");
    
    updateStage("monitoring");
    sendLog("🛡️ WICKGUARD PROTECTION ACTIVE", "success");
    
    let isShieldActive = false;
    let rescueCount = 0;
    let totalRescueTime = 0;

    while (true) {
        const currentPrice = 140 + (Math.random() * 10 - 5); 
        const timestamp = new Date().toLocaleTimeString();
        
        process.stdout.write(`\r[${timestamp}] Price: $${currentPrice.toFixed(2)} | Shield: ${isShieldActive ? "🟢 ACTIVE" : "⚪ STANDBY"} | Rescues: ${rescueCount}   `);
        
        updatePrice(currentPrice);

        // LIQUIDATION PROTECTION
        if (currentPrice < 136 && !isShieldActive) {
            console.log("\n\n⚠️  LIQUIDATION THRESHOLD BREACHED!");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
            updateStage("threat");
            sendLog("⚠️ LIQUIDATION THRESHOLD BREACHED!", "alert");
            
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
                updateStage("rescuing");
                sendLog(`Protecting ${userBalance / 10**6} tokens...`, "warning");

                const transferIx = createTransferInstruction(
                    userATA.address,
                    safeATA.address,
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
                
                updateStage("secured");
                console.log(`   ✅ ASSETS SECURED ON L2!`);
                console.log(`   ⚡ Execution: ${speed}ms (avg: ${avgSpeed}ms)`);
                console.log(`   📝 Tx: ${sig}`);
                console.log(`   🔗 https://explorer.solana.com/tx/${sig}?cluster=devnet`);
                
                sendLog(`✅ ASSETS SECURED! Speed: ${speed}ms`, "success");
                updateBalance(0, userBalance / 10**6);
                
                isShieldActive = true;
                
                // Verify
                await SLEEP(1000);
                const newUser = await getAccount(connectionL2, userATA.address);
                const newSafe = await getAccount(connectionL2, safeATA.address);
                console.log(`   ✅ Verified - User: ${Number(newUser.amount) / 10**6} | Safe: ${Number(newSafe.amount) / 10**6}`);
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                
                await SLEEP(2000);
                updateStage("monitoring");

            } catch (err) {
                console.log(`\n   ❌ Rescue failed: ${err.message}`);
                sendLog(`Rescue failed: ${err.message}`, "error");
                if (err.logs) {
                    err.logs.forEach(log => console.log(`      ${log}`));
                }
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                updateStage("monitoring");
            }
        }

        // MARKET RECOVERY
        if (currentPrice > 138 && isShieldActive) {
            console.log("\n\n📈 MARKET RECOVERY");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
            updateStage("recovery");
            sendLog("📈 MARKET RECOVERY DETECTED", "success");
            
            try {
                const safeInfo = await getAccount(connectionL2, safeATA.address);
                const safeBalance = Number(safeInfo.amount);
                
                if (safeBalance === 0) {
                    console.log("   ⚠️  Safe empty");
                    isShieldActive = false;
                    continue;
                }

                console.log(`   🔓 Restoring ${safeBalance / 10**6} tokens...`);
                updateStage("restoring");
                sendLog(`Restoring ${safeBalance / 10**6} tokens...`, "info");

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

                updateStage("restored");
                console.log("   ✅ Position restored");
                sendLog("✅ Position restored", "success");
                updateBalance(safeBalance / 10**6, 0);
                
                isShieldActive = false;
                
                await SLEEP(1000);
                const finalUser = await getAccount(connectionL2, userATA.address);
                const finalSafe = await getAccount(connectionL2, safeATA.address);
                console.log(`   📊 Final - User: ${Number(finalUser.amount) / 10**6} | Safe: ${Number(finalSafe.amount) / 10**6}`);
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                
                await SLEEP(2000);
                updateStage("monitoring");
                
            } catch (e) { 
                console.log(`   ⚠️ ${e.message}`);
                sendLog(`Restore failed: ${e.message}`, "error");
                console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                updateStage("monitoring");
            }
        }
        
        await SLEEP(500);
    }
}

process.on('SIGINT', () => {
    console.log("\n\n🛑 Shutting down...");
    if (socket && isSocketConnected) {
        socket.disconnect();
    }
    process.exit(0);
});

main().catch(err => {
    console.error("\n❌ FATAL ERROR:", err.message);
    sendLog(`Fatal error: ${err.message}`, "error");
    if (socket && isSocketConnected) {
        socket.disconnect();
    }
    process.exit(1);
});










// const fs = require("fs");
// const { 
//     Connection, Keypair, PublicKey, Transaction
// } = require("@solana/web3.js");
// const { 
//     createMint, getOrCreateAssociatedTokenAccount, mintTo, 
//     createTransferInstruction, TOKEN_PROGRAM_ID,
//     getAccount
// } = require("@solana/spl-token");
// const { delegateSpl } = require("@magicblock-labs/ephemeral-rollups-sdk");

// // --- WEBSOCKET CONNECTION ---
// let socket = null;
// let isSocketConnected = false;

// try {
//     const io = require("socket.io-client");
//     socket = io("http://localhost:3001", {
//         reconnection: true,
//         reconnectionDelay: 1000,
//         reconnectionAttempts: 5,
//         timeout: 5000
//     });

//     socket.on("connect", () => {
//         console.log("✅ Connected to dashboard server");
//         isSocketConnected = true;
//     });

//     socket.on("connect_error", () => {
//         if (isSocketConnected) {
//             console.log("⚠️  Dashboard disconnected");
//         }
//         isSocketConnected = false;
//     });

//     socket.on("disconnect", () => {
//         console.log("⚠️  Dashboard disconnected");
//         isSocketConnected = false;
//     });
// } catch (error) {
//     console.log("ℹ️  Running in standalone mode (no dashboard)");
// }

// // Safe emit functions
// function updateStage(stage) {
//     if (socket && isSocketConnected) {
//         try {
//             socket.emit("bot-stage", stage);
//         } catch (e) {}
//     }
// }

// function updatePrice(price) {
//     if (socket && isSocketConnected) {
//         try {
//             socket.emit("bot-price", price);
//         } catch (e) {}
//     }
// }

// function updateBalance(user, safe) {
//     if (socket && isSocketConnected) {
//         try {
//             socket.emit("bot-balance", { user, safe });
//         } catch (e) {}
//     }
// }

// function sendLog(message, type = "info") {
//     if (socket && isSocketConnected) {
//         try {
//             socket.emit("bot-log", {
//                 message,
//                 type,
//                 timestamp: new Date().toLocaleTimeString()
//             });
//         } catch (e) {}
//     }
// }

// // NEW: Send detailed data
// function sendData(key, value) {
//     if (socket && isSocketConnected) {
//         try {
//             socket.emit("bot-data", { key, value });
//         } catch (e) {}
//     }
// }

// function sendTransaction(txData) {
//     if (socket && isSocketConnected) {
//         try {
//             socket.emit("bot-transaction", txData);
//         } catch (e) {}
//     }
// }

// // --- CONFIGURATION ---
// const MAGIC_RPC = "https://devnet-us.magicblock.app"; 
// const VALIDATOR_ID = new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd");
// const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// async function main() {
//     console.log("🛡️  WICKGUARD - FINAL VERSION");
//     console.log("   Institutional-Grade Liquidation Protection\n");
    
//     updateStage("wallet");
    
//     const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
//     const connectionL2 = new Connection(MAGIC_RPC, "confirmed");

//     // LOAD WALLET
//     let wallet;
//     try {
//         const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
//         wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
//         const walletAddress = wallet.publicKey.toBase58();
        
//         console.log(`📂 Wallet: ${walletAddress.slice(0,8)}...`);
//         sendLog(`Wallet loaded: ${walletAddress}`, "success");
//         sendData("walletAddress", walletAddress);
//     } catch (e) {
//         console.log("❌ ERROR: my-wallet.json missing.");
//         sendLog("ERROR: my-wallet.json missing", "error");
//         return;
//     }

//     const balance = await connectionL1.getBalance(wallet.publicKey);
//     const balanceSOL = (balance / 10**9).toFixed(4);
//     console.log(`💰 Balance: ${balanceSOL} SOL`);
//     sendLog(`Balance: ${balanceSOL} SOL`, "info");
//     sendData("solBalance", balanceSOL);
    
//     if (balance < 0.05 * 10**9) {
//         console.log("❌ Insufficient balance.");
//         sendLog("Insufficient balance", "error");
//         return;
//     }

//     // LOAD OR CREATE SAFE WALLET
//     let safeWallet;
//     try {
//         const safeKey = JSON.parse(fs.readFileSync("safe-wallet.json", "utf-8"));
//         safeWallet = Keypair.fromSecretKey(new Uint8Array(safeKey));
//         console.log("📂 Safe wallet loaded");
//     } catch (e) {
//         safeWallet = Keypair.generate();
//         fs.writeFileSync("safe-wallet.json", JSON.stringify(Array.from(safeWallet.secretKey)));
//         console.log("🔑 Created new safe-wallet.json");
//     }
    
//     const safeAddress = safeWallet.publicKey.toBase58();
//     sendData("safeWalletAddress", safeAddress);

//     // SETUP ASSETS ON L1
//     updateStage("mint");
//     console.log("\n🔨 Initializing Assets on L1...");
//     sendLog("Initializing assets on L1...", "info");
    
//     const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
//     const mintAddress = mint.toBase58();
//     console.log(`🪙 Mint: ${mintAddress}`);
//     sendData("mintAddress", mintAddress);
//     sendLog(`Mint created: ${mintAddress}`, "success");
    
//     updateStage("userAta");
//     const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
//     const userATAAddress = userATA.address.toBase58();
//     console.log(`📍 User ATA: ${userATAAddress}`);
//     sendData("userATA", userATAAddress);
//     sendLog(`User ATA: ${userATAAddress}`, "info");
    
//     updateStage("safeAta");
//     const safeATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, safeWallet.publicKey);
//     const safeATAAddress = safeATA.address.toBase58();
//     console.log(`📍 Safe ATA: ${safeATAAddress}`);
//     sendData("safeATA", safeATAAddress);
//     sendLog(`Safe ATA: ${safeATAAddress}`, "info");
    
//     try { 
//         await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
//         console.log("✅ Minted 1,000 tokens");
//         sendLog("Minted 1,000 tokens", "success");
//     } catch(e) {
//         console.log("ℹ️  Tokens already minted");
//         sendLog("Tokens already minted", "info");
//     }
    
//     updateBalance(1000, 0);

//     // DELEGATE USER ACCOUNT TO L2
//     updateStage("delegating");
//     console.log("\n🔗 Delegating user account to Ephemeral Rollup...");
//     sendLog("Delegating user account to L2...", "info");
    
//     try {
//         const delegateUserIx = await delegateSpl(
//             wallet.publicKey,
//             mint,
//             1000n * 1000000n,
//             {
//                 payer: wallet.publicKey,
//                 validator: VALIDATOR_ID,
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
        
//         updateStage("userDelegated");
//         console.log(`   ✅ User delegation successful!`);
//         console.log(`   📝 Tx: ${userSig}`);
//         sendLog("User delegation successful!", "success");
//         sendTransaction({
//             type: "User Delegation",
//             signature: userSig,
//             status: "confirmed",
//             explorerUrl: `https://explorer.solana.com/tx/${userSig}?cluster=devnet`
//         });
//     } catch(e) {
//         if (e.message.includes("already")) {
//             console.log("   ✅ User already delegated");
//             sendLog("User already delegated", "info");
//             updateStage("userDelegated");
//         } else {
//             console.log(`   ❌ Error: ${e.message}`);
//             sendLog(`Delegation error: ${e.message}`, "error");
//             return;
//         }
//     }

//     // DELEGATE SAFE ACCOUNT TO L2
//     updateStage("delegatingSafe");
//     console.log("\n🔗 Delegating safe account to Ephemeral Rollup...");
//     sendLog("Delegating safe account to L2...", "info");
    
//     try {
//         const delegateSafeIx = await delegateSpl(
//             safeWallet.publicKey,
//             mint,
//             0n,
//             {
//                 payer: wallet.publicKey,
//                 validator: VALIDATOR_ID,
//                 initIfMissing: true
//             }
//         );
        
//         const safeTx = new Transaction().add(...delegateSafeIx);
//         const { blockhash } = await connectionL1.getLatestBlockhash();
//         safeTx.recentBlockhash = blockhash;
//         safeTx.feePayer = wallet.publicKey;
//         safeTx.sign(wallet, safeWallet);
        
//         const safeSig = await connectionL1.sendRawTransaction(safeTx.serialize(), {
//             skipPreflight: false
//         });
        
//         await connectionL1.confirmTransaction(safeSig, "confirmed");
        
//         updateStage("safeDelegated");
//         console.log(`   ✅ Safe delegation successful!`);
//         console.log(`   📝 Tx: ${safeSig}`);
//         sendLog("Safe delegation successful!", "success");
//         sendTransaction({
//             type: "Safe Delegation",
//             signature: safeSig,
//             status: "confirmed",
//             explorerUrl: `https://explorer.solana.com/tx/${safeSig}?cluster=devnet`
//         });
//     } catch(e) {
//         if (e.message.includes("already")) {
//             console.log("   ✅ Safe already delegated");
//             sendLog("Safe already delegated", "info");
//             updateStage("safeDelegated");
//         } else {
//             console.log(`   ❌ Error: ${e.message}`);
//             sendLog(`Safe delegation error: ${e.message}`, "error");
//             return;
//         }
//     }

//     // Wait for L2 sync
//     updateStage("syncing");
//     console.log("\n⏳ Waiting for L2 sync (15s)...");
//     sendLog("Waiting for L2 sync (15s)...", "warning");
//     await SLEEP(15000);

//     // VERIFY L2 STATE
//     updateStage("verifying");
//     console.log("\n🔍 Verifying L2 state:");
//     try {
//         const userL2 = await getAccount(connectionL2, userATA.address);
//         const safeL2 = await getAccount(connectionL2, safeATA.address);
//         const userTokens = Number(userL2.amount) / 10**6;
//         const safeTokens = Number(safeL2.amount) / 10**6;
        
//         console.log(`   User ATA: ${userTokens} tokens`);
//         console.log(`   Safe ATA: ${safeTokens} tokens`);
//         sendLog("L2 state synchronized!", "success");
//         sendData("userTokensL2", userTokens);
//         sendData("safeTokensL2", safeTokens);
//     } catch(e) {
//         console.log(`   ⚠️  ${e.message}`);
//     }

//     console.log("\n═══════════════════════════════════════════");
//     console.log("🛡️  WICKGUARD PROTECTION ACTIVE");
//     console.log("═══════════════════════════════════════════\n");
    
//     updateStage("monitoring");
//     sendLog("🛡️ WICKGUARD PROTECTION ACTIVE", "success");
    
//     let isShieldActive = false;
//     let rescueCount = 0;
//     let totalRescueTime = 0;

//     while (true) {
//         const currentPrice = 140 + (Math.random() * 10 - 5); 
//         const timestamp = new Date().toLocaleTimeString();
        
//         process.stdout.write(`\r[${timestamp}] Price: $${currentPrice.toFixed(2)} | Shield: ${isShieldActive ? "🟢 ACTIVE" : "⚪ STANDBY"} | Rescues: ${rescueCount}   `);
        
//         updatePrice(currentPrice);

//         // LIQUIDATION PROTECTION
//         if (currentPrice < 136 && !isShieldActive) {
//             console.log("\n\n⚠️  LIQUIDATION THRESHOLD BREACHED!");
//             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
//             updateStage("threat");
//             sendLog("⚠️ LIQUIDATION THRESHOLD BREACHED!", "alert");
            
//             const start = Date.now();

//             try {
//                 const userInfo = await getAccount(connectionL2, userATA.address);
//                 const userBalance = Number(userInfo.amount);
                
//                 if (userBalance === 0) {
//                     console.log("   ℹ️  No assets to protect");
//                     isShieldActive = true;
//                     continue;
//                 }

//                 const tokensAmount = userBalance / 10**6;
//                 console.log(`   🔒 Protecting ${tokensAmount} tokens...`);
//                 updateStage("rescuing");
//                 sendLog(`🔒 Protecting ${tokensAmount} tokens...`, "warning");

//                 const transferIx = createTransferInstruction(
//                     userATA.address,
//                     safeATA.address,
//                     wallet.publicKey,
//                     userBalance,
//                     [], 
//                     TOKEN_PROGRAM_ID
//                 );

//                 const tx = new Transaction().add(transferIx);
//                 const { blockhash } = await connectionL2.getLatestBlockhash("confirmed");
//                 tx.recentBlockhash = blockhash;
//                 tx.feePayer = wallet.publicKey;
//                 tx.sign(wallet);

//                 console.log(`   ⚡ Executing atomic rescue on L2...`);
//                 const sig = await connectionL2.sendRawTransaction(tx.serialize(), {
//                     skipPreflight: false,
//                     maxRetries: 3
//                 });
                
//                 await connectionL2.confirmTransaction(sig, "confirmed");
                
//                 const speed = Date.now() - start;
//                 rescueCount++;
//                 totalRescueTime += speed;
//                 const avgSpeed = (totalRescueTime / rescueCount).toFixed(0);
                
//                 updateStage("secured");
//                 console.log(`   ✅ ASSETS SECURED ON L2!`);
//                 console.log(`   ⚡ Execution: ${speed}ms (avg: ${avgSpeed}ms)`);
//                 console.log(`   📝 Tx: ${sig}`);
//                 console.log(`   🔗 https://explorer.solana.com/tx/${sig}?cluster=devnet`);
                
//                 sendLog(`✅ ASSETS SECURED! Speed: ${speed}ms`, "success");
//                 sendTransaction({
//                     type: "Asset Protection (User → Safe)",
//                     signature: sig,
//                     amount: tokensAmount,
//                     speed: speed,
//                     avgSpeed: avgSpeed,
//                     status: "confirmed",
//                     explorerUrl: `https://explorer.solana.com/tx/${sig}?cluster=devnet`,
//                     from: userATAAddress,
//                     to: safeATAAddress
//                 });
//                 updateBalance(0, tokensAmount);
//                 sendData("rescueCount", rescueCount);
//                 sendData("avgRescueSpeed", avgSpeed);
                
//                 isShieldActive = true;
                
//                 // Verify
//                 await SLEEP(1000);
//                 const newUser = await getAccount(connectionL2, userATA.address);
//                 const newSafe = await getAccount(connectionL2, safeATA.address);
//                 const finalUser = Number(newUser.amount) / 10**6;
//                 const finalSafe = Number(newSafe.amount) / 10**6;
                
//                 console.log(`   ✅ Verified - User: ${finalUser} | Safe: ${finalSafe}`);
//                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                
//                 sendLog(`✅ Verified - User: ${finalUser} | Safe: ${finalSafe}`, "success");
                
//                 await SLEEP(2000);
//                 updateStage("monitoring");

//             } catch (err) {
//                 console.log(`\n   ❌ Rescue failed: ${err.message}`);
//                 sendLog(`❌ Rescue failed: ${err.message}`, "error");
//                 if (err.logs) {
//                     err.logs.forEach(log => console.log(`      ${log}`));
//                 }
//                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
//                 updateStage("monitoring");
//             }
//         }

//         // MARKET RECOVERY
//         if (currentPrice > 138 && isShieldActive) {
//             console.log("\n\n📈 MARKET RECOVERY");
//             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
//             updateStage("recovery");
//             sendLog("📈 MARKET RECOVERY DETECTED", "success");
            
//             try {
//                 const safeInfo = await getAccount(connectionL2, safeATA.address);
//                 const safeBalance = Number(safeInfo.amount);
                
//                 if (safeBalance === 0) {
//                     console.log("   ⚠️  Safe empty");
//                     isShieldActive = false;
//                     continue;
//                 }

//                 const tokensAmount = safeBalance / 10**6;
//                 console.log(`   🔓 Restoring ${tokensAmount} tokens...`);
//                 updateStage("restoring");
//                 sendLog(`🔓 Restoring ${tokensAmount} tokens...`, "info");

//                 const returnIx = createTransferInstruction(
//                     safeATA.address,
//                     userATA.address,
//                     safeWallet.publicKey,
//                     safeBalance,
//                     [], 
//                     TOKEN_PROGRAM_ID
//                 );
                
//                 const returnTx = new Transaction().add(returnIx);
//                 const { blockhash } = await connectionL2.getLatestBlockhash();
//                 returnTx.recentBlockhash = blockhash;
//                 returnTx.feePayer = wallet.publicKey;
//                 returnTx.sign(wallet, safeWallet);
                
//                 const returnSig = await connectionL2.sendRawTransaction(returnTx.serialize(), {
//                     skipPreflight: false
//                 });
//                 await connectionL2.confirmTransaction(returnSig);

//                 updateStage("restored");
//                 console.log("   ✅ Position restored");
//                 sendLog("✅ Position restored", "success");
//                 sendTransaction({
//                     type: "Position Restore (Safe → User)",
//                     signature: returnSig,
//                     amount: tokensAmount,
//                     status: "confirmed",
//                     explorerUrl: `https://explorer.solana.com/tx/${returnSig}?cluster=devnet`,
//                     from: safeATAAddress,
//                     to: userATAAddress
//                 });
//                 updateBalance(tokensAmount, 0);
                
//                 isShieldActive = false;
                
//                 await SLEEP(1000);
//                 const finalUser = await getAccount(connectionL2, userATA.address);
//                 const finalSafe = await getAccount(connectionL2, safeATA.address);
//                 const userFinal = Number(finalUser.amount) / 10**6;
//                 const safeFinal = Number(finalSafe.amount) / 10**6;
                
//                 console.log(`   📊 Final - User: ${userFinal} | Safe: ${safeFinal}`);
//                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                
//                 sendLog(`📊 Final - User: ${userFinal} | Safe: ${safeFinal}`, "success");
                
//                 await SLEEP(2000);
//                 updateStage("monitoring");
                
//             } catch (e) { 
//                 console.log(`   ⚠️ ${e.message}`);
//                 sendLog(`⚠️ Restore failed: ${e.message}`, "error");
//                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
//                 updateStage("monitoring");
//             }
//         }
        
//         await SLEEP(500);
//     }
// }

// process.on('SIGINT', () => {
//     console.log("\n\n🛑 Shutting down...");
//     if (socket && isSocketConnected) {
//         socket.disconnect();
//     }
//     process.exit(0);
// });

// main().catch(err => {
//     console.error("\n❌ FATAL ERROR:", err.message);
//     sendLog(`Fatal error: ${err.message}`, "error");
//     if (socket && isSocketConnected) {
//         socket.disconnect();
//     }
//     process.exit(1);
// });