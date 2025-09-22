import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || ""
  const url = request.nextUrl.clone()

  // Skip middleware for static files and API routes
  if (url.pathname.startsWith("/_next") || url.pathname.startsWith("/api") || url.pathname.includes(".")) {
    return NextResponse.next()
  }

  // Handle subdomain detection for Netlify
  const subdomain = getSubdomain(hostname)

  if (subdomain) {
    // If someone tries to access a subdomain, redirect to URL parameter approach
    // This avoids SSL certificate issues with Netlify subdomains
    const mainDomain = getMainDomain(hostname)
    const redirectUrl = `https://${mainDomain}?school=${subdomain}`
    
    return NextResponse.redirect(redirectUrl, 301)
  }

  // For main domain, continue normally
  return NextResponse.next()
}

function getSubdomain(hostname: string): string | null {
  // Handle localhost development
  if (hostname === "localhost" || hostname.startsWith("localhost:")) {
    return null
  }

  // Handle Netlify domains specially
  if (hostname.includes('.netlify.app')) {
    const parts = hostname.split('.')
    
    // For Netlify: subdomain.mainsite.netlify.app (4 parts) = has subdomain
    // mainsite.netlify.app (3 parts) = no subdomain
    if (parts.length === 4 && parts[parts.length - 2] === 'netlify' && parts[parts.length - 1] === 'app') {
      return parts[0] // Return the first part as subdomain
    }
    
    // Main Netlify site (3 parts) - no subdomain
    if (parts.length === 3 && parts[parts.length - 2] === 'netlify' && parts[parts.length - 1] === 'app') {
      return null
    }
  }

  // Extract subdomain from hostname for custom domains
  const parts = hostname.split(".")

  // Need at least 3 parts for a subdomain (subdomain.domain.tld)
  if (parts.length < 3) {
    return null
  }

  // Return the first part as subdomain
  return parts[0]
}

function getMainDomain(hostname: string): string {
  // For Netlify domains, extract the main domain
  if (hostname.includes('.netlify.app')) {
    const parts = hostname.split('.')
    if (parts.length >= 4) {
      // Return mainsite.netlify.app from subdomain.mainsite.netlify.app
      return parts.slice(1).join('.')
    }
  }
  
  // For custom domains, extract main domain
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    return parts.slice(1).join('.')
  }
  
  return hostname
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
