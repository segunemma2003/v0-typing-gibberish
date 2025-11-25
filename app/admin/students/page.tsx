"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Search, Plus, Filter, Download, Edit, Trash2, X, Loader2, Upload as UploadIcon } from "lucide-react"
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from "@/lib/api/students"
import { useClasses } from "@/lib/api/academic"
import { useSchools } from "@/lib/api/schools"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ExcelUpload } from "@/components/common/excel-upload"
import { useBulkCreateStudents } from "@/lib/api/bulk"
import { parseStudentRow } from "@/lib/utils/excel-parser"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudentsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"list" | "bulk">("list")
  
  const { data: studentsResponse, isLoading, error, refetch } = useStudents({
    search: searchTerm || undefined,
    per_page: 100,
  })

  const { data: classesResponse } = useClasses()
  // API may return direct array or wrapped in { data: [...] }
  const classes = Array.isArray(classesResponse) ? classesResponse : (classesResponse?.data || [])

  const { data: schoolsResponse } = useSchools()
  const schools = Array.isArray(schoolsResponse?.data) ? schoolsResponse.data : []
  const currentSchoolId = schools?.[0]?.id // Get first school ID (admin should only have access to one school)

  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()
  const bulkCreateStudents = useBulkCreateStudents()

  // Safely extract students array from API response
  const students = Array.isArray(studentsResponse?.data) ? studentsResponse.data : []

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    class_id: "",
    arm_id: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    blood_group: "",
    emergency_contact: "",
  })
  
  const [medicalInfo, setMedicalInfo] = useState({
    allergies: [] as string[],
    conditions: [] as string[],
    newAllergy: "",
    newCondition: "",
  })

  const [guardians, setGuardians] = useState<Array<{
    first_name: string
    last_name: string
    middle_name: string
    email: string
    phone: string
    address: string
    occupation: string
    employer: string
    relationship: string
    is_primary: boolean
    emergency_contact: boolean
  }>>([])

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Get selected class's arms for dropdown
  const selectedClass = classes.find((c: any) => c.id.toString() === formData.class_id)
  const availableArms = selectedClass?.arms || []

  const handleAdd = async () => {
    // Clear previous validation errors
    setValidationErrors({})
    const errors: Record<string, string> = {}

    // Validate required fields
    if (!formData.first_name?.trim()) {
      errors.first_name = "First name is required"
    }
    
    if (!formData.last_name?.trim()) {
      errors.last_name = "Last name is required"
    }

    // Validate email format if provided
    if (formData.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address"
    }

    // Validate guardians if added
    guardians.forEach((guardian, index) => {
      if (!guardian.first_name?.trim()) {
        errors[`guardian_${index}_first_name`] = "Guardian first name is required"
      }
      if (!guardian.last_name?.trim()) {
        errors[`guardian_${index}_last_name`] = "Guardian last name is required"
      }
      if (!guardian.email?.trim()) {
        errors[`guardian_${index}_email`] = "Guardian email is required"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guardian.email.trim())) {
        errors[`guardian_${index}_email`] = "Please enter a valid email address"
      }
      if (!guardian.relationship?.trim()) {
        errors[`guardian_${index}_relationship`] = "Guardian relationship is required"
      }
    })
    
    if (!currentSchoolId) {
      errors.school = "School information not available. Please refresh the page."
    }

    // If there are validation errors, set them and show toast
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      const errorMessages = Object.values(errors)
      toast.error(`Validation Error: ${errorMessages[0]}`, {
        description: errorMessages.length > 1 ? `And ${errorMessages.length - 1} more error(s)` : undefined
      })
      return
    }

    try {
      // Build request payload with proper type checking
      const payload: any = {
        school_id: currentSchoolId,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
      }

      // Add optional fields only if they have values
      if (formData.email?.trim()) {
        payload.email = formData.email.trim()
      }
      if (formData.phone?.trim()) {
        payload.phone = formData.phone.trim()
      }
      if (formData.date_of_birth) {
        payload.date_of_birth = formData.date_of_birth
      }
      if (formData.gender) {
        payload.gender = formData.gender
      }
      if (formData.class_id) {
        const classId = parseInt(formData.class_id)
        if (!isNaN(classId)) {
          payload.class_id = classId
        }
      }
      if (formData.arm_id) {
        const armId = parseInt(formData.arm_id)
        if (!isNaN(armId)) {
          payload.arm_id = armId
        }
      }

      // Add guardians if provided (max 2)
      if (guardians.length > 0) {
        payload.guardians = guardians.slice(0, 2).map(g => ({
          first_name: g.first_name.trim(),
          last_name: g.last_name.trim(),
          middle_name: g.middle_name?.trim(),
          email: g.email.trim(),
          phone: g.phone?.trim(),
          address: g.address?.trim(),
          occupation: g.occupation?.trim(),
          employer: g.employer?.trim(),
          relationship: g.relationship,
          is_primary: g.is_primary,
          emergency_contact: g.emergency_contact,
        }))
      }

      const response = await createStudent.mutateAsync(payload)
      
      // Display login credentials if available (with guardians credentials too)
      if (response.login_credentials) {
        let credentialsMessage = `Student Credentials:\nEmail: ${response.login_credentials.email}\nPassword: ${response.login_credentials.password}`
        
        // Add guardian credentials if they exist
        if (response.student?.guardians && response.student.guardians.length > 0) {
          credentialsMessage += `\n\nGuardian Credentials:`
          response.student.guardians.forEach((guardian: any, index: number) => {
            credentialsMessage += `\n${index + 1}. ${guardian.first_name} ${guardian.last_name} (${guardian.pivot?.relationship || 'Guardian'}):\n   Email: ${guardian.email}\n   Password: Password@123`
          })
        }
        
        toast.success("Student created successfully!", {
          description: credentialsMessage,
          duration: 20000, // Extended duration for longer message
        })
      } else {
        toast.success("Student created successfully")
      }
      
      setFormData({ first_name: "", last_name: "", middle_name: "", email: "", class_id: "", arm_id: "", phone: "", date_of_birth: "", gender: "", address: "", blood_group: "", emergency_contact: "" })
      setMedicalInfo({ allergies: [], conditions: [], newAllergy: "", newCondition: "" })
      setGuardians([])
      setValidationErrors({})
    setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error creating student:", error)
      let errorMessage = "Failed to create student"
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

  const handleEdit = (student: any) => {
      setFormData({
      first_name: student.name?.split(' ')[0] || "",
      last_name: student.name?.split(' ').slice(1).join(' ') || "",
      middle_name: "",
      email: student.email || "",
      class_id: student.class?.id?.toString() || "",
      arm_id: student.arm?.id?.toString() || "",
      phone: student.phone || "",
      date_of_birth: student.date_of_birth || "",
      gender: student.gender || "",
      address: "",
      blood_group: "",
      emergency_contact: "",
    })
    setEditingId(student.id)
      setShowAddForm(true)
      setValidationErrors({})
    }

  const handleUpdate = async () => {
    if (!editingId || !formData.first_name || !formData.last_name) {
      toast.error("Please fill in required fields (First Name and Last Name)")
      return
    }
    
    try {
      // Build update payload with proper type checking
      const updateData: any = {
        name: `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim(),
      }

      // Add optional fields only if they have values
      if (formData.class_id) {
        const classId = parseInt(formData.class_id)
        if (!isNaN(classId)) {
          updateData.class_id = classId
        }
      }
      if (formData.arm_id) {
        const armId = parseInt(formData.arm_id)
        if (!isNaN(armId)) {
          updateData.arm_id = armId
        }
      }

      await updateStudent.mutateAsync({
        id: editingId,
        data: updateData,
      })
      toast.success("Student updated successfully")
      setFormData({ first_name: "", last_name: "", middle_name: "", email: "", class_id: "", arm_id: "", phone: "", date_of_birth: "", gender: "", address: "", blood_group: "", emergency_contact: "" })
      setValidationErrors({})
    setEditingId(null)
    setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error updating student:", error)
      let errorMessage = "Failed to update student"
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
    if (!confirm("Are you sure you want to delete this student?")) return
    
    try {
      await deleteStudent.mutateAsync(id)
      toast.success("Student deleted successfully")
      refetch()
    } catch (error: any) {
      console.error("Error deleting student:", error)
      let errorMessage = "Failed to delete student"
      if (error?.response?.data) {
        const data = error.response.data
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        } else if (data.messages) {
          const messages = data.messages
          const errorMessages = Object.entries(messages).map(([field, msg]: [string, any]) => {
            const message = Array.isArray(msg) ? msg.join(", ") : msg
            return `${field}: ${message}`
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

  return (
    <div className="p-6 space-y-6" style={{ position: 'relative' }}>
      {/* Header - Always visible */}
      <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 10 }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student records and enrollment</p>
        </div>
        <div className="flex gap-2">
          <Button 
            type="button"
            variant="outline"
            onClick={() => setActiveTab(activeTab === "list" ? "bulk" : "list")}
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {activeTab === "list" ? "Bulk Upload" : "Back to List"}
          </Button>
          <Button 
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log("Add Student button clicked", { showAddForm })
              setShowAddForm(true)
              setEditingId(null)
              setValidationErrors({})
              setFormData({ 
                first_name: "", 
                last_name: "", 
                middle_name: "", 
                email: "", 
                class_id: "", 
                arm_id: "", 
                phone: "", 
                date_of_birth: "", 
                gender: "", 
                address: "", 
                blood_group: "", 
                emergency_contact: "" 
              })
              setMedicalInfo({ 
                allergies: [], 
                conditions: [], 
                newAllergy: "", 
                newCondition: "" 
              })
              setGuardians([])
            }}
            style={{ position: 'relative', zIndex: 100 }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading students: {error instanceof Error ? error.message : 'Unknown error'}</p>
            <Button onClick={() => refetch()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bulk Upload Section */}
      {activeTab === "bulk" && (
        <ExcelUpload
          entityType="students"
          templateColumns={[
            "first_name", "last_name", "middle_name", 
            "class_id (or class_name)", "arm_id (or arm_name)",
            "date_of_birth", "gender", "phone", "address",
            "blood_group", "parent_name", "parent_phone", "parent_email",
            "emergency_contact", "allergies", "medications"
          ]}
          maxRows={1000}
          onFileProcessed={(data) => {
            console.log("Excel data processed:", data)
          }}
          onUpload={async (excelData) => {
            // Create maps for class and arm lookup
            const classMap = new Map<string, number>()
            classes.forEach((c: any) => {
              classMap.set(c.name?.toLowerCase() || "", c.id)
              classMap.set(String(c.id), c.id)
            })

            const armMap = new Map<string, number>()
            classes.forEach((c: any) => {
              if (c.arms) {
                c.arms.forEach((arm: any) => {
                  armMap.set(arm.name?.toLowerCase() || "", arm.id)
                  armMap.set(String(arm.id), arm.id)
                })
              }
            })

            // Parse Excel rows to API format
            const students = excelData.map((row: any) => {
              try {
                return parseStudentRow(row, classMap, armMap)
              } catch (error: any) {
                console.error("Error parsing row:", row, error)
                throw new Error(`Row ${row._rowIndex || 'unknown'}: ${error.message}`)
              }
            }).filter((s: any) => s.first_name && s.last_name)

            if (students.length === 0) {
              throw new Error("No valid student data found in Excel file")
            }

            const response = await bulkCreateStudents.mutateAsync({ students })
            await refetch()
            return response
          }}
        />
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Student" : "Add New Student"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setEditingId(null); setGuardians([]); setValidationErrors({}) }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {validationErrors.school && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{validationErrors.school}</p>
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input 
                  value={formData.first_name} 
                  onChange={(e) => {
                    setFormData({...formData, first_name: e.target.value})
                    if (validationErrors.first_name) {
                      setValidationErrors({...validationErrors, first_name: ""})
                    }
                  }}
                  placeholder="Enter first name"
                  className={validationErrors.first_name ? "border-red-500" : ""}
                />
                {validationErrors.first_name && (
                  <p className="text-sm text-red-500">{validationErrors.first_name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input 
                  value={formData.last_name} 
                  onChange={(e) => {
                    setFormData({...formData, last_name: e.target.value})
                    if (validationErrors.last_name) {
                      setValidationErrors({...validationErrors, last_name: ""})
                    }
                  }}
                  placeholder="Enter last name"
                  className={validationErrors.last_name ? "border-red-500" : ""}
                />
                {validationErrors.last_name && (
                  <p className="text-sm text-red-500">{validationErrors.last_name}</p>
                )}
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
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => {
                    setFormData({...formData, email: e.target.value})
                    if (validationErrors.email) {
                      setValidationErrors({...validationErrors, email: ""})
                    }
                  }}
                  placeholder="Leave empty for auto-generation"
                  className={validationErrors.email ? "border-red-500" : ""}
                />
                {validationErrors.email ? (
                  <p className="text-sm text-red-500">{validationErrors.email}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Auto-generated if not provided</p>
                )}
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
                <Label>Blood Group</Label>
                <Select 
                  value={formData.blood_group} 
                  onValueChange={(value) => setFormData({...formData, blood_group: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Input 
                  value={formData.address} 
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Full address"
                />
              </div>
              <div className="space-y-2">
                <Label>Present Class *</Label>
                <Select 
                  value={formData.class_id || undefined} 
                  onValueChange={(value) => setFormData({...formData, class_id: value, arm_id: ""})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={classes.length === 0 ? "No classes available" : "Select a class"} />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.length === 0 ? (
                      <SelectItem value="none" disabled>No classes available. Please create a class first.</SelectItem>
                    ) : (
                      classes.map((classItem: any) => (
                        <SelectItem key={classItem.id} value={classItem.id.toString()}>
                          {classItem.name} {classItem.level ? `(${classItem.level})` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {classes.length === 0 && (
                  <p className="text-xs text-muted-foreground">No classes found. Please create classes in the Classes page first.</p>
                )}
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

            {/* Medical Information Section */}
            {!editingId && (
              <div className="mt-6 space-y-4">
                <Label className="text-base font-semibold">Medical Information (Optional)</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Allergies</Label>
                    <div className="flex gap-2">
                      <Input
                        value={medicalInfo.newAllergy}
                        onChange={(e) => setMedicalInfo({...medicalInfo, newAllergy: e.target.value})}
                        placeholder="Add allergy"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && medicalInfo.newAllergy.trim()) {
                            setMedicalInfo({
                              ...medicalInfo,
                              allergies: [...medicalInfo.allergies, medicalInfo.newAllergy.trim()],
                              newAllergy: "",
                            })
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (medicalInfo.newAllergy.trim()) {
                            setMedicalInfo({
                              ...medicalInfo,
                              allergies: [...medicalInfo.allergies, medicalInfo.newAllergy.trim()],
                              newAllergy: "",
                            })
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {medicalInfo.allergies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {medicalInfo.allergies.map((allergy, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
                            setMedicalInfo({
                              ...medicalInfo,
                              allergies: medicalInfo.allergies.filter((_, i) => i !== index),
                            })
                          }}>
                            {allergy} <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Medical Conditions</Label>
                    <div className="flex gap-2">
                      <Input
                        value={medicalInfo.newCondition}
                        onChange={(e) => setMedicalInfo({...medicalInfo, newCondition: e.target.value})}
                        placeholder="Add condition"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && medicalInfo.newCondition.trim()) {
                            setMedicalInfo({
                              ...medicalInfo,
                              conditions: [...medicalInfo.conditions, medicalInfo.newCondition.trim()],
                              newCondition: "",
                            })
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (medicalInfo.newCondition.trim()) {
                            setMedicalInfo({
                              ...medicalInfo,
                              conditions: [...medicalInfo.conditions, medicalInfo.newCondition.trim()],
                              newCondition: "",
                            })
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {medicalInfo.conditions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {medicalInfo.conditions.map((condition, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
                            setMedicalInfo({
                              ...medicalInfo,
                              conditions: medicalInfo.conditions.filter((_, i) => i !== index),
                            })
                          }}>
                            {condition} <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Guardians Section */}
            {!editingId && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Guardians (Optional, Max 2)</Label>
                  {guardians.length < 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGuardians([...guardians, {
                          first_name: "",
                          last_name: "",
                          middle_name: "",
                          email: "",
                          phone: "",
                          address: "",
                          occupation: "",
                          employer: "",
                          relationship: "Father",
                          is_primary: guardians.length === 0, // First guardian is primary by default
                          emergency_contact: true,
                        }])
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Guardian
                    </Button>
                  )}
                </div>
                {guardians.map((guardian, index) => (
                  <Card key={index} className="p-4 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Guardian {index + 1}</Label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`primary_${index}`}
                            checked={guardian.is_primary}
                            onChange={(e) => {
                              const updated = [...guardians]
                              updated.forEach((g, i) => {
                                g.is_primary = i === index ? e.target.checked : !e.target.checked
                              })
                              setGuardians(updated)
                            }}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <Label htmlFor={`primary_${index}`} className="text-xs cursor-pointer">
                            Primary
                          </Label>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setGuardians(guardians.filter((_, i) => i !== index))}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>First Name *</Label>
                        <Input
                          value={guardian.first_name}
                          onChange={(e) => {
                            const updated = [...guardians]
                            updated[index].first_name = e.target.value
                            setGuardians(updated)
                            if (validationErrors[`guardian_${index}_first_name`]) {
                              setValidationErrors({...validationErrors, [`guardian_${index}_first_name`]: ""})
                            }
                          }}
                          placeholder="First name"
                          className={validationErrors[`guardian_${index}_first_name`] ? "border-red-500" : ""}
                        />
                        {validationErrors[`guardian_${index}_first_name`] && (
                          <p className="text-sm text-red-500">{validationErrors[`guardian_${index}_first_name`]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name *</Label>
                        <Input
                          value={guardian.last_name}
                          onChange={(e) => {
                            const updated = [...guardians]
                            updated[index].last_name = e.target.value
                            setGuardians(updated)
                            if (validationErrors[`guardian_${index}_last_name`]) {
                              setValidationErrors({...validationErrors, [`guardian_${index}_last_name`]: ""})
                            }
                          }}
                          placeholder="Last name"
                          className={validationErrors[`guardian_${index}_last_name`] ? "border-red-500" : ""}
                        />
                        {validationErrors[`guardian_${index}_last_name`] && (
                          <p className="text-sm text-red-500">{validationErrors[`guardian_${index}_last_name`]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={guardian.email}
                          onChange={(e) => {
                            const updated = [...guardians]
                            updated[index].email = e.target.value
                            setGuardians(updated)
                            if (validationErrors[`guardian_${index}_email`]) {
                              setValidationErrors({...validationErrors, [`guardian_${index}_email`]: ""})
                            }
                          }}
                          placeholder="email@example.com"
                          className={validationErrors[`guardian_${index}_email`] ? "border-red-500" : ""}
                        />
                        {validationErrors[`guardian_${index}_email`] && (
                          <p className="text-sm text-red-500">{validationErrors[`guardian_${index}_email`]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Phone</Label>
                        <Input
                          value={guardian.phone}
                          onChange={(e) => {
                            const updated = [...guardians]
                            updated[index].phone = e.target.value
                            setGuardians(updated)
                          }}
                          placeholder="+1234567890"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship *</Label>
                        <Select
                          value={guardian.relationship}
                          onValueChange={(value) => {
                            const updated = [...guardians]
                            updated[index].relationship = value
                            setGuardians(updated)
                            if (validationErrors[`guardian_${index}_relationship`]) {
                              setValidationErrors({...validationErrors, [`guardian_${index}_relationship`]: ""})
                            }
                          }}
                        >
                          <SelectTrigger className={`w-full ${validationErrors[`guardian_${index}_relationship`] ? "border-red-500" : ""}`}>
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
                        {validationErrors[`guardian_${index}_relationship`] && (
                          <p className="text-sm text-red-500">{validationErrors[`guardian_${index}_relationship`]}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Occupation</Label>
                        <Input
                          value={guardian.occupation}
                          onChange={(e) => {
                            const updated = [...guardians]
                            updated[index].occupation = e.target.value
                            setGuardians(updated)
                          }}
                          placeholder="Occupation"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`emergency_${index}`}
                            checked={guardian.emergency_contact}
                            onChange={(e) => {
                              const updated = [...guardians]
                              updated[index].emergency_contact = e.target.checked
                              setGuardians(updated)
                            }}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <Label htmlFor={`emergency_${index}`} className="text-sm cursor-pointer">
                            Emergency Contact
                          </Label>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button 
                type="button"
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
              <Button variant="outline" onClick={() => { setShowAddForm(false); setEditingId(null); setValidationErrors({}) }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters - Only show in list view */}
      {activeTab === "list" && (
        <>
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
        </>
      )}
    </div>
  )
}
