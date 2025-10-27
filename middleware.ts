import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const url = request.nextUrl.clone()

  // Skip middleware for static files, API routes, and specific file types
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/api") ||
    url.pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Extract subdomain from hostname
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "compasse.net"
  const parts = hostname.split(".")
  
  let subdomain = ""
  let isSuperAdmin = false

  // Check if hostname is a subdomain
  if (hostname.endsWith(`.${baseDomain}`) && parts.length > 2) {
    subdomain = parts[0]
    isSuperAdmin = subdomain === "super-admin" || subdomain === "admin"
  }

  // If it's the base domain without subdomain and not super admin
  if (!isSuperAdmin && !subdomain && hostname === baseDomain) {
    if (url.pathname !== "/" && url.pathname !== "/super-admin") {
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  // Add tenant information to response headers
  const response = NextResponse.next()

  if (subdomain) {
    response.headers.set("X-Subdomain", subdomain)
  }
  response.headers.set("X-Is-Super-Admin", isSuperAdmin.toString())

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}