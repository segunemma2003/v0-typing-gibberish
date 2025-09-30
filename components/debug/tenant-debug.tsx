"use client"

import { useTenant } from "@/lib/tenant"
import { useAuth } from "@/hooks/use-auth"

export function TenantDebug() {
  const { currentSchool, subdomain, isSuperAdmin, isLoading } = useTenant()
  const { user, isAuthenticated } = useAuth()

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🐛 Debug Info</h3>
      <div className="space-y-1">
        <div><strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</div>
        <div><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</div>
        <div><strong>Tenant Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
        <div><strong>Is Super Admin:</strong> {isSuperAdmin ? 'Yes' : 'No'}</div>
        <div><strong>Subdomain:</strong> {subdomain || 'None'}</div>
        <div><strong>Current School:</strong> {currentSchool?.name || 'None'}</div>
        <div><strong>School ID:</strong> {currentSchool?.id || 'None'}</div>
        <div><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
        <div><strong>User:</strong> {user?.name || 'None'}</div>
        <div><strong>User Role:</strong> {user?.role || 'None'}</div>
        <div><strong>User School ID:</strong> {user?.schoolId || 'None'}</div>
        <div><strong>School Match:</strong> {currentSchool && user ? (user.schoolId === currentSchool.id ? 'Yes' : 'No') : 'N/A'}</div>
      </div>
    </div>
  )
}
