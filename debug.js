const fs = require("fs");
const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
const { createMint, getOrCreateAssociatedTokenAccount, mintTo, getAccount } = require("@solana/spl-token");
const { deriveEphemeralAta } = require("@magicblock-labs/ephemeral-rollups-sdk");

const MAGIC_RPC = "https://devnet-us.magicblock.app";

async function main() {
    console.log("🔍 DEBUGGING EPHEMERAL ATA STATE\n");
    
    const connectionL1 = new Connection("https://api.devnet.solana.com", "confirmed");
    const connectionL2 = new Connection(MAGIC_RPC, "confirmed");
    
    const secretKey = JSON.parse(fs.readFileSync("my-wallet.json", "utf-8"));
    const wallet = Keypair.fromSecretKey(new Uint8Array(secretKey));
    
    // Use the mint and ATA from your last successful delegation
    const mint = new PublicKey("8ZnaW2N1maP9jJZ1Nnd5FXHDM89NqTyvZBRkQs5KWxQx");
    const userATA = new PublicKey("35wqQCfNZ4pWgusU8HT3uC7A1Go15iQfTcnpJ5pKPyVd");
    const [ephemeralATA] = deriveEphemeralAta(wallet.publicKey, mint);
    
    console.log(`📍 Regular ATA: ${userATA.toBase58()}`);
    console.log(`📍 Ephemeral ATA: ${ephemeralATA.toBase58()}\n`);
    
    // Check L1 state
    console.log("═══ L1 STATE ═══");
    try {
        const userL1 = await getAccount(connectionL1, userATA);
        console.log(`✅ Regular ATA: ${Number(userL1.amount) / 10**6} tokens`);
    } catch(e) {
        console.log(`❌ Regular ATA: ${e.message}`);
    }
    
    try {
        const ephemeralL1 = await getAccount(connectionL1, ephemeralATA);
        console.log(`✅ Ephemeral ATA: ${Number(ephemeralL1.amount) / 10**6} tokens`);
    } catch(e) {
        console.log(`❌ Ephemeral ATA: ${e.message}`);
    }
    
    // Check L2 state
    console.log("\n═══ L2 STATE ═══");
    try {
        const userL2 = await getAccount(connectionL2, userATA);
        console.log(`✅ Regular ATA: ${Number(userL2.amount) / 10**6} tokens`);
    } catch(e) {
        console.log(`❌ Regular ATA: ${e.message}`);
    }
    
    try {
        const ephemeralL2 = await getAccount(connectionL2, ephemeralATA);
        console.log(`✅ Ephemeral ATA: ${Number(ephemeralL2.amount) / 10**6} tokens`);
    } catch(e) {
        console.log(`❌ Ephemeral ATA: ${e.message}`);
    }
    
    // Check account info (not just token balance)
    console.log("\n═══ ACCOUNT INFO ═══");
    try {
        const info = await connectionL2.getAccountInfo(ephemeralATA);
        if (info) {
            console.log(`✅ Ephemeral ATA exists on L2`);
            console.log(`   Owner: ${info.owner.toBase58()}`);
            console.log(`   Lamports: ${info.lamports}`);
            console.log(`   Data length: ${info.data.length}`);
        } else {
            console.log(`❌ Ephemeral ATA doesn't exist on L2`);
        }
    } catch(e) {
        console.log(`❌ Error: ${e.message}`);
    }
}

main().catch(console.error);