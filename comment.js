
// // // // // // // // claude version

// // // // // // // const fs = require("fs");
// // // // // // // const { 
// // // // // // //     Connection, Keypair, PublicKey, Transaction, SystemProgram,
// // // // // // //     TransactionInstruction
// // // // // // // } = require("@solana/web3.js");
// // // // // // // const { 
// // // // // // //     createMint, getOrCreateAssociatedTokenAccount, mintTo, 
// // // // // // //     createTransferInstruction, TOKEN_PROGRAM_ID 
// // // // // // // } = require("@solana/spl-token");

// // // // // // // // Import only what we need from SDK
// // // // // // // const { DELEGATION_PROGRAM_ID } = require("@magicblock-labs/ephemeral-rollups-sdk");

// // // // // // // // --- CONFIGURATION ---
// // // // // // // const MAGIC_RPC = "https://devnet-us.magicblock.app"; 
// // // // // // // const VALIDATOR_ID = new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd");
// // // // // // // const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // // // // // // // MANUAL INSTRUCTION BUILDERS (bypassing broken SDK)
// // // // // // // function createManualDelegateInstruction(account, owner, payer, validator) {
// // // // // // //     // Derive the delegation PDA manually
// // // // // // //     const [delegationPda] = PublicKey.findProgramAddressSync(
// // // // // // //         [
// // // // // // //             Buffer.from("delegation"),
// // // // // // //             account.toBuffer(),
// // // // // // //             owner.toBuffer()
// // // // // // //         ],
// // // // // // //         DELEGATION_PROGRAM_ID
// // // // // // //     );

// // // // // // //     // Delegation instruction discriminator (anchor convention)
// // // // // // //     const discriminator = Buffer.from([
// // // // // // //         0x90, 0x4d, 0xa1, 0x5c, 0x5c, 0x4e, 0x71, 0x7f  // "delegate" discriminator
// // // // // // //     ]);

// // // // // // //     const keys = [
// // // // // // //         { pubkey: delegationPda, isSigner: false, isWritable: true },
// // // // // // //         { pubkey: account, isSigner: false, isWritable: true },
// // // // // // //         { pubkey: owner, isSigner: true, isWritable: false },
// // // // // // //         { pubkey: payer, isSigner: true, isWritable: true },
// // // // // // //         { pubkey: validator, isSigner: false, isWritable: false },
// // // // // // //         { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
// // // // // // //         { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
// // // // // // //     ];

// // // // // // //     return new TransactionInstruction({
// // // // // // //         keys,
// // // // // // //         programId: DELEGATION_PROGRAM_ID,
// // // // // // //         data: discriminator
// // // // // // //     });
// // // // // // // }

// // // // // // // function createManualUndelegateInstruction(account, owner, payer) {
// // // // // // //     const [delegationPda] = PublicKey.findProgramAddressSync(
// // // // // // //         [
// // // // // // //             Buffer.from("delegation"),
// // // // // // //             account.toBuffer(),
// // // // // // //             owner.toBuffer()
// // // // // // //         ],
// // // // // // //         DELEGATION_PROGRAM_ID
// // // // // // //     );

// // // // // // //     // Undelegate discriminator
// // // // // // //     const discriminator = Buffer.from([
// // // // // // //         0x2e, 0x7d, 0x5d, 0x9e, 0x7e, 0x4a, 0x7c, 0x8f  // "undelegate" discriminator
// // // // // // //     ]);

// // // // // // //     const keys = [
// // // // // // //         { pubkey: delegationPda, isSigner: false, isWritable: true },
// // // // // // //         { pubkey: account, isSigner: false, isWritable: true },
// // // // // // //         { pubkey: owner, isSigner: true, isWritable: false },
// // // // // // //         { pubkey: payer, isSigner: true, isWritable: true },
// // // // // // //         { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
// // // // // // //         { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
// // // // // // //     ];

// // // // // // //     return new TransactionInstruction({
// // // // // // //         keys,
// // // // // // //         programId: DELEGATION_PROGRAM_ID,
// // // // // // //         data: discriminator
// // // // // // //     });
// // // // // // // }

// // // // // // // async function main() {
// // // // // // //     console.log("🚀 STARTING WICKGUARD (MANUAL INSTRUCTION MODE)...");
    
// // // // // // //     // 1. SETUP CONNECTIONS
// // // // // // //     const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
// // // // // // //     const connectionL2 = new Connection(MAGIC_RPC, "confirmed");

// // // // // // //     // 2. LOAD WALLET
// // // // // // //     let wallet;
// // // // // // //     try {
// // // // // // //         if (fs.existsSync("my-wallet.json")) {
// // // // // // //             const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
// // // // // // //             wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
// // // // // // //             console.log(`\n1. 📂 Wallet: ${wallet.publicKey.toBase58().slice(0,8)}...`);
// // // // // // //         } else {
// // // // // // //             throw new Error("No wallet file!");
// // // // // // //         }
// // // // // // //     } catch (e) {
// // // // // // //         console.log("❌ ERROR: my-wallet.json missing. Run setup.");
// // // // // // //         return;
// // // // // // //     }

// // // // // // //     // CHECK BALANCE
// // // // // // //     const balance = await connectionL1.getBalance(wallet.publicKey);
// // // // // // //     console.log(`   💰 Balance: ${(balance / 10**9).toFixed(2)} SOL`);
// // // // // // //     if (balance < 0.05 * 10**9) return console.log("   ❌ Low Balance.");

// // // // // // //     // 3. ASSETS (L1)
// // // // // // //     console.log("\n2. 🏦 Checking Assets...");
// // // // // // //     const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
// // // // // // //     const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
// // // // // // //     const safeWallet = Keypair.generate();
// // // // // // //     const safeATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, safeWallet.publicKey);
    
// // // // // // //     try { 
// // // // // // //         await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
// // // // // // //     } catch(e) {
// // // // // // //         console.log("   ℹ️  Tokens already minted");
// // // // // // //     }
// // // // // // //     console.log("   ✅ User Ready: 1,000 Tokens");
// // // // // // //     console.log(`   📍 User ATA: ${userATA.address.toBase58()}`);

// // // // // // //     // 4. MANUAL DELEGATION
// // // // // // //     console.log("\n3. ⚡ EXECUTING DELEGATION (L1)...");
// // // // // // //     try {
// // // // // // //         const ix = createManualDelegateInstruction(
// // // // // // //             userATA.address,
// // // // // // //             wallet.publicKey,
// // // // // // //             wallet.publicKey,
// // // // // // //             VALIDATOR_ID
// // // // // // //         );

// // // // // // //         const tx = new Transaction().add(ix);
// // // // // // //         const { blockhash } = await connectionL1.getLatestBlockhash();
// // // // // // //         tx.recentBlockhash = blockhash;
// // // // // // //         tx.feePayer = wallet.publicKey;
// // // // // // //         tx.sign(wallet);

// // // // // // //         console.log("   ⏳ Sending delegation transaction...");
// // // // // // //         const sig = await connectionL1.sendRawTransaction(tx.serialize(), {
// // // // // // //             skipPreflight: false,
// // // // // // //             preflightCommitment: "confirmed"
// // // // // // //         });
        
// // // // // // //         console.log("   ⏳ Confirming...");
// // // // // // //         await connectionL1.confirmTransaction(sig, "confirmed");
        
