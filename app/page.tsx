import { Suspense } from "react"
import { SchoolRouter } from "@/components/school-router"

// Force dynamic rendering for search params
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading School Management System...</p>
        </div>
      </div>
    }>
      <SchoolRouter />
    </Suspense>
  )
}
