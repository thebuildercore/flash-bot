const { Server } = require("socket.io");

const io = new Server(3001, {
    cors: {
        origin: "*", // Allow Next.js frontend to connect
    }
});

console.log("🚀 WickGuard Bridge Server running on port 3001");

io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Receive data from Bot, broadcast to Frontend
    socket.on("bot-log", (data) => {
        io.emit("ui-log", data); // Forward to UI
    });

    socket.on("bot-stage", (stage) => {
        io.emit("ui-stage", stage); // Forward to UI
    });

    socket.on("bot-price", (price) => {
        io.emit("ui-price", price); // Forward to UI
    });

    socket.on("bot-balance", (data) => {
        io.emit("ui-balance", data); // Forward to UI
    });
});

// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]
//   }
// });

// // Store latest data
// let latestData = {
//   stage: 'idle',
//   price: 140,
//   balance: { user: 0, safe: 0 },
//   logs: [],
//   transactions: [],
//   systemData: {}
// };

// io.on('connection', (socket) => {
//   console.log('✅ Client connected:', socket.id);
  
//   // Send current state to newly connected clients
//   socket.emit('initial-state', latestData);
  
//   // Bot stage updates
//   socket.on('bot-stage', (stage) => {
//     latestData.stage = stage;
//     io.emit('bot-stage', stage);
//     console.log('📊 Stage:', stage);
//   });
  
//   // Price updates
//   socket.on('bot-price', (price) => {
//     latestData.price = price;
//     io.emit('bot-price', price);
//   });
  
//   // Balance updates
//   socket.on('bot-balance', (balance) => {
//     latestData.balance = balance;
//     io.emit('bot-balance', balance);
//     console.log('💰 Balance - User:', balance.user, 'Safe:', balance.safe);
//   });
  
//   // Log messages
//   socket.on('bot-log', (log) => {
//     const logEntry = {
//       ...log,
//       id: Date.now() + Math.random()
//     };
    
//     // Keep last 100 logs
//     latestData.logs.push(logEntry);
//     if (latestData.logs.length > 100) {
//       latestData.logs.shift();
//     }
    
//     io.emit('bot-log', logEntry);
//     console.log(`[${log.type.toUpperCase()}] ${log.message}`);
//   });
  
//   // NEW: System data (addresses, hashes, etc.)
//   socket.on('bot-data', (data) => {
//     latestData.systemData[data.key] = data.value;
//     io.emit('bot-data', data);
//     console.log(`📋 ${data.key}:`, data.value);
//   });
  
//   // NEW: Transaction details
//   socket.on('bot-transaction', (tx) => {
//     const txEntry = {
//       ...tx,
//       id: Date.now() + Math.random(),
//       timestamp: new Date().toLocaleTimeString()
//     };
    
//     // Keep last 50 transactions
//     latestData.transactions.push(txEntry);
//     if (latestData.transactions.length > 50) {
//       latestData.transactions.shift();
//     }
    
//     io.emit('bot-transaction', txEntry);
//     console.log(`💳 Transaction: ${tx.type} - ${tx.signature?.slice(0, 8)}...`);
//   });
  
//   socket.on('disconnect', () => {
//     console.log('❌ Client disconnected:', socket.id);
//   });
// });

// const PORT = 3001;
// server.listen(PORT, () => {
//   console.log(`🚀 Server listening on port ${PORT}`);
//   console.log('📡 WebSocket server ready');
// });