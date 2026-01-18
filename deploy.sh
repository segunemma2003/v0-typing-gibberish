#!/bin/bash
set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Set deployment directory
DEPLOY_DIR="/var/www/react-app"
cd "$DEPLOY_DIR" || exit 1

echo "🛑 Stopping and cleaning up PM2..."

# Force kill PM2 daemon if it exists
if pgrep -f "pm2" > /dev/null; then
  echo "🔪 Force killing PM2 processes..."
  pkill -9 -f "pm2" || true
  sleep 2
fi

# Remove PM2 lock files that might cause hangs
if [ -d "$HOME/.pm2" ]; then
  echo "🧹 Cleaning PM2 lock files..."
  rm -f "$HOME/.pm2/.sock" 2>/dev/null || true
  rm -f "$HOME/.pm2/lock" 2>/dev/null || true
  rm -f "$HOME/.pm2/reload.lock" 2>/dev/null || true
fi

# Try to stop PM2 gracefully first
echo "🛑 Stopping PM2 gracefully..."
timeout 10 pm2 delete my-compasse-app 2>/dev/null || true
timeout 10 pm2 kill 2>/dev/null || true

# Wait a bit
sleep 2

# Force kill again if still running
if pgrep -f "pm2" > /dev/null; then
  echo "🔪 Force killing remaining PM2 processes..."
  pkill -9 -f "pm2" || true
  sleep 2
fi

# Verify PM2 is stopped
if pgrep -f "pm2" > /dev/null; then
  echo "⚠️ Warning: PM2 processes still running, but continuing..."
else
  echo "✅ PM2 fully stopped"
fi

echo "🔍 Killing any processes on ports 9000, 3000, and 5000..."
lsof -ti:9000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
sleep 2

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

# Ensure PM2 daemon is not running before starting
if pgrep -f "pm2" > /dev/null; then
  echo "⚠️ PM2 still running, force killing..."
  pkill -9 -f "pm2" || true
  sleep 2
fi

# Start PM2 with timeout to prevent hanging
echo "🚀 Starting PM2 (with 30s timeout)..."
timeout 30 pm2 start ecosystem.config.js || {
  echo "❌ PM2 start timed out or failed"
  echo "🔍 Checking PM2 status..."
  pm2 list || true
  echo "🔍 Checking for PM2 processes..."
  ps aux | grep pm2 || true
  exit 1
}

echo "💾 Saving PM2 configuration..."
pm2 save

echo "⏳ Waiting for app to start..."
sleep 5

echo "📊 PM2 Status:"
pm2 list

echo "🔍 Checking if port 9000 is listening..."
if netstat -tlnp | grep :9000; then
  echo "✅ Port 9000 is listening"
else
  echo "⚠️ Port 9000 not listening yet, checking logs..."
  pm2 logs my-compasse-app --lines 50 --nostream
fi

echo "✅ Deployment complete!"
