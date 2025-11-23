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
import { toast } from "sonner"

export default function StaffPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: staffResponse, isLoading, error, refetch } = useStaff({
    search: searchTerm || undefined,
    per_page: 100,
  })

  const createStaff = useCreateStaff()
  const updateStaff = useUpdateStaff()
  const deleteStaff = useDeleteStaff()

  const staff = staffResponse?.data || []

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    position: "",
  })

  const handleAdd = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await createStaff.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        department: formData.department || undefined,
        position: formData.position || undefined,
      })
      toast.success("Staff member created successfully")
      setFormData({ name: "", email: "", phone: "", role: "", department: "", position: "" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create staff member")
    }
  }

  const handleEdit = (member: any) => {
    setFormData({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      role: member.role || "",
      department: member.department || "",
      position: member.position || "",
    })
    setEditingId(member.id)
    setShowAddForm(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.name || !formData.email || !formData.role) {
      toast.error("Please fill in required fields")
      return
    }

    try {
      await updateStaff.mutateAsync({
        id: editingId,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          role: formData.role,
          department: formData.department || undefined,
          position: formData.position || undefined,
        },
      })
      toast.success("Staff member updated successfully")
      setFormData({ name: "", email: "", phone: "", role: "", department: "", position: "" })
      setEditingId(null)
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update staff member")
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
            setFormData({ name: "", email: "", phone: "", role: "", department: "", position: "" })
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
                <Label>Full Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-0000"
                />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g., Librarian, IT Support"
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Administration, IT"
                />
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Input
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="e.g., Senior Librarian"
                />
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
