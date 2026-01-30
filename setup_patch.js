const fs = require("fs");
const { Connection, Keypair, PublicKey, Transaction } = require("@solana/web3.js");
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require("@solana/spl-token");

// IMPORT SDK
const { delegateIx } = require("@magicblock-labs/ephemeral-rollups-sdk");

async function main() {
    console.log("🛠️  RUNNING PATCHED SETUP...");

    // 1. SETUP
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`   ✅ Wallet: ${wallet.publicKey.toBase58()}`);
    } catch (e) { return console.log("   ❌ Wallet missing."); }

    // 2. ASSETS
    console.log("   🏦 Checking Assets...");
    const mint = await createMint(connection, wallet, wallet.publicKey, null, 6);
    const userATA = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, wallet.publicKey);
    try { await mintTo(connection, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); } catch(e){}
    console.log(`   ✅ Token Account: ${userATA.address.toBase58()}`);

    // 3. GET VALIDATOR
    // We hardcode the one found in your previous run to save time
    const VALIDATOR_ID = new PublicKey("Gk38QXPf6xqSHoLG6eBnPih4b1BMFmSizEz8jGAA2spG");
    console.log(`   🎯 Validator: ${VALIDATOR_ID.toBase58()}`);

    // 4. BUILD & PATCH INSTRUCTION
    console.log("   ⚡ Patching Transaction...");
    
    try {
        // Generate the faulty instruction
        const ix = delegateIx(
            userATA.address,    // Account
            wallet.publicKey,   // Owner
            VALIDATOR_ID        // Validator
        );

        // --- THE SURGERY ---
        // Look through every account in the instruction.
        // If we find the Token Account, FORCE it to NOT be a signer.
        let patched = false;
        ix.keys.forEach((key) => {
            if (key.pubkey.equals(userATA.address)) {
                if (key.isSigner) {
                    console.log("   🔧 Found Bug: SDK wanted Token Account to sign.");
                    console.log("   🔧 FIXING: Setting isSigner = false");
                    key.isSigner = false; // <--- THE FIX
                    patched = true;
                }
            }
        });

        if (!patched) console.log("   ⚠️ Note: Token Account was not marked as signer (Bug might be elsewhere?)");

        const tx = new Transaction().add(ix);
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx.feePayer = wallet.publicKey;
        tx.sign(wallet); // Only the WALLET signs now

        console.log("   ⏳ Sending Patched Transaction...");
        const sig = await connection.sendRawTransaction(tx.serialize());
        await connection.confirmTransaction(sig, "confirmed");

        console.log("   ✅ SUCCESS! Account Delegated.");
        
        fs.writeFileSync("config.json", JSON.stringify({
            mint: mint.toBase58(),
            ata: userATA.address.toBase58(),
            validator: VALIDATOR_ID.toBase58()
        }));
        console.log("   ✅ Config Saved.");

    } catch (e) {
        console.log("   ❌ Failed:", e.message);
    }
}

main();