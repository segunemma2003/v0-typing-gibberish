/**
 * Authentication utility functions
 * Helps debug and verify authentication state
 */

/**
 * Get the current authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

/**
 * Check if user is authenticated (has a token)
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

/**
 * Clear authentication token
 */
export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    console.log('✅ Authentication token cleared')
  }
}

/**
 * Debug authentication state
 */
export const debugAuth = (): void => {
  if (typeof window === 'undefined') {
    console.log('🔍 Auth Debug: Running on server-side (no localStorage)')
    return
  }
  
  const token = getAuthToken()
  console.log('🔍 Auth Debug:')
  console.log('  - Has Token:', !!token)
  console.log('  - Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'N/A')
  console.log('  - Token Length:', token?.length || 0)
  console.log('  - Is Authenticated:', isAuthenticated())
}

