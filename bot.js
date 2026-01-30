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
    console.log(" WICKGUARD - FINAL VERSION");
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
    console.log(` Balance: ${(balance / 10**9).toFixed(2)} SOL`);
    if (balance < 0.05 * 10**9) return console.log("❌ Insufficient balance.");

    // SETUP ASSETS ON L1
    console.log("\n Initializing Assets on L1...");
    const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
    const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
    const safeWallet = Keypair.generate();
    const safeATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, safeWallet.publicKey);
    
    try { 
        await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
        console.log("✅ Minted 1,000 tokens");
    } catch(e) {
        console.log("ℹ  Tokens already minted");
    }
    
    console.log(` User ATA: ${userATA.address.toBase58()}`);
    console.log(` Safe ATA: ${safeATA.address.toBase58()}`);

    // DELEGATE USER ACCOUNT TO L2
    console.log("\n Delegating user account to Ephemeral Rollup...");
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
        console.log(`    Tx: ${userSig}`);
    } catch(e) {
        if (e.message.includes("already")) {
            console.log("   ✅ User already delegated");
        } else {
            console.log(`   ❌ Error: ${e.message}`);
            return;
        }
    }

    // DELEGATE SAFE ACCOUNT TO L2
    console.log("\n Delegating safe account to Ephemeral Rollup...");
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
        console.log(`    Tx: ${safeSig}`);
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
    console.log("\n Verifying L2 state:");
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
            console.log("\n\n LIQUIDATION THRESHOLD BREACHED!");
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

                console.log(`    Protecting ${userBalance / 10**6} tokens...`);

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
                console.log(`    Execution: ${speed}ms (avg: ${avgSpeed}ms)`);
                console.log(`    Tx: ${sig}`);
                console.log(`   🔗 https://explorer.solana.com/tx/${sig}?cluster=devnet`);
                
                isShieldActive = true;
                
                // Verify
                await SLEEP(1000);
                const newUser = await getAccount(connectionL2, userATA.address);
                const newSafe = await getAccount(connectionL2, safeATA.address);
                console.log(`    Verified - User: ${Number(newUser.amount) / 10**6} | Safe: ${Number(newSafe.amount) / 10**6}`);
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
            console.log("\n\n MARKET RECOVERY");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
            try {
                const safeInfo = await getAccount(connectionL2, safeATA.address);
                const safeBalance = Number(safeInfo.amount);
                
                if (safeBalance === 0) {
                    console.log("   ⚠️  Safe empty");
                    isShieldActive = false;
                    continue;
                }

                console.log(`    Restoring ${safeBalance / 10**6} tokens...`);

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

// // // the above is the working bot
// // // below is the code by gemini
// // const fs = require("fs");
// // const { Connection, Keypair, PublicKey, Transaction } = require("@solana/web3.js");
// // const { createMint, getOrCreateAssociatedTokenAccount, mintTo, createTransferInstruction, TOKEN_PROGRAM_ID, getAccount } = require("@solana/spl-token");
// // const { delegateSpl } = require("@magicblock-labs/ephemeral-rollups-sdk");
// // const io = require("socket.io-client");

// // // --- CONNECT TO BRIDGE ---
// // const socket = io("http://localhost:3001");

// // function broadcast(type, message, level = 'info') {
// //     console.log(`[${level.toUpperCase()}] ${message}`);
// //     socket.emit("bot-log", { 
// //         message, 
// //         type: level, 
// //         timestamp: new Date().toLocaleTimeString() 
// //     });
// // }

// // function updateStage(stage) {
// //     socket.emit("bot-stage", stage);
// // }

// // // --- CONFIGURATION ---
// // const MAGIC_RPC = "https://devnet-us.magicblock.app"; 
// // const VALIDATOR_ID = new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd");
// // const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // async function main() {
// //     broadcast("info", "WICKGUARD - FINAL VERSION INITIALIZING...");
// //     updateStage("wallet");

// //     const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
// //     const connectionL2 = new Connection(MAGIC_RPC, "confirmed");

// //     // LOAD WALLET
// //     let wallet;
// //     try {
// //         const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
// //         wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
// //         broadcast("success", `📂 Wallet Loaded: ${wallet.publicKey.toBase58().slice(0,8)}...`);
// //     } catch (e) {
// //         return broadcast("error", "my-wallet.json missing.");
// //     }

// //     // LOAD SAFE WALLET (Fixed version)
// //     let safeWallet;
// //     try {
// //         const safeKey = JSON.parse(fs.readFileSync("safe-wallet.json", "utf-8"));
// //         safeWallet = Keypair.fromSecretKey(new Uint8Array(safeKey));
// //     } catch (e) {
// //         safeWallet = Keypair.generate();
// //         fs.writeFileSync("safe-wallet.json", JSON.stringify(Array.from(safeWallet.secretKey)));
// //         broadcast("info", "Created new safe-wallet.json");
// //     }

// //     const balance = await connectionL1.getBalance(wallet.publicKey);
// //     broadcast("info", `Balance: ${(balance / 10**9).toFixed(2)} SOL`);

// //     // SETUP ASSETS ON L1
// //     updateStage("mint");
// //     broadcast("info", "Initializing Assets on L1...");
// //     const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
    
// //     updateStage("userAta");
// //     const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
// //     broadcast("success", `User ATA (L1): ${userATA.address.toBase58().slice(0,10)}...`);
    
// //     updateStage("safeAta");
// //     const safeATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, safeWallet.publicKey);
    
// //     try { 
// //         await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
// //         broadcast("success", "✅ Minted 1,000 tokens");
// //     } catch(e) {
// //         broadcast("info", "ℹ Tokens already minted");
// //     }
    
// //     // Send initial balances to UI
// //     socket.emit("bot-balance", { user: 1000, safe: 0 });

// //     // DELEGATE USER
// //     updateStage("delegating");
// //     broadcast("info", "Delegating user account to Ephemeral Rollup...");
// //     try {
// //         const delegateUserIx = await delegateSpl(wallet.publicKey, mint, 1000n * 1000000n, { payer: wallet.publicKey, validator: VALIDATOR_ID, initIfMissing: true });
// //         const userTx = new Transaction().add(...delegateUserIx);
// //         const { blockhash } = await connectionL1.getLatestBlockhash();
// //         userTx.recentBlockhash = blockhash;
// //         userTx.feePayer = wallet.publicKey;
// //         userTx.sign(wallet);
// //         const userSig = await connectionL1.sendRawTransaction(userTx.serialize());
// //         await connectionL1.confirmTransaction(userSig, "confirmed");
        
// //         updateStage("userDelegated");
// //         broadcast("success", `User delegation successful! Tx: ${userSig.slice(0,8)}...`);
// //     } catch(e) {
// //         broadcast("info", "User already delegated");
// //         updateStage("userDelegated");
// //     }

// //     // DELEGATE SAFE
// //     updateStage("delegatingSafe");
// //     broadcast("info", "Delegating safe account...");
// //     try {
// //         const delegateSafeIx = await delegateSpl(safeWallet.publicKey, mint, 0n, { payer: wallet.publicKey, validator: VALIDATOR_ID, initIfMissing: true });
// //         const safeTx = new Transaction().add(...delegateSafeIx);
// //         const { blockhash } = await connectionL1.getLatestBlockhash();
// //         safeTx.recentBlockhash = blockhash;
// //         safeTx.feePayer = wallet.publicKey;
// //         safeTx.sign(wallet, safeWallet);
// //         const safeSig = await connectionL1.sendRawTransaction(safeTx.serialize());
// //         await connectionL1.confirmTransaction(safeSig, "confirmed");
        
// //         updateStage("safeDelegated");
// //         broadcast("success", "Safe delegation successful!");
// //     } catch(e) {
// //         broadcast("info", "Safe already delegated");
// //         updateStage("safeDelegated");
// //     }

// //     // SYNC
// //     updateStage("syncing");
// //     broadcast("warning", "⏳ Waiting for L2 sync (15s)...");
// //     await SLEEP(15000);

// //     updateStage("verifying");
// //     broadcast("success", "L2 State Synchronized!");

// //     // MONITORING LOOP
// //     updateStage("monitoring");
// //     broadcast("success", "🛡️ WICKGUARD PROTECTION ACTIVE");
    
// //     let isShieldActive = false;
// //     let rescueCount = 0;

// //     while (true) {
// //         // Simulate Price (OR REPLACE WITH REAL ORACLE HERE)
// //         const currentPrice = 140 + (Math.random() * 10 - 5); 
// //         socket.emit("bot-price", currentPrice); // Send price to UI

// //         // LIQUIDATION LOGIC
// //         if (currentPrice < 136 && !isShieldActive) {
// //             updateStage("threat");
// //             broadcast("alert", "LIQUIDATION THRESHOLD BREACHED!");
            
// //             updateStage("rescuing");
// //             broadcast("warning", "Executing atomic rescue on L2...");
// //             const start = Date.now();

// //             try {
// //                 const userInfo = await getAccount(connectionL2, userATA.address);
// //                 const userBalance = Number(userInfo.amount);

// //                 if (userBalance > 0) {
// //                     const transferIx = createTransferInstruction(userATA.address, safeATA.address, wallet.publicKey, userBalance, [], TOKEN_PROGRAM_ID);
// //                     const tx = new Transaction().add(transferIx);
// //                     const { blockhash } = await connectionL2.getLatestBlockhash("confirmed");
// //                     tx.recentBlockhash = blockhash;
// //                     tx.feePayer = wallet.publicKey;
// //                     tx.sign(wallet);

// //                     const sig = await connectionL2.sendRawTransaction(tx.serialize(), { skipPreflight: false });
// //                     await connectionL2.confirmTransaction(sig, "confirmed");
                    
// //                     const speed = Date.now() - start;
// //                     updateStage("secured");
// //                     broadcast("success", `ASSETS SECURED! Speed: ${speed}ms`);
// //                     socket.emit("bot-balance", { user: 0, safe: userBalance / 10**6 });
                    
// //                     isShieldActive = true;
// //                 }
// //             } catch (err) {
// //                 broadcast("error", `Rescue failed: ${err.message}`);
// //             }
// //         }

// //         // RECOVERY LOGIC
// //         if (currentPrice > 138 && isShieldActive) {
// //             updateStage("recovery");
// //             broadcast("success", "MARKET RECOVERY DETECTED");
            
// //             updateStage("restoring");
// //             broadcast("info", "Restoring assets to user wallet...");
            
// //             try {
// //                 const safeInfo = await getAccount(connectionL2, safeATA.address);
// //                 const safeBalance = Number(safeInfo.amount);
                
// //                 if (safeBalance > 0) {
// //                     const returnIx = createTransferInstruction(safeATA.address, userATA.address, safeWallet.publicKey, safeBalance, [], TOKEN_PROGRAM_ID);
// //                     const returnTx = new Transaction().add(returnIx);
// //                     const { blockhash } = await connectionL2.getLatestBlockhash();
// //                     returnTx.recentBlockhash = blockhash;
// //                     returnTx.feePayer = wallet.publicKey;
// //                     returnTx.sign(wallet, safeWallet);
                    
// //                     const returnSig = await connectionL2.sendRawTransaction(returnTx.serialize());
// //                     await connectionL2.confirmTransaction(returnSig);
                    
// //                     updateStage("restored");
// //                     broadcast("success", "Position Restored");
// //                     socket.emit("bot-balance", { user: safeBalance / 10**6, safe: 0 });
                    
// //                     isShieldActive = false;
                    
// //                     // Reset to monitoring after short delay
// //                     await SLEEP(2000);
// //                     updateStage("monitoring");
// //                 }
// //             } catch(e) {
// //                 broadcast("error", `Restore failed: ${e.message}`);
// //             }
// //         }

// //         await SLEEP(500); // Send updates every 500ms
// //     }
// // }

// // main().catch(console.error);

// // below is the claude version 
// const fs = require("fs");
// const { Connection, Keypair, PublicKey, Transaction } = require("@solana/web3.js");
// const { createMint, getOrCreateAssociatedTokenAccount, mintTo, createTransferInstruction, TOKEN_PROGRAM_ID, getAccount } = require("@solana/spl-token");
// const { delegateSpl } = require("@magicblock-labs/ephemeral-rollups-sdk");

// // --- SOCKET.IO CONNECTION WITH ERROR HANDLING ---
// let socket = null;
// let isSocketConnected = false;

// // Try to connect to socket, but don't crash if it fails
// try {
//     const io = require("socket.io-client");
//     socket = io("http://localhost:3001", {
//         reconnection: true,
//         reconnectionDelay: 1000,
//         reconnectionAttempts: 5,
//         timeout: 5000
//     });

//     socket.on("connect", () => {
//         console.log("✅ Connected to WebSocket bridge");
//         isSocketConnected = true;
//     });

//     socket.on("connect_error", (error) => {
//         console.log("⚠️  WebSocket not available - running in standalone mode");
//         isSocketConnected = false;
//     });

//     socket.on("disconnect", () => {
//         console.log("⚠️  WebSocket disconnected");
//         isSocketConnected = false;
//     });
// } catch (error) {
//     console.log("⚠️  Socket.io-client not available - running in standalone mode");
//     console.log("   Run 'npm install socket.io-client' to enable dashboard integration");
// }

// // Safe broadcast function
// function broadcast(type, message, level = 'info') {
//     const timestamp = new Date().toLocaleTimeString();
//     console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    
//     if (socket && isSocketConnected) {
//         try {
//             socket.emit("bot-log", { 
//                 message, 
//                 type: level, 
//                 timestamp 
//             });
//         } catch (error) {
//             // Silently fail if socket emit fails
//         }
//     }
// }

// // Safe update stage function
// function updateStage(stage) {
//     if (socket && isSocketConnected) {
//         try {
//             socket.emit("bot-stage", stage);
//         } catch (error) {
//             // Silently fail if socket emit fails
//         }
//     }
// }

// // Safe emit function
// function safeEmit(event, data) {
//     if (socket && isSocketConnected) {
//         try {
//             socket.emit(event, data);
//         } catch (error) {
//             // Silently fail if socket emit fails
//         }
//     }
// }

// // --- CONFIGURATION ---
// const MAGIC_RPC = "https://devnet-us.magicblock.app"; 
// const VALIDATOR_ID = new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd");
// const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// async function main() {
//     broadcast("info", "🛡️  WICKGUARD - FINAL VERSION INITIALIZING...");
//     updateStage("wallet");

//     const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
//     const connectionL2 = new Connection(MAGIC_RPC, "confirmed");

//     // LOAD WALLET
//     let wallet;
//     try {
//         const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
//         wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
//         broadcast("success", `📂 Wallet Loaded: ${wallet.publicKey.toBase58().slice(0,8)}...`);
//     } catch (e) {
//         broadcast("error", "❌ my-wallet.json missing. Please create a wallet first.");
//         return;
//     }

//     // LOAD OR CREATE SAFE WALLET
//     let safeWallet;
//     try {
//         const safeKey = JSON.parse(fs.readFileSync("safe-wallet.json", "utf-8"));
//         safeWallet = Keypair.fromSecretKey(new Uint8Array(safeKey));
//         broadcast("info", "📂 Safe wallet loaded");
//     } catch (e) {
//         safeWallet = Keypair.generate();
//         fs.writeFileSync("safe-wallet.json", JSON.stringify(Array.from(safeWallet.secretKey)));
//         broadcast("info", "🔑 Created new safe-wallet.json");
//     }

//     const balance = await connectionL1.getBalance(wallet.publicKey);
//     broadcast("info", `💰 Balance: ${(balance / 10**9).toFixed(2)} SOL`);
    
//     if (balance < 0.05 * 10**9) {
//         broadcast("error", "❌ Insufficient balance. Need at least 0.05 SOL");
//         return;
//     }

//     // SETUP ASSETS ON L1
//     updateStage("mint");
//     broadcast("info", "🔨 Initializing Assets on L1...");
//     const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
//     broadcast("success", `✅ Mint created: ${mint.toBase58().slice(0,10)}...`);
    
//     updateStage("userAta");
//     const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
//     broadcast("success", `✅ User ATA (L1): ${userATA.address.toBase58().slice(0,10)}...`);
    
//     updateStage("safeAta");
//     const safeATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, safeWallet.publicKey);
//     broadcast("success", `✅ Safe ATA (L1): ${safeATA.address.toBase58().slice(0,10)}...`);
    
//     try { 
//         await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
//         broadcast("success", "✅ Minted 1,000 tokens");
//     } catch(e) {
//         broadcast("info", "ℹ️  Tokens already minted");
//     }
    
//     // Send initial balances to UI
//     safeEmit("bot-balance", { user: 1000, safe: 0 });

//     // DELEGATE USER
//     updateStage("delegating");
//     broadcast("info", "🔗 Delegating user account to Ephemeral Rollup...");
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
//         const userSig = await connectionL1.sendRawTransaction(userTx.serialize());
//         await connectionL1.confirmTransaction(userSig, "confirmed");
        
//         updateStage("userDelegated");
//         broadcast("success", `✅ User delegation successful! Tx: ${userSig.slice(0,8)}...`);
//     } catch(e) {
//         if (e.message && e.message.includes("already")) {
//             broadcast("info", "ℹ️  User already delegated");
//             updateStage("userDelegated");
//         } else {
//             broadcast("error", `❌ User delegation failed: ${e.message}`);
//             throw e;
//         }
//     }

//     // DELEGATE SAFE
//     updateStage("delegatingSafe");
//     broadcast("info", "🔗 Delegating safe account...");
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
//         const safeSig = await connectionL1.sendRawTransaction(safeTx.serialize());
//         await connectionL1.confirmTransaction(safeSig, "confirmed");
        
//         updateStage("safeDelegated");
//         broadcast("success", "✅ Safe delegation successful!");
//     } catch(e) {
//         if (e.message && e.message.includes("already")) {
//             broadcast("info", "ℹ️  Safe already delegated");
//             updateStage("safeDelegated");
//         } else {
//             broadcast("error", `❌ Safe delegation failed: ${e.message}`);
//             throw e;
//         }
//     }

//     // SYNC
//     updateStage("syncing");
//     broadcast("warning", "⏳ Waiting for L2 sync (15s)...");
//     await SLEEP(15000);

//     updateStage("verifying");
//     broadcast("info", "🔍 Verifying L2 state...");
    
//     try {
//         const userL2 = await getAccount(connectionL2, userATA.address);
//         const safeL2 = await getAccount(connectionL2, safeATA.address);
//         broadcast("success", `✅ User L2: ${Number(userL2.amount) / 10**6} tokens`);
//         broadcast("success", `✅ Safe L2: ${Number(safeL2.amount) / 10**6} tokens`);
//     } catch(e) {
//         broadcast("warning", `⚠️  L2 verification: ${e.message}`);
//     }

//     // MONITORING LOOP
//     updateStage("monitoring");
//     broadcast("success", "🛡️  WICKGUARD PROTECTION ACTIVE");
//     console.log("\n═══════════════════════════════════════════");
//     console.log("  MONITORING STARTED - Press Ctrl+C to stop");
//     console.log("═══════════════════════════════════════════\n");
    
//     let isShieldActive = false;
//     let rescueCount = 0;
//     let totalRescueTime = 0;

//     while (true) {
//         // Simulate Price (REPLACE WITH REAL ORACLE)
//         const currentPrice = 140 + (Math.random() * 10 - 5); 
//         const timestamp = new Date().toLocaleTimeString();
        
//         // Console output
//         process.stdout.write(`\r[${timestamp}] Price: $${currentPrice.toFixed(2)} | Shield: ${isShieldActive ? "🟢 ACTIVE" : "⚪ STANDBY"} | Rescues: ${rescueCount}   `);
        
//         // Send to UI
//         safeEmit("bot-price", currentPrice);

//         // LIQUIDATION LOGIC
//         if (currentPrice < 136 && !isShieldActive) {
//             console.log("\n"); // New line for clean output
//             updateStage("threat");
//             broadcast("alert", "⚠️  LIQUIDATION THRESHOLD BREACHED!");
            
//             updateStage("rescuing");
//             broadcast("warning", "⚡ Executing atomic rescue on L2...");
//             const start = Date.now();

//             try {
//                 const userInfo = await getAccount(connectionL2, userATA.address);
//                 const userBalance = Number(userInfo.amount);

//                 if (userBalance === 0) {
//                     broadcast("info", "ℹ️  No assets to protect");
//                     isShieldActive = true;
//                     updateStage("monitoring");
//                     continue;
//                 }

//                 broadcast("info", `🔒 Protecting ${userBalance / 10**6} tokens...`);

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
//                 broadcast("success", `✅ ASSETS SECURED! Speed: ${speed}ms (avg: ${avgSpeed}ms)`);
//                 broadcast("info", `🔗 Tx: ${sig}`);
                
//                 safeEmit("bot-balance", { user: 0, safe: userBalance / 10**6 });
                
//                 isShieldActive = true;
                
//                 // Verify
//                 await SLEEP(1000);
//                 const newUser = await getAccount(connectionL2, userATA.address);
//                 const newSafe = await getAccount(connectionL2, safeATA.address);
//                 broadcast("success", `✅ Verified - User: ${Number(newUser.amount) / 10**6} | Safe: ${Number(newSafe.amount) / 10**6}`);
                
//                 await SLEEP(2000);
//                 updateStage("monitoring");
                
//             } catch (err) {
//                 broadcast("error", `❌ Rescue failed: ${err.message}`);
//                 if (err.logs) {
//                     err.logs.forEach(log => console.log(`   ${log}`));
//                 }
//                 updateStage("monitoring");
//             }
//         }

//         // RECOVERY LOGIC
//         if (currentPrice > 138 && isShieldActive) {
//             console.log("\n"); // New line for clean output
//             updateStage("recovery");
//             broadcast("success", "📈 MARKET RECOVERY DETECTED");
            
//             updateStage("restoring");
//             broadcast("info", "♻️  Restoring assets to user wallet...");
            
//             try {
//                 const safeInfo = await getAccount(connectionL2, safeATA.address);
//                 const safeBalance = Number(safeInfo.amount);
                
//                 if (safeBalance === 0) {
//                     broadcast("warning", "⚠️  Safe wallet empty");
//                     isShieldActive = false;
//                     updateStage("monitoring");
//                     continue;
//                 }

//                 broadcast("info", `🔓 Restoring ${safeBalance / 10**6} tokens...`);

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
//                 broadcast("success", "✅ Position Restored");
                
//                 safeEmit("bot-balance", { user: safeBalance / 10**6, safe: 0 });
                
//                 isShieldActive = false;
                
//                 // Verify
//                 await SLEEP(1000);
//                 const finalUser = await getAccount(connectionL2, userATA.address);
//                 const finalSafe = await getAccount(connectionL2, safeATA.address);
//                 broadcast("success", `✅ Verified - User: ${Number(finalUser.amount) / 10**6} | Safe: ${Number(finalSafe.amount) / 10**6}`);
                
//                 await SLEEP(2000);
//                 updateStage("monitoring");
                
//             } catch(e) {
//                 broadcast("error", `❌ Restore failed: ${e.message}`);
//                 updateStage("monitoring");
//             }
//         }

//         await SLEEP(500); // Update every 500ms
//     }
// }

// // Handle graceful shutdown
// process.on('SIGINT', () => {
//     console.log("\n\n🛑 Shutting down gracefully...");
//     if (socket && isSocketConnected) {
//         socket.disconnect();
//     }
//     process.exit(0);
// });

// // Start the bot
// main().catch(error => {
//     console.error("\n❌ FATAL ERROR:", error.message);
//     if (socket && isSocketConnected) {
//         socket.disconnect();
//     }
//     process.exit(1);
// });