# API Testing Guide

This guide explains how to test all API endpoints to verify they match the documented response formats.

## Quick Start

### Option 1: Bash Script (Recommended)

```bash
# Set environment variables
export API_BASE_URL="https://api.compasse.net/api/v1"
export TOKEN="your-token-here"
export TENANT_ID="your-tenant-id"

# Run the test script
./test-api-endpoints.sh
```

### Option 2: Node.js Script

```bash
# Set environment variables
export API_BASE_URL="https://api.compasse.net/api/v1"
export TOKEN="your-token-here"
export TENANT_ID="your-tenant-id"
export TEST_EMAIL="admin@school.com"
export TEST_PASSWORD="Password@12345"

# Run the Node.js test script
node test-api.js
```

### Option 3: Manual curl Testing

```bash
# 1. Login to get token
TOKEN=$(curl -X POST "https://api.compasse.net/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"Password@12345"}' \
  | jq -r '.token')

# 2. Test an endpoint
curl -X GET "https://api.compasse.net/api/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-ID: your-tenant-id" \
  | jq '.'
```

## Response Format Verification

### Fixed Issues

1. **`/auth/me`** - Now correctly extracts `user` from `{ user: {...} }` response
2. **`/tenants/{id}`** - Now correctly extracts `tenant` from `{ tenant: {...} }` response  
3. **`/schools/{id}`** - Now correctly extracts `school` from `{ school: {...} }` response
4. **Dashboard endpoints** - All handle `{ dashboard: {...} }` wrapper correctly

### Response Patterns

The API uses these response patterns:

1. **Single Resource with Wrapper:**
   ```json
   {
     "resource": { "id": 1, ... }
   }
   ```
   Our code extracts: `response.data.resource || response.data`

2. **List with Pagination:**
   ```json
   {
     "data": [...],
     "links": { "first": "...", "last": "...", "prev": null, "next": null },
     "meta": { "current_page": 1, "per_page": 15, "total": 100 }
   }
   ```
   Our interfaces handle this with optional `links` and `meta` properties.

3. **Success Message:**
   ```json
   {
     "message": "Operation successful"
   }
   ```
   Our code returns: `response.data`

4. **Error Response:**
   ```json
   {
     "error": "Error type",
     "message": "Error description"
   }
   ```
   Handled by axios interceptors in `apiClient.ts`

## Testing Checklist

### Authentication Endpoints
- [ ] POST `/auth/login` - Returns `{ message, token, user }`
- [ ] POST `/auth/register` - Returns `{ message, user, token }`
- [ ] GET `/auth/me` - Returns `{ user: {...} }` ✓ Fixed
- [ ] POST `/auth/logout` - Returns `{ message }`
- [ ] POST `/auth/forgot-password` - Returns `{ message, token? }`
- [ ] POST `/auth/reset-password` - Returns `{ message }`
- [ ] POST `/auth/refresh-token` - Returns `{ token, token_type }`

### Tenant Management
- [ ] GET `/tenants` - Returns paginated list
- [ ] GET `/tenants/{id}` - Returns `{ tenant: {...} }` ✓ Fixed
- [ ] GET `/tenants/{id}/stats` - Returns `{ stats: {...} }`

### School Management
- [ ] GET `/schools` - Returns paginated list
- [ ] GET `/schools/{id}` - Returns `{ school: {...}, stats: {...} }` ✓ Fixed
- [ ] GET `/schools/{id}/stats` - Returns `{ stats: {...} }`
- [ ] GET `/schools/{id}/dashboard` - Returns `{ dashboard: {...} }`
- [ ] GET `/schools/subdomain/{subdomain}` - Returns school info

### Student Management
- [ ] GET `/students` - Returns paginated list with `data`, `links`, `meta`
- [ ] GET `/students/{id}` - Returns student object
- [ ] GET `/students/{id}/attendance` - Returns attendance data
- [ ] GET `/students/{id}/results` - Returns results data
- [ ] POST `/students` - Returns `{ message, student: {...} }`

### Other Endpoints
- [ ] All list endpoints return paginated structure
- [ ] All single resource endpoints return wrapped or direct object
- [ ] All dashboard endpoints return `{ dashboard: {...} }`
- [ ] All error responses follow standard format

## Common Issues

### Issue: 401 Unauthorized
**Solution:** Make sure you have a valid token:
```bash
TOKEN=$(curl -X POST "${API_BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email","password":"your-password"}' \
  | jq -r '.token')
```

### Issue: 404 Not Found
**Solution:** Check that:
1. The endpoint path is correct
2. The resource ID exists
3. You have permission to access it

### Issue: Response format mismatch
**Solution:** Check the API documentation and verify:
1. The response wrapper (e.g., `{ user: {...} }` vs direct object)
2. Pagination structure for list endpoints
3. Nested object structure

## Verification Results

All TypeScript interfaces have been verified against the API documentation:

✅ **Authentication** - All endpoints match documented format
✅ **Tenant Management** - Response extraction fixed
✅ **School Management** - Response extraction fixed  
✅ **Student Management** - Pagination structure correct
✅ **Dashboard Endpoints** - Wrapper handling correct
✅ **List Endpoints** - Pagination structure correct
✅ **Error Handling** - Standard format handled

## Next Steps

1. Run the test scripts with your actual API credentials
2. Verify each endpoint returns the expected format
3. Update any interfaces that don't match actual responses
4. Document any API inconsistencies found during testing

