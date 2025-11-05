"use client"

import { AlertCircle, Home, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SchoolNotFoundProps {
  subdomain: string | null
  error?: string | null
}

export function SchoolNotFound({ subdomain, error }: SchoolNotFoundProps) {
  const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'compasse.net'
  const mainDomain = typeof window !== 'undefined' ? window.location.protocol + '//' + BASE_DOMAIN : ''

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">School Not Found</h1>
        
        {subdomain && (
          <p className="text-slate-600 mb-4">
            The subdomain <span className="font-semibold text-slate-900">{subdomain}</span> does not exist in our system.
          </p>
        )}
        
        {error && (
          <p className="text-sm text-red-600 mb-6 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}
        
        <div className="space-y-3">
          <p className="text-sm text-slate-500 mb-6">
            Please verify the subdomain is correct. If you believe this is an error, please contact support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {mainDomain && (
              <Link href={mainDomain} className="flex-1">
                <Button className="w-full" variant="default">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Main Site
                </Button>
              </Link>
            )}
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.location.reload()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
