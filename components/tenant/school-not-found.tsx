"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Globe, AlertCircle } from "lucide-react"
import Link from "next/link"

interface SchoolNotFoundProps {
  subdomain: string
}

export function SchoolNotFound({ subdomain }: SchoolNotFoundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle className="text-xl">School Not Found</CardTitle>
            <CardDescription>
              The school subdomain <code className="bg-gray-100 px-2 py-1 rounded text-sm">{subdomain}</code> is not registered yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This subdomain is available for registration. If you're a school administrator, you can register your school to get started.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="https://theqcare.org">
                  <Globe className="w-4 h-4 mr-2" />
                  Visit Main Site
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="mailto:support@theqcare.org">
                  <Building2 className="w-4 h-4 mr-2" />
                  Register Your School
                </Link>
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Need help? Contact our support team</p>
              <p className="font-medium">support@theqcare.org</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
