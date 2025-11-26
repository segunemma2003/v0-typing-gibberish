"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, Users, FileText, X, Loader2 } from "lucide-react"
import { useAssignments, useCreateAssignment, useUpdateAssignment, useDeleteAssignment, useAssignmentSubmissions } from "@/lib/api/assignments"
import { useClasses } from "@/lib/api/academic"
import { useSubjects } from "@/lib/api/academic"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import Link from "next/link"

export default function TeacherAssignmentsPage() {
  const { user } = useAuth()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: classesData } = useClasses()
  const { data: subjectsData } = useSubjects()
  const { data: assignmentsData, isLoading, refetch } = useAssignments({
    teacher_id: user?.id ? Number(user.id) : undefined,
    per_page: 50,
  })

  const classes = Array.isArray(classesData) ? classesData : (classesData?.data || [])
  const subjects = Array.isArray(subjectsData) ? subjectsData : (subjectsData?.data || [])
  const assignments = Array.isArray(assignmentsData?.data) ? assignmentsData.data : []

  const createAssignment = useCreateAssignment()
  const updateAssignment = useUpdateAssignment()
  const deleteAssignment = useDeleteAssignment()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject_id: "",
    class_id: "",
    due_date: "",
    total_marks: "",
    status: "published" as "draft" | "published",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject_id: "",
      class_id: "",
      due_date: "",
      total_marks: "",
      status: "published",
    })
    setEditingId(null)
  }

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.subject_id || !formData.class_id || !formData.due_date) {
        toast.error("Please fill in all required fields")
        return
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        subject_id: parseInt(formData.subject_id),
        class_id: parseInt(formData.class_id),
        due_date: new Date(formData.due_date).toISOString(),
        total_marks: formData.total_marks ? parseInt(formData.total_marks) : 0,
        status: formData.status,
      }

      if (editingId) {
        await updateAssignment.mutateAsync({ id: editingId, data: payload })
        toast.success("Assignment updated successfully")
      } else {
        await createAssignment.mutateAsync(payload)
        toast.success("Assignment created successfully")
      }

      setShowCreateForm(false)
      resetForm()
      refetch()
    } catch (error: any) {
      console.error("Error saving assignment:", error)
      toast.error(error?.response?.data?.message || "Failed to save assignment")
    }
  }

  const handleEdit = (assignment: any) => {
    setFormData({
      title: assignment.title || "",
      description: assignment.description || "",
      subject_id: assignment.subject_id?.toString() || "",
      class_id: assignment.class_id?.toString() || "",
      due_date: assignment.due_date ? new Date(assignment.due_date).toISOString().slice(0, 16) : "",
      total_marks: assignment.total_marks?.toString() || "",
      status: assignment.status || "published",
    })
    setEditingId(assignment.id)
    setShowCreateForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this assignment?")) return

    try {
      await deleteAssignment.mutateAsync(id)
      toast.success("Assignment deleted successfully")
      refetch()
    } catch (error: any) {
      console.error("Error deleting assignment:", error)
      toast.error(error?.response?.data?.message || "Failed to delete assignment")
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">Create and manage class assignments</p>
        </div>
        <Button onClick={() => { setShowCreateForm(true); resetForm() }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Assignment" : "Create New Assignment"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowCreateForm(false); resetForm() }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>Add a new assignment for your students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Assignment Title *</Label>
                <Input 
                  placeholder="Enter assignment title" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  placeholder="Enter assignment description" 
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Subject *</Label>
                  <Select 
                    value={formData.subject_id || undefined} 
                    onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Class *</Label>
                  <Select 
                    value={formData.class_id || undefined} 
                    onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classItem: any) => (
                        <SelectItem key={classItem.id} value={classItem.id.toString()}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Due Date *</Label>
                  <Input 
                    type="datetime-local" 
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Total Marks</Label>
                  <Input 
                    type="number" 
                    placeholder="100"
                    value={formData.total_marks}
                    onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  onClick={handleSubmit}
                >
                  {(createAssignment.isPending || updateAssignment.isPending) ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingId ? "Update" : "Create"} Assignment
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => { setShowCreateForm(false); resetForm() }}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.length > 0 ? (
          assignments.map((assignment: any) => {
            const classItem = classes.find((c: any) => c.id === assignment.class_id)
            const subjectItem = subjects.find((s: any) => s.id === assignment.subject_id)
            const dueDate = assignment.due_date ? new Date(assignment.due_date) : null
            const isOverdue = dueDate && dueDate < new Date() && assignment.status !== "closed"

            return (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{assignment.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {subjectItem?.name || "Unknown Subject"} • {classItem?.name || "Unknown Class"}
                      </CardDescription>
                    </div>
                    <Badge variant={assignment.status === "closed" ? "secondary" : isOverdue ? "destructive" : "default"}>
                      {assignment.status === "closed" ? "Closed" : isOverdue ? "Overdue" : assignment.status || "Active"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {dueDate && (
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>Due: {dueDate.toLocaleDateString()} {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                      {assignment.total_marks && (
                        <div className="text-sm">
                          <span className="font-semibold">{assignment.total_marks}</span> marks
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/teacher/assignments/${assignment.id}/submissions`}>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          View Submissions
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(assignment)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDelete(assignment.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">No assignments found. Create your first assignment to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
