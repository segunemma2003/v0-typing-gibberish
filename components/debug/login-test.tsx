"use client"

import { useTenant } from "@/lib/tenant"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginTest() {
  const { currentSchool, subdomain, isLoading } = useTenant()
  const { login, user, isAuthenticated } = useAuth()

  const testLogin = async () => {
    console.log("=== TEST LOGIN ===")
    console.log("Current School:", currentSchool)
    console.log("Subdomain:", subdomain)
    
    const success = await login("admin@school.edu", "password123")
    console.log("Login success:", success)
    console.log("User after login:", useAuth.getState().user)
  }

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  return (
    <Card className="fixed top-4 left-4 max-w-sm">
      <CardHeader>
        <CardTitle className="text-sm">🔧 Login Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-xs">
          <div><strong>School:</strong> {currentSchool?.name || 'None'}</div>
          <div><strong>Subdomain:</strong> {subdomain || 'None'}</div>
          <div><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</div>
          <div><strong>Auth:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
          <div><strong>User:</strong> {user?.name || 'None'}</div>
        </div>
        <Button onClick={testLogin} size="sm" className="w-full">
          Test Login
        </Button>
      </CardContent>
    </Card>
  )
}
