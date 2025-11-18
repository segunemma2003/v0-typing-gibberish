#!/bin/bash

# API Endpoint Testing Script
# This script tests all API endpoints using curl
# Make sure to set your API_BASE_URL and TOKEN before running

API_BASE_URL="${API_BASE_URL:-https://api.compasse.net/api/v1}"
TOKEN="${TOKEN:-}"
TENANT_ID="${TENANT_ID:-}"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to make API call
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -e "\n${YELLOW}Testing: ${description}${NC}"
    echo "Endpoint: ${method} ${endpoint}"
    
    if [ -z "$TOKEN" ] && [[ "$endpoint" != *"auth/login"* ]] && [[ "$endpoint" != *"auth/register"* ]] && [[ "$endpoint" != *"health"* ]]; then
        echo -e "${RED}⚠️  TOKEN not set. Skipping authenticated endpoint.${NC}"
        return
    fi
    
    local headers=(-H "Content-Type: application/json")
    if [ ! -z "$TOKEN" ]; then
        headers+=(-H "Authorization: Bearer $TOKEN")
    fi
    if [ ! -z "$TENANT_ID" ]; then
        headers+=(-H "X-Tenant-ID: $TENANT_ID")
    fi
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -X GET "${API_BASE_URL}${endpoint}" "${headers[@]}")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST "${API_BASE_URL}${endpoint}" "${headers[@]}" -d "$data")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X PUT "${API_BASE_URL}${endpoint}" "${headers[@]}" -d "$data")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE "${API_BASE_URL}${endpoint}" "${headers[@]}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✅ Success (HTTP $http_code)${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo -e "${RED}❌ Failed (HTTP $http_code)${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    fi
}

echo "=========================================="
echo "API Endpoint Testing Script"
echo "=========================================="
echo "API Base URL: $API_BASE_URL"
echo "Token: ${TOKEN:0:20}..." 
echo "Tenant ID: $TENANT_ID"
echo "=========================================="

# 1. HEALTH CHECK
api_call "GET" "/api/health" "" "Health Check"

# 2. AUTHENTICATION
echo -e "\n${YELLOW}=== AUTHENTICATION ENDPOINTS ===${NC}"

# Login
api_call "POST" "/auth/login" '{"email":"admin@school.com","password":"Password@12345"}' "User Login"

# Register (commented out - requires valid data)
# api_call "POST" "/auth/register" '{"name":"Test User","email":"test@example.com","password":"Password@12345","password_confirmation":"Password@12345","role":"student","tenant_id":1,"school_id":1}' "User Registration"

# Get Current User (requires token)
api_call "GET" "/auth/me" "" "Get Current User"

# Forgot Password
api_call "POST" "/auth/forgot-password" '{"email":"user@example.com"}' "Forgot Password"

# Logout (requires token)
api_call "POST" "/auth/logout" "" "User Logout"

# 3. TENANT MANAGEMENT (Super Admin)
echo -e "\n${YELLOW}=== TENANT MANAGEMENT ===${NC}"
api_call "GET" "/tenants" "" "List Tenants"
api_call "GET" "/tenants/1" "" "Get Tenant by ID"
api_call "GET" "/tenants/1/stats" "" "Get Tenant Stats"

# 4. SCHOOL MANAGEMENT
echo -e "\n${YELLOW}=== SCHOOL MANAGEMENT ===${NC}"
api_call "GET" "/schools" "" "List Schools"
api_call "GET" "/schools/1" "" "Get School by ID"
api_call "GET" "/schools/subdomain/test" "" "Get School by Subdomain"
api_call "GET" "/schools/1/stats" "" "Get School Stats"
api_call "GET" "/schools/1/dashboard" "" "Get School Dashboard"
api_call "GET" "/schools/1/organogram" "" "Get School Organogram"

# 5. USER MANAGEMENT
echo -e "\n${YELLOW}=== USER MANAGEMENT ===${NC}"
api_call "GET" "/users" "" "List Users"
api_call "GET" "/users?role=teacher&status=active" "" "List Users with Filters"
api_call "GET" "/users/1" "" "Get User by ID"

