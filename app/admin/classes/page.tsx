"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Search, Plus, Filter, Users, BookOpen, Clock, Edit, Trash2, X } from "lucide-react"

export default function ClassesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [classes, setClasses] = useState([
    {
      id: "1",
      name: "Grade 9A",
      level: "Grade 9",
      section: "A",
      classTeacher: "Ms. Emily Chen",
      students: 28,
      subjects: 8,
      schedule: "Morning Shift",
      room: "Room 101",
      status: "Active",
    },
    {
      id: "2",
      name: "Grade 10A",
      level: "Grade 10",
      section: "A",
      classTeacher: "Dr. Sarah Wilson",
      students: 30,
      subjects: 9,
      schedule: "Morning Shift",
      room: "Room 201",
      status: "Active",
    },
    {
      id: "3",
      name: "Grade 11B",
      level: "Grade 11",
      section: "B",
      classTeacher: "Mr. John Davis",
      students: 25,
      subjects: 10,
      schedule: "Afternoon Shift",
      room: "Room 301",
      status: "Active",
    },
    {
      id: "4",
      name: "Grade 12C",
      level: "Grade 12",
      section: "C",
      classTeacher: "Dr. Maria Garcia",
      students: 22,
      subjects: 8,
      schedule: "Morning Shift",
      room: "Room 401",
      status: "Active",
    },
  ])

  const [formData, setFormData] = useState({
    name: "",
    level: "",
    section: "",
    classTeacher: "",
    room: "",
  })

  const handleAdd = () => {
    if (!formData.name || !formData.level) return
    
    const newClass = {
      id: `${Date.now()}`,
      ...formData,
      students: 0,
      subjects: 0,
      schedule: "Morning Shift",
      status: "Active",
    }
    setClasses([...classes, newClass])
    setFormData({ name: "", level: "", section: "", classTeacher: "", room: "" })
    setShowAddForm(false)
  }

  const handleEdit = (id: string) => {
    const classItem = classes.find(c => c.id === id)
    if (classItem) {
      setFormData({
        name: classItem.name,
        level: classItem.level,
        section: classItem.section,
        classTeacher: classItem.classTeacher,
        room: classItem.room,
      })
      setEditingId(id)
      setShowAddForm(true)
    }
  }

  const handleUpdate = () => {
    if (!editingId) return
    setClasses(classes.map(c => 
      c.id === editingId 
        ? { ...c, ...formData }
        : c
    ))
    setFormData({ name: "", level: "", section: "", classTeacher: "", room: "" })
    setEditingId(null)
    setShowAddForm(false)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this class?")) {
      setClasses(classes.filter(c => c.id !== id))
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage class sections and assignments</p>
        </div>
        <Button onClick={() => { setShowAddForm(true); setEditingId(null); setFormData({ name: "", level: "", section: "", classTeacher: "", room: "" }) }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Class" : "Add New Class"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowAddForm(false); setEditingId(null) }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Class Name *</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Grade 10A"
                />
              </div>
              <div className="space-y-2">
                <Label>Level *</Label>
                <Input 
                  value={formData.level} 
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  placeholder="e.g., Grade 10"
                />
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Input 
                  value={formData.section} 
                  onChange={(e) => setFormData({...formData, section: e.target.value})}
                  placeholder="e.g., A, B, C"
                />
              </div>
              <div className="space-y-2">
                <Label>Class Teacher</Label>
                <Input 
                  value={formData.classTeacher} 
                  onChange={(e) => setFormData({...formData, classTeacher: e.target.value})}
                  placeholder="Teacher name"
                />
              </div>
              <div className="space-y-2">
                <Label>Room</Label>
                <Input 
                  value={formData.room} 
                  onChange={(e) => setFormData({...formData, room: e.target.value})}
                  placeholder="e.g., Room 201"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={editingId ? handleUpdate : handleAdd}>
                {editingId ? "Update" : "Add"} Class
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
              <Input placeholder="Search classes..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Grade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{classItem.name}</CardTitle>
                <Badge variant={classItem.status === "Active" ? "default" : "secondary"}>
                  {classItem.status}
                </Badge>
              </div>
              <CardDescription>{classItem.room}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Class Teacher:</span>
                  <span className="font-medium">{classItem.classTeacher}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    Students
                  </div>
                  <span className="font-medium">{classItem.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Subjects
                  </div>
                  <span className="font-medium">{classItem.subjects}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    Schedule
                  </div>
                  <span className="font-medium">{classItem.schedule}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(classItem.id)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(classItem.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
