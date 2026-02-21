#  WICKGUARD - COMPLETE STARTUP GUIDE

## Use Node ~18 newer version like 24 will lead to errors

---

## Starting the Full System
# Clone and enter the repo
git clone <https://github.com/thebuildercore/flash-bot>
cd flash-bot

# Install dependencies (Fresh install to avoid lockfile issues)
npm install

## Wallet and Security Config 

# Generate your localized wallet (creates my-wallet.json)
node create-wallet.js

# IMPORTANT: Get your Public Key from the output and fund it!
# Needs ~0.1 SOL on Devnet: https://solfaucet.com/

## Initialize the vault 
node vault.js

## Start the Engine
node bot.js

# Note: This is MVP of the real on-chain protcol under development
# The bot here perfectly applied the mathematics - PID HJB equations mentioned in the Technical Paper and executes exactly as modeled with L2 Rollup and executes it. 
# You can check the execution Summary On the site: wickguard.vercel.app 