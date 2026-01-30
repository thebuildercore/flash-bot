// Diagnostic Script - Test each module individually
console.log("Starting diagnostic...\n");

// Test 1: Basic Node
console.log("✓ Node.js working");

// Test 2: File System
try {
    const fs = require("fs");
    console.log("✓ fs module OK");
} catch(e) {
    console.log("✗ fs module FAILED:", e.message);
    process.exit(1);
}

// Test 3: Solana Web3
try {
    console.log("Testing @solana/web3.js...");
    const { Connection, Keypair, PublicKey } = require("@solana/web3.js");
    console.log("✓ @solana/web3.js OK");
} catch(e) {
    console.log("✗ @solana/web3.js FAILED:", e.message);
    process.exit(1);
}

// Test 4: SPL Token
try {
    console.log("Testing @solana/spl-token...");
    const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");
    console.log("✓ @solana/spl-token OK");
} catch(e) {
    console.log("✗ @solana/spl-token FAILED:", e.message);
    process.exit(1);
}

// Test 5: MagicBlock SDK (LIKELY CULPRIT)
try {
    console.log("Testing @magicblock-labs/ephemeral-rollups-sdk...");
    const { delegateSpl } = require("@magicblock-labs/ephemeral-rollups-sdk");
    console.log("✓ @magicblock-labs/ephemeral-rollups-sdk OK");
} catch(e) {
    console.log("✗ @magicblock-labs/ephemeral-rollups-sdk FAILED:", e.message);
    console.log("\n🔍 THIS IS LIKELY THE PROBLEM!");
    process.exit(1);
}

// Test 6: Socket.io Client
try {
    console.log("Testing socket.io-client...");
    const io = require("socket.io-client");
    console.log("✓ socket.io-client OK");
} catch(e) {
    console.log("✗ socket.io-client FAILED:", e.message);
    process.exit(1);
}

console.log("\n✅ All modules loaded successfully!");
console.log("   The segfault must be in the initialization code.");