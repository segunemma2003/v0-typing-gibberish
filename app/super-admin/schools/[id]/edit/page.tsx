"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SchoolForm } from "@/components/super-admin/school-form"
import { mockSchools, type School } from "@/lib/auth"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EditSchoolPageProps {
  params: {
    id: string
  }
}

export default function EditSchoolPage({ params }: EditSchoolPageProps) {
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // In a real app, this would fetch the school from an API
    const foundSchool = mockSchools.find((s) => s.id === params.id)
    setSchool(foundSchool || null)
  }, [params.id])

  const handleSave = async (schoolData: Partial<School>) => {
    setIsLoading(true)
    try {
      // In a real app, this would call an API to update the school
      console.log("Updating school:", schoolData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to schools list
      router.push("/super-admin/schools")
    } catch (error) {
      console.error("Error updating school:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push("/super-admin/schools")
  }

  if (!school) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">School not found</h1>
          <p className="text-gray-600 mt-2">The requested school could not be found.</p>
          <Link href="/super-admin/schools" className="mt-4 inline-block">
            <Button>Back to Schools</Button>
          </Link>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Edit School</h1>
          <p className="text-gray-600 mt-1">Update {school.name} information</p>
        </div>
      </div>

      <div className="max-w-4xl">
        <SchoolForm school={school} onSave={handleSave} onCancel={handleCancel} isLoading={isLoading} />
      </div>
    </div>
  )
}
