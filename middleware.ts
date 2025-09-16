import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const url = request.nextUrl.clone()

  // Skip middleware for static files and API routes
  if (url.pathname.startsWith("/_next") || url.pathname.startsWith("/api") || url.pathname.includes(".")) {
    return NextResponse.next()
  }

  // Extract subdomain
  const subdomain = getSubdomain(hostname)

  // Super admin domain (no subdomain)
  if (!subdomain) {
    // Allow super admin routes
    if (url.pathname.startsWith("/super-admin")) {
      return NextResponse.next()
    }

    // Redirect other routes to super admin login
    if (url.pathname !== "/") {
      url.pathname = "/"
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  // School subdomain
  // Block access to super admin routes from school subdomains
  if (url.pathname.startsWith("/super-admin")) {
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // Add tenant info to headers for client-side access
  const response = NextResponse.next()
  response.headers.set("x-tenant-subdomain", subdomain)
  response.headers.set("x-tenant-hostname", hostname)

  return response
}

function getSubdomain(hostname: string): string | null {
  // Handle localhost development
  if (hostname === "localhost" || hostname.startsWith("localhost:")) {
    return null
  }

  // Extract subdomain from hostname
  const parts = hostname.split(".")

  // Need at least 3 parts for a subdomain (subdomain.domain.tld)
  if (parts.length < 3) {
    return null
  }

  // Return the first part as subdomain
  return parts[0]
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
