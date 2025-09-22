"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { mockSchools, type School } from "@/lib/auth"
import { Building2, Plus, Search, Eye, Edit, Trash2, Users, Calendar, Globe } from "lucide-react"
import Link from "next/link"

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [schools] = useState<School[]>(mockSchools)

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.principalName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteSchool = (schoolId: string) => {
    // In a real app, this would call an API to delete the school
    console.log("Delete school:", schoolId)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schools Management</h1>
          <p className="text-gray-600 mt-1">Manage all registered schools in the system</p>
        </div>
        <Link href="/super-admin/schools/new">
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New School
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search schools by name, subdomain, or principal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schools Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <Card key={school.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                    <CardDescription>{school.subdomain}.compasse.com</CardDescription>
                  </div>
                </div>
                <Badge variant={school.isActive ? "default" : "secondary"}>
                  {school.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Principal: {school.principalName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{school.settings.timezone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    {new Date(school.settings.academicYearStart).getFullYear()} -{" "}
                    {new Date(school.settings.academicYearEnd).getFullYear()}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-between">
                <div className="text-xs text-gray-500">Created {school.createdAt.toLocaleDateString()}</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Link href={`/super-admin/schools/${school.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSchool(school.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSchools.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? "No schools match your search criteria." : "Get started by adding your first school."}
            </p>
            <Link href="/super-admin/schools/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New School
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
