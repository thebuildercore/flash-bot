async function main() {
    console.log("🔍 Inspecting magic-router-sdk...");
    try {
        const routerSdk = await import("magic-router-sdk");
        console.log("Available Functions:", Object.keys(routerSdk));
    } catch (e) {
        console.log("Router SDK Error:", e.message);
    }

    console.log("\n🔍 Inspecting @magicblock-labs/ephemeral-rollups-sdk...");
    try {
        const rollupSdk = require("@magicblock-labs/ephemeral-rollups-sdk");
        console.log("Available Functions:", Object.keys(rollupSdk));
    } catch (e) {
        console.log("Rollup SDK Error:", e.message);
    }
}
main();