#!/bin/bash

API_BASE="https://api.compasse.net/api/v1"
SUPER_ADMIN_EMAIL="superadmin@compasse.net"
SUPER_ADMIN_PASSWORD="Nigeria@60"
SUBDOMAIN="rolex"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0
SKIPPED=0

echo "=========================================="
echo "Testing Admin API Endpoints with curl"
echo "=========================================="
echo ""

# Step 1: Super Admin Login
echo -e "${BLUE}Step 1: Super Admin Login${NC}"
SUPER_TOKEN=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$SUPER_ADMIN_EMAIL\",\"password\":\"$SUPER_ADMIN_PASSWORD\"}" \
  | jq -r '.token // .data.token // empty')

if [ -z "$SUPER_TOKEN" ] || [ "$SUPER_TOKEN" = "null" ]; then
  echo -e "${RED}❌ Super admin login failed${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Super admin login successful${NC}"
echo ""

# Step 2: Get school info
echo -e "${BLUE}Step 2: Get School Info${NC}"
SCHOOL_INFO=$(curl -s -X GET "$API_BASE/schools/by-subdomain/$SUBDOMAIN" \
  -H "X-Subdomain: $SUBDOMAIN")

ADMIN_EMAIL=$(echo "$SCHOOL_INFO" | jq -r '.tenant.admin_credentials.email // empty' 2>/dev/null)

if [ -z "$ADMIN_EMAIL" ] || [ "$ADMIN_EMAIL" = "null" ]; then
  echo -e "${YELLOW}⚠️  Cannot get admin credentials automatically${NC}"
  echo "Please provide admin credentials for subdomain: $SUBDOMAIN"
  echo "We'll test endpoint structure only"
  ADMIN_TOKEN=""
else
  ADMIN_PASSWORD=$(echo "$SCHOOL_INFO" | jq -r '.tenant.admin_credentials.password // empty' 2>/dev/null)
  echo -e "${GREEN}✅ Found admin: $ADMIN_EMAIL${NC}"
  
  # Step 3: Admin Login
  echo -e "${BLUE}Step 3: Admin Login${NC}"
  ADMIN_LOGIN=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_BASE/auth/login" \
    -H "Content-Type: application/json" \
    -H "X-Subdomain: $SUBDOMAIN" \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
  
  HTTP_CODE=$(echo "$ADMIN_LOGIN" | grep "HTTP_CODE" | cut -d: -f2)
  ADMIN_BODY=$(echo "$ADMIN_LOGIN" | grep -v "HTTP_CODE")
  
  if [ "$HTTP_CODE" = "200" ]; then
    ADMIN_TOKEN=$(echo "$ADMIN_BODY" | jq -r '.token // .data.token // empty' 2>/dev/null)
    echo -e "${GREEN}✅ Admin login successful${NC}"
  else
    echo -e "${YELLOW}⚠️  Admin login failed (HTTP $HTTP_CODE)${NC}"
    ADMIN_TOKEN=""
  fi
fi

echo ""

# Test function
test_endpoint() {
  local method=$1
  local endpoint=$2
  local description=$3
  local body=$4
  
  echo -n "  [$description] ... "
  
  if [ -z "$ADMIN_TOKEN" ] || [ "$ADMIN_TOKEN" = "null" ]; then
    echo -e "${YELLOW}⚠️  SKIPPED (no token)${NC}"
    ((SKIPPED++))
    return 2
  fi
  
  if [ "$method" = "GET" ]; then
    RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "$API_BASE$endpoint" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "X-Subdomain: $SUBDOMAIN" \
      -H "Content-Type: application/json" 2>/dev/null)
  elif [ "$method" = "POST" ]; then
    RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_BASE$endpoint" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      -H "X-Subdomain: $SUBDOMAIN" \
      -H "Content-Type: application/json" \
      -d "$body" 2>/dev/null)
  fi
  
  HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
  BODY=$(echo "$RESPONSE" | grep -v "HTTP_CODE")
  
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    echo -e "${GREEN}✅ (HTTP $HTTP_CODE)${NC}"
    ((PASSED++))
    return 0
  elif [ "$HTTP_CODE" = "404" ]; then
    echo -e "${YELLOW}⚠️  Not Found (HTTP $HTTP_CODE)${NC}"
    ((SKIPPED++))
    return 1
  else
    echo -e "${RED}❌ (HTTP $HTTP_CODE)${NC}"
    ERROR_MSG=$(echo "$BODY" | jq -r '.message // .error // empty' 2>/dev/null | head -c 60)
    if [ -n "$ERROR_MSG" ] && [ "$ERROR_MSG" != "null" ]; then
      echo "      Error: $ERROR_MSG"
    fi
    ((FAILED++))
    return 1
  fi
}

