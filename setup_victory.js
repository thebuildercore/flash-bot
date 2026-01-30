const fs = require("fs");
const { 
    Connection, Keypair, PublicKey, Transaction, SystemProgram 
} = require("@solana/web3.js");
const { 
    createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID 
} = require("@solana/spl-token");

// IMPORT SDK CONSTANTS & HELPERS
const { 
    createDelegateInstruction, 
    DELEGATION_PROGRAM_ID,
    MAGIC_CONTEXT_ID,
    delegationRecordPdaFromDelegatedAccount,
    commitStatePdaFromDelegatedAccount
} = require("@magicblock-labs/ephemeral-rollups-sdk");

async function main() {
    console.log("🛠️  RUNNING VICTORY SETUP...");

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    // 1. SETUP WALLET
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`   ✅ Wallet: ${wallet.publicKey.toBase58()}`);
    } catch (e) { return console.log("   ❌ Error: my-wallet.json missing."); }

    // 2. CREATE FRESH ASSETS
    console.log("   🏦 Creating Assets...");
    const mint = await createMint(connection, wallet, wallet.publicKey, null, 6);
    const userATA = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, wallet.publicKey);
    try { await mintTo(connection, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); } catch(e){}
    console.log(`   ✅ Token Account: ${userATA.address.toBase58()}`);

    // 3. CALCULATE ADDRESSES
    const VALIDATOR_ID = new PublicKey("Gk38QXPf6xqSHoLG6eBnPih4b1BMFmSizEz8jGAA2spG");

    const delegationRecord = delegationRecordPdaFromDelegatedAccount(
        userATA.address, 
        DELEGATION_PROGRAM_ID
    );

    const commitState = commitStatePdaFromDelegatedAccount(
        userATA.address, 
        DELEGATION_PROGRAM_ID
    );

    const [buffer] = PublicKey.findProgramAddressSync(
        [Buffer.from("buffer"), userATA.address.toBuffer(), VALIDATOR_ID.toBuffer()],
        DELEGATION_PROGRAM_ID
    );

    console.log("   ⚡ Constructing Instruction...");

    try {
        const ix = createDelegateInstruction({
            payer: wallet.publicKey,
            account: userATA.address,
            owner: wallet.publicKey,
            buffer: buffer,
            delegationRecord: delegationRecord,
            commitState: commitState,
            magicContext: MAGIC_CONTEXT_ID,
            delegationProgram: DELEGATION_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            validator: VALIDATOR_ID,
            
            // --- THE CRITICAL FIX ---
            // The SDK needs BOTH of these to be set to the Token Program ID
            tokenProgram: TOKEN_PROGRAM_ID, 
            ownerProgram: TOKEN_PROGRAM_ID, // <--- This prevents the 'toBytes' crash
            // ------------------------
        });

        const tx = new Transaction().add(ix);
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx.feePayer = wallet.publicKey;
        tx.sign(wallet);

        console.log("   ⏳ Sending Transaction...");
        const sig = await connection.sendRawTransaction(tx.serialize());
        await connection.confirmTransaction(sig, "confirmed");

        console.log("   ✅ SUCCESS! Account Delegated.");
        
        fs.writeFileSync("config.json", JSON.stringify({
            mint: mint.toBase58(),
            ata: userATA.address.toBase58(),
            validator: VALIDATOR_ID.toBase58()
        }));
        console.log("   ✅ Config saved. NOW RUN BOT.JS!");

    } catch (e) {
        console.log("   ❌ Failed:", e.message);
        if (e.logs) console.log(e.logs);
    }
}

main();