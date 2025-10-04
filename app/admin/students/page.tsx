"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Search, Plus, Filter, Download, Edit, Trash2, X } from "lucide-react"

export default function StudentsPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [students, setStudents] = useState([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@school.edu",
      grade: "Grade 10",
      class: "10A",
      status: "Active",
      enrollmentDate: "2023-09-01",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob.smith@school.edu",
      grade: "Grade 11",
      class: "11B",
      status: "Active",
      enrollmentDate: "2022-09-01",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol.davis@school.edu",
      grade: "Grade 9",
      class: "9C",
      status: "Inactive",
      enrollmentDate: "2024-01-15",
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    grade: "",
    class: "",
  })

  const handleAdd = () => {
    if (!formData.name || !formData.email) return
    
    const newStudent = {
      id: `${Date.now()}`,
      ...formData,
      status: "Active",
      enrollmentDate: new Date().toISOString().split('T')[0],
    }
    setStudents([...students, newStudent])
    setFormData({ name: "", email: "", grade: "", class: "" })
    setShowAddForm(false)
  }

  const handleEdit = (id: string) => {
    const student = students.find(s => s.id === id)
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        grade: student.grade,
        class: student.class,
      })
      setEditingId(id)
      setShowAddForm(true)
    }
  }

  const handleUpdate = () => {
    if (!editingId) return
    setStudents(students.map(s => 
      s.id === editingId 
        ? { ...s, ...formData }
        : s
    ))
    setFormData({ name: "", email: "", grade: "", class: "" })
    setEditingId(null)
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      setStudents(students.filter(s => s.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage student records and enrollment</p>
        </div>
        <Button onClick={() => { setShowAddForm(true); setEditingId(null); setFormData({ name: "", email: "", grade: "", class: "" }) }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Student" : "Add New Student"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setEditingId(null) }}>
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
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="student@school.edu"
                />
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <Input 
                  value={formData.grade} 
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  placeholder="e.g., Grade 10"
                />
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Input 
                  value={formData.class} 
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  placeholder="e.g., 10A"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleUpdate : handleAdd}>
                {editingId ? "Update" : "Add"} Student
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search students..." className="pl-10" />
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
          <CardDescription>{students.length} students registered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{student.grade}</p>
                    <p className="text-sm text-muted-foreground">Class {student.class}</p>
                  </div>
                  <Badge variant={student.status === "Active" ? "default" : "secondary"}>{student.status}</Badge>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(student.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(student.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