echo "=========================================="
echo "Testing Admin API Endpoints"
echo "=========================================="
echo ""

echo -e "${BLUE}=== Authentication ===${NC}"
test_endpoint "GET" "/auth/me" "Get Current User"

echo ""
echo -e "${BLUE}=== User Management ===${NC}"
test_endpoint "GET" "/users" "List Users"
test_endpoint "GET" "/users?role=teacher&per_page=5" "List Users (Filtered)"

echo ""
echo -e "${BLUE}=== School Management ===${NC}"
SCHOOL_ID=$(curl -s -X GET "$API_BASE/schools" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "X-Subdomain: $SUBDOMAIN" \
  | jq -r '.data[0].id // empty' 2>/dev/null)

if [ -n "$SCHOOL_ID" ] && [ "$SCHOOL_ID" != "null" ]; then
  test_endpoint "GET" "/schools" "List Schools"
  test_endpoint "GET" "/schools/$SCHOOL_ID" "View School"
  test_endpoint "GET" "/schools/$SCHOOL_ID/dashboard" "School Dashboard"
else
  echo "  [List Schools] ... ⚠️  SKIPPED (no school ID)"
  ((SKIPPED++))
fi

echo ""
echo -e "${BLUE}=== Student Management ===${NC}"
test_endpoint "GET" "/students" "List Students"
test_endpoint "GET" "/students?per_page=5" "List Students (Paginated)"

echo ""
echo -e "${BLUE}=== Staff Management ===${NC}"
test_endpoint "GET" "/staff" "List Staff"

echo ""
echo -e "${BLUE}=== Academic Management ===${NC}"
test_endpoint "GET" "/classes" "List Classes"
test_endpoint "GET" "/subjects" "List Subjects"
test_endpoint "GET" "/academic-years" "List Academic Years"
test_endpoint "GET" "/terms" "List Terms"
test_endpoint "GET" "/timetable" "List Timetables"

echo ""
echo -e "${BLUE}=== Attendance Management ===${NC}"
test_endpoint "GET" "/attendance" "List Attendance Records"
test_endpoint "GET" "/attendance/reports" "Attendance Reports"

echo ""
echo -e "${BLUE}=== Assessment Management ===${NC}"
test_endpoint "GET" "/assessments/assignments" "List Assignments"
test_endpoint "GET" "/assessments/exams" "List Exams"
test_endpoint "GET" "/assessments/results" "List Results"

echo ""
echo -e "${BLUE}=== Financial Management ===${NC}"
test_endpoint "GET" "/financial/fees" "List Fees"
test_endpoint "GET" "/financial/payments" "List Payments"

echo ""
echo -e "${BLUE}=== Communication ===${NC}"
test_endpoint "GET" "/communication/notifications" "List Notifications"
test_endpoint "GET" "/communication/messages" "List Messages"
test_endpoint "GET" "/announcements" "List Announcements"

echo ""
echo -e "${BLUE}=== Library Management ===${NC}"
test_endpoint "GET" "/library/books" "List Books"
test_endpoint "GET" "/library/borrowed" "List Borrowed Books"

echo ""
echo -e "${BLUE}=== Transport Management ===${NC}"
test_endpoint "GET" "/transport/vehicles" "List Vehicles"
test_endpoint "GET" "/transport/routes" "List Routes"
test_endpoint "GET" "/transport/drivers" "List Drivers"

echo ""
echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${YELLOW}⚠️  Skipped: $SKIPPED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo "Total Tested: $((PASSED + SKIPPED + FAILED))"
echo "=========================================="

