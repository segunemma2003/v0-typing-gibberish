"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, X, Loader2, Building2 } from "lucide-react"
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from "@/lib/api/departments"
import { useTeachers } from "@/lib/api/teachers"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function DepartmentsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: departmentsResponse, isLoading, error, refetch } = useDepartments({
    search: searchTerm || undefined,
    per_page: 100,
  })
  const { data: teachersResponse } = useTeachers()

  const departments = Array.isArray(departmentsResponse?.data) ? departmentsResponse.data : []
  const teachers = Array.isArray(teachersResponse?.data) ? teachersResponse.data : []

  const createDepartment = useCreateDepartment()
  const updateDepartment = useUpdateDepartment()
  const deleteDepartment = useDeleteDepartment()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    code: "",
    head_of_department_id: "",
    status: "active" as "active" | "inactive",
  })

  const handleAdd = async () => {
    if (!formData.name) {
      toast.error("Department name is required")
      return
    }

    try {
      const payload: any = {
        name: formData.name.trim(),
        status: formData.status,
      }

      if (formData.description?.trim()) {
        payload.description = formData.description.trim()
      }
      if (formData.code?.trim()) {
        payload.code = formData.code.trim().toUpperCase()
      }
      if (formData.head_of_department_id) {
        payload.head_of_department_id = parseInt(formData.head_of_department_id)
      }

      await createDepartment.mutateAsync(payload)
      toast.success("Department created successfully")
      setFormData({ name: "", description: "", code: "", head_of_department_id: "", status: "active" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error creating department:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create department"
      toast.error(errorMessage)
    }
  }

  const handleEdit = (dept: any) => {
    setFormData({
      name: dept.name || "",
      description: dept.description || "",
      code: dept.code || "",
      head_of_department_id: dept.head_of_department_id?.toString() || "",
      status: dept.status || "active",
    })
    setEditingId(dept.id)
    setShowAddForm(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.name) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      const updateData: any = {
        name: formData.name.trim(),
        status: formData.status,
      }

      if (formData.description?.trim()) {
        updateData.description = formData.description.trim()
      }
      if (formData.code?.trim()) {
        updateData.code = formData.code.trim().toUpperCase()
      }
      if (formData.head_of_department_id) {
        updateData.head_of_department_id = parseInt(formData.head_of_department_id)
      } else {
        updateData.head_of_department_id = null
      }

      await updateDepartment.mutateAsync({
        id: editingId,
        data: updateData,
      })
      toast.success("Department updated successfully")
      setFormData({ name: "", description: "", code: "", head_of_department_id: "", status: "active" })
      setEditingId(null)
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error updating department:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update department"
      toast.error(errorMessage)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this department?")) return

    try {
      await deleteDepartment.mutateAsync(id)
      toast.success("Department deleted successfully")
      refetch()
    } catch (error: any) {
      console.error("Error deleting department:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete department"
      toast.error(errorMessage)
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading departments: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground">Manage school departments and staff organization</p>
        </div>
        <Button onClick={() => { setShowAddForm(true); setEditingId(null); setFormData({ name: "", description: "", code: "", head_of_department_id: "", status: "active" }) }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Department" : "Add New Department"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setEditingId(null) }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Department Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Science Department"
                />
              </div>
              <div className="space-y-2">
                <Label>Code</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="e.g., SCI"
                  maxLength={20}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Department description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Head of Department</Label>
                <Select
                  value={formData.head_of_department_id}
                  onValueChange={(value) => setFormData({...formData, head_of_department_id: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select head of department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {teachers.map((teacher: any) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={editingId ? handleUpdate : handleAdd}
                disabled={createDepartment.isPending || updateDepartment.isPending}
              >
                {(createDepartment.isPending || updateDepartment.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingId ? "Update" : "Add"} Department
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => { setShowAddForm(false); setEditingId(null) }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search departments..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Departments List */}
      <Card>
        <CardHeader>
          <CardTitle>All Departments</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `${departments.length} departments`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No departments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {departments.map((dept: any) => (
                <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{dept.name}</h3>
                      {dept.code && (
                        <p className="text-sm text-muted-foreground">Code: {dept.code}</p>
                      )}
                      {dept.description && (
                        <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                      )}
                      {dept.head && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Head: {dept.head.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={dept.status === "active" ? "default" : "secondary"}>
                      {dept.status || "active"}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(dept)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(dept.id)}
                      disabled={deleteDepartment.isPending}
                    >
                      {deleteDepartment.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

