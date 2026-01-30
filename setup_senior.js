const fs = require("fs");
const { 
    Connection, Keypair, PublicKey, Transaction, SystemProgram, TransactionInstruction 
} = require("@solana/web3.js");
const { 
    createMint, getOrCreateAssociatedTokenAccount, mintTo, TOKEN_PROGRAM_ID 
} = require("@solana/spl-token");

// CONSTANTS FROM SDK
const DELEGATION_PROGRAM_ID = new PublicKey("Dc2mkg8Sj441edP272b1j66k8aNdf9T86c2P7V5V4K2K");

async function main() {
    console.log("🛠️  RUNNING SENIOR ENGINEER SETUP...");
    console.log("   (Replicating Source Code Logic + Patching Bugs)");

    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    // 1. SETUP WALLET
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`   ✅ Wallet: ${wallet.publicKey.toBase58()}`);
    } catch (e) { return console.log("   ❌ Error: my-wallet.json missing."); }

    // 2. CREATE ASSETS
    console.log("   🏦 Creating Assets...");
    const mint = await createMint(connection, wallet, wallet.publicKey, null, 6);
    const userATA = await getOrCreateAssociatedTokenAccount(connection, wallet, mint, wallet.publicKey);
    try { await mintTo(connection, wallet, mint, userATA.address, wallet.publicKey, 1000 * 10**6); } catch(e){}
    console.log(`   ✅ Token Account: ${userATA.address.toBase58()}`);

    // 3. MANUAL PDA CALCULATION (Matching your Source Code)
    const VALIDATOR_ID = new PublicKey("Gk38QXPf6xqSHoLG6eBnPih4b1BMFmSizEz8jGAA2spG");

    // A. Delegation Record: ["delegation", account]
    const [delegationRecord] = PublicKey.findProgramAddressSync(
        [Buffer.from("delegation"), userATA.address.toBuffer()],
        DELEGATION_PROGRAM_ID
    );

    // B. Delegation Metadata: ["delegation_metadata", account] (Inferred from your code)
    const [delegationMetadata] = PublicKey.findProgramAddressSync(
        [Buffer.from("delegation_metadata"), userATA.address.toBuffer()],
        DELEGATION_PROGRAM_ID
    );

    // C. Delegate Buffer: ["buffer", account, OWNER_PROGRAM] <-- THIS WAS THE KEY!
    // Your source code uses 'accounts.ownerProgram' (Token Program) not Validator!
    const [delegateBuffer] = PublicKey.findProgramAddressSync(
        [Buffer.from("buffer"), userATA.address.toBuffer(), TOKEN_PROGRAM_ID.toBuffer()],
        DELEGATION_PROGRAM_ID
    );

    console.log("   ⚡ PDAs Calculated (Source Code Method).");

    // 4. MANUAL INSTRUCTION CONSTRUCTION
    // We rebuild 'createDelegateInstruction' but correct the signer flag.
    
    // Serialize Data: [Discriminator (8 bytes) + CommitFreq (4) + SeedsLen (4) + Validator (33)]
    const bufferSize = 1024;
    const dataBuffer = Buffer.alloc(bufferSize);
    let offset = 0;

    // Discriminator: [0,0,0,0,0,0,0,0] (From your code)
    const discriminator = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 8; i++) dataBuffer[offset++] = discriminator[i];

    // Commit Frequency: 0xffffffff (Default)
    dataBuffer.writeUInt32LE(0xffffffff, offset);
    offset += 4;

    // Seeds Length: 0
    dataBuffer.writeUInt32LE(0, offset);
    offset += 4;
    // (No seeds loop since length is 0)

    // Validator: 1 (Option::Some) + 32 bytes Pubkey
    dataBuffer[offset++] = 1;
    dataBuffer.set(VALIDATOR_ID.toBuffer(), offset);
    offset += 32;

    const finalData = dataBuffer.subarray(0, offset);

    // 5. BUILD TRANSACTION
    console.log("   ⚡ Building Fixed Transaction...");

    const ix = new TransactionInstruction({
        programId: DELEGATION_PROGRAM_ID,
        keys: [
            // 1. Payer (Wallet) - Signer, Writable
            { pubkey: wallet.publicKey, isWritable: true, isSigner: true },
            
            // 2. Delegated Account - Writable, NOT Signer (FIXED HERE!)
            // Your source code said 'isSigner: true'. We set 'false'.
            { pubkey: userATA.address, isWritable: true, isSigner: false }, 
            
            // 3. Owner Program (Token Program)
            { pubkey: TOKEN_PROGRAM_ID, isWritable: false, isSigner: false },
            
            // 4. Buffer
            { pubkey: delegateBuffer, isWritable: true, isSigner: false },
            
            // 5. Delegation Record
            { pubkey: delegationRecord, isWritable: true, isSigner: false },
            
            // 6. Delegation Metadata
            { pubkey: delegationMetadata, isWritable: true, isSigner: false },
            
            // 7. System Program
            { pubkey: SystemProgram.programId, isWritable: false, isSigner: false },
        ],
        data: finalData
    });

    try {
        const tx = new Transaction().add(ix);
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        tx.feePayer = wallet.publicKey;
        tx.sign(wallet);

        console.log("   ⏳ Sending Transaction...");
        const sig = await connection.sendRawTransaction(tx.serialize());
        console.log("   📝 Signature:", sig);
        
        await connection.confirmTransaction(sig, "confirmed");
        console.log("   ✅ SUCCESS! Account Delegated.");
        
        fs.writeFileSync("config.json", JSON.stringify({
            mint: mint.toBase58(),
            ata: userATA.address.toBase58(),
            validator: VALIDATOR_ID.toBase58()
        }));
        console.log("   ✅ Config saved. NOW RUN BOT.JS!");

    } catch (e) {
        console.log("   ❌ FAILED.");
        console.log("   Error:", e.message);
        if (e.logs) console.log(e.logs);
    }
}

main();