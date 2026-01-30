const fs = require("fs");
const { 
    Connection, Keypair, PublicKey, Transaction 
} = require("@solana/web3.js");
const { 
    createMint, getOrCreateAssociatedTokenAccount, mintTo 
} = require("@solana/spl-token");

// 1. IMPORT BOTH SDKS
// We use dynamic import for Router to avoid "Require ESM" error
// We use require for Rollups SDK as it works fine
const { 
    delegateIx, 
    DELEGATION_PROGRAM_ID 
} = require("@magicblock-labs/ephemeral-rollups-sdk");

async function main() {
    console.log("🛠️  RUNNING FINAL SETUP (MANUAL INSTRUCTION)...");

    // 2. LOAD ROUTER SDK (Dynamically)
    const { getClosestValidator } = await import("magic-router-sdk");

    // 3. SETUP
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`   ✅ Wallet: ${wallet.publicKey.toBase58()}`);
    } catch (e) { return console.log("   ❌ Wallet missing."); }

    // 4. ASSETS
    console.log("   🏦 Preparing Assets...");
    const mint = await createMint(connection, wallet, wallet.publicKey, null, 6);
    const userATA = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, wallet.publicKey);
    try { await mintTo(connection, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); } catch(e){}
    console.log(`   ✅ Token Account: ${userATA.address.toBase58()}`);

    // 5. GET VALIDATOR
    console.log("   🔍 Finding Validator...");
    const validator = await getClosestValidator(connection);
    console.log(`   🎯 Validator: ${validator.toBase58()}`);

    // 6. BUILD INSTRUCTION MANUALLY
    // We use delegateIx. Based on the SDK structure, it likely takes:
    // (delegatedAccount, owner, validator, ...)
    console.log("   ⚡ Building Delegation Transaction...");
    
    try {
        // Attempt 1: The most standard signature for delegateIx
        const ix = delegateIx(
            userATA.address,    // Account
            wallet.publicKey,   // Owner
            validator           // Validator
        );

        const tx = new Transaction().add(ix);
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx.feePayer = wallet.publicKey;
        tx.sign(wallet);

        console.log("   ⏳ Sending...");
        const sig = await connection.sendRawTransaction(tx.serialize());
        await connection.confirmTransaction(sig, "confirmed");

        console.log("   ✅ SUCCESS! Account Delegated to Rollup.");
        
        fs.writeFileSync("config.json", JSON.stringify({
            mint: mint.toBase58(),
            ata: userATA.address.toBase58(),
            validator: validator.toBase58()
        }));
        console.log("   ✅ Config Saved.");

    } catch (e) {
        console.log("   ❌ Attempt 1 Failed:", e.message);
        
        // If Attempt 1 failed, we try Attempt 2 (Different arg order?)
        // Some versions use (account, validator, owner)
        try {
            console.log("   🔄 Trying Alternate Argument Order...");
            const ix = delegateIx(
                userATA.address,
                validator,
                wallet.publicKey
            );
            const tx = new Transaction().add(ix);
            tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            tx.feePayer = wallet.publicKey;
            tx.sign(wallet);
            const sig = await connection.sendRawTransaction(tx.serialize());
            await connection.confirmTransaction(sig, "confirmed");
            console.log("   ✅ SUCCESS! (Alternate Order Worked)");
            
            fs.writeFileSync("config.json", JSON.stringify({
                mint: mint.toBase58(),
                ata: userATA.address.toBase58(),
                validator: validator.toBase58()
            }));

        } catch (e2) {
            console.log("   ❌ All Attempts Failed.");
            console.log("   Debug Info:", e2.message);
        }
    }
}

main();