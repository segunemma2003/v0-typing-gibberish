"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, AlertTriangle } from "lucide-react"

interface SchoolNotFoundProps {
  subdomain: string
}

export function SchoolNotFound({ subdomain }: SchoolNotFoundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">School Not Found</CardTitle>
            <CardDescription>The school "{subdomain}" could not be found or is currently inactive.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-700 mb-2">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Requested URL</span>
            </div>
            <p className="text-sm text-gray-600">{subdomain}.compasse.com</p>
          </div>
          <div className="text-sm text-gray-600">
            <p>This could happen if:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-left">
              <li>The school subdomain is incorrect</li>
              <li>The school account has been deactivated</li>
              <li>The school is still being set up</li>
            </ul>
          </div>
          <Button
            onClick={() =>
              (window.location.href =
                window.location.protocol + "//" + window.location.hostname.split(".").slice(-2).join("."))
            }
            className="w-full"
          >
            Go to Main Site
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
