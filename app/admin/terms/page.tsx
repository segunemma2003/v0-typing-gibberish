"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, Plus, Edit, Trash2, X, Loader2, Calendar, CheckCircle2 } from "lucide-react"
import { useTerms, useCreateTerm, useUpdateTerm, useDeleteTerm } from "@/lib/api/academic"
import { useAcademicYears } from "@/lib/api/academic"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function TermsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAcademicYear, setFilterAcademicYear] = useState<string>("")

  const { data: termsResponse, isLoading, error, refetch } = useTerms({
    academic_year_id: filterAcademicYear && filterAcademicYear !== "all" ? parseInt(filterAcademicYear) : undefined,
    per_page: 100,
  })
  const { data: academicYearsResponse } = useAcademicYears({ per_page: 100 })

  // API returns direct array for terms
  const terms = Array.isArray(termsResponse) ? termsResponse : (termsResponse?.data || [])
  // API returns direct array for academic years
  const academicYears = Array.isArray(academicYearsResponse) ? academicYearsResponse : (academicYearsResponse?.data || [])

  const createTerm = useCreateTerm()
  const updateTerm = useUpdateTerm()
  const deleteTerm = useDeleteTerm()

  const [formData, setFormData] = useState({
    academic_year_id: "",
    name: "",
    start_date: "",
    end_date: "",
    is_current: false,
    status: "pending" as "pending" | "active" | "completed",
  })

  const handleAdd = async () => {
    if (!formData.academic_year_id || !formData.name || !formData.start_date || !formData.end_date) {
      toast.error("Please fill in all required fields")
      return
    }

    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      toast.error("End date must be after start date")
      return
    }

    // Validate dates are within academic year
    const selectedYear = academicYears.find((y: any) => y.id.toString() === formData.academic_year_id)
    if (selectedYear) {
      if (new Date(formData.start_date) < new Date(selectedYear.start_date) || 
          new Date(formData.end_date) > new Date(selectedYear.end_date)) {
        toast.error("Term dates must fall within the academic year dates")
        return
      }
    }

    try {
      await createTerm.mutateAsync({
        academic_year_id: parseInt(formData.academic_year_id),
        name: formData.name.trim(),
        start_date: formData.start_date,
        end_date: formData.end_date,
        is_current: formData.is_current,
        status: formData.status,
      })
      toast.success("Term created successfully")
      setFormData({ academic_year_id: "", name: "", start_date: "", end_date: "", is_current: false, status: "pending" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error creating term:", error)
      let errorMessage = "Failed to create term"
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

  const handleEdit = (term: any) => {
    setFormData({
      academic_year_id: term.academic_year_id?.toString() || "",
      name: term.name || "",
      start_date: term.start_date || "",
      end_date: term.end_date || "",
      is_current: term.is_current || false,
      status: term.status || "pending",
    })
    setEditingId(term.id)
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
      await updateTerm.mutateAsync({
        id: editingId,
        data: {
          name: formData.name.trim(),
          start_date: formData.start_date,
          end_date: formData.end_date,
          is_current: formData.is_current,
          status: formData.status,
        },
      })
      toast.success("Term updated successfully")
      setFormData({ academic_year_id: "", name: "", start_date: "", end_date: "", is_current: false, status: "pending" })
      setEditingId(null)
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      console.error("Error updating term:", error)
      let errorMessage = "Failed to update term"
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
    if (!confirm("Are you sure you want to delete this term?")) return
    
    const term = terms.find((t: any) => t.id === id)
    if (term?.is_current) {
      toast.error("Cannot delete the current term")
      return
    }

    try {
      await deleteTerm.mutateAsync(id)
      toast.success("Term deleted successfully")
      refetch()
    } catch (error: any) {
      console.error("Error deleting term:", error)
      let errorMessage = "Failed to delete term"
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
            <p className="text-red-500">Error loading terms: {error instanceof Error ? error.message : 'Unknown error'}</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Terms</h1>
          <p className="text-muted-foreground">Manage academic terms and semesters</p>
        </div>
        <Button onClick={() => { setShowAddForm(true); setEditingId(null); setFormData({ academic_year_id: "", name: "", start_date: "", end_date: "", is_current: false, status: "pending" }) }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Term
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Term" : "Add New Term"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setEditingId(null) }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Academic Year *</Label>
                <Select
                  value={formData.academic_year_id || undefined}
                  onValueChange={(value) => {
                    setFormData({...formData, academic_year_id: value})
                    // Auto-fill dates from selected academic year
                    const selectedYear = academicYears.find((y: any) => y.id.toString() === value)
                    if (selectedYear && !editingId) {
                      setFormData(prev => ({
                        ...prev,
                        academic_year_id: value,
                        start_date: prev.start_date || selectedYear.start_date,
                        end_date: prev.end_date || selectedYear.end_date,
                      }))
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears && academicYears.length > 0 ? (
                      academicYears.map((year: any) => (
                        <SelectItem key={year.id} value={year.id.toString()}>
                          {year.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-years" disabled>
                        No academic years available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {editingId && (
                  <p className="text-xs text-muted-foreground">Academic year cannot be changed after creation</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Term Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., First Term"
                />
              </div>
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date *</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status || "pending"}
                  onValueChange={(value: "pending" | "active" | "completed") => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_current_term"
                    checked={formData.is_current}
                    onChange={(e) => setFormData({...formData, is_current: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <Label htmlFor="is_current_term" className="cursor-pointer">
                    Set as current term
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Only one term can be marked as current at a time
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={editingId ? handleUpdate : handleAdd}
              >
                {(createTerm.isPending || updateTerm.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingId ? "Update" : "Add"} Term
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
            <div className="flex-1">
              <Label>Filter by Academic Year</Label>
              <Select value={filterAcademicYear || "all"} onValueChange={(value) => setFilterAcademicYear(value === "all" ? "" : value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All academic years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All academic years</SelectItem>
                  {academicYears.map((year: any) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms List */}
      <Card>
        <CardHeader>
          <CardTitle>All Terms</CardTitle>
          <CardDescription>
            {isLoading ? "Loading..." : `${terms.length} terms`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : terms.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No terms found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {terms.map((term: any) => (
                <div key={term.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${term.is_current ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Calendar className={`w-5 h-5 ${term.is_current ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{term.name}</h3>
                        {term.is_current && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Current
                          </Badge>
                        )}
                      </div>
                      {term.academic_year && (
                        <p className="text-sm text-muted-foreground">
                          {term.academic_year.name}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {new Date(term.start_date).toLocaleDateString()} - {new Date(term.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={term.status === "active" ? "default" : term.status === "completed" ? "secondary" : "outline"}>
                      {term.status || "pending"}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(term)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(term.id)}
                      title={term.is_current ? "Cannot delete current term" : ""}
                    >
                      {deleteTerm.isPending ? (
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

