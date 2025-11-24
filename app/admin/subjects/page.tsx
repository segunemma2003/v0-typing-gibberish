"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, Plus, Filter, BookOpen, Users, Clock, Edit, Trash2, X, Loader2 } from "lucide-react"
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from "@/lib/api/academic"
import { useTeachers } from "@/lib/api/teachers"
import { useDepartments } from "@/lib/api/departments"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function SubjectsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: subjectsResponse, isLoading, error, refetch } = useSubjects()
  const { data: teachersResponse } = useTeachers()
  const { data: departmentsResponse } = useDepartments({ per_page: 100 })

  // API may return direct array or wrapped in { data: [...] }
  const subjects = Array.isArray(subjectsResponse) ? subjectsResponse : (subjectsResponse?.data || [])
  const teachers = teachersResponse?.teachers?.data || teachersResponse?.data || []
  const departments = Array.isArray(departmentsResponse) ? departmentsResponse : (departmentsResponse?.data || [])

  const createSubject = useCreateSubject()
  const updateSubject = useUpdateSubject()
  const deleteSubject = useDeleteSubject()

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    department_id: "",
    teacher_ids: [] as number[],
  })

  const toggleTeacher = (teacherId: number) => {
    setFormData((prev) => ({
      ...prev,
      teacher_ids: prev.teacher_ids.includes(teacherId)
        ? prev.teacher_ids.filter((id) => id !== teacherId)
        : [...prev.teacher_ids, teacherId],
    }))
  }

  const handleAdd = async () => {
    if (!formData.name || !formData.code || !formData.department_id) {
      toast.error("Please fill in required fields (Name, Code, and Department)")
      return
    }

    try {
      await createSubject.mutateAsync({
        name: formData.name,
        code: formData.code,
        description: formData.description || "",
        department_id: parseInt(formData.department_id),
        teacher_ids: formData.teacher_ids,
      })
      toast.success("Subject created successfully")
      setFormData({ name: "", code: "", description: "", department_id: "", teacher_ids: [] })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error creating subject:", error)
      let errorMessage = "Failed to create subject"
      if (error?.response?.data) {
        const data = error.response.data
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        } else {
          errorMessage = data.message || data.error || data.detail || errorMessage
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleEdit = (subject: any) => {
    setFormData({
      name: subject.name || "",
      code: subject.code || "",
      description: subject.description || "",
      department_id: subject.department_id?.toString() || "",
      teacher_ids: subject.teachers?.map((t: any) => t.id) || [],
    })
    setEditingId(subject.id)
    setShowAddForm(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.name || !formData.code || !formData.department_id) {
      toast.error("Please fill in required fields (Name, Code, and Department)")
      return
    }

    try {
      await updateSubject.mutateAsync({
        id: editingId,
        data: {
          name: formData.name,
          code: formData.code,
          description: formData.description || "",
          department_id: parseInt(formData.department_id),
          teacher_ids: formData.teacher_ids,
        },
      })
      toast.success("Subject updated successfully")
      setFormData({ name: "", code: "", description: "", department_id: "", teacher_ids: [] })
      setEditingId(null)
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error updating subject:", error)
      let errorMessage = "Failed to update subject"
      if (error?.response?.data) {
        const data = error.response.data
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        } else {
          errorMessage = data.message || data.error || data.detail || errorMessage
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this subject?")) return

    try {
      await deleteSubject.mutateAsync(id)
      toast.success("Subject deleted successfully")
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete subject")
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading subjects: {error?.message || "Unknown error"}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">Manage subjects and curriculum</p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true)
            setEditingId(null)
            setFormData({ name: "", code: "", description: "", teacher_ids: [] })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Subject" : "Add New Subject"}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Subject Name *</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div className="space-y-2">
                <Label>Subject Code *</Label>
                <Input 
                  value={formData.code} 
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., MATH101"
                />
              </div>
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select 
                  value={formData.department_id || undefined} 
                  onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept: any) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Subject description"
                  rows={3}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Teachers</Label>
                <div className="flex flex-wrap gap-2 border rounded-lg p-3 min-h-[60px]">
                  {teachers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No teachers available</p>
                  ) : (
                    teachers.map((teacher: any) => (
                      <Badge
                        key={teacher.id}
                        variant={formData.teacher_ids.includes(teacher.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleTeacher(teacher.id)}
                      >
                        {teacher.name}
                      </Badge>
                    ))
                  )}
              </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleUpdate : handleAdd} disabled={createSubject.isPending || updateSubject.isPending}>
                {createSubject.isPending || updateSubject.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{editingId ? "Update" : "Add"} Subject</>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search subjects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Department
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.length === 0 ? (
          <Card className="md:col-span-3">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">No subjects found</p>
            </CardContent>
          </Card>
        ) : (
          subjects
            .filter((subject: any) => {
              if (!searchTerm) return true
              const search = searchTerm.toLowerCase()
              return (
                subject.name?.toLowerCase().includes(search) ||
                subject.code?.toLowerCase().includes(search) ||
                subject.description?.toLowerCase().includes(search)
              )
            })
            .map((subject: any) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{subject.name}</CardTitle>
                  <CardDescription className="mt-1">{subject.code}</CardDescription>
                </div>
                    <Badge variant="default">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                    {subject.description && (
                      <p className="text-sm text-muted-foreground">{subject.description}</p>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Teachers:</p>
                      <div className="flex flex-wrap gap-1">
                        {subject.teachers && subject.teachers.length > 0 ? (
                          subject.teachers.map((teacher: any) => (
                            <Badge key={teacher.id} variant="outline" className="text-xs">
                              {teacher.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No teachers assigned</span>
                        )}
                </div>
                </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(subject)}
                    >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(subject.id)}
                      disabled={deleteSubject.isPending}
                    >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
            ))
        )}
      </div>
    </div>
  )
}
