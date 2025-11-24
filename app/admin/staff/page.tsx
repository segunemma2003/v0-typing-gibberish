"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Search, Plus, Filter, Download, Mail, Phone, Edit, Trash2, X, Loader2 } from "lucide-react"
import { useStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from "@/lib/api/staff"
import { useDepartments } from "@/lib/api/departments"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

const staffRoles = [
  { value: 'admin', label: 'Administrator' },
  { value: 'staff', label: 'General Staff' },
  { value: 'finance', label: 'Finance' },
  { value: 'librarian', label: 'Librarian' },
  { value: 'driver', label: 'Driver' },
  { value: 'security', label: 'Security' },
  { value: 'cleaner', label: 'Cleaner' },
  { value: 'caterer', label: 'Caterer' },
  { value: 'nurse', label: 'Nurse' },
]

export default function StaffPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: staffResponse, isLoading, error, refetch } = useStaff({
    search: searchTerm || undefined,
    per_page: 100,
  })
  const { data: departmentsResponse } = useDepartments({ per_page: 100 })

  const createStaff = useCreateStaff()
  const updateStaff = useUpdateStaff()
  const deleteStaff = useDeleteStaff()

  const staff = staffResponse?.data || []
  // API may return direct array or wrapped in { data: [...] }
  const departments = Array.isArray(departmentsResponse) ? departmentsResponse : (departmentsResponse?.data || [])

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    position: "",
    employment_date: "",
    employee_id: "",
  })

  const handleAdd = async () => {
    if (!formData.first_name || !formData.last_name || !formData.role) {
      toast.error("Please fill in required fields (First Name, Last Name, and Role)")
      return
    }

    try {
      const payload: any = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        role: formData.role,
      }

      if (formData.middle_name?.trim()) {
        payload.middle_name = formData.middle_name.trim()
      }
      if (formData.email?.trim()) {
        payload.email = formData.email.trim()
      }
      if (formData.phone?.trim()) {
        payload.phone = formData.phone.trim()
      }
      if (formData.department?.trim() && formData.department !== "none") {
        payload.department = formData.department.trim()
      }
      if (formData.position?.trim()) {
        payload.position = formData.position.trim()
      }
      if (formData.employment_date) {
        payload.employment_date = formData.employment_date
      }
      if (formData.employee_id?.trim()) {
        payload.employee_id = formData.employee_id.trim()
      }

      const response = await createStaff.mutateAsync(payload)
      
      // Display login credentials if available
      if (response.login_credentials) {
        toast.success("Staff member created successfully!", {
          description: `Email: ${response.login_credentials.email}\nPassword: ${response.login_credentials.password}\nEmployee ID: ${response.staff.employee_id || 'Auto-generated'}`,
          duration: 15000,
        })
      } else {
        toast.success("Staff member created successfully")
      }
      
      setFormData({ first_name: "", last_name: "", middle_name: "", email: "", phone: "", role: "", department: "", position: "", employment_date: "", employee_id: "" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error creating staff:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create staff member"
      toast.error(errorMessage)
    }
  }

  const handleEdit = (member: any) => {
    // Parse name into first_name and last_name if needed
    const nameParts = (member.name || "").split(" ")
    setFormData({
      first_name: member.first_name || nameParts[0] || "",
      last_name: member.last_name || nameParts.slice(1).join(" ") || "",
      middle_name: member.middle_name || "",
      email: member.email || "",
      phone: member.phone || "",
      role: member.role || "",
      department: member.department || "",
      position: member.position || "",
      employment_date: member.employment_date || "",
      employee_id: member.employee_id || "",
    })
    setEditingId(member.id)
    setShowAddForm(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.first_name || !formData.last_name || !formData.role) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      const updateData: any = {
        name: `${formData.first_name.trim()} ${formData.last_name.trim()}`.trim(),
        role: formData.role,
      }

      if (formData.email?.trim()) {
        updateData.email = formData.email.trim()
      }
      if (formData.phone?.trim()) {
        updateData.phone = formData.phone.trim()
      }
      if (formData.department?.trim()) {
        updateData.department = formData.department.trim()
      }
      if (formData.position?.trim()) {
        updateData.position = formData.position.trim()
      }

      await updateStaff.mutateAsync({
        id: editingId,
        data: updateData,
      })
      toast.success("Staff member updated successfully")
      setFormData({ first_name: "", last_name: "", middle_name: "", email: "", phone: "", role: "", department: "", position: "", employment_date: "", employee_id: "" })
      setEditingId(null)
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error updating staff:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update staff member"
      toast.error(errorMessage)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return

    try {
      await deleteStaff.mutateAsync(id)
      toast.success("Staff member deleted successfully")
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete staff member")
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
            <p className="text-destructive">Error loading staff: {error?.message || "Unknown error"}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
          <p className="text-muted-foreground">Manage staff members and roles</p>
        </div>
        <Button
          onClick={() => {
            setShowAddForm(true)
            setEditingId(null)
            setFormData({ first_name: "", last_name: "", middle_name: "", email: "", phone: "", role: "", department: "", position: "", employment_date: "", employee_id: "" })
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Staff Member" : "Add New Staff Member"}</CardTitle>
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
                <Label>Middle Name</Label>
                <Input
                  value={formData.middle_name}
                  onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
                  placeholder="Enter middle name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Leave empty for auto-generation"
                />
                <p className="text-xs text-muted-foreground">Auto-generated if not provided</p>
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
                <Label>Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select 
                  value={formData.department || undefined} 
                  onValueChange={(value) => setFormData({ ...formData, department: value === "none" ? "" : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {departments.map((dept: any) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., Senior Librarian"
                />
              </div>
              <div className="space-y-2">
                <Label>Employment Date</Label>
                <Input
                  type="date"
                  value={formData.employment_date}
                  onChange={(e) => setFormData({ ...formData, employment_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  placeholder="Leave empty for auto-generation"
                />
                <p className="text-xs text-muted-foreground">Auto-generated if not provided</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleUpdate : handleAdd} disabled={createStaff.isPending || updateStaff.isPending}>
                {createStaff.isPending || updateStaff.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>{editingId ? "Update" : "Add"} Staff Member</>
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
                placeholder="Search staff..."
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

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>All Staff Members</CardTitle>
          <CardDescription>A list of all staff members in the school</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staff.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No staff members found</p>
            ) : (
              staff.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{member.name?.split(" ").map((n: string) => n[0]).join("") || "S"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Mail className="w-3 h-3 mr-1" />
                          {member.email}
                        </div>
                        {member.phone && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="w-3 h-3 mr-1" />
                            {member.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      {member.department && <p className="text-sm font-medium">{member.department}</p>}
                      {member.position && <p className="text-sm text-muted-foreground">{member.position}</p>}
                      {member.created_at && (
                        <p className="text-xs text-muted-foreground">Joined: {new Date(member.created_at).toLocaleDateString()}</p>
                      )}
                    </div>
                    <Badge variant={member.status === "active" ? "default" : "secondary"}>{member.status}</Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(member.id)} disabled={deleteStaff.isPending}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
