#!/usr/bin/env node

// Terminal Output Bridge - Pipes any program's output to WebSocket server
const { spawn } = require('child_process');
const io = require('socket.io-client');

const socket = io("http://localhost:3001");
const botProcess = spawn('node', ['bot.js'], { 
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true 
});

console.log("🌉 Bridge started - Streaming bot output to dashboard...\n");

// Forward stdout to both terminal AND websocket
botProcess.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(output); // Show in terminal
    
    // Send to dashboard
    socket.emit('bot-log', {
        message: output.trim(),
        type: 'info',
        timestamp: new Date().toLocaleTimeString()
    });
});

// Forward stderr
botProcess.stderr.on('data', (data) => {
    const output = data.toString();
    process.stderr.write(output);
    
    socket.emit('bot-log', {
        message: output.trim(),
        type: 'error',
        timestamp: new Date().toLocaleTimeString()
    });
});

botProcess.on('close', (code) => {
    console.log(`\n🛑 Bot exited with code ${code}`);
    socket.disconnect();
    process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\n\n⚠️  Stopping bot...');
    botProcess.kill('SIGINT');
});