# 6. STUDENT MANAGEMENT
echo -e "\n${YELLOW}=== STUDENT MANAGEMENT ===${NC}"
api_call "GET" "/students" "" "List Students"
api_call "GET" "/students?class_id=1&search=john" "" "List Students with Filters"
api_call "GET" "/students/1" "" "Get Student by ID"
api_call "GET" "/students/1/attendance" "" "Get Student Attendance"
api_call "GET" "/students/1/results" "" "Get Student Results"

# 7. TEACHER MANAGEMENT
echo -e "\n${YELLOW}=== TEACHER MANAGEMENT ===${NC}"
api_call "GET" "/teachers" "" "List Teachers"
api_call "GET" "/teachers/1" "" "Get Teacher by ID"

# 8. GUARDIAN MANAGEMENT
echo -e "\n${YELLOW}=== GUARDIAN MANAGEMENT ===${NC}"
api_call "GET" "/guardians" "" "List Guardians"
api_call "GET" "/guardians/1" "" "Get Guardian by ID"

# 9. ACADEMIC MANAGEMENT
echo -e "\n${YELLOW}=== ACADEMIC MANAGEMENT ===${NC}"
api_call "GET" "/classes" "" "List Classes"
api_call "GET" "/subjects" "" "List Subjects"

# 10. ANNOUNCEMENTS
echo -e "\n${YELLOW}=== ANNOUNCEMENTS ===${NC}"
api_call "GET" "/announcements" "" "List Announcements"
api_call "GET" "/announcements/1" "" "Get Announcement by ID"

# 11. ASSIGNMENTS
echo -e "\n${YELLOW}=== ASSIGNMENTS ===${NC}"
api_call "GET" "/assignments" "" "List Assignments"
api_call "GET" "/assignments/1" "" "Get Assignment by ID"
api_call "GET" "/assignments/1/submissions" "" "Get Assignment Submissions"

# 12. QUIZ SYSTEM
echo -e "\n${YELLOW}=== QUIZ SYSTEM ===${NC}"
api_call "GET" "/quizzes" "" "List Quizzes"
api_call "GET" "/quizzes/1" "" "Get Quiz by ID"
api_call "GET" "/quizzes/1/questions" "" "Get Quiz Questions"
api_call "GET" "/quizzes/1/attempts" "" "Get Quiz Attempts"
api_call "GET" "/quizzes/1/results" "" "Get Quiz Results"

# 13. GRADES
echo -e "\n${YELLOW}=== GRADES ===${NC}"
api_call "GET" "/grades" "" "List Grades"
api_call "GET" "/grades/student/1" "" "Get Student Grades"
api_call "GET" "/grades/class/1" "" "Get Class Grades"

# 14. TIMETABLE
echo -e "\n${YELLOW}=== TIMETABLE ===${NC}"
api_call "GET" "/timetable" "" "Get Timetable"
api_call "GET" "/timetable/class/1" "" "Get Class Timetable"
api_call "GET" "/timetable/teacher/1" "" "Get Teacher Timetable"

# 15. LIBRARY
echo -e "\n${YELLOW}=== LIBRARY ===${NC}"
api_call "GET" "/library/books" "" "List Books"
api_call "GET" "/library/books/1" "" "Get Book by ID"
api_call "GET" "/library/borrowed" "" "List Borrowed Books"
api_call "GET" "/library/digital-resources" "" "List Digital Resources"
api_call "GET" "/library/members" "" "List Library Members"
api_call "GET" "/library/stats" "" "Get Library Stats"

# 16. FINANCE
echo -e "\n${YELLOW}=== FINANCE ===${NC}"
api_call "GET" "/financial/fees" "" "List Fees"
api_call "GET" "/financial/fees/1" "" "Get Fee by ID"
api_call "GET" "/financial/fees/student/1" "" "Get Student Fees"
api_call "GET" "/financial/fees/structure" "" "Get Fee Structure"
api_call "GET" "/financial/payments" "" "List Payments"
api_call "GET" "/financial/payments/1" "" "Get Payment by ID"