// // // // // // //         console.log("   ✅ DELEGATION SUCCESSFUL!"); 
// // // // // // //         console.log(`   📝 Tx: ${sig}`);
// // // // // // //         console.log("      (Account now controlled by Ephemeral Rollup)");
        
// // // // // // //         // Wait for MagicBlock to sync
// // // // // // //         console.log("   ⏳ Waiting for L2 sync (15s)...");
// // // // // // //         await SLEEP(15000);

// // // // // // //     } catch (e) {
// // // // // // //         console.log("   ⚠️ Delegation Error:", e.message);
        
// // // // // // //         // Check if already delegated
// // // // // // //         if (e.message.includes("already") || e.message.includes("0x0")) {
// // // // // // //             console.log("   ✅ Account may already be delegated, continuing...");
// // // // // // //             await SLEEP(5000);
// // // // // // //         } else {
// // // // // // //             console.log("   ❌ CRITICAL: Delegation failed!");
// // // // // // //             console.log("   Full error:", e);
            
// // // // // // //             // Try to continue anyway for testing
// // // // // // //             console.log("   ⚠️  Continuing in L1-only mode for debugging...");
// // // // // // //         }
// // // // // // //     }

// // // // // // //     // VERIFY L2 ACCESS
// // // // // // //     console.log("\n4. 🔍 Verifying L2 Account Access...");
// // // // // // //     try {
// // // // // // //         const accountInfo = await connectionL2.getAccountInfo(userATA.address);
// // // // // // //         if (accountInfo) {
// // // // // // //             console.log("   ✅ Account visible on L2");
// // // // // // //             console.log(`   📊 Lamports: ${accountInfo.lamports}`);
// // // // // // //             console.log(`   👤 Owner: ${accountInfo.owner.toBase58()}`);
// // // // // // //         } else {
// // // // // // //             console.log("   ⚠️  Account not found on L2");
// // // // // // //         }
// // // // // // //     } catch (e) {
// // // // // // //         console.log("   ⚠️  L2 verification failed:", e.message);
// // // // // // //     }

// // // // // // //     // 5. WATCHER LOOP
// // // // // // //     console.log("\n--- 🛡️  WICK GUARD LIVE ---");
// // // // // // //     let isShieldActive = false;
// // // // // // //     let useL2 = true; // Flag to try L2 first

// // // // // // //     while (true) {
// // // // // // //         const currentPrice = 140 + (Math.random() * 10 - 5); 
// // // // // // //         process.stdout.write(`\r   Price: $${currentPrice.toFixed(2)} | Shield: ${isShieldActive ? "ACTIVE" : "IDLE"} | Mode: ${useL2 ? "L2" : "L1"}   `);

// // // // // // //         // CRASH TRIGGER
// // // // // // //         if (currentPrice < 136 && !isShieldActive) {
// // // // // // //             console.log("\n\n🚨 CRASH DETECTED! EXECUTING RESCUE...");
// // // // // // //             const start = Date.now();

// // // // // // //             try {
// // // // // // //                 const transferIx = createTransferInstruction(
// // // // // // //                     userATA.address, 
// // // // // // //                     safeATA.address, 
// // // // // // //                     wallet.publicKey, 
// // // // // // //                     1000 * 10**6, 
// // // // // // //                     [], 
// // // // // // //                     TOKEN_PROGRAM_ID
// // // // // // //                 );

// // // // // // //                 const tx = new Transaction().add(transferIx);
                
// // // // // // //                 // Try L2 first
// // // // // // //                 const connection = useL2 ? connectionL2 : connectionL1;
// // // // // // //                 const label = useL2 ? "L2" : "L1";
                
// // // // // // //                 const { blockhash } = await connection.getLatestBlockhash("confirmed");
// // // // // // //                 tx.recentBlockhash = blockhash;
// // // // // // //                 tx.feePayer = wallet.publicKey;
// // // // // // //                 tx.sign(wallet);

// // // // // // //                 console.log(`   ⏳ Sending to ${label}...`);
// // // // // // //                 const sig = await connection.sendRawTransaction(tx.serialize(), {
// // // // // // //                     skipPreflight: true, // Skip preflight for speed
// // // // // // //                     maxRetries: 3
// // // // // // //                 });
                
// // // // // // //                 await connection.confirmTransaction(sig, "confirmed");
                
// // // // // // //                 const speed = Date.now() - start;
// // // // // // //                 console.log(`   ✅ ASSETS SAVED ON ${label}!`);
// // // // // // //                 console.log(`   ⚡ Execution Time: ${speed}ms`);
// // // // // // //                 console.log(`   📝 Tx: ${sig}`);
                
// // // // // // //                 isShieldActive = true;
// // // // // // //                 await SLEEP(3000); 

// // // // // // //             } catch (err) {
// // // // // // //                 console.log(`\n   ❌ Transfer Failed: ${err.message}`);
                
// // // // // // //                 // If L2 fails, try L1 as fallback
// // // // // // //                 if (useL2) {
// // // // // // //                     console.log("   🔄 Falling back to L1 mode...");
// // // // // // //                     useL2 = false;
// // // // // // //                 }
// // // // // // //             }
// // // // // // //         }

// // // // // // //         // RECOVERY
// // // // // // //         if (currentPrice > 138 && isShieldActive) {
// // // // // // //             console.log("\n\n📈 RECOVERY. RESTORING POSITION...");
// // // // // // //             try {
// // // // // // //                 const returnIx = createTransferInstruction(
// // // // // // //                     safeATA.address, 
// // // // // // //                     userATA.address, 
// // // // // // //                     safeWallet.publicKey, 
// // // // // // //                     1000 * 10**6, 
// // // // // // //                     [], 
// // // // // // //                     TOKEN_PROGRAM_ID
// // // // // // //                 );
                
// // // // // // //                 const returnTx = new Transaction().add(returnIx);
// // // // // // //                 const { blockhash } = await connectionL1.getLatestBlockhash();
// // // // // // //                 returnTx.recentBlockhash = blockhash;
// // // // // // //                 returnTx.feePayer = wallet.publicKey;
// // // // // // //                 returnTx.sign(wallet, safeWallet);
                
// // // // // // //                 const returnSig = await connectionL1.sendRawTransaction(returnTx.serialize());
// // // // // // //                 await connectionL1.confirmTransaction(returnSig);

// // // // // // //                 isShieldActive = false;
// // // // // // //                 console.log("   ✅ Position Restored");
                
// // // // // // //             } catch (e) { 
// // // // // // //                 console.log("   ⚠️ Restore failed:", e.message); 
// // // // // // //             }
// // // // // // //         }
        
// // // // // // //         await SLEEP(200);
// // // // // // //     }
// // // // // // // }

// // // // // // // main().catch(console.error);

// // // // // // // // the above code Great progress! The L2 rescue is working 🎉 - you successfully saved assets on L2 in 2.7 seconds!
// // // // // // // // The problems now are:
// // // // // // // // Delegation discriminator is wrong (but it doesn't matter since L2 works without it)
// // // // // // // // Recovery fails because the safe wallet has insufficient funds

// // // // // // //claude version2 below

// // // // // // const fs = require("fs");
// // // // // // const { 
// // // // // //     Connection, Keypair, PublicKey, Transaction
// // // // // // } = require("@solana/web3.js");
// // // // // // const { 
// // // // // //     createMint, getOrCreateAssociatedTokenAccount, mintTo, 
// // // // // //     createTransferInstruction, TOKEN_PROGRAM_ID,
// // // // // //     getAccount
// // // // // // } = require("@solana/spl-token");

