"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Search, Plus, Filter, Download, Edit, Trash2, X } from "lucide-react"

export default function TeachersPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [teachers, setTeachers] = useState([
    {
      id: "1",
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@school.edu",
      subjects: ["Mathematics", "Physics"],
      department: "Science",
      status: "Active",
      joinDate: "2020-08-15",
    },
    {
      id: "2",
      name: "Mr. John Davis",
      email: "john.davis@school.edu",
      subjects: ["English Literature", "Creative Writing"],
      department: "Languages",
      status: "Active",
      joinDate: "2019-09-01",
    },
    {
      id: "3",
      name: "Ms. Emily Chen",
      email: "emily.chen@school.edu",
      subjects: ["History", "Geography"],
      department: "Social Studies",
      status: "On Leave",
      joinDate: "2021-01-10",
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subjects: "",
    department: "",
  })

  const handleAdd = () => {
    if (!formData.name || !formData.email) return
    
    const newTeacher = {
      id: `${Date.now()}`,
      name: formData.name,
      email: formData.email,
      subjects: formData.subjects.split(',').map(s => s.trim()),
      department: formData.department,
      status: "Active",
      joinDate: new Date().toISOString().split('T')[0],
    }
    setTeachers([...teachers, newTeacher])
    setFormData({ name: "", email: "", subjects: "", department: "" })
    setShowAddForm(false)
  }

  const handleEdit = (id: string) => {
    const teacher = teachers.find(t => t.id === id)
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        subjects: teacher.subjects.join(', '),
        department: teacher.department,
      })
      setEditingId(id)
      setShowAddForm(true)
    }
  }

  const handleUpdate = () => {
    if (!editingId) return
    setTeachers(teachers.map(t => 
      t.id === editingId 
        ? { ...t, name: formData.name, email: formData.email, subjects: formData.subjects.split(',').map(s => s.trim()), department: formData.department }
        : t
    ))
    setFormData({ name: "", email: "", subjects: "", department: "" })
    setEditingId(null)
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      setTeachers(teachers.filter(t => t.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">Manage teaching staff and assignments</p>
        </div>
        <Button onClick={() => { setShowAddForm(true); setEditingId(null); setFormData({ name: "", email: "", subjects: "", department: "" }) }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Teacher" : "Add New Teacher"}</CardTitle>
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
                  placeholder="teacher@school.edu"
                />
              </div>
              <div className="space-y-2">
                <Label>Subjects</Label>
                <Input 
                  value={formData.subjects} 
                  onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                  placeholder="e.g., Mathematics, Physics"
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input 
                  value={formData.department} 
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  placeholder="e.g., Science"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleUpdate : handleAdd}>
                {editingId ? "Update" : "Add"} Teacher
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
              <Input placeholder="Search teachers..." className="pl-10" />
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

      {/* Teachers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
          <CardDescription>{teachers.length} teachers on staff</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground">{teacher.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{teacher.department}</p>
                    <p className="text-sm text-muted-foreground">Since {teacher.joinDate}</p>
                  </div>
                  <Badge variant={teacher.status === "Active" ? "default" : "secondary"}>{teacher.status}</Badge>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(teacher.id)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(teacher.id)}>
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
