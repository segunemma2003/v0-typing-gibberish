"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { School, ExternalLink, Users, BookOpen } from "lucide-react"

export function SchoolAccessGuide() {
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

  const getSchoolUrl = (subdomain: string) => {
    // Since Netlify doesn't support wildcard SSL, use URL parameters
    if (typeof window !== 'undefined') {
      return `${window.location.origin}?school=${subdomain}`
    }
    return `?school=${subdomain}`
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <School className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Available Schools</CardTitle>
        <CardDescription>
          Choose a school to access its management system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {schools.map((school) => (
            <Card key={school.subdomain} className="border border-border/50">
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
                <Button 
                  className="w-full" 
                  onClick={() => window.location.href = getSchoolUrl(school.subdomain)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Access {school.name}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
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

        <div className="mt-4 p-4 bg-amber-50 rounded-lg">
          <h3 className="font-semibold text-amber-900 mb-2">SSL Certificate Note</h3>
          <p className="text-sm text-amber-800">
            Due to Netlify's free plan limitations, subdomains use URL parameters instead of true subdomains. 
            For production with custom domains, wildcard SSL certificates are supported.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
