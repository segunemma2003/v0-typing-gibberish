#!/bin/bash

# API Flow Testing Script
API_BASE="https://api.compasse.net/api/v1"
TOKEN=""
SUPER_ADMIN_EMAIL="${SUPER_ADMIN_EMAIL:-admin@compasse.net}"
SUPER_ADMIN_PASSWORD="${SUPER_ADMIN_PASSWORD:-password123}"

echo "=========================================="
echo "Testing API Flow: Super Admin → Create School → Admin Login"
echo "=========================================="
echo ""

# Step 1: Super Admin Login
echo "Step 1: Super Admin Login"
echo "POST $API_BASE/auth/login"
echo "Email: $SUPER_ADMIN_EMAIL"
echo "---"

RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SUPER_ADMIN_EMAIL\",\"password\":\"$SUPER_ADMIN_PASSWORD\"}")

echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

TOKEN=$(echo "$RESPONSE" | jq -r '.token // .data.token // empty' 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed. Please check credentials."
  echo "Please set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD environment variables"
  exit 1
fi

echo "✅ Login successful!"
echo "Token: ${TOKEN:0:50}..."
echo ""

# Step 2: Get Current User Info
echo "Step 2: Get Current User Info"
echo "GET $API_BASE/auth/me"
echo "---"

USER_INFO=$(curl -s -X GET "$API_BASE/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

echo "$USER_INFO" | jq '.' 2>/dev/null || echo "$USER_INFO"
echo ""

# Step 3: Create School
echo "Step 3: Create School"
echo "POST $API_BASE/tenants"
echo "---"

SCHOOL_DATA='{
  "name": "Test School '$(date +%s)'",
  "subdomain": "test-school-'$(date +%s | cut -c7-12)'",
  "domain": "test-school-'$(date +%s | cut -c7-12)'.compasse.net",
  "school": {
    "name": "Test School '$(date +%s)'",
    "address": "123 Test Street, Test City",
    "phone": "+1234567890",
    "email": "info@testschool.compasse.net",
    "website": "https://test-school-'$(date +%s | cut -c7-12)'.compasse.net",
    "admin_name": "Test Administrator",
    "admin_email": "admin@test-school-'$(date +%s | cut -c7-12)'.compasse.net"
  },
  "settings": {
    "timezone": "Africa/Lagos",
    "currency": "NGN"
  }
}'

SCHOOL_RESPONSE=$(curl -s -X POST "$API_BASE/tenants" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$SCHOOL_DATA")

echo "$SCHOOL_RESPONSE" | jq '.' 2>/dev/null || echo "$SCHOOL_RESPONSE"
echo ""

ADMIN_EMAIL=$(echo "$SCHOOL_RESPONSE" | jq -r '.admin_credentials.email // empty' 2>/dev/null)
ADMIN_PASSWORD=$(echo "$SCHOOL_RESPONSE" | jq -r '.admin_credentials.password // empty' 2>/dev/null)
SUBDOMAIN=$(echo "$SCHOOL_RESPONSE" | jq -r '.tenant.subdomain // empty' 2>/dev/null)

if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
  echo "❌ School creation failed or admin credentials not returned"
  exit 1
fi

echo "✅ School created successfully!"
echo "Subdomain: $SUBDOMAIN"
echo "Admin Email: $ADMIN_EMAIL"
echo "Admin Password: $ADMIN_PASSWORD"
echo ""

# Step 4: Login as School Admin
echo "Step 4: Login as School Admin"
echo "POST $API_BASE/auth/login"
echo "Email: $ADMIN_EMAIL"
echo "X-Subdomain: $SUBDOMAIN"
echo "---"

ADMIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -H "X-Subdomain: $SUBDOMAIN" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

echo "$ADMIN_RESPONSE" | jq '.' 2>/dev/null || echo "$ADMIN_RESPONSE"
echo ""

ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | jq -r '.token // .data.token // empty' 2>/dev/null)

if [ -z "$ADMIN_TOKEN" ] || [ "$ADMIN_TOKEN" = "null" ]; then
  echo "❌ Admin login failed"
  exit 1
fi

echo "✅ Admin login successful!"
echo "Token: ${ADMIN_TOKEN:0:50}..."
echo ""

# Step 5: Get Admin User Info
echo "Step 5: Get Admin User Info"
echo "GET $API_BASE/auth/me"
echo "X-Subdomain: $SUBDOMAIN"
echo "---"

ADMIN_USER_INFO=$(curl -s -X GET "$API_BASE/auth/me" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Subdomain: $SUBDOMAIN")

echo "$ADMIN_USER_INFO" | jq '.' 2>/dev/null || echo "$ADMIN_USER_INFO"
echo ""

echo "=========================================="
echo "✅ All steps completed successfully!"
echo "=========================================="