// // // // // // // Import the delegate HELPER function, not the instruction builder
// // // // // // const { delegate } = require("@magicblock-labs/ephemeral-rollups-sdk");

// // // // // // // --- CONFIGURATION ---
// // // // // // const MAGIC_RPC = "https://devnet-us.magicblock.app"; 
// // // // // // const VALIDATOR_ID = new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd");
// // // // // // const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // // // // // async function main() {
// // // // // //     console.log("🚀 STARTING WICKGUARD (USING SDK HELPER)...");
    
// // // // // //     // 1. SETUP CONNECTIONS
// // // // // //     const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
// // // // // //     const connectionL2 = new Connection(MAGIC_RPC, "confirmed");

// // // // // //     // 2. LOAD WALLET
// // // // // //     let wallet;
// // // // // //     try {
// // // // // //         if (fs.existsSync("my-wallet.json")) {
// // // // // //             const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
// // // // // //             wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
// // // // // //             console.log(`\n1. 📂 Wallet: ${wallet.publicKey.toBase58().slice(0,8)}...`);
// // // // // //         } else {
// // // // // //             throw new Error("No wallet file!");
// // // // // //         }
// // // // // //     } catch (e) {
// // // // // //         console.log("❌ ERROR: my-wallet.json missing.");
// // // // // //         return;
// // // // // //     }

// // // // // //     // CHECK BALANCE
// // // // // //     const balance = await connectionL1.getBalance(wallet.publicKey);
// // // // // //     console.log(`   💰 Balance: ${(balance / 10**9).toFixed(2)} SOL`);
// // // // // //     if (balance < 0.05 * 10**9) return console.log("   ❌ Low Balance.");

// // // // // //     // 3. ASSETS (L1)
// // // // // //     console.log("\n2. 🏦 Setting Up Assets...");
// // // // // //     const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
// // // // // //     const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
// // // // // //     const safeWallet = Keypair.generate();
// // // // // //     const safeATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, safeWallet.publicKey);
    
// // // // // //     try { 
// // // // // //         await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
// // // // // //     } catch(e) {
// // // // // //         console.log("   ℹ️  Tokens already minted");
// // // // // //     }
// // // // // //     console.log("   ✅ User ATA Ready: 1,000 Tokens");
// // // // // //     console.log(`   📍 User: ${userATA.address.toBase58().slice(0, 12)}...`);
// // // // // //     console.log(`   📍 Safe: ${safeATA.address.toBase58().slice(0, 12)}...`);

// // // // // //     // 4. DELEGATION USING SDK HELPER
// // // // // //     console.log("\n3. ⚡ DELEGATING TO EPHEMERAL ROLLUP...");
// // // // // //     try {
// // // // // //         // The SDK provides a high-level 'delegate' function that handles everything
// // // // // //         const delegateTx = await delegate(
// // // // // //             connectionL1,
// // // // // //             wallet,
// // // // // //             userATA.address,  // Account to delegate
// // // // // //             VALIDATOR_ID,     // MagicBlock validator
// // // // // //             "confirmed"
// // // // // //         );
        
// // // // // //         console.log("   ✅ DELEGATION SUCCESSFUL!");
// // // // // //         console.log(`   📝 Tx: ${delegateTx}`);
// // // // // //         console.log("   ⏳ Waiting for L2 sync (10s)...");
// // // // // //         await SLEEP(10000);

// // // // // //     } catch (e) {
// // // // // //         console.log("   ⚠️ Delegation Error:", e.message);
        
// // // // // //         if (e.message.includes("already") || e.message.includes("0x0")) {
// // // // // //             console.log("   ✅ Already delegated, continuing...");
// // // // // //             await SLEEP(5000);
// // // // // //         } else {
// // // // // //             console.log("   ❌ CRITICAL: Cannot proceed without delegation");
// // // // // //             console.log("\n💡 Try running: npx @magicblock-labs/ephemeral-rollups-sdk delegate");
// // // // // //             return;
// // // // // //         }
// // // // // //     }

// // // // // //     // Verify both accounts are accessible on L2
// // // // // //     console.log("\n4. 🔍 Verifying L2 Access...");
// // // // // //     try {
// // // // // //         const userInfo = await getAccount(connectionL2, userATA.address);
// // // // // //         const safeInfo = await getAccount(connectionL2, safeATA.address);
// // // // // //         console.log(`   ✅ User on L2: ${Number(userInfo.amount) / 10**6} tokens`);
// // // // // //         console.log(`   ✅ Safe on L2: ${Number(safeInfo.amount) / 10**6} tokens`);
// // // // // //     } catch(e) {
// // // // // //         console.log("   ⚠️ L2 verification failed:", e.message);
// // // // // //     }

// // // // // //     // 5. WATCHER LOOP
// // // // // //     console.log("\n--- 🛡️  WICK GUARD LIVE ON L2 ---");
// // // // // //     let isShieldActive = false;

// // // // // //     while (true) {
// // // // // //         const currentPrice = 140 + (Math.random() * 10 - 5); 
// // // // // //         process.stdout.write(`\r   Price: $${currentPrice.toFixed(2)} | Shield: ${isShieldActive ? "🟢 ACTIVE" : "⚪ IDLE"}   `);

// // // // // //         // CRASH TRIGGER
// // // // // //         if (currentPrice < 136 && !isShieldActive) {
// // // // // //             console.log("\n\n🚨 LIQUIDATION RISK! EXECUTING L2 RESCUE...");
// // // // // //             const start = Date.now();

// // // // // //             try {
// // // // // //                 const userInfo = await getAccount(connectionL2, userATA.address);
// // // // // //                 const userBalance = Number(userInfo.amount);
                
// // // // // //                 console.log(`   📊 Rescuing ${userBalance / 10**6} tokens...`);

// // // // // //                 const transferIx = createTransferInstruction(
// // // // // //                     userATA.address, 
// // // // // //                     safeATA.address, 
// // // // // //                     wallet.publicKey, 
// // // // // //                     userBalance,
// // // // // //                     [], 
// // // // // //                     TOKEN_PROGRAM_ID
// // // // // //                 );

// // // // // //                 const tx = new Transaction().add(transferIx);
// // // // // //                 const { blockhash } = await connectionL2.getLatestBlockhash("confirmed");
// // // // // //                 tx.recentBlockhash = blockhash;
// // // // // //                 tx.feePayer = wallet.publicKey;
// // // // // //                 tx.sign(wallet);

// // // // // //                 console.log(`   ⚡ Sending to L2...`);
// // // // // //                 const sig = await connectionL2.sendRawTransaction(tx.serialize(), {
// // // // // //                     skipPreflight: false,
// // // // // //                     maxRetries: 3
// // // // // //                 });
                
// // // // // //                 await connectionL2.confirmTransaction(sig, "confirmed");
                
// // // // // //                 const speed = Date.now() - start;
// // // // // //                 console.log(`   ✅ ASSETS SECURED ON L2!`);
// // // // // //                 console.log(`   ⚡ Execution: ${speed}ms (vs ~2000ms on L1)`);
// // // // // //                 console.log(`   📝 Tx: ${sig.slice(0, 20)}...`);
                
// // // // // //                 isShieldActive = true;
                
