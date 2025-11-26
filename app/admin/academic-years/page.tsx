"use client"

/// <reference types="react" />
/// <reference types="react-dom" />

import React, { useState, useEffect, useMemo } from "react"
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

  // Handle different response structures - API returns direct array
  const academicYears = useMemo(() => {
    if (!academicYearsResponse) return []
    
    // API returns direct array: [{...}, {...}]
    if (Array.isArray(academicYearsResponse)) {
      return academicYearsResponse
    }
    
    // Also handle nested data structure (backwards compatibility)
    if (academicYearsResponse?.data && Array.isArray(academicYearsResponse.data)) {
      return academicYearsResponse.data
    }
    
    console.warn("Unexpected academic years response structure:", academicYearsResponse)
    return []
  }, [academicYearsResponse])

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

  // Show toast error when error state changes
  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading academic years'
      toast.error(`Error loading academic years: ${errorMessage}`)
    }
  }, [error])

  const handleAdd = async () => {
    try {
      console.log("handleAdd called", formData)
      
      // Validate required fields
      if (!formData.name || !formData.name.trim()) {
        toast.error("Academic year name is required")
        return
      }
      
      if (!formData.start_date) {
        toast.error("Start date is required")
        return
      }
      
      if (!formData.end_date) {
        toast.error("End date is required")
        return
      }

      // Validate date format
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      
      if (isNaN(startDate.getTime())) {
        toast.error("Invalid start date format")
        return
      }
      
      if (isNaN(endDate.getTime())) {
        toast.error("Invalid end date format")
        return
      }
      
      // Validate date logic
      if (endDate <= startDate) {
        toast.error("End date must be after start date")
        return
      }

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
      
      // Extract error message from various possible formats
      let errorMessage = "Failed to create academic year"
      
      if (error?.response?.data) {
        const data = error.response.data
        // Handle validation errors (Laravel format) - check this FIRST
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
    try {
      if (!editingId) {
        toast.error("No academic year selected for editing")
        return
      }
      
      // Validate required fields
      if (!formData.name || !formData.name.trim()) {
        toast.error("Academic year name is required")
        return
      }
      
      if (!formData.start_date) {
        toast.error("Start date is required")
        return
      }
      
      if (!formData.end_date) {
        toast.error("End date is required")
        return
      }

      // Validate date format
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      
      if (isNaN(startDate.getTime())) {
        toast.error("Invalid start date format")
        return
      }
      
      if (isNaN(endDate.getTime())) {
        toast.error("Invalid end date format")
        return
      }

      // Validate date logic
      if (endDate <= startDate) {
        toast.error("End date must be after start date")
        return
      }

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
      
      // Extract error message from various possible formats
      let errorMessage = "Failed to update academic year"
      
      if (error?.response?.data) {
        const data = error.response.data
        // Handle validation errors (Laravel format) - check this FIRST
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
    try {
      if (!id) {
        toast.error("Invalid academic year ID")
        return
      }
      
      const year = academicYears.find((y: any) => y.id === id)
      if (!year) {
        toast.error("Academic year not found")
        return
      }
      
      if (year.is_current) {
        toast.error("Cannot delete the current academic year")
        return
      }
      
      if (year?.is_current) {
        toast.error("Cannot delete the current academic year")
        return
      }
      
      if (!confirm("Are you sure you want to delete this academic year?")) {
        return
      }

      await deleteAcademicYear.mutateAsync(id)
      toast.success("Academic year deleted successfully")
      refetch()
    } catch (error: any) {
      console.error("Error deleting academic year:", error)
      
      // Extract error message from various possible formats
      let errorMessage = "Failed to delete academic year"
      
      if (error?.response?.data) {
        const data = error.response.data
        errorMessage = data.message || data.error || data.detail || JSON.stringify(data)
      } else if (error?.response?.data?.errors) {
        // Handle validation errors object
        const errors = error.response.data.errors
        const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
          const msg = Array.isArray(messages) ? messages.join(", ") : messages
          return `${field}: ${msg}`
        })
        errorMessage = errorMessages.join("; ")
      } else if (error?.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    }
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error loading academic years'
    
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">Error loading academic years: {errorMessage}</p>
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
                onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault()
                  e.stopPropagation()
                  
                  if (createAcademicYear.isPending || updateAcademicYear.isPending) {
                    toast.info("Please wait, operation in progress...")
                    return
                  }
                  
                  try {
                    if (editingId) {
                      await handleUpdate()
                    } else {
                      await handleAdd()
                    }
                  } catch (error: any) {
                    // Additional catch for unexpected errors
                    console.error("Unexpected error in button click:", error)
                    const errorMessage = error?.message || "An unexpected error occurred"
                    toast.error(errorMessage)
                  }
                }}
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