# 17. HOUSES
echo -e "\n${YELLOW}=== HOUSES ===${NC}"
api_call "GET" "/houses" "" "List Houses"
api_call "GET" "/houses/1" "" "Get House by ID"
api_call "GET" "/houses/1/members" "" "Get House Members"
api_call "GET" "/houses/1/points" "" "Get House Points"
api_call "GET" "/houses/competitions" "" "Get House Competitions"

# 18. SPORTS
echo -e "\n${YELLOW}=== SPORTS ===${NC}"
api_call "GET" "/sports/activities" "" "List Sports Activities"
api_call "GET" "/sports/teams" "" "List Sports Teams"
api_call "GET" "/sports/events" "" "List Sports Events"

# 19. INVENTORY
echo -e "\n${YELLOW}=== INVENTORY ===${NC}"
api_call "GET" "/inventory/items" "" "List Inventory Items"
api_call "GET" "/inventory/categories" "" "List Inventory Categories"

# 20. EVENTS
echo -e "\n${YELLOW}=== EVENTS ===${NC}"
api_call "GET" "/events/events" "" "List Events"
api_call "GET" "/events/upcoming" "" "Get Upcoming Events"
api_call "GET" "/events/calendars" "" "List Calendars"

# 21. TRANSPORT
echo -e "\n${YELLOW}=== TRANSPORT ===${NC}"
api_call "GET" "/transport/routes" "" "List Transport Routes"
api_call "GET" "/transport/vehicles" "" "List Vehicles"
api_call "GET" "/transport/drivers" "" "List Drivers"
api_call "GET" "/transport/students" "" "List Student Transport"

# 22. LIVESTREAM
echo -e "\n${YELLOW}=== LIVESTREAM ===${NC}"
api_call "GET" "/livestreams/livestreams" "" "List Livestreams"
api_call "GET" "/livestreams/livestreams/1" "" "Get Livestream by ID"

# 23. COMMUNICATION
echo -e "\n${YELLOW}=== COMMUNICATION ===${NC}"
api_call "GET" "/communication/messages" "" "List Messages"
api_call "GET" "/communication/notifications" "" "List Notifications"

# 24. DASHBOARDS
echo -e "\n${YELLOW}=== DASHBOARDS ===${NC}"
api_call "GET" "/dashboard/admin" "" "Admin Dashboard"
api_call "GET" "/dashboard/teacher" "" "Teacher Dashboard"
api_call "GET" "/dashboard/student" "" "Student Dashboard"
api_call "GET" "/dashboard/parent" "" "Parent Dashboard"
api_call "GET" "/dashboard/super-admin" "" "Super Admin Dashboard"

# 25. REPORTS
echo -e "\n${YELLOW}=== REPORTS ===${NC}"
api_call "GET" "/reports/attendance" "" "Attendance Report"
api_call "GET" "/reports/academic" "" "Academic Report"
api_call "GET" "/reports/financial" "" "Financial Report"

# 26. STAFF
echo -e "\n${YELLOW}=== STAFF ===${NC}"
api_call "GET" "/staff" "" "List Staff"

# 27. ACHIEVEMENTS
echo -e "\n${YELLOW}=== ACHIEVEMENTS ===${NC}"
api_call "GET" "/achievements" "" "List Achievements"
api_call "GET" "/achievements/student/1" "" "Get Student Achievements"

# 28. SUBSCRIPTIONS
echo -e "\n${YELLOW}=== SUBSCRIPTIONS ===${NC}"
api_call "GET" "/subscriptions/plans" "" "List Subscription Plans"
api_call "GET" "/subscriptions" "" "List Subscriptions"

# 29. SUPER ADMIN
echo -e "\n${YELLOW}=== SUPER ADMIN ===${NC}"
api_call "GET" "/super-admin/analytics" "" "System Analytics"
api_call "GET" "/super-admin/database" "" "Database Status"
api_call "GET" "/super-admin/security" "" "Security Logs"

echo -e "\n${GREEN}=========================================="
echo "Testing Complete!"
echo "==========================================${NC}"