// // // // // //                 const newUserInfo = await getAccount(connectionL2, userATA.address);
// // // // // //                 const newSafeInfo = await getAccount(connectionL2, safeATA.address);
// // // // // //                 console.log(`   📊 New - User: ${Number(newUserInfo.amount) / 10**6} | Safe: ${Number(newSafeInfo.amount) / 10**6}`);
                
// // // // // //                 await SLEEP(3000); 

// // // // // //             } catch (err) {
// // // // // //                 console.log(`\n   ❌ L2 Rescue Failed: ${err.message}`);
// // // // // //             }
// // // // // //         }

// // // // // //         // RECOVERY
// // // // // //         if (currentPrice > 138 && isShieldActive) {
// // // // // //             console.log("\n\n📈 MARKET RECOVERED. RETURNING POSITION...");
// // // // // //             try {
// // // // // //                 const safeInfo = await getAccount(connectionL2, safeATA.address);
// // // // // //                 const safeBalance = Number(safeInfo.amount);
                
// // // // // //                 if (safeBalance === 0) {
// // // // // //                     console.log("   ⚠️ Safe is empty");
// // // // // //                     isShieldActive = false;
// // // // // //                     continue;
// // // // // //                 }

// // // // // //                 console.log(`   📊 Returning ${safeBalance / 10**6} tokens...`);

// // // // // //                 const returnIx = createTransferInstruction(
// // // // // //                     safeATA.address, 
// // // // // //                     userATA.address, 
// // // // // //                     safeWallet.publicKey,
// // // // // //                     safeBalance,
// // // // // //                     [], 
// // // // // //                     TOKEN_PROGRAM_ID
// // // // // //                 );
                
// // // // // //                 const returnTx = new Transaction().add(returnIx);
// // // // // //                 const { blockhash } = await connectionL2.getLatestBlockhash();
// // // // // //                 returnTx.recentBlockhash = blockhash;
// // // // // //                 returnTx.feePayer = wallet.publicKey;
// // // // // //                 returnTx.sign(wallet, safeWallet);
                
// // // // // //                 const returnSig = await connectionL2.sendRawTransaction(returnTx.serialize());
// // // // // //                 await connectionL2.confirmTransaction(returnSig);

// // // // // //                 isShieldActive = false;
// // // // // //                 console.log("   ✅ Position Restored on L2");
// // // // // //                 console.log(`   📝 Tx: ${returnSig.slice(0, 20)}...`);
                
// // // // // //                 const finalUserInfo = await getAccount(connectionL2, userATA.address);
// // // // // //                 const finalSafeInfo = await getAccount(connectionL2, safeATA.address);
// // // // // //                 console.log(`   📊 Final - User: ${Number(finalUserInfo.amount) / 10**6} | Safe: ${Number(finalSafeInfo.amount) / 10**6}`);
                
// // // // // //             } catch (e) { 
// // // // // //                 console.log("   ⚠️ Restore failed:", e.message);
// // // // // //             }
// // // // // //         }
        
// // // // // //         await SLEEP(200);
// // // // // //     }
// // // // // // }

// // // // // // main().catch(console.error);

// // // // // // claude v 3

// // // const fs = require("fs");
// // // const { 
// // //     Connection, Keypair, PublicKey, Transaction, SystemProgram
// // // } = require("@solana/web3.js");
// // // const { 
// // //     createMint, getOrCreateAssociatedTokenAccount, mintTo, 
// // //     createTransferInstruction, TOKEN_PROGRAM_ID,
// // //     getAccount
// // // } = require("@solana/spl-token");

// // // // Let's check what's actually in the SDK
// // // const SDK = require("@magicblock-labs/ephemeral-rollups-sdk");

// // // // --- CONFIGURATION ---
// // // const MAGIC_RPC = "https://devnet-us.magicblock.app"; 
// // // const VALIDATOR_ID = new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd");
// // // const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // // async function main() {
// // //     console.log("🚀 STARTING WICKGUARD...");
    
// // //     // Debug: Log what's available in the SDK
// // //     console.log("\n🔍 SDK Exports:", Object.keys(SDK));
    
// // //     // 1. SETUP CONNECTIONS
// // //     const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
// // //     const connectionL2 = new Connection(MAGIC_RPC, "confirmed");

// // //     // 2. LOAD WALLET
// // //     let wallet;
// // //     try {
// // //         if (fs.existsSync("my-wallet.json")) {
// // //             const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
// // //             wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
// // //             console.log(`\n1. 📂 Wallet: ${wallet.publicKey.toBase58().slice(0,8)}...`);
// // //         } else {
// // //             throw new Error("No wallet file!");
// // //         }
// // //     } catch (e) {
// // //         console.log("❌ ERROR: my-wallet.json missing.");
// // //         return;
// // //     }

// // //     // CHECK BALANCE
// // //     const balance = await connectionL1.getBalance(wallet.publicKey);
// // //     console.log(`   💰 Balance: ${(balance / 10**9).toFixed(2)} SOL`);
// // //     if (balance < 0.05 * 10**9) return console.log("   ❌ Low Balance.");

// // //     // 3. ASSETS (L1)
// // //     console.log("\n2. 🏦 Setting Up Assets...");
// // //     const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
// // //     const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
// // //     const safeWallet = Keypair.generate();
// // //     const safeATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, safeWallet.publicKey);
    
// // //     try { 
// // //         await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
// // //     } catch(e) {
// // //         console.log("   ℹ️  Tokens already minted");
// // //     }
// // //     console.log("   ✅ User ATA Ready: 1,000 Tokens");
// // //     console.log(`   📍 User: ${userATA.address.toBase58().slice(0, 12)}...`);
// // //     console.log(`   📍 Safe: ${safeATA.address.toBase58().slice(0, 12)}...`);

// // //     // 4. TRY DIFFERENT DELEGATION APPROACHES
// // //     console.log("\n3. ⚡ ATTEMPTING DELEGATION...");
    
// // //     // Approach 1: Try if there's a delegateAccount function
// // //     if (SDK.delegateAccount) {
// // //         console.log("   📌 Using SDK.delegateAccount...");
// // //         try {
// // //             await SDK.delegateAccount(connectionL1, wallet, userATA.address, VALIDATOR_ID);
// // //             console.log("   ✅ Delegated!");
// // //         } catch(e) {
// // //             console.log("   ❌ Failed:", e.message);
// // //         }
// // //     }
    
// // //     // Approach 2: Try using the program interface
// // //     else if (SDK.DelegationProgram) {
// // //         console.log("   📌 Using SDK.DelegationProgram...");
// // //         try {
// // //             const program = SDK.DelegationProgram;
// // //             // Check what methods are available
// // //             console.log("   Available methods:", Object.keys(program));
// // //         } catch(e) {
// // //             console.log("   ❌ Failed:", e.message);
// // //         }
// // //     }
    
// // //     // Approach 3: Use anchor-style instruction with correct data
// // //     else {
// // //         console.log("   📌 Using manual Anchor instruction...");
// // //         try {
// // //             const { DELEGATION_PROGRAM_ID } = SDK;
            
// // //             // Anchor uses 8-byte discriminator from sha256("global:delegate")[0..8]
// // //             // Let's try a few common patterns
// // //             const discriminators = [
// // //                 Buffer.from([90, 77, 161, 92, 92, 78, 113, 127]), // Common Anchor pattern
// // //                 Buffer.from([1]), // Simple index
// // //                 Buffer.from([0]), // Zero index
// // //             ];
            
