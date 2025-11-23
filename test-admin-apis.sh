#!/bin/bash

API_BASE="https://api.compasse.net/api/v1"
SUPER_ADMIN_EMAIL="superadmin@compasse.net"
SUPER_ADMIN_PASSWORD="Nigeria@60"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Testing Admin API Endpoints"
echo "=========================================="
echo ""

# Step 1: Super Admin Login
echo "Step 1: Super Admin Login"
TOKEN=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SUPER_ADMIN_EMAIL\",\"password\":\"$SUPER_ADMIN_PASSWORD\"}" \
  | jq -r '.token // .data.token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo -e "${RED}❌ Super admin login failed${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Super admin login successful${NC}"
echo "Token: ${TOKEN:0:50}..."
echo ""

# Step 2: Create a test school for admin API testing
echo "Step 2: Create Test School"
TIMESTAMP=$(date +%s | cut -c7-12)
SUBDOMAIN="test-admin-${TIMESTAMP}"
SCHOOL_DATA=$(cat <<JSON
{
  "name": "Test Admin School ${TIMESTAMP}",
  "subdomain": "${SUBDOMAIN}",
  "domain": "${SUBDOMAIN}.compasse.net",
  "school": {
    "name": "Test Admin School ${TIMESTAMP}",
    "address": "123 Test Street",
    "phone": "+1234567890",
    "email": "info@${SUBDOMAIN}.compasse.net",
    "website": "https://${SUBDOMAIN}.compasse.net",
    "admin_name": "Test Admin",
    "admin_email": "admin@${SUBDOMAIN}.compasse.net"
  },
  "settings": {
    "timezone": "Africa/Lagos",
    "currency": "NGN"
  }
}
JSON
)

SCHOOL_RESPONSE=$(curl -s -X POST "$API_BASE/tenants" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "$SCHOOL_DATA")

ADMIN_EMAIL=$(echo "$SCHOOL_RESPONSE" | jq -r '.admin_credentials.email // .tenant.admin_credentials.email // empty')
ADMIN_PASSWORD=$(echo "$SCHOOL_RESPONSE" | jq -r '.admin_credentials.password // .tenant.admin_credentials.password // empty')

if [ -z "$ADMIN_EMAIL" ] || [ "$ADMIN_EMAIL" = "null" ]; then
  echo -e "${RED}❌ School creation failed${NC}"
  echo "$SCHOOL_RESPONSE" | jq '.'
  exit 1
fi

echo -e "${GREEN}✅ School created successfully${NC}"
echo "Subdomain: $SUBDOMAIN"
echo "Admin Email: $ADMIN_EMAIL"
echo "Admin Password: $ADMIN_PASSWORD"
echo ""

# Step 3: Admin Login with X-Subdomain header
echo "Step 3: Admin Login (with X-Subdomain header)"
ADMIN_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -H "X-Subdomain: $SUBDOMAIN" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

HTTP_CODE=$(echo "$ADMIN_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
ADMIN_BODY=$(echo "$ADMIN_RESPONSE" | grep -v "HTTP_CODE")

if [ "$HTTP_CODE" != "200" ]; then
  echo -e "${RED}❌ Admin login failed${NC}"
  echo "$ADMIN_BODY" | jq '.'
  exit 1
fi

ADMIN_TOKEN=$(echo "$ADMIN_BODY" | jq -r '.token // .data.token // empty')
echo -e "${GREEN}✅ Admin login successful${NC}"
echo "Admin Token: ${ADMIN_TOKEN:0:50}..."
echo ""

# Step 4: Test Admin API Endpoints
echo "=========================================="
echo "Testing Admin API Endpoints"
echo "=========================================="
echo ""

test_endpoint() {
  local method=$1
  local endpoint=$2
  local description=$3
  local body=$4
  
  echo -n "Testing: $description ... "
  
  if [ "$method" = "GET" ]; then
    RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$API_BASE$endpoint" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "X-Subdomain: $SUBDOMAIN" \
      -H "Content-Type: application/json")
  elif [ "$method" = "POST" ]; then
    RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_BASE$endpoint" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "X-Subdomain: $SUBDOMAIN" \
      -H "Content-Type: application/json" \
      -d "$body")
  elif [ "$method" = "PUT" ]; then
    RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X PUT "$API_BASE$endpoint" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "X-Subdomain: $SUBDOMAIN" \
      -H "Content-Type: application/json" \
      -d "$body")
  elif [ "$method" = "DELETE" ]; then
    RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X DELETE "$API_BASE$endpoint" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "X-Subdomain: $SUBDOMAIN" \
      -H "Content-Type: application/json")
  fi
  
  HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
  BODY=$(echo "$RESPONSE" | grep -v "HTTP_CODE")
  
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "204" ]; then
    echo -e "${GREEN}✅ (HTTP $HTTP_CODE)${NC}"
    return 0
  else
    echo -e "${YELLOW}⚠️  (HTTP $HTTP_CODE)${NC}"
    echo "  Response: $(echo "$BODY" | jq -r '.message // .error // .' | head -c 100)"
    return 1
  fi
}

