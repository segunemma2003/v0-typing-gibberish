"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Calendar, Clock, FileText, AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useMyAssignments } from "@/lib/api/assessment"
import { format } from "date-fns"

export default function StudentAssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: assignmentsData, isLoading } = useMyAssignments()

  const assignments = assignmentsData?.assignments || []

  const getTypeColor = (type: string) => {
    switch (type) {
      case "homework":
        return "default"
      case "quiz":
        return "secondary"
      case "project":
        return "outline"
      case "exam":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600"
      case "submitted":
        return "text-green-600"
      case "overdue":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getPriorityIcon = (priority: string) => {
    if (priority === "high") {
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
    return null
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
          <p className="text-muted-foreground">Manage your assignments and track deadlines</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search assignments..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>
            {assignments.length} assignment{assignments.length !== 1 ? "s" : ""} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments
                .filter((assignment: any) => 
                  !searchTerm || 
                  assignment.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  assignment.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((assignment: any) => (
                <div key={assignment.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-lg">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{assignment.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {assignment.subject?.name || assignment.subject} • {assignment.teacher?.name || assignment.teacher}
                      </p>
                      {assignment.description && (
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {assignment.due_date && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{format(new Date(assignment.due_date), "MMM dd, yyyy")}</span>
                          </div>
                        )}
                        {assignment.due_date && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{format(new Date(assignment.due_date), "HH:mm")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-end space-y-2">
                      <Badge variant={getTypeColor(assignment.type || "homework")} className="text-xs">
                        {assignment.type || "assignment"}
                      </Badge>
                      <span className={`text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        if (assignment.status === "submitted" || assignment.status === "graded") {
                          toast.error("This assignment has already been submitted")
                          return
                        }
                        // Handle submit logic here - navigate to submission page
                        window.location.href = `/student/assignments/${assignment.id}`
                      }}
                    >
                      {assignment.status === "submitted" || assignment.status === "graded" ? "View" : "Submit"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">No assignments found</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
