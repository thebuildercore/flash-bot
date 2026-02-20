#  WICKGUARD - COMPLETE STARTUP GUIDE

## You've Fixed the Segfault! ✅

The issue was Node.js version. You're now using Node v18 which is stable for Solana packages.

---

## Starting the Full System

### Step 1: Start the WebSocket Server

```bash
# Terminal 1
cd ~/flash-bot
nvm use 18
node server.js
```

**Expected output:**
```
Server listening on port 3001
WebSocket server ready
```

---

### Step 2: Start the Bot

```bash
# Terminal 2
cd ~/flash-bot
nvm use 18
node bot-integrated.js
```

**Expected output:**
```
🛡️  WICKGUARD - FINAL VERSION
✅ Connected to dashboard server
📂 Wallet: CVYvELNx...
💰 Balance: 4.74 SOL
...
🛡️  WICKGUARD PROTECTION ACTIVE
```

---

### Step 3: Start the Dashboard

```bash
# Terminal 3
cd ~/flash-bot/wickguard-dashboard
npm run dev
```

**Expected output:**
```
- ready started server on 0.0.0.0:3000
- Local:        http://localhost:3000
```

---

### Step 4: Open Dashboard

Open browser to: **http://localhost:3000**

You should see:
- ✅ Live price updates
- ✅ Real-time logs from the bot
- ✅ Stage indicators (wallet → mint → delegating → monitoring)
- ✅ Balance updates (User / Safe)

---

## Quick Start Script

Save this as `start-all.sh`:

```bash
#!/bin/bash

# Ensure using Node 18
source ~/.nvm/nvm.sh
nvm use 18

echo "🚀 Starting Wickguard System..."
echo ""

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found!"
    exit 1
fi

# Start server in background
echo "1️⃣  Starting WebSocket server..."
node server.js &
SERVER_PID=$!
sleep 2

# Start bot in background
echo "2️⃣  Starting protection bot..."
node bot-integrated.js &
BOT_PID=$!
sleep 2

# Start dashboard
echo "3️⃣  Starting dashboard..."
cd wickguard-dashboard
npm run dev &
DASH_PID=$!

echo ""
echo "✅ All services started!"
echo "   Server PID: $SERVER_PID"
echo "   Bot PID: $BOT_PID"
echo "   Dashboard PID: $DASH_PID"
echo ""
echo "📊 Open: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services..."

# Trap Ctrl+C
trap "echo ''; echo 'Stopping all...'; kill $SERVER_PID $BOT_PID $DASH_PID 2>/dev/null; exit" INT

# Wait
wait
```

Then run:
```bash
chmod +x start-all.sh
./start-all.sh
```

---

## What Each Component Does

### server.js (Port 3001)
- WebSocket server
- Bridges bot ↔ dashboard
- Receives events from bot
- Broadcasts to dashboard

### bot-integrated.js
- Runs your Solana bot
- Sends updates to server via WebSocket:
  - `bot-stage` - Current operation stage
  - `bot-price` - Live price updates
  - `bot-balance` - User/Safe balances
  - `bot-log` - Log messages

### Dashboard (Port 3000)
- Next.js frontend
- Connects to server WebSocket
- Displays live data
- Shows logs, charts, status

---

## Data Flow

```
Bot (Node.js)
    ↓
  [WebSocket]
    ↓
Server (port 3001)
    ↓
  [WebSocket]
    ↓
Dashboard (port 3000)
    ↓
  [Browser]
    ↓
You see live updates!
```

---

## Troubleshooting

### Bot can't connect to server
```bash
# Make sure server is running first
node server.js

# Then start bot
node bot-integrated.js
```

### Dashboard shows "Disconnected"
- Check server.js is running
- Check browser console (F12) for errors
- Verify port 3001 is not blocked

### Segmentation fault returns
```bash
# Always use Node 18
nvm use 18

# Check current version
node --version  # Should show v18.x.x
```

### Bot works but dashboard is blank
- Open browser console (F12)
- Check for WebSocket connection errors
- Verify dashboard is connecting to `http://localhost:3001`

---

## Testing the Connection

Run this to test WebSocket flow:

```bash
# Terminal 1
node server.js

# Terminal 2
node -e "
const io = require('socket.io-client');
const socket = io('http://localhost:3001');
socket.on('connect', () => {
  console.log('✅ Connected!');
  socket.emit('bot-log', { message: 'Test', type: 'info' });
  setTimeout(() => process.exit(0), 1000);
});
"
```

If you see "✅ Connected!", the WebSocket bridge is working!

---

## Remember

**ALWAYS use Node 18:**
```bash
nvm use 18
```

Add this to your `~/.bashrc` to auto-use Node 18:
```bash
echo "nvm use 18" >> ~/.bashrc
```

---

## Success Checklist

- ✅ Node v18 installed and active
- ✅ `server.js` running on port 3001
- ✅ `bot-integrated.js` connected to server
- ✅ Dashboard running on port 3000
- ✅ Browser shows live updates
- ✅ Bot logs appearing in dashboard

**You're all set! 🎉**