// Configuration for subdomain-based multi-tenancy

export const config = {
  // Main domain for the application
  mainDomain: process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'compasse.netlify.app',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // Netlify specific configuration
  isNetlifyDeployment: process.env.NETLIFY === 'true',
}

// Helper function to get the main domain
export const getMainDomain = () => {
  if (typeof window !== 'undefined') {
    // Client-side: try to detect from current hostname
    const hostname = window.location.hostname
    if (hostname.includes('.netlify.app')) {
      const parts = hostname.split('.')
      if (parts.length >= 3) {
        // Return the main domain part (e.g., 'compasse.netlify.app' from 'test.compasse.netlify.app')
        return parts.slice(-3).join('.')
      }
    }
  }
  
  return config.mainDomain
}

// Helper function to construct subdomain URLs
export const getSubdomainUrl = (subdomain: string, path = '') => {
  const mainDomain = getMainDomain()
  const protocol = config.isDevelopment ? 'http' : 'https'
  
  if (config.isDevelopment) {
    // In development, we might handle this differently
    return `${protocol}://localhost:3000${path}?school=${subdomain}`
  }
  
  return `${protocol}://${subdomain}.${mainDomain}${path}`
}

// Helper function to get current school subdomain
export const getCurrentSchoolSubdomain = () => {
  if (typeof window === 'undefined') return null
  
  const hostname = window.location.hostname
  
  // Handle localhost development
  if (hostname === 'localhost' || hostname.startsWith('localhost:')) {
    // Try to get from URL params
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('school')
  }
  
  // Handle Netlify subdomains
  if (hostname.includes('.netlify.app')) {
    const parts = hostname.split('.')
    if (parts.length >= 4) {
      return parts[0] // First part is the school subdomain
    }
  }
  
  // Handle custom domains
  const parts = hostname.split('.')
  if (parts.length >= 3) {
    return parts[0]
  }
  
  return null
}
