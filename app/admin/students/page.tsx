"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Search, Plus, Filter, Download, Edit, Trash2, X, Loader2 } from "lucide-react"
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from "@/lib/api/students"
import { useClasses } from "@/lib/api/academic"
import { useSchools } from "@/lib/api/schools"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function StudentsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  const { data: studentsResponse, isLoading, error, refetch } = useStudents({
    search: searchTerm || undefined,
    per_page: 100,
  })

  const { data: classesResponse } = useClasses()
  const classes = classesResponse?.data || []

  const { data: schoolsResponse } = useSchools()
  const schools = schoolsResponse?.data || []
  const currentSchoolId = schools?.[0]?.id // Get first school ID (admin should only have access to one school)

  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()

  const students = studentsResponse?.data || []

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    class_id: "",
    arm_id: "",
    phone: "",
    date_of_birth: "",
    gender: "",
  })

  // Get selected class's arms for dropdown
  const selectedClass = classes.find((c: any) => c.id.toString() === formData.class_id)
  const availableArms = selectedClass?.arms || []

  const handleAdd = async () => {
    if (!formData.first_name || !formData.last_name) {
      toast.error("Please fill in required fields")
      return
    }
    
    if (!currentSchoolId) {
      toast.error("School information not available")
      return
    }

    try {
      await createStudent.mutateAsync({
        school_id: currentSchoolId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email || undefined,
        class_id: formData.class_id ? parseInt(formData.class_id) : undefined,
        arm_id: formData.arm_id ? parseInt(formData.arm_id) : undefined,
        phone: formData.phone || undefined,
        date_of_birth: formData.date_of_birth || undefined,
        gender: formData.gender || undefined,
      })
      toast.success("Student created successfully")
      setFormData({ first_name: "", last_name: "", email: "", class_id: "", arm_id: "", phone: "", date_of_birth: "", gender: "" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create student")
    }
  }

  const handleEdit = (student: any) => {
      setFormData({
      first_name: student.name?.split(' ')[0] || "",
      last_name: student.name?.split(' ').slice(1).join(' ') || "",
      email: student.email || "",
      class_id: student.class?.id?.toString() || "",
      arm_id: student.arm?.id?.toString() || "",
      phone: student.phone || "",
      date_of_birth: student.date_of_birth || "",
      gender: student.gender || "",
    })
    setEditingId(student.id)
      setShowAddForm(true)
    }

  const handleUpdate = async () => {
    if (!editingId || !formData.first_name || !formData.last_name) {
      toast.error("Please fill in required fields")
      return
    }
    
    try {
      await updateStudent.mutateAsync({
        id: editingId,
        data: {
          name: `${formData.first_name} ${formData.last_name}`,
          class_id: formData.class_id ? parseInt(formData.class_id) : undefined,
          arm_id: formData.arm_id ? parseInt(formData.arm_id) : undefined,
        },
      })
      toast.success("Student updated successfully")
      setFormData({ first_name: "", last_name: "", email: "", class_id: "", arm_id: "", phone: "", date_of_birth: "", gender: "" })
    setEditingId(null)
    setShowAddForm(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update student")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return
    
    try {
      await deleteStudent.mutateAsync(id)
      toast.success("Student deleted successfully")
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete student")
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading students: {error instanceof Error ? error.message : 'Unknown error'}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student records and enrollment</p>
        </div>
        <Button onClick={() => { setShowAddForm(true); setEditingId(null); setFormData({ first_name: "", last_name: "", email: "", class_id: "", arm_id: "", phone: "", date_of_birth: "", gender: "" }) }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Student" : "Add New Student"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setEditingId(null) }}>
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
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input 
                  value={formData.last_name} 
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="student@school.edu"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input 
                  value={formData.phone} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input 
                  type="date"
                  value={formData.date_of_birth} 
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => setFormData({...formData, gender: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Class *</Label>
                <Select 
                  value={formData.class_id} 
                  onValueChange={(value) => setFormData({...formData, class_id: value, arm_id: ""})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem: any) => (
                      <SelectItem key={classItem.id} value={classItem.id.toString()}>
                        {classItem.name} ({classItem.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Arm/Section</Label>
                <Select 
                  value={formData.arm_id} 
                  onValueChange={(value) => setFormData({...formData, arm_id: value})}
                  disabled={!formData.class_id}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={formData.class_id ? "Select an arm" : "Select a class first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableArms.map((arm: any) => (
                      <SelectItem key={arm.id} value={arm.id.toString()}>
                        {arm.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={editingId ? handleUpdate : handleAdd}
                disabled={createStudent.isPending || updateStudent.isPending}
              >
                {(createStudent.isPending || updateStudent.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                {editingId ? "Update" : "Add"} Student
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search students..." 
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

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `${students.length} students registered`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No students found</p>
            </div>
          ) : (
          <div className="space-y-4">
              {students.map((student: any) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {student.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase() || "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                      <h3 className="font-medium">{student.name || 'N/A'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {student.email || student.admission_number || 'No email'}
                      </p>
                      {student.admission_number && (
                        <p className="text-xs text-muted-foreground">Admission: {student.admission_number}</p>
                      )}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                      {student.class && (
                        <p className="text-sm font-medium">{student.class.name}</p>
                      )}
                      {student.arm && (
                        <p className="text-sm text-muted-foreground">{student.arm.name}</p>
                      )}
                  </div>
                    <Badge variant={student.status === "active" ? "default" : "secondary"}>
                      {student.status || "active"}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(student.id)}
                      disabled={deleteStudent.isPending}
                    >
                      {deleteStudent.isPending ? (
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
