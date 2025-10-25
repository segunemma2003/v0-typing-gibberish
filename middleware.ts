import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getServerTenant } from "@/lib/tenant"

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const url = request.nextUrl.clone()

  // Skip middleware for static files, API routes, and specific file types
  if (url.pathname.startsWith("/_next") || url.pathname.startsWith("/api") || url.pathname.includes(".")) {
    return NextResponse.next()
  }

  const { subdomain, isSuperAdmin } = getServerTenant(request)

  // If it's the base domain (no subdomain and not super admin, or specific base domain for super admin)
  // and trying to access a tenant-specific route, redirect to a generic tenant not found page or main page.
  if (!isSuperAdmin && !subdomain && hostname === (process.env.NEXT_PUBLIC_BASE_DOMAIN || "theqcare.org")) {
    // Example: Redirect non-tenant requests on base domain away from tenant-specific routes
    // You might want to define specific patterns for tenant-specific routes (e.g., /admin, /student)
    // For now, if it's the base domain and not a known tenant, and not super admin, redirect to a safe place.
    if (url.pathname !== '/' && url.pathname !== '/super-admin') { // Allow root and super-admin for base domain
      url.pathname = '/'; // Redirect to home or tenant selection page
      return NextResponse.redirect(url)
    }
  }

  // For any tenant-specific requests (subdomain or custom domain handled by Nginx)
  // Add tenant information to the response headers for client-side processing
  const response = NextResponse.next()

  if (subdomain) {
    response.headers.set('X-Subdomain', subdomain)
  }
  response.headers.set('X-Is-Super-Admin', isSuperAdmin.toString())

  // The TenantProvider will use these headers to initialize currentTenant state on the client
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
