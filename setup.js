const fs = require("fs");
const { 
    Connection, Keypair, PublicKey, Transaction, SystemProgram 
} = require("@solana/web3.js");
const { 
    createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID 
} = require("@solana/spl-token");

// IMPORT SDK
const { 
    createDelegateInstruction, 
    DELEGATION_PROGRAM_ID 
} = require("@magicblock-labs/ephemeral-rollups-sdk");

// CONFIGURATION
const VALIDATOR_ID = new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd");

async function main() {
    console.log("🛠️  RUNNING DELEGATION SETUP (FIXED)...");

    // 1. SETUP CONNECTION
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`   ✅ Wallet Loaded: ${wallet.publicKey.toBase58()}`);
    } catch (e) {
        return console.log("   ❌ Error: my-wallet.json not found.");
    }

    // 2. PREPARE ASSETS
    console.log("   🏦 Checking Assets...");
    const mint = await createMint(connection, wallet, wallet.publicKey, null, 6);
    const userATA = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, wallet.publicKey);
    try { await mintTo(connection, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); } catch(e){}
    console.log(`   ✅ Token Account: ${userATA.address.toBase58()}`);

    // 3. FORCE DELEGATION
    console.log("   ⚡ Delegating Account...");
    
    try {
        // --- FIX: PASS 'ownerProgram' instead of 'tokenProgram' ---
        // The SDK uses this ID to derive the PDA. If it's missing, it crashes.
        const ix = createDelegateInstruction({
            account: userATA.address,       // The account to delegate
            owner: wallet.publicKey,        // The user's wallet
            payer: wallet.publicKey,        // Who pays the fee
            validator: VALIDATOR_ID,        // MagicBlock Validator
            
            // CRITICAL FIXES HERE:
            ownerProgram: TOKEN_PROGRAM_ID, // Renamed from 'tokenProgram'
            delegationProgram: DELEGATION_PROGRAM_ID, // Explicitly pass this
            systemProgram: SystemProgram.programId, 
        });

        const tx = new Transaction().add(ix);
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx.feePayer = wallet.publicKey;
        tx.sign(wallet);

        const sig = await connection.sendRawTransaction(tx.serialize());
        console.log("   ⏳ Sending Transaction...");
        await connection.confirmTransaction(sig, "confirmed");
        
        console.log("   ✅ SUCCESS: DELEGATION COMPLETE!");
        console.log("   ------------------------------------------------");
        
        // Save config
        fs.writeFileSync("config.json", JSON.stringify({
            mint: mint.toBase58(),
            ata: userATA.address.toBase58()
        }));
        console.log("   ✅ Config saved. You are ready to run bot.js");

    } catch (e) {
        console.log("\n   ❌ Setup Failed:", e.message);
        console.log("   (If this fails, please show me the error message again)");
    }
}

main();