#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Set deployment directory
DEPLOY_DIR="/var/www/react-app"
cd "$DEPLOY_DIR" || exit 1

echo "🛑 Stopping and cleaning up PM2 (SAFE MODE)..."

# Method 1: Try graceful shutdown with timeout
echo "Step 1: Graceful PM2 shutdown..."
timeout 5 pm2 delete my-compasse-app 2>/dev/null || true
timeout 5 pm2 kill 2>/dev/null || true
sleep 1

# Method 2: Force kill PM2 processes
echo "Step 2: Force killing PM2 processes..."
pkill -9 -f "pm2" 2>/dev/null || true
pkill -9 -f "node.*pm2" 2>/dev/null || true
sleep 2

# Method 3: Clean PM2 lock files
echo "Step 3: Cleaning PM2 lock files..."
PM2_HOME="${PM2_HOME:-$HOME/.pm2}"
if [ -d "$PM2_HOME" ]; then
  rm -f "$PM2_HOME/.sock" 2>/dev/null || true
  rm -f "$PM2_HOME/lock" 2>/dev/null || true
  rm -f "$PM2_HOME/reload.lock" 2>/dev/null || true
  rm -f "$PM2_HOME/pids" 2>/dev/null || true
fi

# Method 4: Kill any processes on target ports
echo "Step 4: Freeing up ports..."
lsof -ti:9000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
sleep 1

# Verify PM2 is stopped
if pgrep -f "pm2" > /dev/null; then
  echo "⚠️ Warning: Some PM2 processes may still be running"
  ps aux | grep pm2 | grep -v grep || true
else
  echo "✅ PM2 fully stopped"
fi

echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps || npm install --legacy-peer-deps

echo "🗑️ Removing old build..."
rm -rf .next
rm -rf .next/cache

echo "🔨 Building application..."
npm run build

# Verify build
if [ ! -d ".next" ]; then
  echo "❌ Build failed: .next directory not found"
  exit 1
fi

if [ ! -f ".next/BUILD_ID" ]; then
  echo "❌ Build failed: BUILD_ID not found"
  exit 1
fi

echo "✅ Build verified successfully"

echo "🔄 Starting PM2 with ecosystem config..."

# Set PM2_HOME explicitly to avoid path issues
export PM2_HOME="$HOME/.pm2"

# Start PM2 with explicit timeout and error handling
echo "🚀 Starting PM2 (max 30s)..."
if timeout 30 pm2 start ecosystem.config.js; then
  echo "✅ PM2 started successfully"
else
  EXIT_CODE=$?
  echo "❌ PM2 start failed with exit code: $EXIT_CODE"
  echo "🔍 Debugging info:"
  echo "PM2_HOME: $PM2_HOME"
  ls -la "$PM2_HOME" 2>/dev/null || echo "PM2_HOME directory not found"
  pm2 list 2>/dev/null || echo "PM2 list command failed"
  ps aux | grep pm2 | head -5 || true
  exit $EXIT_CODE
fi

echo "💾 Saving PM2 configuration..."
timeout 5 pm2 save || echo "⚠️ PM2 save failed, but continuing..."

echo "⏳ Waiting for app to start..."
sleep 5

echo "📊 PM2 Status:"
pm2 list || echo "⚠️ PM2 list failed"

echo "🔍 Checking if port 9000 is listening..."
if netstat -tlnp 2>/dev/null | grep :9000 || ss -tlnp 2>/dev/null | grep :9000; then
  echo "✅ Port 9000 is listening"
else
  echo "⚠️ Port 9000 not listening yet, checking logs..."
  pm2 logs my-compasse-app --lines 50 --nostream 2>/dev/null || echo "⚠️ Could not fetch PM2 logs"
fi

echo "✅ Deployment complete!"
