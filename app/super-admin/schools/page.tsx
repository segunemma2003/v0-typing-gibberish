"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTenants, useDeleteTenant } from "@/lib/api/tenants"
import { Building2, Plus, Search, Eye, Edit, Trash2, Users, Calendar, Globe, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: tenantsData, isLoading, error } = useTenants()
  const deleteTenant = useDeleteTenant()

  // Extract tenants array from response
  const tenants = useMemo(() => {
    if (!tenantsData) return []
    if (Array.isArray(tenantsData.data)) return tenantsData.data
    if ((tenantsData as any).tenants?.data) return (tenantsData as any).tenants.data
    return []
  }, [tenantsData])

  const filteredTenants = useMemo(() => {
    if (!tenants) return []
    return tenants.filter(
      (tenant) =>
        tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tenant.domain.split('.')[0] || '').toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [tenants, searchTerm])

  const handleDeleteSchool = async (tenantId: number) => {
    if (!confirm("Are you sure you want to delete this school? This action cannot be undone.")) {
      return
    }

    try {
      await deleteTenant.mutateAsync(tenantId)
      toast.success("School deleted successfully")
    } catch (error: any) {
      console.error("Error deleting school:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete school"
      toast.error("Error deleting school", {
        description: errorMessage,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-gray-600">Loading schools...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-red-600 mb-4">Error loading schools. Please try again later.</div>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
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
        {filteredTenants.map((tenant) => {
          const subdomain = tenant.domain.split('.')[0]
          return (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tenant.name}</CardTitle>
                      <CardDescription>{tenant.domain}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={tenant.status === 'active' ? "default" : "secondary"}>
                    {tenant.status === 'active' ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Schools: {tenant.schools_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Users: {tenant.users_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Subdomain: {subdomain}</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Database: {tenant.database_name || 'N/A'}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`https://${tenant.domain}`} target="_blank">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href={`/super-admin/schools/${tenant.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteSchool(tenant.id)}
                      className="text-red-600 hover:text-red-700"
                      disabled={deleteTenant.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTenants.length === 0 && (
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
