import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getServerTenant } from "@/lib/tenant"

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

  // Use getServerTenant to identify tenant based on hostname
  const { subdomain, isSuperAdmin } = getServerTenant(request)
  
  const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "compasse.net"; // Ensure consistency

  // Define an array of allowed top-level role-specific routes (login pages)
  const allowedBaseRoutes = [
    "/",
    "/super-admin",
    "/admin",
    "/teacher",
    "/student",
    "/parent",
    "/library",
    "/house",
    "/finance",
    "/quiz",
    "/transport",
  ];

  // If it's the base domain (e.g., compasse.net) AND no tenant subdomain is detected
  // AND the current path is NOT one of the allowed base routes, then redirect to home.
  if (!subdomain && !isSuperAdmin && hostname === BASE_DOMAIN) {
    if (!allowedBaseRoutes.includes(url.pathname)) {
      url.pathname = "/"; // Redirect to the main home page
      return NextResponse.redirect(url);
    }
  }

  // If a subdomain is detected, but it's not the base domain, and the path is a base route
  // that implies non-tenant-specific login, this might need a different handling.
  // For now, if a subdomain is present, allow access to its specific routes.

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