// const fs = require("fs");
// const fetch = require("cross-fetch");
// const { 
//     Connection, Keypair, PublicKey, Transaction
// } = require("@solana/web3.js");
// const { 
//     createMint, 
//     getOrCreateAssociatedTokenAccount, 
//     mintTo,
//     getAccount
// } = require("@solana/spl-token");
// const { delegateSpl } = require("@magicblock-labs/ephemeral-rollups-sdk");
// const config = require("./config");

// const SLEEP = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// async function main() {
//     console.log("╔════════════════════════════════════════════════════════════╗");
//     console.log("║             WICKGUARD VAULT SETUP                          ║");
//     console.log("╚════════════════════════════════════════════════════════════╝\n");
    
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
//         console.log(`📂 Wallet: ${wallet.publicKey.toBase58()}`);
//     } catch (e) {
//         return console.log("❌ ERROR: my-wallet.json missing.");
//     }

//     const balance = await connectionL1.getBalance(wallet.publicKey);
//     console.log(`💰 Balance: ${(balance / 10**9).toFixed(2)} SOL\n`);
//     if (balance < 0.1 * 10**9) return console.log("❌ Need at least 0.1 SOL");

//     // Step 1: Create or load mint
//     console.log("🔧 Step 1: Creating/Loading Token Mint...");
//     let mint, mintData;
    
//     // Check if we have saved mint data
//     if (fs.existsSync('./vault-config.json')) {
//         const saved = JSON.parse(fs.readFileSync('./vault-config.json', 'utf-8'));
//         mint = new PublicKey(saved.mint);
//         console.log(`✅ Using existing mint: ${mint.toBase58()}`);
//     } else {
//         mint = await createMint(
//             connectionL1, 
//             wallet, 
//             wallet.publicKey, 
//             null, 
//             6  // 6 decimals
//         );
//         console.log(`✅ Created new mint: ${mint.toBase58()}`);
//     }

//     // Step 2: Create vault keypair
//     console.log("\n🔧 Step 2: Creating Vault...");
//     let vaultKeypair;
    
//     if (fs.existsSync('./vault-keypair.json')) {
//         const vaultSecret = JSON.parse(fs.readFileSync('./vault-keypair.json', 'utf-8'));
//         vaultKeypair = Keypair.fromSecretKey(new Uint8Array(vaultSecret));
//         console.log(`✅ Using existing vault: ${vaultKeypair.publicKey.toBase58()}`);
//     } else {
//         vaultKeypair = Keypair.generate();
//         fs.writeFileSync('./vault-keypair.json', JSON.stringify(Array.from(vaultKeypair.secretKey)));
//         console.log(`✅ Created new vault: ${vaultKeypair.publicKey.toBase58()}`);
//     }

//     // Step 3: Create vault token account
//     console.log("\n🔧 Step 3: Creating Vault Token Account...");
//     const vaultATA = await getOrCreateAssociatedTokenAccount(
//         connectionL1, 
//         wallet, 
//         mint, 
//         vaultKeypair.publicKey
//     );
//     console.log(`✅ Vault ATA: ${vaultATA.address.toBase58()}`);

//     // Step 4: Delegate vault to L2
//     console.log("\n🔧 Step 4: Delegating Vault to L2...");
//     try {
//         const delegateVaultIx = await delegateSpl(
//             vaultKeypair.publicKey,
//             mint,
//             0n,
//             {
//                 payer: wallet.publicKey,
//                 validator: config.VALIDATOR_ID,
//                 initIfMissing: true
//             }
//         );
        
//         const vaultTx = new Transaction().add(...delegateVaultIx);
//         const { blockhash } = await connectionL1.getLatestBlockhash();
//         vaultTx.recentBlockhash = blockhash;
//         vaultTx.feePayer = wallet.publicKey;
//         vaultTx.sign(wallet, vaultKeypair);
        
//         const vaultSig = await connectionL1.sendRawTransaction(vaultTx.serialize(), {
//             skipPreflight: false
//         });
//         await connectionL1.confirmTransaction(vaultSig, "confirmed");
//         console.log(`✅ Vault delegated to L2!`);
//         console.log(`   Tx: ${vaultSig}`);
//     } catch(e) {
//         if (e.message.includes("already")) {
//             console.log("✅ Vault already delegated to L2");
//         } else {
//             console.log(`❌ Error: ${e.message}`);
//             return;
//         }
//     }

