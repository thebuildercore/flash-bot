// // // // const { PublicKey } = require("@solana/web3.js");

// // const { PublicKey } = require("@solana/web3.js");

// // // // module.exports = {
// // // //     // RPC Endpoints
// // // //     L1_RPC: "https://api.devnet.solana.com",
// // // //     L2_RPC: "https://devnet-us.magicblock.app",
    
// // // //     // MagicBlock Validator
// // // //     VALIDATOR_ID: new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd"),
    
// // // //     // Wallet
// // // //     WALLET_PATH: "./my-wallet.json",
    
// // // //     // Control Parameters
// // // //     HEALTH_THRESHOLD: 1.05,
// // // //     MIN_CONTROL_THRESHOLD: 0.001,
// // // //     MONITORING_INTERVAL_MS: 200,
    
// // // //     // Strategic Parameters (HJB)
// // // //     GAMMA: 4.0,
// // // //     SIGMA: 0.03,
// // // //     ETA: 0.5,
    
// // // //     // Tactical Parameters (PID)
// // // //     KP: 3.0,
// // // //     KI: 0.3,
// // // //     KD: 0.12,
// // // //     ALPHA: 0.7,
// // // //     DT: 0.2,
    
// // // //     // Vault Configuration (will be set after vault creation)
// // // //     VAULT_PUBKEY: null,  // Set this after running vault.js
// // // //     VAULT_ATA: null,     // Set this after running vault.js
// // // // };


// const { PublicKey } = require("@solana/web3.js");

// module.exports = {
//     // RPC Endpoints
//     L1_RPC: "https://api.devnet.solana.com",
//     L2_RPC: "https://devnet-us.magicblock.app",
    
//     // MagicBlock Validator
//     VALIDATOR_ID: new PublicKey("GFwjtPEBWyBU6echJwwTsJzT1H6AaLMGsCs9FLPFfcbW"),
    
//     // Wallet
//     WALLET_PATH: "./my-wallet.json",
    
//     // Control Parameters
//     HEALTH_THRESHOLD: 1.05,
//     HEALTH_DANGER_ZONE: 1.03,        // NEW: Only act if H < 1.03
//     MIN_CONTROL_THRESHOLD: 0.001,
//     MONITORING_INTERVAL_MS: 200,
    
//     // Anti-Wick Protection
//     GRACE_PERIOD_CHECKS: 15,          // NEW: Must be in danger for 15 checks (3 seconds)
//     PRICE_EMA_ALPHA: 0.3,             // NEW: Price smoothing factor
    
//     // Strategic Parameters (UPDATED for Solana volatility)
//     GAMMA: 4.0,
//     SIGMA: 0.08,                      // INCREASED: Was 0.03, now 0.08 for Solana
//     ETA: 0.5,
    
//     // Tactical Parameters (SOFTENED)
//     KP: 1.0,                          // DECREASED: Was 3.0, now 1.0
//     KI: 0.05,                         // DECREASED: Was 0.3, now 0.05
//     KD: 0.08,                         // DECREASED: Was 0.12, now 0.08
//     ALPHA: 0.7,
//     DT: 0.2,
    
//     // Vault Configuration
//     VAULT_PUBKEY: null,
//     VAULT_ATA: null,
// };
 


// // // config.js
// // module.exports = {
// //     // RPC Endpoints
// //     L1_RPC: "https://api.devnet.solana.com",
// //     L2_RPC: "https://testnet.magicblock.app", // Example L2
    
// //      //MagicBlock Validator
// //    //VALIDATOR_ID: new PublicKey("MUS3hc9TCw4cGC12vHNoYcCGzJG1txjgQLZWVoeNHNd"),
// //     VALIDATOR_ID: new PublicKey("GFwjtPEBWyBU6echJwwTsJzT1H6AaLMGsCs9FLPFfcbW"),
// //         // Wallet
// //    WALLET_PATH: "./my-wallet.json",

// //     // Strategic Parameters (HJB)
// //     GAMMA: 4.0,     // Risk Aversion
// //     SIGMA: 0.08,    // Volatility
// //     ETA: 0.5,       // Market Impact
    
// //     // Tactical Parameters (PID) - TUNED FOR L2 AGGRESSION
// //     KP: 5.0,        // Proportional Gain (Was 1.0 -> Now 5.0 for survival)
// //     KI: 0.1,        // Integral Gain
// //     KD: 0.15,       // Derivative Gain
// //     ALPHA: 0.7,     // Derivative Filter (Faster response)
// //     DT: 0.05,       // Time step (50ms)
    
// //     // Anti-Wick Protection
// //     PRICE_EMA_ALPHA: 0.7,       // Faster smoothing (Was 0.3 -> Now 0.7)
// //     GRACE_PERIOD_CHECKS: 5,     // Shorter wait (Was 15 -> Now 5)
// //     MONITORING_INTERVAL_MS: 50, // 50ms loop speed
    
// //     // Safety Thresholds
// //     HEALTH_THRESHOLD: 1.05,     // Yellow Zone
// //     HEALTH_DANGER_ZONE: 1.03,   // Red Zone (Start Acting)
// //     HEALTH_CRITICAL: 1.015,     // PANIC ZONE (Bypass Filters)
// //     MIN_CONTROL_THRESHOLD: 0.0001 // Execute even tiny trades
// // };



const { PublicKey } = require("@solana/web3.js");

module.exports = {
    // RPC Endpoints
    L1_RPC: "https://api.devnet.solana.com",
    L2_RPC: "https://devnet-as.magicblock.app",
    
    // MagicBlock Validator (FIXED - This should be the validator, not your wallet!)
    VALIDATOR_ID: new PublicKey("MAS1Dt9qreoRMQ14YQuhg8UTZMMzDdKhmkZMECCzk57"),
    
    // Wallet
    WALLET_PATH: "./my-wallet.json",
    
    // Control Parameters
    HEALTH_THRESHOLD: 1.15,
    HEALTH_DANGER_ZONE: 1.10,
    MIN_CONTROL_THRESHOLD: 0.001,
    MONITORING_INTERVAL_MS: 200,
    
    // Anti-Wick Protection
    GRACE_PERIOD_CHECKS: 15,
    PRICE_EMA_ALPHA: 0.3,
    
    // Strategic Parameters (HJB)
    GAMMA: 4.0,
    SIGMA: 0.08,
    ETA: 0.5,
    
    // Tactical Parameters (PID)
    KP: 1.0,
    KI: 0.05,
    KD: 0.08,
    ALPHA: 0.7,
    DT: 0.2,
    
    // Vault Configuration
    VAULT_PUBKEY: null,
    VAULT_ATA: null,
};