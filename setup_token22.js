const fs = require("fs");
const { 
    Connection, Keypair, PublicKey, Transaction, 
    SystemProgram, TransactionInstruction 
} = require("@solana/web3.js");
const { 
    createMint, getOrCreateAssociatedTokenAccount, mintTo, 
    TOKEN_2022_PROGRAM_ID // <--- THE NEW STANDARD
} = require("@solana/spl-token");

// CONSTANTS
const DELEGATION_PROGRAM_ID = new PublicKey("DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh");

async function main() {
    console.log("🛠️  RUNNING TOKEN-2022 SETUP...");
    
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    // 1. SETUP WALLET
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`   ✅ Wallet: ${wallet.publicKey.toBase58()}`);
    } catch (e) { return console.log("   ❌ Error: my-wallet.json missing."); }

    // 2. CREATE TOKEN-2022 ASSETS
    console.log("   🏦 Creating Token-2022 Assets...");
    
    // Create Mint using the NEW Program ID
    const mint = await createMint(
        connection, 
        wallet, 
        wallet.publicKey, 
        null, 
        6, 
        undefined, 
        undefined, 
        TOKEN_2022_PROGRAM_ID // <--- CRITICAL
    );
    
    // Create ATA using the NEW Program ID
    const userATA = await getOrCreateAssociatedTokenAccount(
        connection, 
        wallet, 
        mint, 
        wallet.publicKey,
        false,
        undefined,
        undefined,
        TOKEN_2022_PROGRAM_ID // <--- CRITICAL
    );

    // Mint tokens
    await mintTo(
        connection, 
        wallet, 
        mint, 
        userATA.address, 
        wallet.publicKey, 
        1000 * 10**6,
        [],
        undefined,
        TOKEN_2022_PROGRAM_ID // <--- CRITICAL
    );
    
    console.log(`   ✅ Token-2022 Account: ${userATA.address.toBase58()}`);

    // 3. CALCULATE ADDRESSES
    const VALIDATOR_ID = new PublicKey("Gk38QXPf6xqSHoLG6eBnPih4b1BMFmSizEz8jGAA2spG");

    const [delegationRecord] = PublicKey.findProgramAddressSync(
        [Buffer.from("delegation"), userATA.address.toBuffer()],
        DELEGATION_PROGRAM_ID
    );

    const [delegationMetadata] = PublicKey.findProgramAddressSync(
        [Buffer.from("delegation_metadata"), userATA.address.toBuffer()],
        DELEGATION_PROGRAM_ID
    );

    // SEED: "buffer" + ACCOUNT + TOKEN_2022_PROGRAM_ID
    // The Program checks the account owner, so the seed MUST use Token-2022 ID
    const [delegateBuffer] = PublicKey.findProgramAddressSync(
        [Buffer.from("buffer"), userATA.address.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer()],
        DELEGATION_PROGRAM_ID
    );

    console.log("   ⚡ PDAs Calculated.");

    // 4. BUILD RAW DATA
    const bufferSize = 100; 
    const data = Buffer.alloc(bufferSize);
    let offset = 0;

    for(let i=0; i<8; i++) data.writeUInt8(0, offset++); // Discriminator
    data.writeUInt32LE(0xffffffff, offset); offset += 4; // Commit Freq
    data.writeUInt32LE(0, offset); offset += 4; // Seeds Len
    data.writeUInt8(1, offset++); // Validator Present
    const validatorBytes = VALIDATOR_ID.toBuffer();
    validatorBytes.copy(data, offset);
    offset += 32;

    const instructionData = data.subarray(0, offset);

    // 5. BUILD TRANSACTION
    const ix = new TransactionInstruction({
        programId: DELEGATION_PROGRAM_ID,
        keys: [
            { pubkey: wallet.publicKey, isWritable: true, isSigner: true },
            { pubkey: userATA.address, isWritable: true, isSigner: false },
            
            // KEY CHANGE: The "Owner Program" is now Token-2022
            { pubkey: TOKEN_2022_PROGRAM_ID, isWritable: false, isSigner: false }, 
            
            { pubkey: delegateBuffer, isWritable: true, isSigner: false },
            { pubkey: delegationRecord, isWritable: true, isSigner: false },
            { pubkey: delegationMetadata, isWritable: true, isSigner: false },
            { pubkey: SystemProgram.programId, isWritable: false, isSigner: false }
        ],
        data: instructionData
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
            validator: VALIDATOR_ID.toBase58(),
            program: "token-2022" // Mark this for the bot
        }));
        console.log("   ✅ Config Saved. RUN BOT.JS!");

    } catch (e) {
        console.log("   ❌ FAILED.");
        if (e.logs) console.log(e.logs);
        else console.log(e.message);
    }
}

main();