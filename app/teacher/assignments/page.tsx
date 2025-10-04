"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, Users, FileText } from "lucide-react"

export default function TeacherAssignmentsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)

  const assignments = [
    {
      id: "1",
      title: "Mathematics Chapter 5 Problems",
      class: "Grade 10A",
      dueDate: "2024-04-15",
      submissions: 25,
      totalStudents: 30,
      status: "Active",
    },
    {
      id: "2",
      title: "Physics Lab Report",
      class: "Grade 11B",
      dueDate: "2024-04-18",
      submissions: 18,
      totalStudents: 25,
      status: "Active",
    },
    {
      id: "3",
      title: "History Essay on World War II",
      class: "Grade 10A",
      dueDate: "2024-04-10",
      submissions: 30,
      totalStudents: 30,
      status: "Closed",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">Create and manage class assignments</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Assignment</CardTitle>
            <CardDescription>Add a new assignment for your students</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium">Assignment Title</label>
                <Input placeholder="Enter assignment title" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Enter assignment description" rows={4} />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Class</label>
                  <Input placeholder="Select class" />
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input type="date" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Assignment</Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription className="mt-1">{assignment.class}</CardDescription>
                </div>
                <Badge variant={assignment.status === "Active" ? "default" : "secondary"}>
                  {assignment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>Due: {assignment.dueDate}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span>
                      {assignment.submissions}/{assignment.totalStudents} submitted
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">
                      {Math.round((assignment.submissions / assignment.totalStudents) * 100)}%
                    </span>{" "}
                    completion
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View Submissions
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