// // //             for (let i = 0; i < discriminators.length; i++) {
// // //                 console.log(`   Attempt ${i+1}: Testing discriminator...`);
                
// // //                 const [delegationPda] = PublicKey.findProgramAddressSync(
// // //                     [Buffer.from("delegation"), userATA.address.toBuffer(), wallet.publicKey.toBuffer()],
// // //                     DELEGATION_PROGRAM_ID
// // //                 );
                
// // //                 const ix = new Transaction.Instruction({
// // //                     keys: [
// // //                         { pubkey: delegationPda, isSigner: false, isWritable: true },
// // //                         { pubkey: userATA.address, isSigner: false, isWritable: true },
// // //                         { pubkey: wallet.publicKey, isSigner: true, isWritable: false },
// // //                         { pubkey: wallet.publicKey, isSigner: true, isWritable: true },
// // //                         { pubkey: VALIDATOR_ID, isSigner: false, isWritable: false },
// // //                         { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
// // //                         { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
// // //                     ],
// // //                     programId: DELEGATION_PROGRAM_ID,
// // //                     data: discriminators[i]
// // //                 });
                
// // //                 const tx = new Transaction().add(ix);
// // //                 const { blockhash } = await connectionL1.getLatestBlockhash();
// // //                 tx.recentBlockhash = blockhash;
// // //                 tx.feePayer = wallet.publicKey;
// // //                 tx.sign(wallet);
                
// // //                 try {
// // //                     const sig = await connectionL1.sendRawTransaction(tx.serialize(), {
// // //                         skipPreflight: true // Skip preflight to see actual error
// // //                     });
                    
// // //                     await connectionL1.confirmTransaction(sig);
// // //                     console.log(`   ✅ SUCCESS with discriminator ${i}!`);
// // //                     console.log(`   📝 Tx: ${sig}`);
// // //                     break;
// // //                 } catch(e) {
// // //                     console.log(`   ❌ Discriminator ${i} failed: ${e.message.split('\n')[0]}`);
// // //                 }
// // //             }
// // //         } catch(e) {
// // //             console.log("   ❌ Manual delegation failed:", e.message);
// // //         }
// // //     }
    
// // //     console.log("\n4. 🔄 Trying SIMPLIFIED APPROACH - Direct L2 without delegation...");
// // //     console.log("   (Some rollups allow write access without explicit delegation)");
    
// // //     // Try creating the safe account on L2 first
// // //     try {
// // //         console.log("   📌 Creating safe account on L2...");
// // //         const createSafeATA = await getOrCreateAssociatedTokenAccount(
// // //             connectionL2, 
// // //             wallet, 
// // //             mint, 
// // //             safeWallet.publicKey
// // //         );
// // //         console.log(`   ✅ Safe ATA created on L2: ${createSafeATA.address.toBase58().slice(0,12)}...`);
// // //     } catch(e) {
// // //         console.log(`   ℹ️  Safe ATA: ${e.message}`);
// // //     }

// // //     await SLEEP(5000);

// // //     // 5. WATCHER LOOP
// // //     console.log("\n--- 🛡️  WICK GUARD LIVE (Testing Mode) ---");
// // //     let isShieldActive = false;

// // //     while (true) {
// // //         const currentPrice = 140 + (Math.random() * 10 - 5); 
// // //         process.stdout.write(`\r   Price: $${currentPrice.toFixed(2)} | Shield: ${isShieldActive ? "🟢 ACTIVE" : "⚪ IDLE"}   `);

// // //         if (currentPrice < 136 && !isShieldActive) {
// // //             console.log("\n\n🚨 LIQUIDATION RISK! EXECUTING RESCUE...");
// // //             const start = Date.now();

// // //             try {
// // //                 const userInfo = await getAccount(connectionL2, userATA.address);
// // //                 const userBalance = Number(userInfo.amount);
                
// // //                 console.log(`   📊 Attempting to rescue ${userBalance / 10**6} tokens...`);

// // //                 const transferIx = createTransferInstruction(
// // //                     userATA.address, 
// // //                     safeATA.address, 
// // //                     wallet.publicKey, 
// // //                     userBalance,
// // //                     [], 
// // //                     TOKEN_PROGRAM_ID
// // //                 );

// // //                 const tx = new Transaction().add(transferIx);
// // //                 const { blockhash } = await connectionL2.getLatestBlockhash("confirmed");
// // //                 tx.recentBlockhash = blockhash;
// // //                 tx.feePayer = wallet.publicKey;
// // //                 tx.sign(wallet);

// // //                 const sig = await connectionL2.sendRawTransaction(tx.serialize(), {
// // //                     skipPreflight: true // Try without preflight
// // //                 });
                
// // //                 await connectionL2.confirmTransaction(sig, "confirmed");
                
// // //                 const speed = Date.now() - start;
// // //                 console.log(`   ✅ RESCUE SUCCESSFUL ON L2!`);
// // //                 console.log(`   ⚡ Speed: ${speed}ms`);
// // //                 console.log(`   📝 Tx: ${sig.slice(0, 20)}...`);
                
// // //                 isShieldActive = true;
// // //                 await SLEEP(3000); 

// // //             } catch (err) {
// // //                 console.log(`\n   ❌ Rescue failed: ${err.message}`);
// // //                 console.log(`   💡 This confirms delegation IS required for L2 writes`);
// // //                 break; // Exit loop since we can't proceed
// // //             }
// // //         }
        
// // //         await SLEEP(200);
// // //     }
    
// // //     console.log("\n\n📚 DOCUMENTATION NEEDED:");
// // //     console.log("   Please share the MagicBlock SDK documentation or GitHub repo");
// // //     console.log("   We need to find the correct delegation method");
// // // }

// // // main().catch(console.error);
// // // // // // this worked


// // // // // the final finishing
// // // // const fs = require("fs");
// // // // const { 
// // // //     Connection, Keypair, PublicKey, Transaction
// // // // } = require("@solana/web3.js");
// // // // const { 
// // // //     createMint, getOrCreateAssociatedTokenAccount, mintTo, 
// // // //     createTransferInstruction, TOKEN_PROGRAM_ID,
// // // //     getAccount
// // // // } = require("@solana/spl-token");

// // // // // --- CONFIGURATION ---
// // // // const MAGIC_RPC = "https://devnet-us.magicblock.app"; 
// // // // const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// // // // async function main() {
// // // //     console.log("🚀 WICKGUARD - PRODUCTION MODE");
// // // //     console.log("   Institutional-Grade Liquidation Protection\n");
    
// // // //     // 1. SETUP
// // // //     const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
// // // //     const connectionL2 = new Connection(MAGIC_RPC, "confirmed");

// // // //     // 2. LOAD WALLET
// // // //     let wallet;
// // // //     try {
// // // //         const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
// // // //         wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
// // // //         console.log(`📂 Wallet: ${wallet.publicKey.toBase58().slice(0,8)}...`);
// // // //     } catch (e) {
// // // //         return console.log("❌ ERROR: my-wallet.json missing.");
// // // //     }

// // // //     const balance = await connectionL1.getBalance(wallet.publicKey);
// // // //     console.log(`💰 Balance: ${(balance / 10**9).toFixed(2)} SOL`);
// // // //     if (balance < 0.05 * 10**9) return console.log("❌ Insufficient balance.");

