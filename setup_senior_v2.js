const fs = require("fs");
const { 
    Connection, Keypair, PublicKey, Transaction, SystemProgram, TransactionInstruction 
} = require("@solana/web3.js");
const { 
    createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID 
} = require("@solana/spl-token");

// 1. IMPORT TRUTH FROM SDK

const { DELEGATION_PROGRAM_ID } = require("@magicblock-labs/ephemeral-rollups-sdk");

async function main() {
    console.log("🛠️  RUNNING SENIOR SETUP V2 (INTEGRITY CHECK)...");
    
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    // 2. DIAGNOSTIC: CHECK THE PROGRAM ID
    console.log("   🔍 Inspecting Program ID...");
    console.log(`   🎯 Target Program ID: ${DELEGATION_PROGRAM_ID.toBase58()}`);

    const programInfo = await connection.getAccountInfo(DELEGATION_PROGRAM_ID);
    if (!programInfo) {
        console.log("   ❌ FATAL ERROR: The Program ID does not exist on Devnet.");
        console.log("      Your SDK might be pointing to Localnet or Mainnet.");
        console.log("      WE CANNOT PROCEED with this ID.");
        return;
    } else {
        console.log("   ✅ Program found! (Executable: " + programInfo.executable + ")");
    }

    // 3. SETUP WALLET
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`   ✅ Wallet: ${wallet.publicKey.toBase58()}`);
    } catch (e) { return console.log("   ❌ Error: my-wallet.json missing."); }

    // 4. CREATE ASSETS
    console.log("   🏦 Creating Assets...");
    const mint = await createMint(connection, wallet, wallet.publicKey, null, 6);
    const userATA = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, wallet.publicKey);
    try { await mintTo(connection, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); } catch(e){}
    console.log(`   ✅ Token Account: ${userATA.address.toBase58()}`);

    // 5. MANUAL PDA CALCULATION (Matching Source Code EXACTLY)
    const VALIDATOR_ID = new PublicKey("Gk38QXPf6xqSHoLG6eBnPih4b1BMFmSizEz8jGAA2spG");

    // A. Delegation Record
    const [delegationRecord] = PublicKey.findProgramAddressSync(
        [Buffer.from("delegation"), userATA.address.toBuffer()],
        DELEGATION_PROGRAM_ID
    );

    // B. Delegation Metadata
    const [delegationMetadata] = PublicKey.findProgramAddressSync(
        [Buffer.from("delegation_metadata"), userATA.address.toBuffer()],
        DELEGATION_PROGRAM_ID
    );

    // C. Delegate Buffer (Source Code: uses ownerProgram/TokenProgram, NOT validator)
    const [delegateBuffer] = PublicKey.findProgramAddressSync(
        [Buffer.from("buffer"), userATA.address.toBuffer(), TOKEN_PROGRAM_ID.toBuffer()],
        DELEGATION_PROGRAM_ID
    );

    console.log("   ⚡ PDAs Calculated.");

    // 6. BUILD INSTRUCTION (Manual)
    // Discriminator [0...0] + CommitFreq + SeedsLen + Validator
    const bufferSize = 1024;
    const dataBuffer = Buffer.alloc(bufferSize);
    let offset = 0;

    // Discriminator (8 bytes of 0)
    for (let i = 0; i < 8; i++) dataBuffer[offset++] = 0;

    // Commit Frequency (u32 max)
    dataBuffer.writeUInt32LE(0xffffffff, offset);
    offset += 4;

    // Seeds Length (0)
    dataBuffer.writeUInt32LE(0, offset);
    offset += 4;

    // Validator (Option<Pubkey>)
    dataBuffer[offset++] = 1; // Some
    dataBuffer.set(VALIDATOR_ID.toBuffer(), offset);
    offset += 32;

    const finalData = dataBuffer.subarray(0, offset);

    // 7. BUILD TRANSACTION
    console.log("   ⚡ Building Transaction...");
    const ix = new TransactionInstruction({
        programId: DELEGATION_PROGRAM_ID,
        keys: [
            // Matches Source Code Order EXACTLY
            { pubkey: wallet.publicKey, isWritable: true, isSigner: true },
            { pubkey: userATA.address, isWritable: true, isSigner: false }, // FIXED: Not Signer
            { pubkey: TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
            { pubkey: delegateBuffer, isWritable: true, isSigner: false },
            { pubkey: delegationRecord, isWritable: true, isSigner: false },
            { pubkey: delegationMetadata, isWritable: true, isSigner: false },
            { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
        ],
        data: finalData
    });

    try {
        const tx = new Transaction().add(ix);
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx.feePayer = wallet.publicKey;
        tx.sign(wallet);

        console.log("   ⏳ Sending...");
        const sig = await connection.sendRawTransaction(tx.serialize());
        console.log("   📝 Signature:", sig);
        
        await connection.confirmTransaction(sig, "confirmed");
        console.log("   ✅ SUCCESS! Account Delegated.");
        
        fs.writeFileSync("config.json", JSON.stringify({
            mint: mint.toBase58(),
            ata: userATA.address.toBase58(),
            validator: VALIDATOR_ID.toBase58()
        }));
        console.log("   ✅ Config Saved. RUN BOT.JS!");

    } catch (e) {
        console.log("   ❌ FAILED.");
        if (e.message.includes("does not exist")) {
             console.log("   🔎 DIAGNOSIS: The SDK Program ID is wrong for Devnet.");
        } else {
             console.log("   Error:", e.message);
             if (e.logs) console.log(e.logs);
        }
    }
}

main();
