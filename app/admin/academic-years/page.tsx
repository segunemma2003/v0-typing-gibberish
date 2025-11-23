"use client"

/// <reference types="react" />
/// <reference types="react-dom" />

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, X, Loader2, Calendar, CheckCircle2 } from "lucide-react"
import { useAcademicYears, useCreateAcademicYear, useUpdateAcademicYear, useDeleteAcademicYear } from "@/lib/api/academic"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function AcademicYearsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const { data: academicYearsResponse, isLoading, error, refetch } = useAcademicYears({
    per_page: 100,
  })

  const academicYears = Array.isArray(academicYearsResponse?.data) ? academicYearsResponse.data : []

  const createAcademicYear = useCreateAcademicYear()
  const updateAcademicYear = useUpdateAcademicYear()
  const deleteAcademicYear = useDeleteAcademicYear()

  const [formData, setFormData] = useState({
    name: "",
    start_date: "",
    end_date: "",
    is_current: false,
    status: "pending" as "pending" | "active" | "completed",
  })

  const handleAdd = async () => {
    console.log("handleAdd called", formData)
    
    if (!formData.name || !formData.start_date || !formData.end_date) {
      toast.error("Please fill in required fields (Name, Start Date, End Date)")
      return
    }

    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    
    if (endDate <= startDate) {
      toast.error("End date must be after start date")
      return
    }

    try {
      const payload = {
        name: formData.name.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_current: formData.is_current || false,
        status: formData.status || "pending",
      }
      
      console.log("Creating academic year with payload:", payload)
      
      await createAcademicYear.mutateAsync(payload)
      toast.success("Academic year created successfully")
      setFormData({ name: "", start_date: "", end_date: "", is_current: false, status: "pending" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error creating academic year:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create academic year"
      toast.error(errorMessage)
    }
  }

  const handleEdit = (year: any) => {
    setFormData({
      name: year.name || "",
      start_date: year.start_date || "",
      end_date: year.end_date || "",
      is_current: year.is_current || false,
      status: year.status || "pending",
    })
    setEditingId(year.id)
    setShowAddForm(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.name || !formData.start_date || !formData.end_date) {
      toast.error("Please fill in required fields")
      return
    }

    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      toast.error("End date must be after start date")
      return
    }

    try {
      await updateAcademicYear.mutateAsync({
        id: editingId,
        data: {
          name: formData.name.trim(),
          start_date: formData.start_date,
          end_date: formData.end_date,
          is_current: formData.is_current,
          status: formData.status,
        },
      })
      toast.success("Academic year updated successfully")
      setFormData({ name: "", start_date: "", end_date: "", is_current: false, status: "pending" })
      setEditingId(null)
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error updating academic year:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update academic year"
      toast.error(errorMessage)
    }
  }

  const handleDelete = async (id: number) => {
    const year = academicYears.find((y: any) => y.id === id)
    if (year?.is_current) {
      toast.error("Cannot delete the current academic year")
      return
    }
    
    if (!confirm("Are you sure you want to delete this academic year?")) return

    try {
      await deleteAcademicYear.mutateAsync(id)
      toast.success("Academic year deleted successfully")
      refetch()
    } catch (error: any) {
      console.error("Error deleting academic year:", error)
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to delete academic year"
      toast.error(errorMessage)
    }
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading academic years: {error instanceof Error ? error.message : 'Unknown error'}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Academic Years</h1>
          <p className="text-muted-foreground">Manage academic years and sessions</p>
        </div>
        <Button onClick={() => { setShowAddForm(true); setEditingId(null); setFormData({ name: "", start_date: "", end_date: "", is_current: false, status: "pending" }) }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Academic Year
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Academic Year" : "Add New Academic Year"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setEditingId(null) }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Academic Year Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., 2024/2025"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "pending" | "active" | "completed") => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_current"
                    checked={formData.is_current}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, is_current: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="is_current" className="cursor-pointer">
                    Set as current academic year
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Only one academic year can be marked as current at a time
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log("Button clicked!", {
                    editingId,
                    formData,
                    isCreatingPending: createAcademicYear.isPending,
                    isUpdatingPending: updateAcademicYear.isPending
                  })
                  if (editingId) {
                    handleUpdate()
                  } else {
                    handleAdd()
                  }
                }}
                disabled={!!createAcademicYear.isPending || !!updateAcademicYear.isPending}
                style={{ cursor: (createAcademicYear.isPending || updateAcademicYear.isPending) ? 'not-allowed' : 'pointer' }}
              >
                {(createAcademicYear.isPending || updateAcademicYear.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingId ? "Update" : "Add"} Academic Year
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingId(null) }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Academic Years List */}
      <Card>
        <CardHeader>
          <CardTitle>All Academic Years</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `${academicYears.length} academic years`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : academicYears.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No academic years found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {academicYears.map((year: any) => (
                <div key={year.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${year.is_current ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Calendar className={`w-5 h-5 ${year.is_current ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{year.name}</h3>
                        {year.is_current && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}
                      </p>
                      {year.total_terms !== undefined && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {year.total_terms} terms
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={year.status === "active" ? "default" : year.status === "completed" ? "secondary" : "outline"}>
                      {year.status || "pending"}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(year)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(year.id)}
                      disabled={deleteAcademicYear.isPending || year.is_current}
                      title={year.is_current ? "Cannot delete current academic year" : ""}
                    >
                      {deleteAcademicYear.isPending ? (
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