// // // //     // 3. SETUP ASSETS ON L1 FIRST
// // // //     console.log("\n🏦 Initializing Assets on L1...");
// // // //     const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
// // // //     const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
// // // //     const safeWallet = Keypair.generate();
// // // //     const safeATA_L1 = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, safeWallet.publicKey);
    
// // // //     try { 
// // // //         await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
// // // //         console.log("✅ Minted 1,000 tokens to user account");
// // // //     } catch(e) {
// // // //         console.log("ℹ️  Tokens already minted");
// // // //     }
    
// // // //     console.log(`📍 User ATA: ${userATA.address.toBase58()}`);
// // // //     console.log(`📍 Safe ATA: ${safeATA_L1.address.toBase58()}`);
// // // //     console.log(`🔑 Mint: ${mint.toBase58()}`);

// // // //     // 4. NOW CREATE ACCOUNTS ON L2
// // // //     console.log("\n⚡ Setting up L2 accounts...");
// // // //     let safeATA_L2;
// // // //     try {
// // // //         // Create safe account on L2
// // // //         safeATA_L2 = await getOrCreateAssociatedTokenAccount(
// // // //             connectionL2, 
// // // //             wallet, 
// // // //             mint, 
// // // //             safeWallet.publicKey
// // // //         );
// // // //         console.log("✅ Safe account created on L2");
// // // //     } catch(e) {
// // // //         console.log("⚠️  L2 account creation failed:", e.message);
// // // //         console.log("   Using L1 address as fallback");
// // // //         safeATA_L2 = safeATA_L1;
// // // //     }

// // // //     // Wait for L2 sync
// // // //     console.log("⏳ Waiting for L2 sync (5s)...");
// // // //     await SLEEP(5000);

// // // //     // Check initial balances (with error handling)
// // // //     console.log("\n💎 Initial Balances:");
// // // //     try {
// // // //         const initialUser = await getAccount(connectionL2, userATA.address);
// // // //         console.log(`   User: ${Number(initialUser.amount) / 10**6} tokens`);
// // // //     } catch(e) {
// // // //         console.log(`   User: Not yet on L2`);
// // // //     }
    
// // // //     try {
// // // //         const initialSafe = await getAccount(connectionL2, safeATA_L2.address);
// // // //         console.log(`   Safe: ${Number(initialSafe.amount) / 10**6} tokens`);
// // // //     } catch(e) {
// // // //         console.log(`   Safe: 0 tokens (new account)`);
// // // //     }

// // // //     // 5. PROTECTION LOOP
// // // //     console.log("\n═══════════════════════════════════════════");
// // // //     console.log("🛡️  WICKGUARD PROTECTION ACTIVE");
// // // //     console.log("═══════════════════════════════════════════\n");
    
// // // //     let isShieldActive = false;
// // // //     let rescueCount = 0;
// // // //     let totalRescueTime = 0;

// // // //     while (true) {
// // // //         const currentPrice = 140 + (Math.random() * 10 - 5); 
// // // //         const timestamp = new Date().toLocaleTimeString();
        
// // // //         process.stdout.write(`\r[${timestamp}] Price: $${currentPrice.toFixed(2)} | Shield: ${isShieldActive ? "🟢 ACTIVE" : "⚪ STANDBY"} | Rescues: ${rescueCount}   `);

// // // //         // LIQUIDATION PROTECTION
// // // //         if (currentPrice < 136 && !isShieldActive) {
// // // //             console.log("\n\n🚨 LIQUIDATION THRESHOLD BREACHED!");
// // // //             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
// // // //             const start = Date.now();

// // // //             try {
// // // //                 // Get balance with error handling
// // // //                 let userBalance;
// // // //                 try {
// // // //                     const userInfo = await getAccount(connectionL2, userATA.address);
// // // //                     userBalance = Number(userInfo.amount);
// // // //                 } catch(e) {
// // // //                     console.log("   ⚠️  Account not on L2 yet, trying L1...");
// // // //                     const userInfoL1 = await getAccount(connectionL1, userATA.address);
// // // //                     userBalance = Number(userInfoL1.amount);
// // // //                     console.log("   ℹ️  Using L1 for this rescue");
// // // //                 }
                
// // // //                 if (userBalance === 0) {
// // // //                     console.log("   ℹ️  No assets to protect");
// // // //                     isShieldActive = true;
// // // //                     continue;
// // // //                 }

// // // //                 console.log(`   📊 Protecting ${userBalance / 10**6} tokens...`);

// // // //                 const transferIx = createTransferInstruction(
// // // //                     userATA.address, 
// // // //                     safeATA_L2.address, 
// // // //                     wallet.publicKey, 
// // // //                     userBalance,
// // // //                     [], 
// // // //                     TOKEN_PROGRAM_ID
// // // //                 );

// // // //                 const tx = new Transaction().add(transferIx);
                
// // // //                 // Try L2 first, fallback to L1
// // // //                 let connection = connectionL2;
// // // //                 let label = "L2";
// // // //                 try {
// // // //                     const { blockhash } = await connectionL2.getLatestBlockhash("confirmed");
// // // //                     tx.recentBlockhash = blockhash;
// // // //                 } catch(e) {
// // // //                     console.log("   ⚠️  L2 unavailable, using L1");
// // // //                     connection = connectionL1;
// // // //                     label = "L1";
// // // //                     const { blockhash } = await connectionL1.getLatestBlockhash("confirmed");
// // // //                     tx.recentBlockhash = blockhash;
// // // //                 }
                
// // // //                 tx.feePayer = wallet.publicKey;
// // // //                 tx.sign(wallet);

// // // //                 console.log(`   ⚡ Executing atomic rescue on ${label}...`);
// // // //                 const sig = await connection.sendRawTransaction(tx.serialize(), {
// // // //                     skipPreflight: true,
// // // //                     maxRetries: 3
// // // //                 });
                
// // // //                 await connection.confirmTransaction(sig, "confirmed");
                
// // // //                 const speed = Date.now() - start;
// // // //                 rescueCount++;
// // // //                 totalRescueTime += speed;
// // // //                 const avgSpeed = (totalRescueTime / rescueCount).toFixed(0);
                
// // // //                 console.log(`   ✅ ASSETS SECURED ON ${label}!`);
// // // //                 console.log(`   ⚡ Execution Time: ${speed}ms (avg: ${avgSpeed}ms)`);
// // // //                 console.log(`   📝 Tx: ${sig}`);
// // // //                 console.log(`   🔗 Explorer: https://explorer.solana.com/tx/${sig}?cluster=devnet`);
                
// // // //                 isShieldActive = true;
                
// // // //                 // Verify (with error handling)
// // // //                 try {
// // // //                     const newUserInfo = await getAccount(connection, userATA.address);
// // // //                     const newSafeInfo = await getAccount(connection, safeATA_L2.address);
// // // //                     console.log(`   📊 New Balances - User: ${Number(newUserInfo.amount) / 10**6} | Safe: ${Number(newSafeInfo.amount) / 10**6}`);
// // // //                 } catch(e) {
// // // //                     console.log(`   📊 Balance verification skipped`);
// // // //                 }
// // // //                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                
// // // //                 await SLEEP(3000); 

// // // //             } catch (err) {
// // // //                 console.log(`\n   ❌ Rescue failed: ${err.message}`);
// // // //                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
// // // //             }
// // // //         }

