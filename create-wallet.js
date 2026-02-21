const { Keypair } = require("@solana/web3.js");
const fs = require("fs");
const keypair = Keypair.generate();
fs.writeFileSync("my-wallet.json", JSON.stringify(Array.from(keypair.secretKey)));
console.log("Wallet created! Public Key:", keypair.publicKey.toBase58());

//Wallet created! Public Key: EbT6nvGZ4WL1evkNCUzPJBxsfDvex6xHU8ywVtuAAQ6i this one is used.. 
// my-wallet.json HBHwxbFf1RM8pt8LLGzmqLki2UgByawDhTPbH2qbi21Pso
// to check balance run this.. : solana balance HBHwxbFf1RM8pt8LLGzmqLki2UgByawDhTPbH2qbi21P --url devnet

//solana confirm -v 2xaNCemB8VGxm13WdYhG6ii8QTB4qMxu9hDmoV4xQttqKXneC7YXbnPEYVQnBcbM4iknumcGRmtK3txLCwhERhHz --url https://devnet-us.magicblock.app

//my current wallet akshaya@LAPTOP-7AG4UK0V:~/flash-bot$ node create-wallet.js
// Wallet created! Public Key: 6wXaAWJuMtNVaRA3ixvzfux4rGakD9uWNGThW9wXgCwo
// akshaya@LAPTOP-7AG4UK0V:~/flash-bot$ 