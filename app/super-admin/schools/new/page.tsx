"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { SchoolForm } from "@/components/super-admin/school-form"
import type { School } from "@/lib/auth"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewSchoolPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (schoolData: Partial<School>) => {
    setIsLoading(true)
    try {
      // In a real app, this would call an API to create the school
      console.log("Creating school:", schoolData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to schools list
      router.push("/super-admin/schools")
    } catch (error) {
      console.error("Error creating school:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/super-admin/schools")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/super-admin/schools">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schools
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New School</h1>
          <p className="text-gray-600 mt-1">Create a new school in the system</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <SchoolForm onSave={handleSave} onCancel={handleCancel} isLoading={isLoading} />
      </div>
    </div>
  )
}
