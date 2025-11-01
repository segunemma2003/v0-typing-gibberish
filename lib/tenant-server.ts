// Server-side tenant utilities
// This file should NOT have "use client" directive

/**
 * Extract tenant information from hostname
 * This is a pure function that works on both client and server
 */
export const getTenantFromHostname = (hostname: string) => {
  const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "compasse.net"

  // Ensure BASE_DOMAIN is always a string for split operations
  const baseDomainParts = BASE_DOMAIN.split('.')

  // Handle localhost development
  if (hostname === "localhost" || hostname.startsWith("localhost:")) {
    return {
      subdomain: null,
      isSuperAdmin: true,
    }
  }

  // Handle subdomains (e.g., demo.yourbase.com)
  if (hostname.includes(`.${BASE_DOMAIN}`)) {
    const parts = hostname.split('.')
    
    // Check if it's a valid base domain
    if (
      parts[parts.length - baseDomainParts.length] === baseDomainParts[0] &&
      parts[parts.length - 1] === baseDomainParts[baseDomainParts.length - 1]
    ) {
      // If it's the main site (yourbase.com), treat as super admin
      if (parts.length === baseDomainParts.length) {
        return {
          subdomain: null,
          isSuperAdmin: true,
        }
      }
      
      // If it's a subdomain (e.g., demo.yourbase.com), extract subdomain
      if (parts.length > baseDomainParts.length) {
        return {
          subdomain: parts[0],
          isSuperAdmin: false,
        }
      }
    }
  }

  // For custom domains, we'll rely on API calls to match the full hostname to a tenant's domain.
  // Default to non-super-admin with null subdomain, and initializeTenant will resolve.
  return {
    subdomain: null,
    isSuperAdmin: false, // Assume not super admin unless explicitly matched to base domain or localhost
  }
}

/**
 * Server-side tenant detection utility for middleware
 * @param request - NextRequest or Request object
 * @returns Tenant information based on hostname
 */
export const getServerTenant = (request: Request) => {
  try {
    const url = new URL(request.url)
    const hostname = url.hostname

    return getTenantFromHostname(hostname)
  } catch (error) {
    // If URL parsing fails, return safe defaults
    console.error("getServerTenant: Error parsing request URL:", error)
    return {
      subdomain: null,
      isSuperAdmin: false,
    }
  }
}