//     // Step 5: Wait for L2 sync
//     console.log("\n⏳ Waiting for L2 sync (15s)...");
//     await SLEEP(15000);

//     // Step 6: Verify on L2
//     console.log("\n🔍 Verifying on L2...");
//     try {
//         const vaultInfo = await getAccount(connectionL2, vaultATA.address);
//         console.log(`✅ Vault visible on L2`);
//         console.log(`   Balance: ${Number(vaultInfo.amount) / 10**6} tokens`);
//     } catch(e) {
//         console.log(`⚠️  Warning: ${e.message}`);
//     }

//     // Step 7: Save configuration
//     console.log("\n💾 Saving configuration...");
//     const vaultConfig = {
//         mint: mint.toBase58(),
//         vaultPubkey: vaultKeypair.publicKey.toBase58(),
//         vaultATA: vaultATA.address.toBase58(),
//         createdAt: new Date().toISOString()
//     };
    
//     fs.writeFileSync('./vault-config.json', JSON.stringify(vaultConfig, null, 2));
//     console.log(`✅ Configuration saved to vault-config.json`);

//     // Step 8: Display summary
//     console.log("\n╔════════════════════════════════════════════════════════════╗");
//     console.log("║                   VAULT SETUP COMPLETE                     ║");
//     console.log("╚════════════════════════════════════════════════════════════╝");
//     console.log("\n📋 Vault Information:");
//     console.log(`   Mint:       ${mint.toBase58()}`);
//     console.log(`   Vault:      ${vaultKeypair.publicKey.toBase58()}`);
//     console.log(`   Vault ATA:  ${vaultATA.address.toBase58()}`);
//     console.log(`   Status:     ✅ Delegated to L2`);
//     console.log("\n🚀 Next Steps:");
//     console.log("   1. Copy these values to bot.js (or it will auto-load)");
//     console.log("   2. Run: node bot.js");
//     console.log("   3. Bot will connect to this vault automatically\n");
// }

// main().catch(console.error);

