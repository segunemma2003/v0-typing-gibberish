"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Search, Plus, Filter, Download, Edit, Trash2, X, Loader2, Upload as UploadIcon } from "lucide-react"
import { useTeachers, useCreateTeacher, useUpdateTeacher, useDeleteTeacher } from "@/lib/api/teachers"
import { useSubjects } from "@/lib/api/academic"
import { useClasses } from "@/lib/api/academic"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ExcelUpload } from "@/components/common/excel-upload"
import { useBulkCreateTeachers } from "@/lib/api/bulk"
import { parseTeacherRow } from "@/lib/utils/excel-parser"
import { useDepartments } from "@/lib/api/departments"

export default function TeachersPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"list" | "bulk">("list")

  const { data: teachersResponse, isLoading, error, refetch } = useTeachers()
  const { data: subjectsResponse } = useSubjects()
  const { data: classesResponse } = useClasses()

  const subjects = subjectsResponse?.data || []
  const classes = classesResponse?.data || []
  // API returns { teachers: { data: [...], current_page: ..., ... } }
  const teachers = teachersResponse?.teachers?.data || teachersResponse?.data || []

  const createTeacher = useCreateTeacher()
  const updateTeacher = useUpdateTeacher()
  const deleteTeacher = useDeleteTeacher()

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    employment_date: "",
    subjects: [] as number[],
    classes: [] as number[],
    qualification: "",
    experience_years: "",
  })

  const handleAdd = async () => {
    if (!formData.first_name || !formData.last_name || !formData.employment_date) {
      toast.error("Please fill in all required fields (First Name, Last Name, Employment Date)")
      return
    }

    try {
      await createTeacher.mutateAsync({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone: formData.phone || undefined,
        employment_date: formData.employment_date,
        subjects: formData.subjects.length > 0 ? formData.subjects : undefined,
        classes: formData.classes.length > 0 ? formData.classes : undefined,
        qualification: formData.qualification || undefined,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
      })
      toast.success("Teacher created successfully")
      setFormData({ first_name: "", last_name: "", phone: "", employment_date: "", subjects: [], classes: [], qualification: "", experience_years: "" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error creating teacher:", error)
      let errorMessage = "Failed to create teacher"
      if (error?.response?.data) {
        const data = error.response.data
        if (data.messages) {
          const errorMessages = Object.entries(data.messages).map(([field, messages]: [string, any]) => {
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

  const handleEdit = (teacher: any) => {
    // Split name into first_name and last_name if only name is provided
    const nameParts = teacher.name ? teacher.name.split(" ") : ["", ""]
    const first_name = teacher.first_name || nameParts[0] || ""
    const last_name = teacher.last_name || nameParts.slice(1).join(" ") || ""
    
    setFormData({
      first_name,
      last_name,
      phone: teacher.phone || "",
      employment_date: teacher.employment_date ? new Date(teacher.employment_date).toISOString().split("T")[0] : "",
      subjects: teacher.subjects?.map((s: any) => s.id) || [],
      classes: teacher.classes?.map((c: any) => c.id) || [],
      qualification: teacher.qualification || "",
      experience_years: teacher.experience_years?.toString() || "",
    })
    setEditingId(teacher.id)
    setShowAddForm(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.first_name || !formData.last_name || !formData.employment_date) {
      toast.error("Please fill in all required fields (First Name, Last Name, Employment Date)")
      return
    }

    try {
      await updateTeacher.mutateAsync({
        id: editingId,
        data: {
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          phone: formData.phone || undefined,
          employment_date: formData.employment_date,
          subjects: formData.subjects.length > 0 ? formData.subjects : undefined,
          classes: formData.classes.length > 0 ? formData.classes : undefined,
          qualification: formData.qualification || undefined,
          experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        },
      })
      toast.success("Teacher updated successfully")
      setFormData({ first_name: "", last_name: "", phone: "", employment_date: "", subjects: [], classes: [], qualification: "", experience_years: "" })
    setEditingId(null)
    setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error updating teacher:", error)
      let errorMessage = "Failed to update teacher"
      if (error?.response?.data) {
        const data = error.response.data
        if (data.messages) {
          const errorMessages = Object.entries(data.messages).map(([field, messages]: [string, any]) => {
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
    if (!confirm("Are you sure you want to delete this teacher?")) return

    try {
      await deleteTeacher.mutateAsync(id)
      toast.success("Teacher deleted successfully")
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete teacher")
    }
  }

  const toggleSubject = (subjectId: number) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter((id) => id !== subjectId)
        : [...prev.subjects, subjectId],
    }))
  }

  const toggleClass = (classId: number) => {
    setFormData((prev) => ({
      ...prev,
      classes: prev.classes.includes(classId)
        ? prev.classes.filter((id) => id !== classId)
        : [...prev.classes, classId],
    }))
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
            <p className="text-destructive">Error loading teachers: {error?.message || "Unknown error"}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">Manage teaching staff and assignments</p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true)
            setEditingId(null)
            setFormData({ first_name: "", last_name: "", phone: "", employment_date: "", subjects: [], classes: [], qualification: "", experience_years: "" })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Teacher" : "Add New Teacher"}</CardTitle>
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
                <Label>First Name *</Label>
                <Input 
                  value={formData.first_name} 
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input 
                  value={formData.last_name} 
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label>Employment Date *</Label>
                <Input 
                  type="date"
                  value={formData.employment_date}
                  onChange={(e) => setFormData({ ...formData, employment_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Qualification</Label>
                <Input 
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="e.g., B.Ed, M.Sc"
                />
              </div>
              <div className="space-y-2">
                <Label>Experience (Years)</Label>
                <Input 
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Subjects</Label>
                <div className="flex flex-wrap gap-2 border rounded-lg p-3 min-h-[60px]">
                  {subjects.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No subjects available</p>
                  ) : (
                    subjects.map((subject: any) => (
                      <Badge
                        key={subject.id}
                        variant={formData.subjects.includes(subject.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleSubject(subject.id)}
                      >
                        {subject.name}
                      </Badge>
                    ))
                  )}
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Classes</Label>
                <div className="flex flex-wrap gap-2 border rounded-lg p-3 min-h-[60px]">
                  {classes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No classes available</p>
                  ) : (
                    classes.map((classItem: any) => (
                      <Badge
                        key={classItem.id}
                        variant={formData.classes.includes(classItem.id) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleClass(classItem.id)}
                      >
                        {classItem.name} ({classItem.level})
                      </Badge>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleUpdate : handleAdd} disabled={createTeacher.isPending || updateTeacher.isPending}>
                {createTeacher.isPending || updateTeacher.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{editingId ? "Update" : "Add"} Teacher</>
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
                placeholder="Search teachers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teachers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
          <CardDescription>{teachers.length} teachers on staff</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No teachers found</p>
            ) : (
              teachers
                .filter((teacher: any) => {
                  if (!searchTerm) return true
                  const search = searchTerm.toLowerCase()
                  const fullName = `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() || teacher.name || ""
                  return (
                    fullName.toLowerCase().includes(search) ||
                    teacher.email?.toLowerCase().includes(search) ||
                    teacher.phone?.toLowerCase().includes(search)
                  )
                })
                .map((teacher: any) => {
                  const fullName = `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() || teacher.name || "Unknown"
                  const initials = fullName.split(" ").map((n: string) => n[0]).join("") || "T"
                  
                  return (
              <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{fullName}</h3>
                    <p className="text-sm text-muted-foreground">{teacher.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                          {teacher.subjects && teacher.subjects.length > 0 ? (
                            teacher.subjects.map((subject: any) => (
                              <Badge key={subject.id} variant="outline" className="text-xs">
                                {subject.name}
                        </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No subjects assigned</span>
                          )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                        {teacher.qualification && <p className="text-sm font-medium">{teacher.qualification}</p>}
                        {teacher.experience_years && (
                          <p className="text-sm text-muted-foreground">{teacher.experience_years} years experience</p>
                        )}
                  </div>
                      <Badge variant={teacher.status === "active" ? "default" : "secondary"}>{teacher.status}</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(teacher)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(teacher.id)}
                        disabled={deleteTeacher.isPending}
                      >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
                  )
                })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