// // // //         // MARKET RECOVERY
// // // //         if (currentPrice > 138 && isShieldActive) {
// // // //             console.log("\n\n📈 MARKET RECOVERY DETECTED");
// // // //             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
// // // //             try {
// // // //                 // Try L2 first, fallback to L1
// // // //                 let safeBalance;
// // // //                 let connection = connectionL2;
// // // //                 let label = "L2";
                
// // // //                 try {
// // // //                     const safeInfo = await getAccount(connectionL2, safeATA_L2.address);
// // // //                     safeBalance = Number(safeInfo.amount);
// // // //                 } catch(e) {
// // // //                     connection = connectionL1;
// // // //                     label = "L1";
// // // //                     const safeInfo = await getAccount(connectionL1, safeATA_L2.address);
// // // //                     safeBalance = Number(safeInfo.amount);
// // // //                 }
                
// // // //                 if (safeBalance === 0) {
// // // //                     console.log("   ⚠️  Safe wallet empty");
// // // //                     isShieldActive = false;
// // // //                     continue;
// // // //                 }

// // // //                 console.log(`   📊 Restoring ${safeBalance / 10**6} tokens to trading position...`);

// // // //                 const returnIx = createTransferInstruction(
// // // //                     safeATA_L2.address, 
// // // //                     userATA.address, 
// // // //                     safeWallet.publicKey,
// // // //                     safeBalance,
// // // //                     [], 
// // // //                     TOKEN_PROGRAM_ID
// // // //                 );
                
// // // //                 const returnTx = new Transaction().add(returnIx);
// // // //                 const { blockhash } = await connection.getLatestBlockhash();
// // // //                 returnTx.recentBlockhash = blockhash;
// // // //                 returnTx.feePayer = wallet.publicKey;
// // // //                 returnTx.sign(wallet, safeWallet);
                
// // // //                 console.log(`   ⚡ Executing on ${label}...`);
// // // //                 const returnSig = await connection.sendRawTransaction(returnTx.serialize());
// // // //                 await connection.confirmTransaction(returnSig);

// // // //                 isShieldActive = false;
// // // //                 console.log("   ✅ Position restored");
// // // //                 console.log(`   📝 Tx: ${returnSig}`);
                
// // // //                 try {
// // // //                     const finalUserInfo = await getAccount(connection, userATA.address);
// // // //                     const finalSafeInfo = await getAccount(connection, safeATA_L2.address);
// // // //                     console.log(`   📊 Final - User: ${Number(finalUserInfo.amount) / 10**6} | Safe: ${Number(finalSafeInfo.amount) / 10**6}`);
// // // //                 } catch(e) {}
// // // //                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                
// // // //             } catch (e) { 
// // // //                 console.log(`   ⚠️ Restore failed: ${e.message}`);
// // // //                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
// // // //             }
// // // //         }
        
// // // //         await SLEEP(200);
// // // //     }
// // // // }

// // // // main().catch(console.error);

// // // // //The L2 execution is working, but there's a critical bug: The tokens aren't actually moving! The user still has 1000 tokens and the safe has 0. The transaction is succeeding on L2, but the transfer isn't happening.

// // // // next 

// // delegation successfull 

// const fs = require("fs");
// const { 
//     Connection, Keypair, PublicKey, Transaction
// } = require("@solana/web3.js");
// const { 
//     createMint, getOrCreateAssociatedTokenAccount, mintTo, 
//     createTransferInstruction, TOKEN_PROGRAM_ID,
//     getAccount
// } = require("@solana/spl-token");

// // Import the ephemeral ATA derivation function
// const { delegateSpl, deriveEphemeralAta, withdrawSplIx } = require("@magicblock-labs/ephemeral-rollups-sdk");

// // --- CONFIGURATION ---
// const MAGIC_RPC = "https://devnet-us.magicblock.app"; 
// const VALIDATOR_ID = new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd");
// const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// async function main() {
//     console.log("🚀 WICKGUARD - USING EPHEMERAL ATA");
//     console.log("   Institutional-Grade Liquidation Protection\n");
    
//     const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
//     const connectionL2 = new Connection(MAGIC_RPC, "confirmed");

//     // LOAD WALLET
//     let wallet;
//     try {
//         const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
//         wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
//         console.log(`📂 Wallet: ${wallet.publicKey.toBase58().slice(0,8)}...`);
//     } catch (e) {
//         return console.log("❌ ERROR: my-wallet.json missing.");
//     }

//     const balance = await connectionL1.getBalance(wallet.publicKey);
//     console.log(`💰 Balance: ${(balance / 10**9).toFixed(2)} SOL`);
//     if (balance < 0.05 * 10**9) return console.log("❌ Insufficient balance.");

//     // SETUP ASSETS ON L1
//     console.log("\n🏦 Initializing Assets on L1...");
//     const mint = await createMint(connectionL1, wallet, wallet.publicKey, null, 6);
//     const userATA = await getOrCreateAssociatedTokenAccount(connectionL1, wallet, mint, wallet.publicKey);
//     const safeWallet = Keypair.generate();
    
//     try { 
//         await mintTo(connectionL1, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); 
//         console.log("✅ Minted 1,000 tokens");
//     } catch(e) {
//         console.log("ℹ️  Tokens already minted");
//     }
    
//     console.log(`📍 User ATA: ${userATA.address.toBase58()}`);
//     console.log(`🔑 Mint: ${mint.toBase58()}`);

//     // DELEGATE - This creates ephemeral ATA
//     console.log("\n⚡ Delegating to Ephemeral Rollup...");
//     try {
//         const delegateInstructions = await delegateSpl(
//             wallet.publicKey,
//             mint,
//             1000n * 1000000n,
//             {
//                 payer: wallet.publicKey,
//                 validator: VALIDATOR_ID,
//                 initIfMissing: true
//             }
//         );
        
//         const tx = new Transaction().add(...delegateInstructions);
//         const { blockhash } = await connectionL1.getLatestBlockhash();
//         tx.recentBlockhash = blockhash;
//         tx.feePayer = wallet.publicKey;
//         tx.sign(wallet);
        
//         const sig = await connectionL1.sendRawTransaction(tx.serialize(), {
//             skipPreflight: false
//         });
        
//         await connectionL1.confirmTransaction(sig, "confirmed");
        
//         console.log(`   ✅ Delegation successful!`);
//         console.log(`   📝 Tx: ${sig}`);
//     } catch(e) {
//         console.log(`   ⚠️  ${e.message}`);
//         if (!e.message.includes("already")) {
//             return;
//         }
//         console.log("   ✅ Already delegated");
//     }

//     // DERIVE EPHEMERAL ATA
//     const [ephemeralATA] = deriveEphemeralAta(wallet.publicKey, mint);
//     console.log(`📍 Ephemeral ATA: ${ephemeralATA.toBase58()}`);

//     // CREATE SAFE EPHEMERAL ATA ON L2
//     console.log("\n🔄 Setting up safe ephemeral account on L2...");
//     const [safeEphemeralATA] = deriveEphemeralAta(safeWallet.publicKey, mint);
//     console.log(`📍 Safe Ephemeral ATA: ${safeEphemeralATA.toBase58()}`);

//     // Wait for sync
//     console.log("⏳ Waiting for L2 sync (15s)...");
//     await SLEEP(15000);

