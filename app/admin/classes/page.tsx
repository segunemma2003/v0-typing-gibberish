"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, Plus, Filter, Users, BookOpen, Clock, Edit, Trash2, X, Loader2 } from "lucide-react"
import { useClasses, useCreateClass, useUpdateClass, useDeleteClass, useAcademicYears, useTerms } from "@/lib/api/academic"
import { useTeachers } from "@/lib/api/teachers"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function ClassesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: classesResponse, isLoading, error, refetch } = useClasses()
  const { data: teachersResponse } = useTeachers()
  const { data: academicYearsResponse } = useAcademicYears({ per_page: 100 })
  const { data: termsResponse } = useTerms({ per_page: 100 })

  // Debug logging - remove after confirming it works
  if (typeof window !== 'undefined') {
    useEffect(() => {
      if (classesResponse) {
        console.log('[Classes Debug] Raw Response:', classesResponse)
        console.log('[Classes Debug] Type:', typeof classesResponse)
        console.log('[Classes Debug] Is Array?', Array.isArray(classesResponse))
        console.log('[Classes Debug] Has data?', classesResponse?.data)
        if (classesResponse && typeof classesResponse === 'object' && !Array.isArray(classesResponse)) {
          console.log('[Classes Debug] Keys:', Object.keys(classesResponse))
        }
      }
    }, [classesResponse])
  }

  // API may return direct array, wrapped in { data: [...] }, or { classes: [...] }
  let classes: any[] = []
  if (Array.isArray(classesResponse)) {
    classes = classesResponse
  } else if (classesResponse?.data) {
    classes = Array.isArray(classesResponse.data) ? classesResponse.data : []
  } else if (classesResponse?.classes) {
    classes = Array.isArray(classesResponse.classes) ? classesResponse.classes : []
  } else if (classesResponse && typeof classesResponse === 'object' && !Array.isArray(classesResponse)) {
    // Check if it's a single class object (has id, name, level properties)
    if (classesResponse.id && classesResponse.name && classesResponse.level) {
      // It's a single class object, wrap it in an array
      classes = [classesResponse]
    } else if (classesResponse.results) {
      // Laravel pagination format
      classes = Array.isArray(classesResponse.results) ? classesResponse.results : []
    } else {
      // Empty or unrecognized format
      classes = []
    }
  }

  const teachers = teachersResponse?.data || []
  // API returns direct array for academic years and terms
  const academicYears = Array.isArray(academicYearsResponse) ? academicYearsResponse : (academicYearsResponse?.data || [])
  const terms = Array.isArray(termsResponse) ? termsResponse : (termsResponse?.data || [])

  const createClass = useCreateClass()
  const updateClass = useUpdateClass()
  const deleteClass = useDeleteClass()

  const [formData, setFormData] = useState({
    name: "",
    level: "",
    arms: [] as string[],
    newArm: "",
    academic_year_id: "",
    term_id: "",
  })

  const handleAddArm = () => {
    if (formData.newArm.trim()) {
      setFormData({
        ...formData,
        arms: [...formData.arms, formData.newArm.trim()],
        newArm: "",
      })
    }
  }

  const handleRemoveArm = (arm: string) => {
    setFormData({
      ...formData,
      arms: formData.arms.filter((a) => a !== arm),
    })
  }

  const handleAdd = async () => {
    if (!formData.name || !formData.level || !formData.academic_year_id || !formData.term_id) {
      toast.error("Please fill in all required fields (Name, Level, Academic Year, Term)")
      return
    }

    if (formData.arms.length === 0) {
      toast.error("Please add at least one arm/section")
      return
    }

    try {
      await createClass.mutateAsync({
        name: formData.name,
        level: formData.level,
        arms: formData.arms,
        academic_year_id: parseInt(formData.academic_year_id),
        term_id: parseInt(formData.term_id),
      })
      toast.success("Class created successfully")
      setFormData({ name: "", level: "", arms: [], newArm: "", academic_year_id: "", term_id: "" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error creating class:", error)
      let errorMessage = "Failed to create class"
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

  const handleEdit = (classItem: any) => {
    setFormData({
      name: classItem.name || "",
      level: classItem.level || "",
      arms: classItem.arms?.map((a: any) => a.name) || [],
      newArm: "",
      academic_year_id: classItem.academic_year_id?.toString() || "",
      term_id: classItem.term_id?.toString() || "",
    })
    setEditingId(classItem.id)
    setShowAddForm(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.name || !formData.level || !formData.academic_year_id || !formData.term_id) {
      toast.error("Please fill in all required fields (Name, Level, Academic Year, Term)")
      return
    }

    if (formData.arms.length === 0) {
      toast.error("Please add at least one arm/section")
      return
    }

    try {
      await updateClass.mutateAsync({
        id: editingId,
        data: {
          name: formData.name,
          level: formData.level,
          arms: formData.arms,
          academic_year_id: parseInt(formData.academic_year_id),
          term_id: parseInt(formData.term_id),
        },
      })
      toast.success("Class updated successfully")
      setFormData({ name: "", level: "", arms: [], newArm: "", academic_year_id: "", term_id: "" })
    setEditingId(null)
    setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error updating class:", error)
      let errorMessage = "Failed to update class"
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
    if (!confirm("Are you sure you want to delete this class?")) return

    try {
      await deleteClass.mutateAsync(id)
      toast.success("Class deleted successfully")
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete class")
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
            <p className="text-destructive">Error loading classes: {error?.message || "Unknown error"}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage classes and sections</p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true)
            setEditingId(null)
            setFormData({ name: "", level: "", arms: [], newArm: "", academic_year_id: "", term_id: "" })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Class" : "Add New Class"}</CardTitle>
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
                <Label>Class Name *</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Grade 9"
                />
              </div>
              <div className="space-y-2">
                <Label>Level *</Label>
                <Input 
                  value={formData.level} 
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  placeholder="e.g., Grade 9, JSS 1"
                />
              </div>
              <div className="space-y-2">
                <Label>Academic Year *</Label>
                <Select 
                  value={formData.academic_year_id || undefined} 
                  onValueChange={(value) => setFormData({ ...formData, academic_year_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year: any) => (
                      <SelectItem key={year.id} value={year.id.toString()}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Term *</Label>
                <Select 
                  value={formData.term_id || undefined} 
                  onValueChange={(value) => setFormData({ ...formData, term_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map((term: any) => (
                      <SelectItem key={term.id} value={term.id.toString()}>
                        {term.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Arms/Sections *</Label>
                <div className="flex gap-2">
                <Input 
                    value={formData.newArm}
                    onChange={(e) => setFormData({ ...formData, newArm: e.target.value })}
                  placeholder="e.g., A, B, C"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddArm()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddArm}>
                    Add Arm
                  </Button>
              </div>
                {formData.arms.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.arms.map((arm) => (
                      <Badge key={arm} variant="default" className="flex items-center gap-1">
                        {arm}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemoveArm(arm)}
                        />
                      </Badge>
                    ))}
              </div>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleUpdate : handleAdd} disabled={createClass.isPending || updateClass.isPending}>
                {createClass.isPending || updateClass.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{editingId ? "Update" : "Add"} Class</>
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
                placeholder="Search classes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Classes List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.length === 0 ? (
          <Card className="md:col-span-3">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">No classes found</p>
            </CardContent>
          </Card>
        ) : (
          classes
            .filter((classItem: any) => {
              if (!searchTerm) return true
              const search = searchTerm.toLowerCase()
              return (
                classItem.name?.toLowerCase().includes(search) ||
                classItem.level?.toLowerCase().includes(search)
              )
            })
            .map((classItem: any) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                    <div>
                <CardTitle>{classItem.name}</CardTitle>
                      <CardDescription className="mt-1">{classItem.level}</CardDescription>
                    </div>
                    <Badge variant="default">{classItem.arms?.length || 0} Arms</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    Students
                  </div>
                      <span className="font-medium">{classItem.student_count || 0}</span>
                </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Arms/Sections:</p>
                      <div className="flex flex-wrap gap-1">
                        {classItem.arms && classItem.arms.length > 0 ? (
                          classItem.arms.map((arm: any) => (
                            <Badge key={arm.id} variant="outline" className="text-xs">
                              {arm.name}
                              {arm.class_teacher && ` (${arm.class_teacher.name})`}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No arms</span>
                        )}
                  </div>
                </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(classItem)}
                    >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(classItem.id)}
                      disabled={deleteClass.isPending}
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