const fs = require("fs");
const fetch = require("cross-fetch");
const { 
    Connection, Keypair, PublicKey, Transaction
} = require("@solana/web3.js");
const { 
    createMint, 
    getOrCreateAssociatedTokenAccount, 
    mintTo,
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

async function main() {
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║             WICKGUARD VAULT SETUP                          ║");
    console.log("╚════════════════════════════════════════════════════════════╝\n");
    
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
        logWithTime(`📂 Wallet: ${wallet.publicKey.toBase58()}`);
    } catch (e) {
        return logWithTime("❌ ERROR: my-wallet.json missing.");
    }

    const balance = await connectionL1.getBalance(wallet.publicKey);
    logWithTime(`💰 Balance: ${(balance / 10**9).toFixed(2)} SOL\n`);
    if (balance < 0.1 * 10**9) return logWithTime("❌ Need at least 0.1 SOL");

    // Step 1: Create or load mint
    logWithTime("🔧 Step 1: Creating/Loading Token Mint...");
    let mint, mintData;
    
    // Check if we have saved mint data
    if (fs.existsSync('./vault-config.json')) {
        const saved = JSON.parse(fs.readFileSync('./vault-config.json', 'utf-8'));
        mint = new PublicKey(saved.mint);
        logWithTime(`✅ Using existing mint: ${mint.toBase58()}`);
    } else {
        mint = await createMint(
            connectionL1, 
            wallet, 
            wallet.publicKey, 
            null, 
            6  // 6 decimals
        );
        logWithTime(`✅ Created new mint: ${mint.toBase58()}`);
    }

    // Step 2: Create vault keypair
    console.log("");
    logWithTime("🔧 Step 2: Creating Vault...");
    let vaultKeypair;
    
    if (fs.existsSync('./vault-keypair.json')) {
        const vaultSecret = JSON.parse(fs.readFileSync('./vault-keypair.json', 'utf-8'));
        vaultKeypair = Keypair.fromSecretKey(new Uint8Array(vaultSecret));
        logWithTime(`✅ Using existing vault: ${vaultKeypair.publicKey.toBase58()}`);
    } else {
        vaultKeypair = Keypair.generate();
        fs.writeFileSync('./vault-keypair.json', JSON.stringify(Array.from(vaultKeypair.secretKey)));
        logWithTime(`✅ Created new vault: ${vaultKeypair.publicKey.toBase58()}`);
    }

    // Step 3: Create vault token account
    console.log("");
    logWithTime("🔧 Step 3: Creating Vault Token Account...");
    const vaultATA = await getOrCreateAssociatedTokenAccount(
        connectionL1, 
        wallet, 
        mint, 
        vaultKeypair.publicKey
    );
    logWithTime(`✅ Vault ATA: ${vaultATA.address.toBase58()}`);

    // Step 4: Delegate vault to L2
    console.log("");
    logWithTime("🔧 Step 4: Delegating Vault to L2...");
    try {
        const delegateVaultIx = await delegateSpl(
            vaultKeypair.publicKey,
            mint,
            0n,
            {
                payer: wallet.publicKey,
                validator: config.VALIDATOR_ID,
                initIfMissing: true
            }
        );
        
        const vaultTx = new Transaction().add(...delegateVaultIx);
        const { blockhash } = await connectionL1.getLatestBlockhash();
        vaultTx.recentBlockhash = blockhash;
        vaultTx.feePayer = wallet.publicKey;
        vaultTx.sign(wallet, vaultKeypair);
        
        const vaultSig = await connectionL1.sendRawTransaction(vaultTx.serialize(), {
            skipPreflight: false
        });
        await connectionL1.confirmTransaction(vaultSig, "confirmed");
        logWithTime(`✅ Vault delegated to L2!`);
        logWithTime(`   Tx: ${vaultSig}`);
    } catch(e) {
        if (e.message.includes("already")) {
            logWithTime("✅ Vault already delegated to L2");
        } else {
            logWithTime(`❌ Error: ${e.message}`);
            return;
        }
    }

    // Step 5 & 6: Polling for L2 sync (Replaces the 15s hardcoded wait)
    console.log("");
    logWithTime("⏳ Waiting for L2 sync... (Polling L2 RPC)");
    
    const syncStartTime = Date.now();
    let isSynced = false;
    let vaultInfo;

    while (!isSynced) {
        try {
            vaultInfo = await getAccount(connectionL2, vaultATA.address);
            isSynced = true; // If this succeeds, the account is visible on L2!
        } catch(e) {
            // Not visible yet, wait 500ms and check again
            await SLEEP(500);
        }

        // Safety timeout (stops after 30 seconds just in case L2 is down)
        if (Date.now() - syncStartTime > 30000) {
            logWithTime("⚠️ Timeout: Vault not visible on L2 after 30 seconds.");
            break;
        }
    }

    if (isSynced) {
        const timeTaken = ((Date.now() - syncStartTime) / 1000).toFixed(2);
        logWithTime(`🔍 Verifying on L2...`);
        logWithTime(`✅ Vault visible on L2 (Exact sync time: ${timeTaken} seconds)`);
        logWithTime(`   Balance: ${Number(vaultInfo.amount) / 10**6} tokens`);
    }

    // Step 7: Save configuration
    console.log("");
    logWithTime("💾 Saving configuration...");
    const vaultConfig = {
        mint: mint.toBase58(),
        vaultPubkey: vaultKeypair.publicKey.toBase58(),
        vaultATA: vaultATA.address.toBase58(),
        createdAt: new Date().toISOString()
    };
    
    fs.writeFileSync('./vault-config.json', JSON.stringify(vaultConfig, null, 2));
    logWithTime(`✅ Configuration saved to vault-config.json`);

    // Step 8: Display summary
    console.log("\n╔════════════════════════════════════════════════════════════╗");
    console.log("║                   VAULT SETUP COMPLETE                     ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log("\n📋 Vault Information:");
    console.log(`   Mint:       ${mint.toBase58()}`);
    console.log(`   Vault:      ${vaultKeypair.publicKey.toBase58()}`);
    console.log(`   Vault ATA:  ${vaultATA.address.toBase58()}`);
    console.log(`   Status:     ✅ Delegated to L2`);
    console.log("\n🚀 Next Steps:");
    console.log("   1. Copy these values to bot.js (or it will auto-load)");
    console.log("   2. Run: node bot.js");
    console.log("   3. Bot will connect to this vault automatically\n");
}

main().catch(console.error);