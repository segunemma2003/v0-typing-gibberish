#!/bin/bash

API_BASE="https://api.compasse.net/api/v1"
SUPER_ADMIN_EMAIL="superadmin@compasse.net"
SUPER_ADMIN_PASSWORD="Nigeria@60"

echo "=========================================="
echo "Testing Delete School/Tenant API"
echo "=========================================="
echo ""

# Step 1: Login as Super Admin
echo "Step 1: Super Admin Login"
echo "---"
TOKEN=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SUPER_ADMIN_EMAIL\",\"password\":\"$SUPER_ADMIN_PASSWORD\"}" \
  | jq -r '.token // .data.token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed"
  exit 1
fi

echo "✅ Login successful! Token: ${TOKEN:0:50}..."
echo ""

# Step 2: Get list of tenants
echo "Step 2: Get List of Tenants"
echo "GET $API_BASE/tenants"
echo "---"
TENANTS_RESPONSE=$(curl -s -X GET "$API_BASE/tenants" \
  -H "Authorization: Bearer $TOKEN")

echo "$TENANTS_RESPONSE" | jq '.tenants.data[] | {id, name, subdomain, status}' 2>/dev/null || echo "$TENANTS_RESPONSE" | jq '.'
echo ""

# Extract a test tenant ID (preferably one with "test" in the name)
TEST_TENANT_ID=$(echo "$TENANTS_RESPONSE" | jq -r '.tenants.data[] | select(.subdomain | contains("test")) | .id' | head -1)
TEST_TENANT_NAME=$(echo "$TENANTS_RESPONSE" | jq -r '.tenants.data[] | select(.subdomain | contains("test")) | .name' | head -1)

if [ -z "$TEST_TENANT_ID" ] || [ "$TEST_TENANT_ID" = "null" ]; then
  echo "⚠️  No test tenant found. Using first available tenant..."
  TEST_TENANT_ID=$(echo "$TENANTS_RESPONSE" | jq -r '.tenants.data[0].id // empty' 2>/dev/null)
  TEST_TENANT_NAME=$(echo "$TENANTS_RESPONSE" | jq -r '.tenants.data[0].name // empty' 2>/dev/null)
fi

if [ -z "$TEST_TENANT_ID" ] || [ "$TEST_TENANT_ID" = "null" ]; then
  echo "❌ No tenants found to delete"
  exit 1
fi

echo "Selected tenant for deletion:"
echo "  ID: $TEST_TENANT_ID"
echo "  Name: $TEST_TENANT_NAME"
echo ""

# Step 3: Delete the tenant
echo "Step 3: Delete Tenant/School"
echo "DELETE $API_BASE/tenants/$TEST_TENANT_ID"
echo "Headers:"
echo "  - Authorization: Bearer {token}"
echo "---"

DELETE_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X DELETE "$API_BASE/tenants/$TEST_TENANT_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json")

HTTP_CODE=$(echo "$DELETE_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$DELETE_RESPONSE" | grep -v "HTTP_CODE")

echo "HTTP Status: $HTTP_CODE"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "204" ]; then
  echo "✅ Tenant deleted successfully!"
  echo ""
  
  # Step 4: Verify deletion by trying to get the tenant
  echo "Step 4: Verify Deletion"
  echo "GET $API_BASE/tenants/$TEST_TENANT_ID"
  echo "---"
  
  VERIFY_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$API_BASE/tenants/$TEST_TENANT_ID" \
    -H "Authorization: Bearer $TOKEN")
  
  VERIFY_HTTP_CODE=$(echo "$VERIFY_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
  VERIFY_BODY=$(echo "$VERIFY_RESPONSE" | grep -v "HTTP_CODE")
  
  echo "HTTP Status: $VERIFY_HTTP_CODE"
  if [ "$VERIFY_HTTP_CODE" = "404" ]; then
    echo "✅ Verification: Tenant not found (deleted successfully)"
  else
    echo "$VERIFY_BODY" | jq '.' 2>/dev/null || echo "$VERIFY_BODY"
  fi
else
  echo "❌ Failed to delete tenant"
fi

echo ""
echo "=========================================="
echo "Delete Test Complete"
echo "=========================================="

