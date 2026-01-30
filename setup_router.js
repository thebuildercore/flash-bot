// const fs = require("fs");
// const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
// const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require("@solana/spl-token");

// // IMPORT THE ROUTER SDK
// const { getClosestValidator, delegateAccount } = require("magic-router-sdk");

// async function main() {
//     console.log("🛠️  RUNNING SETUP (VIA MAGIC ROUTER)...");

//     // 1. SETUP
//     const connection = new Connection("https://api.devnet.solana.com", "confirmed");
//     let wallet;
//     try {
//         const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
//         wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
//         console.log(`   ✅ Wallet Loaded: ${wallet.publicKey.toBase58()}`);
//     } catch (e) {
//         return console.log("   ❌ Error: my-wallet.json not found.");
//     }

//     // 2. ASSETS
//     console.log("   🏦 Checking Assets...");
//     const mint = await createMint(connection, wallet, wallet.publicKey, null, 6);
//     const userATA = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, wallet.publicKey);
//     try { await mintTo(connection, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); } catch(e){}
//     console.log(`   ✅ Token Account: ${userATA.address.toBase58()}`);

//     // 3. DELEGATE (Using Router SDK)
//     console.log("   ⚡ Finding Validator & Delegating...");
//     try {
//         // Auto-detect the best validator for this connection
//         const validator = await getClosestValidator(connection);
//         console.log(`   🎯 Target Validator: ${validator.toBase58()}`);

//         // Delegate!
//         const txId = await delegateAccount(
//             connection,
//             wallet,             // Payer
//             userATA.address,    // Account to delegate
//             validator,          // Validator
//             { commitment: "confirmed" }
//         );

//         console.log("   ✅ SUCCESS! Account Delegated.");
//         console.log(`   📝 Tx: ${txId}`);

//         // Save Config
//         fs.writeFileSync("config.json", JSON.stringify({
//             mint: mint.toBase58(),
//             ata: userATA.address.toBase58(),
//             validator: validator.toBase58() // Save this for the bot
//         }));
//         console.log("   ✅ Config saved to 'config.json'");

//     } catch (e) {
//         console.log("   ❌ Setup Failed:", e.message);
//         // If it says "Already delegated", we treat it as success!
//         if (e.message.includes("already")) {
//              fs.writeFileSync("config.json", JSON.stringify({
//                 mint: mint.toBase58(),
//                 ata: userATA.address.toBase58(),
//                 validator: "MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd" // Default US
//             }));
//             console.log("   ✅ Config saved (Account was already ready).");
//         }
//     }
// }

// main();
const fs = require("fs");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require("@solana/spl-token");

async function main() {
    console.log("🛠️  RUNNING SETUP (VIA MAGIC ROUTER)...");

    // --- FIX: DYNAMIC IMPORT (Bypasses the Error) ---
    // We load the SDK here instead of at the top
    const { getClosestValidator, delegateAccount } = await import("magic-router-sdk");
    // ------------------------------------------------

    // 1. SETUP
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`   ✅ Wallet Loaded: ${wallet.publicKey.toBase58()}`);
    } catch (e) {
        return console.log("   ❌ Error: my-wallet.json not found.");
    }

    // 2. ASSETS
    console.log("   🏦 Checking Assets...");
    const mint = await createMint(connection, wallet, wallet.publicKey, null, 6);
    const userATA = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, wallet.publicKey);
    try { await mintTo(connection, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); } catch(e){}
    console.log(`   ✅ Token Account: ${userATA.address.toBase58()}`);

    // 3. DELEGATE
    console.log("   ⚡ Finding Validator & Delegating...");
    try {
        const validator = await getClosestValidator(connection);
        console.log(`   🎯 Target Validator: ${validator.toBase58()}`);

        const txId = await delegateAccount(
            connection,
            wallet,             // Payer
            userATA.address,    // Account to delegate
            validator,          // Validator
            { commitment: "confirmed" }
        );

        console.log("   ✅ SUCCESS! Account Delegated.");
        console.log(`   📝 Tx: ${txId}`);

        // Save Config for the Bot
        fs.writeFileSync("config.json", JSON.stringify({
            mint: mint.toBase58(),
            ata: userATA.address.toBase58(),
            validator: validator.toBase58()
        }));
        console.log("   ✅ Config saved to 'config.json'");

    } catch (e) {
        console.log("   ❌ Setup Failed:", e.message);
        if (e.message.includes("already")) {
             fs.writeFileSync("config.json", JSON.stringify({
                mint: mint.toBase58(),
                ata: userATA.address.toBase58(),
                validator: "MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd"
            }));
            console.log("   ✅ Config saved (Account was already ready).");
        }
    }
}

main();