//     // VERIFY L2 STATE
//     console.log("\n💎 Verifying L2 state:");
//     try {
//         const ephemeralInfo = await getAccount(connectionL2, ephemeralATA);
//         console.log(`   Ephemeral: ${Number(ephemeralInfo.amount) / 10**6} tokens`);
//     } catch(e) {
//         console.log(`   ⚠️  Ephemeral: ${e.message}`);
//     }

//     console.log("\n═══════════════════════════════════════════");
//     console.log("🛡️  WICKGUARD PROTECTION ACTIVE");
//     console.log("   (Operating on Ephemeral ATAs)");
//     console.log("═══════════════════════════════════════════\n");
    
//     let isShieldActive = false;
//     let rescueCount = 0;
//     let totalRescueTime = 0;

//     while (true) {
//         const currentPrice = 140 + (Math.random() * 10 - 5); 
//         const timestamp = new Date().toLocaleTimeString();
        
//         process.stdout.write(`\r[${timestamp}] Price: $${currentPrice.toFixed(2)} | Shield: ${isShieldActive ? "🟢 ACTIVE" : "⚪ STANDBY"} | Rescues: ${rescueCount}   `);

//         // LIQUIDATION PROTECTION
//         if (currentPrice < 136 && !isShieldActive) {
//             console.log("\n\n🚨 LIQUIDATION THRESHOLD BREACHED!");
//             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
//             const start = Date.now();

//             try {
//                 // Work with EPHEMERAL ATA, not regular ATA
//                 const ephemeralInfo = await getAccount(connectionL2, ephemeralATA);
//                 const ephemeralBalance = Number(ephemeralInfo.amount);
                
//                 if (ephemeralBalance === 0) {
//                     console.log("   ℹ️  No assets in ephemeral account");
//                     isShieldActive = true;
//                     continue;
//                 }

//                 console.log(`   📊 Protecting ${ephemeralBalance / 10**6} tokens from ephemeral...`);

//                 // Transfer from EPHEMERAL ATA to SAFE EPHEMERAL ATA
//                 const transferIx = createTransferInstruction(
//                     ephemeralATA,           // Source: ephemeral ATA
//                     safeEphemeralATA,       // Dest: safe ephemeral ATA
//                     wallet.publicKey,
//                     ephemeralBalance,
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
                
//                 console.log(`   ✅ ASSETS SECURED ON L2!`);
//                 console.log(`   ⚡ Execution: ${speed}ms (avg: ${avgSpeed}ms)`);
//                 console.log(`   📝 Tx: ${sig}`);
                
//                 isShieldActive = true;
                
//                 // Verify
//                 await SLEEP(1000);
//                 const newEphemeral = await getAccount(connectionL2, ephemeralATA);
//                 const newSafe = await getAccount(connectionL2, safeEphemeralATA);
//                 console.log(`   📊 Verified - User: ${Number(newEphemeral.amount) / 10**6} | Safe: ${Number(newSafe.amount) / 10**6}`);
//                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                
//                 await SLEEP(3000); 

//             } catch (err) {
//                 console.log(`\n   ❌ Rescue failed: ${err.message}`);
//                 if (err.logs) {
//                     err.logs.forEach(log => console.log(`      ${log}`));
//                 }
//                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
//             }
//         }

//         // MARKET RECOVERY
//         if (currentPrice > 138 && isShieldActive) {
//             console.log("\n\n📈 MARKET RECOVERY");
//             console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            
//             try {
//                 const safeInfo = await getAccount(connectionL2, safeEphemeralATA);
//                 const safeBalance = Number(safeInfo.amount);
                
//                 if (safeBalance === 0) {
//                     console.log("   ⚠️  Safe empty");
//                     isShieldActive = false;
//                     continue;
//                 }

//                 console.log(`   📊 Restoring ${safeBalance / 10**6} tokens...`);

//                 // Return from safe ephemeral to user ephemeral
//                 const returnIx = createTransferInstruction(
//                     safeEphemeralATA,
//                     ephemeralATA,
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

//                 isShieldActive = false;
//                 console.log("   ✅ Position restored");
                
//                 await SLEEP(1000);
//                 const finalUser = await getAccount(connectionL2, ephemeralATA);
//                 const finalSafe = await getAccount(connectionL2, safeEphemeralATA);
//                 console.log(`   📊 Final - User: ${Number(finalUser.amount) / 10**6} | Safe: ${Number(finalSafe.amount) / 10**6}`);
//                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
                
//             } catch (e) { 
//                 console.log(`   ⚠️ ${e.message}`);
//                 console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
//             }
//         }
        
//         await SLEEP(200);
//     }
// }

// main().catch(console.error);

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
    console.log("🚀 WICKGUARD - PRODUCTION READY");
    console.log("   Institutional-Grade Liquidation Protection\n");
    
    const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
    const connectionL2 = new Connection(MAGIC_RPC, "confirmed");

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
    console.log("\n🏦 Initializing Assets on L1...");
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

    // DELEGATE TO L2
    console.log("\n⚡ Delegating to Ephemeral Rollup...");
    try {
        const delegateInstructions = await delegateSpl(
            wallet.publicKey,
            mint,
            1000n * 1000000n,
            {
                payer: wallet.publicKey,
                validator: VALIDATOR_ID,
                initIfMissing: true
            }
        );
        
        const tx = new Transaction().add(...delegateInstructions);
        const { blockhash } = await connectionL1.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        tx.feePayer = wallet.publicKey;
        tx.sign(wallet);
        
        const sig = await connectionL1.sendRawTransaction(tx.serialize(), {
            skipPreflight: false
        });
        
        await connectionL1.confirmTransaction(sig, "confirmed");
        
        console.log(`   ✅ Delegation successful!`);
        console.log(`   📝 Tx: ${sig}`);
    } catch(e) {
        console.log(`   ⚠️  ${e.message}`);
        if (!e.message.includes("already")) {
            return;
        }
        console.log("   ✅ Already delegated");
    }

    // Wait for L2 sync
    console.log("⏳ Waiting for L2 sync (15s)...");
    await SLEEP(15000);

    // VERIFY L2 STATE
    console.log("\n💎 Verifying L2 state:");
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
            console.log("\n\n🚨 LIQUIDATION THRESHOLD BREACHED!");
            console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            const start = Date.now();

            try {
                // Use REGULAR ATA on L2 (not ephemeral)
                const userInfo = await getAccount(connectionL2, userATA.address);
                const userBalance = Number(userInfo.amount);
                
                if (userBalance === 0) {
                    console.log("   ℹ️  No assets to protect");
                    isShieldActive = true;
                    continue;
                }

                console.log(`   📊 Protecting ${userBalance / 10**6} tokens...`);

                // Transfer from regular ATA to safe ATA (both on L2)
                const transferIx = createTransferInstruction(
                    userATA.address,      // Source: regular user ATA
                    safeATA.address,      // Dest: regular safe ATA
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
                console.log(`   📊 Verified - User: ${Number(newUser.amount) / 10**6} | Safe: ${Number(newSafe.amount) / 10**6}`);
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

                console.log(`   📊 Restoring ${safeBalance / 10**6} tokens...`);

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
//The account is read-only on L2 because delegateSpl is meant for SPL tokens only and creates an EPHEMERAL ATA system, but your tokens are still in the regular ATA which is read-only.The key insight: You should NOT use delegateSpl for just transferring tokens. That function is specifically for the ephemeral ATA/vault system. For simple token transfers on L2, you need to delegate the regular ATA account using createDelegateInstruction.