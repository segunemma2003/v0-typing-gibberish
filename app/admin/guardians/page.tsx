"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, X, Loader2, UserCog, Mail, Phone, Users } from "lucide-react"
import { useGuardians, useCreateGuardian, useUpdateGuardian, useDeleteGuardian, useAssignStudentToGuardian, useRemoveStudentFromGuardian } from "@/lib/api/guardians"
import { useStudents } from "@/lib/api/students"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function GuardiansPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAssignStudent, setShowAssignStudent] = useState<number | null>(null)

  const { data: guardiansResponse, isLoading, error, refetch } = useGuardians({
    search: searchTerm || undefined,
    per_page: 100,
  })
  const { data: studentsResponse } = useStudents({ per_page: 100 })

  const guardians = Array.isArray(guardiansResponse?.data) ? guardiansResponse.data : Array.isArray(guardiansResponse?.guardians?.data) ? guardiansResponse.guardians.data : []
  const students = Array.isArray(studentsResponse?.data) ? studentsResponse.data : []

  const createGuardian = useCreateGuardian()
  const updateGuardian = useUpdateGuardian()
  const deleteGuardian = useDeleteGuardian()
  const assignStudent = useAssignStudentToGuardian()
  const removeStudent = useRemoveStudentFromGuardian()

  // Show toast error when error state changes
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading guardians'
      toast.error(`Error loading guardians: ${errorMessage}`)
    }
  }, [error])

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone: "",
    address: "",
    occupation: "",
    employer: "",
    relationship_to_student: "Father",
    emergency_contact: "",
  })

  const [assignForm, setAssignForm] = useState({
    student_id: "",
    relationship: "Father",
    is_primary: false,
    emergency_contact: true,
  })

  const handleAdd = async () => {
    if (!formData.first_name || !formData.last_name || !formData.email) {
      toast.error("Please fill in required fields (First Name, Last Name, Email)")
      return
    }

    try {
      const payload: any = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
      }

      if (formData.middle_name?.trim()) {
        payload.middle_name = formData.middle_name.trim()
      }
      if (formData.phone?.trim()) {
        payload.phone = formData.phone.trim()
      }
      if (formData.address?.trim()) {
        payload.address = formData.address.trim()
      }
      if (formData.occupation?.trim()) {
        payload.occupation = formData.occupation.trim()
      }
      if (formData.employer?.trim()) {
        payload.employer = formData.employer.trim()
      }
      if (formData.relationship_to_student) {
        payload.relationship_to_student = formData.relationship_to_student
      }
      if (formData.emergency_contact?.trim()) {
        payload.emergency_contact = formData.emergency_contact.trim()
      }

      await createGuardian.mutateAsync(payload)
      toast.success("Guardian created successfully")
      setFormData({ first_name: "", last_name: "", middle_name: "", email: "", phone: "", address: "", occupation: "", employer: "", relationship_to_student: "Father", emergency_contact: "" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error creating guardian:", error)
      let errorMessage = "Failed to create guardian"
      if (error?.response?.data) {
        const data = error.response.data
        // Handle validation errors (Laravel format)
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle messages format (another common format)
        else if (data.messages) {
          const messages = data.messages
          const errorMessages = Object.entries(messages).map(([field, msg]: [string, any]) => {
            const message = Array.isArray(msg) ? msg.join(", ") : msg
            return `${field}: ${message}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle simple message format
        else {
          errorMessage = data.message || data.error || data.detail || errorMessage
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleEdit = (guardian: any) => {
    const nameParts = (guardian.name || "").split(" ")
    setFormData({
      first_name: guardian.first_name || nameParts[0] || "",
      last_name: guardian.last_name || nameParts.slice(1).join(" ") || "",
      middle_name: guardian.middle_name || "",
      email: guardian.email || "",
      phone: guardian.phone || "",
      address: guardian.address || "",
      occupation: guardian.occupation || "",
      employer: guardian.employer || "",
      relationship_to_student: guardian.relationship || "Father",
      emergency_contact: guardian.phone || "",
    })
    setEditingId(guardian.id)
    setShowAddForm(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.first_name || !formData.last_name || !formData.email) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      const updateData: any = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
      }

      if (formData.middle_name?.trim()) {
        updateData.middle_name = formData.middle_name.trim()
      }
      if (formData.phone?.trim()) {
        updateData.phone = formData.phone.trim()
      }
      if (formData.address?.trim()) {
        updateData.address = formData.address.trim()
      }
      if (formData.occupation?.trim()) {
        updateData.occupation = formData.occupation.trim()
      }
      if (formData.employer?.trim()) {
        updateData.employer = formData.employer.trim()
      }

      await updateGuardian.mutateAsync({
        id: editingId,
        data: updateData,
      })
      toast.success("Guardian updated successfully")
      setFormData({ first_name: "", last_name: "", middle_name: "", email: "", phone: "", address: "", occupation: "", employer: "", relationship_to_student: "Father", emergency_contact: "" })
      setEditingId(null)
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error updating guardian:", error)
      let errorMessage = "Failed to update guardian"
      if (error?.response?.data) {
        const data = error.response.data
        // Handle validation errors (Laravel format)
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle messages format (another common format)
        else if (data.messages) {
          const messages = data.messages
          const errorMessages = Object.entries(messages).map(([field, msg]: [string, any]) => {
            const message = Array.isArray(msg) ? msg.join(", ") : msg
            return `${field}: ${message}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle simple message format
        else {
          errorMessage = data.message || data.error || data.detail || errorMessage
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this guardian?")) return

    try {
      await deleteGuardian.mutateAsync(id)
      toast.success("Guardian deleted successfully")
      refetch()
    } catch (error: any) {
      console.error("Error deleting guardian:", error)
      let errorMessage = "Failed to delete guardian"
      if (error?.response?.data) {
        const data = error.response.data
        // Handle validation errors (Laravel format)
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle messages format (another common format)
        else if (data.messages) {
          const messages = data.messages
          const errorMessages = Object.entries(messages).map(([field, msg]: [string, any]) => {
            const message = Array.isArray(msg) ? msg.join(", ") : msg
            return `${field}: ${message}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle simple message format
        else {
          errorMessage = data.message || data.error || data.detail || errorMessage
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleAssignStudent = async (guardianId: number) => {
    if (!assignForm.student_id) {
      toast.error("Please select a student")
      return
    }

    try {
      await assignStudent.mutateAsync({
        guardian_id: guardianId,
        data: {
          student_id: parseInt(assignForm.student_id),
          relationship: assignForm.relationship,
          is_primary: assignForm.is_primary,
          emergency_contact: assignForm.emergency_contact,
        },
      })
      toast.success("Student assigned to guardian successfully")
      setAssignForm({ student_id: "", relationship: "Father", is_primary: false, emergency_contact: true })
      setShowAssignStudent(null)
      refetch()
    } catch (error: any) {
      console.error("Error assigning student:", error)
      let errorMessage = "Failed to assign student"
      if (error?.response?.data) {
        const data = error.response.data
        // Handle validation errors (Laravel format)
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle messages format (another common format)
        else if (data.messages) {
          const messages = data.messages
          const errorMessages = Object.entries(messages).map(([field, msg]: [string, any]) => {
            const message = Array.isArray(msg) ? msg.join(", ") : msg
            return `${field}: ${message}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle simple message format
        else {
          errorMessage = data.message || data.error || data.detail || errorMessage
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleRemoveStudent = async (guardianId: number, studentId: number) => {
    if (!confirm("Are you sure you want to remove this student from the guardian?")) return

    try {
      await removeStudent.mutateAsync({ guardian_id: guardianId, student_id: studentId })
      toast.success("Student removed from guardian successfully")
      refetch()
    } catch (error: any) {
      console.error("Error removing student:", error)
      let errorMessage = "Failed to remove student"
      if (error?.response?.data) {
        const data = error.response.data
        // Handle validation errors (Laravel format)
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle messages format (another common format)
        else if (data.messages) {
          const messages = data.messages
          const errorMessages = Object.entries(messages).map(([field, msg]: [string, any]) => {
            const message = Array.isArray(msg) ? msg.join(", ") : msg
            return `${field}: ${message}`
          })
          errorMessage = errorMessages.join("; ")
        }
        // Handle simple message format
        else {
          errorMessage = data.message || data.error || data.detail || errorMessage
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading guardians: {error instanceof Error ? error.message : 'Unknown error'}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Guardians</h1>
          <p className="text-muted-foreground">Manage student guardians and parents</p>
        </div>
        <Button onClick={() => { setShowAddForm(true); setEditingId(null); setFormData({ first_name: "", last_name: "", middle_name: "", email: "", phone: "", address: "", occupation: "", employer: "", relationship_to_student: "Father", emergency_contact: "" }) }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Guardian
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Guardian" : "Add New Guardian"}</CardTitle>
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
                <Label>Middle Name</Label>
                <Input
                  value={formData.middle_name}
                  onChange={(e) => setFormData({...formData, middle_name: e.target.value})}
                  placeholder="Enter middle name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="email@example.com"
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
                <Label>Emergency Contact</Label>
                <Input
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                  placeholder="+1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label>Occupation</Label>
                <Input
                  value={formData.occupation}
                  onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                  placeholder="Occupation"
                />
              </div>
              <div className="space-y-2">
                <Label>Employer</Label>
                <Input
                  value={formData.employer}
                  onChange={(e) => setFormData({...formData, employer: e.target.value})}
                  placeholder="Employer name"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Full address"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={editingId ? handleUpdate : handleAdd}
              >
                {(createGuardian.isPending || updateGuardian.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingId ? "Update" : "Add"} Guardian
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
              placeholder="Search guardians..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Guardians List */}
      <Card>
        <CardHeader>
          <CardTitle>All Guardians</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `${guardians.length} guardians`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : guardians.length === 0 ? (
            <div className="text-center py-12">
              <UserCog className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No guardians found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {guardians.map((guardian: any) => (
                <div key={guardian.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <UserCog className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {guardian.first_name && guardian.last_name 
                            ? `${guardian.first_name} ${guardian.last_name}`
                            : guardian.name || 'N/A'}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          {guardian.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {guardian.email}
                            </div>
                          )}
                          {guardian.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {guardian.phone}
                            </div>
                          )}
                        </div>
                        {guardian.occupation && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {guardian.occupation}{guardian.employer ? ` at ${guardian.employer}` : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={guardian.status === "active" ? "default" : "secondary"}>
                        {guardian.status || "active"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(guardian)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(guardian.id)}
                      >
                        {deleteGuardian.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Students List */}
                  {guardian.students && guardian.students.length > 0 && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-medium flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Students ({guardian.students.length})
                        </Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAssignStudent(guardian.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Assign Student
                        </Button>
                      </div>
                      {guardian.students.map((student: any) => (
                        <div key={student.id} className="flex items-center justify-between p-2 bg-muted rounded">
                          <div>
                            <p className="font-medium">{student.first_name && student.last_name ? `${student.first_name} ${student.last_name}` : student.name}</p>
                            {student.pivot && (
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {student.pivot.relationship}
                                </Badge>
                                {student.pivot.is_primary && (
                                  <Badge variant="default" className="text-xs">Primary</Badge>
                                )}
                                {student.pivot.emergency_contact && (
                                  <Badge variant="secondary" className="text-xs">Emergency</Badge>
                                )}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveStudent(guardian.id, student.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Assign Student Form */}
                  {showAssignStudent === guardian.id && (
                    <Card className="mt-4">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Assign Student</CardTitle>
                          <Button variant="ghost" size="sm" onClick={() => setShowAssignStudent(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Student *</Label>
                            <Select
                              value={assignForm.student_id}
                              onValueChange={(value) => setAssignForm({...assignForm, student_id: value})}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select student" />
                              </SelectTrigger>
                              <SelectContent>
                                {students
                                  .filter((s: any) => !guardian.students?.some((gs: any) => gs.id === s.id))
                                  .map((student: any) => (
                                    <SelectItem key={student.id} value={student.id.toString()}>
                                      {student.first_name && student.last_name 
                                        ? `${student.first_name} ${student.last_name}`
                                        : student.name}
                                      {student.admission_number && ` (${student.admission_number})`}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Relationship *</Label>
                            <Select
                              value={assignForm.relationship}
                              onValueChange={(value) => setAssignForm({...assignForm, relationship: value})}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Father">Father</SelectItem>
                                <SelectItem value="Mother">Mother</SelectItem>
                                <SelectItem value="Guardian">Guardian</SelectItem>
                                <SelectItem value="Uncle">Uncle</SelectItem>
                                <SelectItem value="Aunt">Aunt</SelectItem>
                                <SelectItem value="Grandfather">Grandfather</SelectItem>
                                <SelectItem value="Grandmother">Grandmother</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`primary_${guardian.id}`}
                                  checked={assignForm.is_primary}
                                  onChange={(e) => setAssignForm({...assignForm, is_primary: e.target.checked})}
                                  className="w-4 h-4 rounded border-gray-300"
                                />
                                <Label htmlFor={`primary_${guardian.id}`} className="text-sm cursor-pointer">
                                  Primary Guardian
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`emergency_${guardian.id}`}
                                  checked={assignForm.emergency_contact}
                                  onChange={(e) => setAssignForm({...assignForm, emergency_contact: e.target.checked})}
                                  className="w-4 h-4 rounded border-gray-300"
                                />
                                <Label htmlFor={`emergency_${guardian.id}`} className="text-sm cursor-pointer">
                                  Emergency Contact
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            onClick={() => handleAssignStudent(guardian.id)}
                          >
                            {assignStudent.isPending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Assigning...
                              </>
                            ) : (
                              "Assign Student"
                            )}
                          </Button>
                          <Button variant="outline" onClick={() => setShowAssignStudent(null)}>
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {(!guardian.students || guardian.students.length === 0) && (
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAssignStudent(guardian.id)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Assign Student
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