# Test authentication endpoints
echo "=== Authentication ==="
test_endpoint "GET" "/auth/me" "Get Current User"
test_endpoint "POST" "/auth/logout" "Logout" "{}"

# Re-login after logout
ADMIN_TOKEN=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -H "X-Subdomain: $SUBDOMAIN" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
  | jq -r '.token // .data.token // empty')

echo ""
echo "=== User Management ==="
test_endpoint "GET" "/users" "List Users"
test_endpoint "GET" "/users?role=teacher&per_page=5" "List Users with Filters"

echo ""
echo "=== School Management ==="
SCHOOL_ID=$(curl -s -X GET "$API_BASE/schools" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "X-Subdomain: $SUBDOMAIN" \
  | jq -r '.data[0].id // empty')

if [ -n "$SCHOOL_ID" ] && [ "$SCHOOL_ID" != "null" ]; then
  test_endpoint "GET" "/schools/$SCHOOL_ID" "View School"
  test_endpoint "GET" "/schools/$SCHOOL_ID/dashboard" "School Dashboard"
fi

echo ""
echo "=== Student Management ==="
test_endpoint "GET" "/students" "List Students"
test_endpoint "GET" "/students?per_page=5" "List Students with Pagination"

echo ""
echo "=== Staff Management ==="
test_endpoint "GET" "/staff" "List Staff"

echo ""
echo "=== Academic Management ==="
test_endpoint "GET" "/classes" "List Classes"
test_endpoint "GET" "/subjects" "List Subjects"
test_endpoint "GET" "/academic-years" "List Academic Years"
test_endpoint "GET" "/terms" "List Terms"
test_endpoint "GET" "/timetable" "List Timetables"

echo ""
echo "=== Attendance Management ==="
test_endpoint "GET" "/attendance" "List Attendance Records"
test_endpoint "GET" "/attendance/reports" "Attendance Reports"

echo ""
echo "=== Assessment Management ==="
test_endpoint "GET" "/assessments/assignments" "List Assignments"
test_endpoint "GET" "/assessments/exams" "List Exams"
test_endpoint "GET" "/assessments/results" "List Results"

echo ""
echo "=== Financial Management ==="
test_endpoint "GET" "/financial/fees" "List Fees"
test_endpoint "GET" "/financial/payments" "List Payments"

echo ""
echo "=== Communication ==="
test_endpoint "GET" "/communication/notifications" "List Notifications"
test_endpoint "GET" "/communication/messages" "List Messages"
test_endpoint "GET" "/announcements" "List Announcements"

echo ""
echo "=== Library Management ==="
test_endpoint "GET" "/library/books" "List Books"
test_endpoint "GET" "/library/borrowed" "List Borrowed Books"

echo ""
echo "=== Transport Management ==="
test_endpoint "GET" "/transport/vehicles" "List Vehicles"
test_endpoint "GET" "/transport/routes" "List Routes"
test_endpoint "GET" "/transport/drivers" "List Drivers"

echo ""
echo "=========================================="
echo "Test Complete"
echo "=========================================="

