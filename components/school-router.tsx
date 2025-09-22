"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { SchoolNotFound } from "@/components/tenant/school-not-found"
import { getSchoolBySubdomain } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { School, Users } from "lucide-react"

export function SchoolRouter() {
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const schoolParam = searchParams?.get('school')

  useEffect(() => {
    console.log("SchoolRouter: Setting mounted to true")
    setMounted(true)
  }, [])

  if (!mounted) {
    console.log("SchoolRouter: Not mounted yet, showing loading")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading School Management System...</p>
        </div>
      </div>
    )
  }

  console.log("SchoolRouter: Mounted, schoolParam:", schoolParam)

  if (schoolParam) {
    const school = getSchoolBySubdomain(schoolParam)
    
    if (!school || !school.isActive) {
      return <SchoolNotFound subdomain={schoolParam} />
    }

    // Show login form for the specific school
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <School className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
            <p className="text-gray-600 mt-2">{school.address}</p>
            <p className="text-sm text-gray-500">Principal: {school.principalName}</p>
          </div>
          <LoginForm />
          <div className="text-center">
            <a 
              href="/" 
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              ← Back to School Selection
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Show school selection page
  const schools = [
    {
      name: "Demo Elementary School",
      subdomain: "demo",
      description: "Elementary school with basic features",
      students: "250 students",
    },
    {
      name: "Test High School", 
      subdomain: "test",
      description: "High school with advanced features",
      students: "800 students",
    },
    {
      name: "Greenwood High School",
      subdomain: "greenwood", 
      description: "Established high school",
      students: "600 students",
    },
    {
      name: "Riverside Academy",
      subdomain: "riverside",
      description: "Private academy",
      students: "300 students",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <School className="w-8 h-8 text-white" />
          </div>
        <CardTitle className="text-2xl">Compasse School Management</CardTitle>
        <CardDescription>
          Choose a school to access its management system
        </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            {schools.map((school) => (
              <Card key={school.subdomain} className="border border-border/50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                    <Badge variant="secondary">{school.subdomain}</Badge>
                  </div>
                  <CardDescription>{school.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{school.students}</span>
                  </div>
                  <div className="space-y-2">
                    <a 
                      href={`?school=${school.subdomain}`}
                      className="block w-full text-center bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Access {school.name}
                    </a>
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        URL: ?school={school.subdomain}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Demo Credentials</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Admin:</strong> admin@school.edu / password123</p>
              <p><strong>Teacher:</strong> teacher@school.edu / password123</p>
              <p><strong>Student:</strong> student@school.edu / password123</p>
              <p><strong>Parent:</strong> parent@school.edu / password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
