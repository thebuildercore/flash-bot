const fs = require("fs");
const { Connection, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const { 
    ExtensionType, 
    createInitializeMintInstruction, 
    getMintLen, 
    TOKEN_2022_PROGRAM_ID,
    createInitializeConfidentialTransferMintInstruction, 
} = require('@solana/spl-token');

async function main() {
    console.log("🕵️  TESTING REAL PRIVACY (Token-2022) - V2...");
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");

    // 1. LOAD EXISTING WALLET (Bypassing Airdrop)
    let wallet;
    try {
        const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
        wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
        console.log(`   ✅ Wallet Loaded: ${wallet.publicKey.toBase58()}`);
    } catch (e) { return console.log("   ❌ Error: my-wallet.json missing."); }

    // 2. Setup Confidential Mint
    const mint = Keypair.generate();
    const decimals = 9;
    const extensions = [ExtensionType.ConfidentialTransferMint];
    const mintLen = getMintLen(extensions);
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

    console.log("   🔒 Creating Confidential Mint Transaction...");

    const tx = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: mint.publicKey,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
        // Initialize Confidential Extension
        createInitializeConfidentialTransferMintInstruction(
            mint.publicKey,
            wallet.publicKey, // authority
            true, // auto-approve
            TOKEN_2022_PROGRAM_ID
        ),
        // Initialize Standard Mint
        createInitializeMintInstruction(
            mint.publicKey,
            decimals,
            wallet.publicKey,
            null,
            TOKEN_2022_PROGRAM_ID
        )
    );

    try {
        await sendAndConfirmTransaction(connection, tx, [wallet, mint]);
        console.log(`   ✅ SUCCESS! Created Confidential Mint: ${mint.publicKey.toBase58()}`);
        console.log("   🔥 PROVEN: You can use Token-2022 Privacy on Devnet!");
    } catch (e) {
        console.log("   ❌ FAILED.");
        console.log("   Error:", e.message);
        if(e.logs) console.log(e.logs);
    }
}

main();