# Subdomain API Update

## Changes Made

Updated the subdomain school lookup to use the correct API endpoint without authentication.

### API Endpoint
- **Old:** `GET /api/v1/schools/subdomain/{subdomain}` (with auth)
- **New:** `GET /api/v1/schools/by-subdomain/{subdomain}` (no auth required)

### Response Structure
```typescript
{
  exists: boolean;
  success: boolean;
  school: {
    id: number;
    name: string;
    code: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo: string | null;
    status: string;
    ...
  };
  tenant: {
    id: string; // UUID
    name: string;
    subdomain: string;
    status: string;
  };
}
```

## Files Modified

### 1. `lib/api/public.ts`
- ✅ Created separate `publicApiClient` without authentication interceptors
- ✅ Updated endpoint from `/schools/subdomain/` to `/schools/by-subdomain/`
- ✅ Updated response interface to match API specification:
  - Added `exists: boolean` field
  - Updated `TenantInfo.id` to `string` (UUID)
  - Updated `SchoolInfo` to include `code` field
  - Made `logo` nullable (`string | null`)

### 2. `lib/tenant.ts`
- ✅ Updated to check `exists` field in response
- ✅ Updated to handle `tenant.id` as string (UUID)
- ✅ Updated to use `school.id` for `currentSchool.id`
- ✅ Added comments documenting the API endpoint

## How It Works

1. **When a subdomain is detected** (e.g., `excellence-academy.theqcare.org`):
   - The `initializeTenant` function extracts the subdomain: `excellence-academy`
   - Calls `publicService.getSchoolBySubdomain('excellence-academy')`
   - Makes a **public API call** (no authentication token required)
   - Endpoint: `GET /api/v1/schools/by-subdomain/excellence-academy`

2. **Response Handling**:
   - Checks `exists` and `success` fields
   - Maps API response to internal `Tenant` format
   - Sets tenant and school information in the store
   - Handles errors gracefully (404, network errors, etc.)

## Usage

The API is automatically called when:
- A user visits a subdomain (e.g., `demo.theqcare.org`)
- The `TenantProvider` component initializes
- The `initializeTenant` function is called

### Manual Usage

```typescript
import { publicService } from '@/lib/api/public';

// Get school by subdomain (no auth required)
const response = await publicService.getSchoolBySubdomain('excellence-academy');

if (response.exists && response.success) {
  console.log('School:', response.school.name);
  console.log('Tenant:', response.tenant.name);
}
```

### Using React Query Hook

```typescript
import { useSchoolBySubdomain } from '@/lib/api/public';

function MyComponent() {
  const { data, isLoading, error } = useSchoolBySubdomain('excellence-academy');
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (data?.exists) {
    return <div>School: {data.school.name}</div>;
  }
}
```

## Testing

To test the API endpoint:

```bash
# Test with curl
curl https://api.compasse.net/api/v1/schools/by-subdomain/excellence-academy

# Expected response:
{
  "exists": true,
  "success": true,
  "school": {
    "id": 1,
    "name": "Excellence Academy",
    "code": "EXA",
    ...
  },
  "tenant": {
    "id": "337a653f-86f6-4a2f-921e-325166733ae5",
    "name": "Excellence Academy School",
    "subdomain": "excellence-academy",
    "status": "active"
  }
}
```

## Notes

- ✅ **No authentication required** - This is a public endpoint
- ✅ **Automatic subdomain detection** - Works when visiting subdomain URLs
- ✅ **Error handling** - Gracefully handles 404s and network errors
- ✅ **Type-safe** - Full TypeScript support with proper interfaces

## Related Files

- `lib/api/public.ts` - Public API service (no auth)
- `lib/api/apiClient.ts` - Authenticated API client
- `lib/tenant.ts` - Tenant initialization logic
- `components/tenant/tenant-provider.tsx` - Tenant provider component

