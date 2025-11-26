"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Search, Plus, Filter, Download, Edit, Trash2, X, Loader2, Upload as UploadIcon, AlertCircle } from "lucide-react"
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
    class_id: "",
    arm_id: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    blood_group: "",
    parent_name: "",
    parent_phone: "",
    parent_email: "",
    emergency_contact: "",
  })
  
  const [medicalInfo, setMedicalInfo] = useState({
    allergies: [] as string[],
    medications: [] as string[],
    conditions: [] as string[],
    doctor_name: "",
    doctor_phone: "",
    hospital: "",
    insurance_provider: "",
    insurance_number: "",
    special_needs: "",
    notes: "",
    newAllergy: "",
    newMedication: "",
    newCondition: "",
  })

  const [transportInfo, setTransportInfo] = useState({
    uses_transport: false,
    route_id: "",
    pickup_point: "",
    pickup_time: "",
    dropoff_point: "",
    dropoff_time: "",
    bus_number: "",
    guardian_pickup: false,
    special_instructions: "",
  })

  const [hostelInfo, setHostelInfo] = useState({
    is_boarder: false,
    hostel_name: "",
    block: "",
    floor: "",
    room_number: "",
    bed_number: "",
    roommate_preferences: "",
    dietary_requirements: "",
    bedding_provided: false,
    locker_number: "",
  })

  const [guardians, setGuardians] = useState<Array<{
    first_name: string
    last_name: string
    email: string
    phone: string
    address: string
    occupation: string
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

    // Validate required fields (per API documentation)
    if (!formData.first_name?.trim()) {
      errors.first_name = "First name is required and cannot be empty"
    }
    
    if (!formData.last_name?.trim()) {
      errors.last_name = "Last name is required and cannot be empty"
    }
    
    // class_id is required per API
    if (!formData.class_id?.trim()) {
      errors.class_id = "Class is required. Please select a class"
    }
    
    // date_of_birth is required per API
    if (!formData.date_of_birth?.trim()) {
      errors.date_of_birth = "Date of birth is required"
    } else {
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(formData.date_of_birth)) {
        errors.date_of_birth = "Date must be in YYYY-MM-DD format"
      }
    }
    
    // gender is required per API
    if (!formData.gender?.trim()) {
      errors.gender = "Gender is required. Please select a gender"
    } else if (!['male', 'female', 'other'].includes(formData.gender.toLowerCase())) {
      errors.gender = "Gender must be 'male', 'female', or 'other'"
    }

    // Validate parent email format if provided
    if (formData.parent_email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parent_email.trim())) {
      errors.parent_email = "Please enter a valid email address"
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
    
    // Note: school_id is auto-detected from X-Subdomain header, no need to validate

    // If there are validation errors, set them and show toast
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      
      // Create a comprehensive error message
      const errorList = Object.entries(errors).map(([field, message]) => {
        // Format field names for better readability
        const fieldName = field
          .replace(/_/g, ' ')
          .replace(/guardian (\d+)/, 'Guardian $1')
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        return `• ${fieldName}: ${message}`
      }).join('\n')
      
      toast.error(`Please fix the following errors:`, {
        description: errorList,
        duration: 8000, // Show longer for multiple errors
      })
      
      // Scroll to first error field
      setTimeout(() => {
        const firstErrorField = document.querySelector('[class*="border-red-500"]')
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Focus the first input
          const input = (firstErrorField as HTMLElement).querySelector('input, select, textarea') as HTMLElement
          if (input) {
            input.focus()
          }
        }
      }, 100)
      
      return
    }

    try {
      // Build request payload according to API documentation
      // Note: school_id is NOT included - it's auto-detected from X-Subdomain header
      const payload: any = {
        // Required fields
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        class_id: parseInt(formData.class_id),
        date_of_birth: formData.date_of_birth,
        gender: formData.gender.toLowerCase(), // Ensure lowercase
      }

      // Optional basic fields
      if (formData.middle_name?.trim()) {
        payload.middle_name = formData.middle_name.trim()
      }
      if (formData.arm_id) {
        const armId = parseInt(formData.arm_id)
        if (!isNaN(armId)) {
          payload.arm_id = armId
        }
      }
      if (formData.phone?.trim()) {
        payload.phone = formData.phone.trim()
      }
      if (formData.address?.trim()) {
        payload.address = formData.address.trim()
      }
      if (formData.blood_group?.trim()) {
        payload.blood_group = formData.blood_group.trim()
      }
      
      // Parent/Guardian information (optional)
      if (formData.parent_name?.trim()) {
        payload.parent_name = formData.parent_name.trim()
      }
      if (formData.parent_phone?.trim()) {
        payload.parent_phone = formData.parent_phone.trim()
      }
      if (formData.parent_email?.trim()) {
        payload.parent_email = formData.parent_email.trim()
      }
      if (formData.emergency_contact?.trim()) {
        payload.emergency_contact = formData.emergency_contact.trim()
      }

      // Add medical_info if provided
      const hasMedicalInfo = medicalInfo.allergies.length > 0 || 
                             medicalInfo.medications.length > 0 || 
                             medicalInfo.conditions.length > 0 ||
                             medicalInfo.doctor_name?.trim() ||
                             medicalInfo.hospital?.trim()
      
      if (hasMedicalInfo) {
        payload.medical_info = {
          allergies: medicalInfo.allergies,
          medications: medicalInfo.medications,
          conditions: medicalInfo.conditions,
        }
        if (medicalInfo.doctor_name?.trim()) {
          payload.medical_info.doctor_name = medicalInfo.doctor_name.trim()
        }
        if (medicalInfo.doctor_phone?.trim()) {
          payload.medical_info.doctor_phone = medicalInfo.doctor_phone.trim()
        }
        if (medicalInfo.hospital?.trim()) {
          payload.medical_info.hospital = medicalInfo.hospital.trim()
        }
        if (medicalInfo.insurance_provider?.trim()) {
          payload.medical_info.insurance_provider = medicalInfo.insurance_provider.trim()
        }
        if (medicalInfo.insurance_number?.trim()) {
          payload.medical_info.insurance_number = medicalInfo.insurance_number.trim()
        }
        if (medicalInfo.special_needs?.trim()) {
          payload.medical_info.special_needs = medicalInfo.special_needs.trim()
        }
        if (medicalInfo.notes?.trim()) {
          payload.medical_info.notes = medicalInfo.notes.trim()
        }
        // Add blood_group to medical_info if provided
        if (formData.blood_group?.trim()) {
          payload.medical_info.blood_group = formData.blood_group.trim()
        }
      }

      // Add transport_info if provided
      if (transportInfo.uses_transport) {
        payload.transport_info = {
          uses_transport: true,
        }
        if (transportInfo.route_id) {
          const routeId = parseInt(transportInfo.route_id)
          if (!isNaN(routeId)) {
            payload.transport_info.route_id = routeId
          }
        }
        if (transportInfo.pickup_point?.trim()) {
          payload.transport_info.pickup_point = transportInfo.pickup_point.trim()
        }
        if (transportInfo.pickup_time?.trim()) {
          payload.transport_info.pickup_time = transportInfo.pickup_time.trim()
        }
        if (transportInfo.dropoff_point?.trim()) {
          payload.transport_info.dropoff_point = transportInfo.dropoff_point.trim()
        }
        if (transportInfo.dropoff_time?.trim()) {
          payload.transport_info.dropoff_time = transportInfo.dropoff_time.trim()
        }
        if (transportInfo.bus_number?.trim()) {
          payload.transport_info.bus_number = transportInfo.bus_number.trim()
        }
        payload.transport_info.guardian_pickup = transportInfo.guardian_pickup
        if (transportInfo.special_instructions?.trim()) {
          payload.transport_info.special_instructions = transportInfo.special_instructions.trim()
        }
      }

      // Add hostel_info if provided
      if (hostelInfo.is_boarder) {
        payload.hostel_info = {
          is_boarder: true,
        }
        if (hostelInfo.hostel_name?.trim()) {
          payload.hostel_info.hostel_name = hostelInfo.hostel_name.trim()
        }
        if (hostelInfo.block?.trim()) {
          payload.hostel_info.block = hostelInfo.block.trim()
        }
        if (hostelInfo.floor?.trim()) {
          payload.hostel_info.floor = hostelInfo.floor.trim()
        }
        if (hostelInfo.room_number?.trim()) {
          payload.hostel_info.room_number = hostelInfo.room_number.trim()
        }
        if (hostelInfo.bed_number?.trim()) {
          payload.hostel_info.bed_number = hostelInfo.bed_number.trim()
        }
        if (hostelInfo.roommate_preferences?.trim()) {
          payload.hostel_info.roommate_preferences = hostelInfo.roommate_preferences.trim()
        }
        if (hostelInfo.dietary_requirements?.trim()) {
          payload.hostel_info.dietary_requirements = hostelInfo.dietary_requirements.trim()
        }
        payload.hostel_info.bedding_provided = hostelInfo.bedding_provided
        if (hostelInfo.locker_number?.trim()) {
          payload.hostel_info.locker_number = hostelInfo.locker_number.trim()
        }
      }

      // Add guardians if provided (max 2 per API)
      if (guardians.length > 0) {
        payload.guardians = guardians.slice(0, 2).map(g => ({
          first_name: g.first_name.trim(),
          last_name: g.last_name.trim(),
          email: g.email.trim(),
          phone: g.phone?.trim() || undefined,
          relationship: g.relationship,
          is_primary: g.is_primary || false,
          occupation: g.occupation?.trim() || undefined,
          address: g.address?.trim() || undefined,
          can_pickup: g.emergency_contact || false,
          emergency_contact: g.emergency_contact || false,
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
      
      setFormData({ first_name: "", last_name: "", middle_name: "", class_id: "", arm_id: "", phone: "", date_of_birth: "", gender: "", address: "", blood_group: "", parent_name: "", parent_phone: "", parent_email: "", emergency_contact: "" })
      setMedicalInfo({ allergies: [], medications: [], conditions: [], doctor_name: "", doctor_phone: "", hospital: "", insurance_provider: "", insurance_number: "", special_needs: "", notes: "", newAllergy: "", newMedication: "", newCondition: "" })
      setTransportInfo({ uses_transport: false, route_id: "", pickup_point: "", pickup_time: "", dropoff_point: "", dropoff_time: "", bus_number: "", guardian_pickup: false, special_instructions: "" })
      setHostelInfo({ is_boarder: false, hostel_name: "", block: "", floor: "", room_number: "", bed_number: "", roommate_preferences: "", dietary_requirements: "", bedding_provided: false, locker_number: "" })
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
      first_name: student.name?.split(' ')[0] || student.first_name || "",
      last_name: student.name?.split(' ').slice(1).join(' ') || student.last_name || "",
      middle_name: student.middle_name || "",
      class_id: student.class?.id?.toString() || student.class_id?.toString() || "",
      arm_id: student.arm?.id?.toString() || student.arm_id?.toString() || "",
      phone: student.phone || "",
      date_of_birth: student.date_of_birth || "",
      gender: student.gender || "",
      address: student.address || "",
      blood_group: student.blood_group || "",
      parent_name: student.parent_name || "",
      parent_phone: student.parent_phone || "",
      parent_email: student.parent_email || "",
      emergency_contact: student.emergency_contact || "",
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
      setFormData({ first_name: "", last_name: "", middle_name: "", class_id: "", arm_id: "", phone: "", date_of_birth: "", gender: "", address: "", blood_group: "", parent_name: "", parent_phone: "", parent_email: "", emergency_contact: "" })
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
      <div className="flex items-center justify-between relative z-10">
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
            onClick={() => {
              console.log("Add Student button clicked")
              setShowAddForm(true)
              setEditingId(null)
              setValidationErrors({})
              setFormData({ 
                first_name: "", 
                last_name: "", 
                middle_name: "", 
                class_id: "", 
                arm_id: "", 
                phone: "", 
                date_of_birth: "", 
                gender: "", 
                address: "", 
                blood_group: "", 
                parent_name: "", 
                parent_phone: "", 
                parent_email: "", 
                emergency_contact: "" 
              })
              setMedicalInfo({ 
                allergies: [], 
                medications: [], 
                conditions: [], 
                doctor_name: "", 
                doctor_phone: "", 
                hospital: "", 
                insurance_provider: "", 
                insurance_number: "", 
                special_needs: "", 
                notes: "", 
                newAllergy: "", 
                newMedication: "", 
                newCondition: "" 
              })
              setTransportInfo({ uses_transport: false, route_id: "", pickup_point: "", pickup_time: "", dropoff_point: "", dropoff_time: "", bus_number: "", guardian_pickup: false, special_instructions: "" })
              setHostelInfo({ is_boarder: false, hostel_name: "", block: "", floor: "", room_number: "", bed_number: "", roommate_preferences: "", dietary_requirements: "", bedding_provided: false, locker_number: "" })
              setGuardians([])
            }}
            className="relative z-50"
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
            "date_of_birth (YYYY-MM-DD)", "gender (male/female/other)", 
            "phone", "address", "blood_group", 
            "parent_name", "parent_phone", "parent_email",
            "emergency_contact", 
            "allergies (comma-separated)", "medications (comma-separated)", "conditions (comma-separated)",
            "doctor_name", "doctor_phone", "hospital", 
            "insurance_provider", "insurance_number",
            "uses_transport (true/false)", "route_id", "pickup_point", "pickup_time",
            "is_boarder (true/false)", "hostel_name", "block", "room_number", "bed_number"
          ]}
          maxRows={1000}
          onFileProcessed={(data) => {
            console.log("Excel data processed:", data)
          }}
          onUpload={async (excelData) => {
            try {
              // Create maps for class and arm lookup (case-insensitive)
              const classMap = new Map<string, number>()
              classes.forEach((c: any) => {
                if (c.name) {
                  classMap.set(c.name.toLowerCase().trim(), c.id)
                  classMap.set(c.name.trim(), c.id) // Also store original case
                }
                classMap.set(String(c.id), c.id)
              })

              const armMap = new Map<string, number>()
              classes.forEach((c: any) => {
                if (c.arms) {
                  c.arms.forEach((arm: any) => {
                    if (arm.name) {
                      armMap.set(arm.name.toLowerCase().trim(), arm.id)
                      armMap.set(arm.name.trim(), arm.id) // Also store original case
                    }
                    armMap.set(String(arm.id), arm.id)
                  })
                }
              })

              // Parse Excel rows to API format
              const parseErrors: string[] = []
              const students = excelData.map((row: any, index: number) => {
                try {
                  const student = parseStudentRow(row, classMap, armMap)
                  return student
                } catch (error: any) {
                  console.error("Error parsing row:", row, error)
                  parseErrors.push(`Row ${row._rowIndex || index + 2}: ${error.message}`)
                  return null
                }
              }).filter((s: any) => s !== null)

              if (parseErrors.length > 0) {
                toast.error(`Found ${parseErrors.length} parsing error(s)`, {
                  description: parseErrors.slice(0, 5).join("\n") + (parseErrors.length > 5 ? `\n... and ${parseErrors.length - 5} more` : ""),
                  duration: 10000,
                })
              }

              if (students.length === 0) {
                throw new Error("No valid student data found in Excel file. Please check required fields: first_name, last_name, date_of_birth, gender, class_id")
              }

              const response = await bulkCreateStudents.mutateAsync({ students })
              await refetch()
              return response
            } catch (error: any) {
              console.error("Error in bulk upload:", error)
              let errorMessage = "Failed to upload students"
              
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
                // Handle messages format
                else if (data.messages) {
                  const messages = data.messages
                  const errorMessages = Object.entries(messages).map(([field, msg]: [string, any]) => {
                    const message = Array.isArray(msg) ? msg.join(", ") : msg
                    return `${field}: ${message}`
                  })
                  errorMessage = errorMessages.join("; ")
                }
                // Handle bulk upload specific error format
                else if (data.data?.failed && Array.isArray(data.data.failed)) {
                  const failedErrors = data.data.failed.map((err: any) => {
                    return `Row ${err.index || err.row || '?'}: ${err.error || JSON.stringify(err)}`
                  }).slice(0, 10)
                  errorMessage = `Failed rows:\n${failedErrors.join("\n")}${data.data.failed.length > 10 ? `\n... and ${data.data.failed.length - 10} more` : ""}`
                }
                else {
                  errorMessage = data.message || data.error || data.detail || errorMessage
                }
              } else if (error?.message) {
                errorMessage = error.message
              }
              
              toast.error(errorMessage, {
                duration: 15000,
              })
              throw error
            }
          }}
        />
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card data-student-form>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
              <CardTitle>{editingId ? "Edit Student" : "Add New Student"}</CardTitle>
                {!editingId && (
                  <CardDescription className="mt-1">
                    Email, username, and password will be auto-generated. Required fields: First Name, Last Name, Class, Date of Birth, Gender.
                  </CardDescription>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setEditingId(null); setGuardians([]); setValidationErrors({}) }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Validation Errors Summary */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                <div className="flex items-start gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800 mb-2">Please fix the following errors:</h3>
                    <ul className="space-y-1 text-sm text-red-700">
                      {Object.entries(validationErrors).map(([field, message]) => {
                        // Format field names for display
                        let displayName = field
                          .replace(/_/g, ' ')
                          .replace(/guardian (\d+)/, 'Guardian $1')
                        displayName = displayName.split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')
                        
                        return (
                          <li key={field} className="flex items-start gap-2">
                            <span className="text-red-600">•</span>
                            <span>
                              <strong>{displayName}:</strong> {message}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
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
                <Label>Date of Birth *</Label>
                <Input 
                  type="date"
                  value={formData.date_of_birth} 
                  onChange={(e) => {
                    setFormData({...formData, date_of_birth: e.target.value})
                    if (validationErrors.date_of_birth) {
                      setValidationErrors({...validationErrors, date_of_birth: ""})
                    }
                  }}
                  className={validationErrors.date_of_birth ? "border-red-500" : ""}
                />
                {validationErrors.date_of_birth && (
                  <p className="text-sm text-red-500">{validationErrors.date_of_birth}</p>
                )}
                <p className="text-xs text-muted-foreground">Format: YYYY-MM-DD</p>
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => {
                    setFormData({...formData, gender: value})
                    if (validationErrors.gender) {
                      setValidationErrors({...validationErrors, gender: ""})
                    }
                  }}
                >
                  <SelectTrigger className={`w-full ${validationErrors.gender ? "border-red-500" : ""}`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.gender && (
                  <p className="text-sm text-red-500">{validationErrors.gender}</p>
                )}
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
                  onValueChange={(value) => {
                    setFormData({...formData, class_id: value, arm_id: ""})
                    if (validationErrors.class_id) {
                      setValidationErrors({...validationErrors, class_id: ""})
                    }
                  }}
                >
                  <SelectTrigger className={`w-full ${validationErrors.class_id ? "border-red-500" : ""}`}>
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
                {validationErrors.class_id && (
                  <p className="text-sm text-red-500">{validationErrors.class_id}</p>
                )}
                {classes.length === 0 && !validationErrors.class_id && (
                  <p className="text-xs text-muted-foreground">No classes found. Please create classes in the Classes page first.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Arm/Section</Label>
                <Select 
                  value={formData.arm_id} 
                  onValueChange={(value) => setFormData({...formData, arm_id: value})}
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

            {/* Parent/Guardian Information Section */}
            <div className="mt-6 space-y-4">
              <Label className="text-base font-semibold">Parent/Guardian Information (Optional)</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Parent Name</Label>
                  <Input 
                    value={formData.parent_name} 
                    onChange={(e) => setFormData({...formData, parent_name: e.target.value})}
                    placeholder="Parent/Guardian full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Parent Phone</Label>
                  <Input 
                    value={formData.parent_phone} 
                    onChange={(e) => setFormData({...formData, parent_phone: e.target.value})}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Parent Email</Label>
                  <Input 
                    type="email"
                    value={formData.parent_email} 
                    onChange={(e) => {
                      setFormData({...formData, parent_email: e.target.value})
                      if (validationErrors.parent_email) {
                        setValidationErrors({...validationErrors, parent_email: ""})
                      }
                    }}
                    placeholder="parent@example.com"
                    className={validationErrors.parent_email ? "border-red-500" : ""}
                  />
                  {validationErrors.parent_email && (
                    <p className="text-sm text-red-500">{validationErrors.parent_email}</p>
                  )}
                </div>
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
                    <Label>Medications</Label>
                    <div className="flex gap-2">
                      <Input
                        value={medicalInfo.newMedication}
                        onChange={(e) => setMedicalInfo({...medicalInfo, newMedication: e.target.value})}
                        placeholder="Add medication"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && medicalInfo.newMedication.trim()) {
                            setMedicalInfo({
                              ...medicalInfo,
                              medications: [...medicalInfo.medications, medicalInfo.newMedication.trim()],
                              newMedication: "",
                            })
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (medicalInfo.newMedication.trim()) {
                            setMedicalInfo({
                              ...medicalInfo,
                              medications: [...medicalInfo.medications, medicalInfo.newMedication.trim()],
                              newMedication: "",
                            })
                          }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {medicalInfo.medications.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {medicalInfo.medications.map((medication, index) => (
                          <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
                            setMedicalInfo({
                              ...medicalInfo,
                              medications: medicalInfo.medications.filter((_, i) => i !== index),
                            })
                          }}>
                            {medication} <X className="w-3 h-3 ml-1" />
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
                <div className="grid gap-4 md:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <Label>Doctor Name</Label>
                    <Input
                      value={medicalInfo.doctor_name}
                      onChange={(e) => setMedicalInfo({...medicalInfo, doctor_name: e.target.value})}
                      placeholder="Dr. Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Doctor Phone</Label>
                    <Input
                      value={medicalInfo.doctor_phone}
                      onChange={(e) => setMedicalInfo({...medicalInfo, doctor_phone: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hospital</Label>
                    <Input
                      value={medicalInfo.hospital}
                      onChange={(e) => setMedicalInfo({...medicalInfo, hospital: e.target.value})}
                      placeholder="Hospital name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Insurance Provider</Label>
                    <Input
                      value={medicalInfo.insurance_provider}
                      onChange={(e) => setMedicalInfo({...medicalInfo, insurance_provider: e.target.value})}
                      placeholder="NHIS, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Insurance Number</Label>
                    <Input
                      value={medicalInfo.insurance_number}
                      onChange={(e) => setMedicalInfo({...medicalInfo, insurance_number: e.target.value})}
                      placeholder="Insurance number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Special Needs</Label>
                    <Input
                      value={medicalInfo.special_needs}
                      onChange={(e) => setMedicalInfo({...medicalInfo, special_needs: e.target.value})}
                      placeholder="Special needs or requirements"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Medical Notes</Label>
                    <Input
                      value={medicalInfo.notes}
                      onChange={(e) => setMedicalInfo({...medicalInfo, notes: e.target.value})}
                      placeholder="Additional medical notes"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Transport Information Section */}
            {!editingId && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="uses_transport"
                    checked={transportInfo.uses_transport}
                    onChange={(e) => setTransportInfo({...transportInfo, uses_transport: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="uses_transport" className="text-base font-semibold cursor-pointer">
                    Transport Information (Optional)
                  </Label>
                </div>
                {transportInfo.uses_transport && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Route ID</Label>
                      <Input
                        value={transportInfo.route_id}
                        onChange={(e) => setTransportInfo({...transportInfo, route_id: e.target.value})}
                        placeholder="Route ID"
                        type="number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bus Number</Label>
                      <Input
                        value={transportInfo.bus_number}
                        onChange={(e) => setTransportInfo({...transportInfo, bus_number: e.target.value})}
                        placeholder="BUS-001"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pickup Point</Label>
                      <Input
                        value={transportInfo.pickup_point}
                        onChange={(e) => setTransportInfo({...transportInfo, pickup_point: e.target.value})}
                        placeholder="Main Gate"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pickup Time</Label>
                      <Input
                        value={transportInfo.pickup_time}
                        onChange={(e) => setTransportInfo({...transportInfo, pickup_time: e.target.value})}
                        placeholder="07:30"
                        type="time"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dropoff Point</Label>
                      <Input
                        value={transportInfo.dropoff_point}
                        onChange={(e) => setTransportInfo({...transportInfo, dropoff_point: e.target.value})}
                        placeholder="Main Gate"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dropoff Time</Label>
                      <Input
                        value={transportInfo.dropoff_time}
                        onChange={(e) => setTransportInfo({...transportInfo, dropoff_time: e.target.value})}
                        placeholder="15:00"
                        type="time"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="guardian_pickup"
                          checked={transportInfo.guardian_pickup}
                          onChange={(e) => setTransportInfo({...transportInfo, guardian_pickup: e.target.checked})}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <Label htmlFor="guardian_pickup" className="text-sm cursor-pointer">
                          Guardian Pickup
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Special Instructions</Label>
                      <Input
                        value={transportInfo.special_instructions}
                        onChange={(e) => setTransportInfo({...transportInfo, special_instructions: e.target.value})}
                        placeholder="Special transport instructions"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Hostel Information Section */}
            {!editingId && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_boarder"
                    checked={hostelInfo.is_boarder}
                    onChange={(e) => setHostelInfo({...hostelInfo, is_boarder: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="is_boarder" className="text-base font-semibold cursor-pointer">
                    Hostel/Boarding Information (Optional)
                  </Label>
                </div>
                {hostelInfo.is_boarder && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Hostel Name</Label>
                      <Input
                        value={hostelInfo.hostel_name}
                        onChange={(e) => setHostelInfo({...hostelInfo, hostel_name: e.target.value})}
                        placeholder="King's Hostel"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Block</Label>
                      <Input
                        value={hostelInfo.block}
                        onChange={(e) => setHostelInfo({...hostelInfo, block: e.target.value})}
                        placeholder="A"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Floor</Label>
                      <Input
                        value={hostelInfo.floor}
                        onChange={(e) => setHostelInfo({...hostelInfo, floor: e.target.value})}
                        placeholder="2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Room Number</Label>
                      <Input
                        value={hostelInfo.room_number}
                        onChange={(e) => setHostelInfo({...hostelInfo, room_number: e.target.value})}
                        placeholder="102"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bed Number</Label>
                      <Input
                        value={hostelInfo.bed_number}
                        onChange={(e) => setHostelInfo({...hostelInfo, bed_number: e.target.value})}
                        placeholder="3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Locker Number</Label>
                      <Input
                        value={hostelInfo.locker_number}
                        onChange={(e) => setHostelInfo({...hostelInfo, locker_number: e.target.value})}
                        placeholder="A102-3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Roommate Preferences</Label>
                      <Input
                        value={hostelInfo.roommate_preferences}
                        onChange={(e) => setHostelInfo({...hostelInfo, roommate_preferences: e.target.value})}
                        placeholder="Quiet environment"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dietary Requirements</Label>
                      <Input
                        value={hostelInfo.dietary_requirements}
                        onChange={(e) => setHostelInfo({...hostelInfo, dietary_requirements: e.target.value})}
                        placeholder="Vegetarian"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="bedding_provided"
                          checked={hostelInfo.bedding_provided}
                          onChange={(e) => setHostelInfo({...hostelInfo, bedding_provided: e.target.checked})}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <Label htmlFor="bedding_provided" className="text-sm cursor-pointer">
                          Bedding Provided
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
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
                          email: "",
                          phone: "",
                          address: "",
                          occupation: "",
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
                        <Label>Address</Label>
                        <Input
                          value={guardian.address}
                          onChange={(e) => {
                            const updated = [...guardians]
                            updated[index].address = e.target.value
                            setGuardians(updated)
                          }}
                          placeholder="Guardian address"
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
                onClick={async (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  
                  // Clear any previous validation errors before attempting submit
                  setValidationErrors({})
                  
                  if (editingId) {
                    await handleUpdate()
                  } else {
                    await handleAdd()
                  }
                }}
                className={Object.keys(validationErrors).length > 0 ? "border-2 border-red-500" : ""}
              >
                {(createStudent.isPending || updateStudent.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {Object.keys(validationErrors).length > 0 && (
                      <AlertCircle className="w-4 h-4 mr-2" />
                    )}
                {editingId ? "Update" : "Add"} Student
                    {Object.keys(validationErrors).length > 0 && (
                      <span className="ml-2 text-xs">({Object.keys(validationErrors).length} error{Object.keys(validationErrors).length > 1 ? 's' : ''})</span>
                    )}
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
