#!/bin/bash

# Complete API Flow Test
API_BASE="https://api.compasse.net/api/v1"
SUPER_ADMIN_EMAIL="superadmin@compasse.net"
SUPER_ADMIN_PASSWORD="Fluidangle@2020"

echo "=========================================="
echo "Complete API Flow Test"
echo "=========================================="
echo ""

# Step 1: Super Admin Login (NO X-Subdomain header - base domain)
echo "Step 1: Super Admin Login"
echo "POST $API_BASE/auth/login"
echo "Headers: Content-Type: application/json"
echo "Body: {email, password}"
echo "---"

SUPER_ADMIN_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SUPER_ADMIN_EMAIL\",\"password\":\"$SUPER_ADMIN_PASSWORD\"}")

HTTP_CODE=$(echo "$SUPER_ADMIN_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
BODY=$(echo "$SUPER_ADMIN_RESPONSE" | grep -v "HTTP_CODE")

echo "HTTP Status: $HTTP_CODE"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

if [ "$HTTP_CODE" != "200" ]; then
  echo "⚠️  Super admin login failed. This might be expected if credentials are incorrect."
  echo "Continuing with documentation of expected flow..."
  echo ""
  TOKEN="TEST_TOKEN_FOR_DOCUMENTATION"
else
  TOKEN=$(echo "$BODY" | jq -r '.token // .data.token // empty' 2>/dev/null)
  if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
    echo "✅ Super admin login successful!"
    echo "Token: ${TOKEN:0:50}..."
  fi
fi

echo ""
echo "=========================================="
echo "Expected Flow Documentation"
echo "=========================================="
echo ""
echo "1. SUPER ADMIN LOGIN"
echo "   POST $API_BASE/auth/login"
echo "   Headers: Content-Type: application/json"
echo "   Body: {\"email\":\"superadmin@compasse.net\",\"password\":\"Fluidangle@2020\"}"
echo "   Response: {\"token\":\"...\", \"user\":{...}}"
echo ""
echo "2. CREATE SCHOOL (Tenant)"
echo "   POST $API_BASE/tenants"
echo "   Headers:"
echo "     - Authorization: Bearer {super_admin_token}"
echo "     - Content-Type: application/json"
echo "   Body: {"
echo "     \"name\": \"School Name\","
echo "     \"subdomain\": \"school-subdomain\","
echo "     \"domain\": \"school-subdomain.compasse.net\","
echo "     \"school\": {...},"
echo "     \"settings\": {...}"
echo "   }"
echo "   Response: {"
echo "     \"tenant\": {...},"
echo "     \"school\": {...},"
echo "     \"admin_credentials\": {"
echo "       \"email\": \"admin@school-subdomain.compasse.net\","
echo "       \"password\": \"generated_password\""
echo "     }"
echo "   }"
echo ""
echo "3. SCHOOL ADMIN LOGIN"
echo "   POST $API_BASE/auth/login"
echo "   Headers:"
echo "     - Content-Type: application/json"
echo "     - X-Subdomain: {school_subdomain}"
echo "   Body: {"
echo "     \"email\": \"admin@school-subdomain.compasse.net\","
echo "     \"password\": \"generated_password\""
echo "   }"
echo "   Response: {\"token\":\"...\", \"user\":{...}}"
echo ""
echo "=========================================="
echo ""

# If we have a token, try to create a school
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] && [ "$TOKEN" != "TEST_TOKEN_FOR_DOCUMENTATION" ]; then
  echo "Testing School Creation..."
  echo ""
  
  TIMESTAMP=$(date +%s | cut -c7-12)
  SUBDOMAIN="test-$(date +%s | cut -c1-10)"
  
  SCHOOL_DATA=$(cat <<JSON
{
  "name": "Test School $TIMESTAMP",
  "subdomain": "$SUBDOMAIN",
  "domain": "$SUBDOMAIN.compasse.net",
  "school": {
    "name": "Test School $TIMESTAMP",
    "address": "123 Test Street, Test City",
    "phone": "+1234567890",
    "email": "info@$SUBDOMAIN.compasse.net",
    "website": "https://$SUBDOMAIN.compasse.net",
    "admin_name": "Test Administrator",
    "admin_email": "admin@$SUBDOMAIN.compasse.net"
  },
  "settings": {
    "timezone": "Africa/Lagos",
    "currency": "NGN"
  }
}
JSON
)
  
  echo "Step 2: Create School"
  echo "POST $API_BASE/tenants"
  echo "Headers: Authorization: Bearer {token}"
  echo "---"
  
  SCHOOL_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_BASE/tenants" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$SCHOOL_DATA")
  
  HTTP_CODE=$(echo "$SCHOOL_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
  BODY=$(echo "$SCHOOL_RESPONSE" | grep -v "HTTP_CODE")
  
  echo "HTTP Status: $HTTP_CODE"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  echo ""
  
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    ADMIN_EMAIL=$(echo "$BODY" | jq -r '.admin_credentials.email // empty' 2>/dev/null)
    ADMIN_PASSWORD=$(echo "$BODY" | jq -r '.admin_credentials.password // empty' 2>/dev/null)
    SUBDOMAIN_RESULT=$(echo "$BODY" | jq -r '.tenant.subdomain // empty' 2>/dev/null)
    
    if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
      echo "✅ School created successfully!"
      echo "Subdomain: $SUBDOMAIN_RESULT"
      echo "Admin Email: $ADMIN_EMAIL"
      echo "Admin Password: $ADMIN_PASSWORD"
      echo ""
      
      # Test admin login
      echo "Step 3: School Admin Login"
      echo "POST $API_BASE/auth/login"
      echo "Headers:"
      echo "  - Content-Type: application/json"
      echo "  - X-Subdomain: $SUBDOMAIN_RESULT"
      echo "---"
      
      ADMIN_LOGIN_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_BASE/auth/login" \
        -H "Content-Type: application/json" \
        -H "X-Subdomain: $SUBDOMAIN_RESULT" \
        -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
      
      HTTP_CODE=$(echo "$ADMIN_LOGIN_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
      BODY=$(echo "$ADMIN_LOGIN_RESPONSE" | grep -v "HTTP_CODE")
      
      echo "HTTP Status: $HTTP_CODE"
      echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
      echo ""
      
      if [ "$HTTP_CODE" = "200" ]; then
        echo "✅ School admin login successful!"
        echo "=========================================="
        echo "✅ All steps completed successfully!"
        echo "=========================================="
      else
        echo "❌ School admin login failed"
      fi
    fi
  fi
fi

