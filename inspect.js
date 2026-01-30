const tokenLibrary = require("@solana/spl-token");

console.log("🔍 Inspecting @solana/spl-token exports...");

// FIXED: Renamed variable to 'libKeys' to avoid conflict
const libKeys = Object.keys(tokenLibrary);

// Filter for anything related to "Confidential"
const privacyFunctions = libKeys.filter(name => 
    name.toLowerCase().includes("confidential")
);

console.log("\nFound Privacy Functions:");
if (privacyFunctions.length > 0) {
    privacyFunctions.forEach(f => console.log(` - ${f}`));
} else {
    console.log(" - NONE FOUND (Your @solana/spl-token version might be too old)");
}

console.log("\nTotal Exports:", libKeys.length);