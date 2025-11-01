#!/bin/bash

# Quick fix script for deployment issues
# Run this on your VPS: cd /var/www/react-app && bash fix-deployment.sh

echo "🛑 Stopping PM2 app..."
pm2 delete my-compasse-app 2>/dev/null || true

echo "🔍 Killing processes on ports 9000, 3000, and 5000..."
lsof -ti:9000 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
sleep 2

echo "🗑️ Removing old build..."
rm -rf .next

echo "🔨 Building application..."
npm run build

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
pm2 start ecosystem.config.js

echo "💾 Saving PM2 configuration..."
pm2 save

echo "⏳ Waiting for app to start..."
sleep 5

echo "📊 PM2 Status:"
pm2 list

echo "📋 PM2 Logs (last 20 lines):"
pm2 logs my-compasse-app --lines 20 --nostream

echo "🔍 Checking if port 9000 is listening..."
netstat -tlnp | grep :9000 || echo "⚠️ Port 9000 not listening yet"

echo "✅ Fix complete!"

