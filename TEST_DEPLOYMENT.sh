#!/bin/bash
# Test script to verify deployment

echo "🔍 Testing Deployment..."
echo ""

echo "1️⃣ Testing main domain (theqcare.org):"
curl -I https://theqcare.org 2>&1 | grep -E "HTTP|x-nf-request-id|cache-status"
echo ""

echo "2️⃣ Testing demo subdomain (demo.theqcare.org):"
curl -I https://demo.theqcare.org 2>&1 | grep -E "HTTP|x-subdomain|x-nf-request-id"
echo ""

echo "3️⃣ Testing URL parameter approach:"
curl -I "https://theqcare.org?school=demo" 2>&1 | grep -E "HTTP|Location"
echo ""

echo "✅ If you see HTTP/2 200 above, the deployment worked!"
echo "❌ If you see HTTP/2 404, wait a bit longer and try again"

