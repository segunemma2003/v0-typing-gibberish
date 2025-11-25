"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Mail, Phone, MessageSquare, Loader2 } from "lucide-react"
import { useStudents } from "@/lib/api/students"
import { useClasses } from "@/lib/api/academic"
import { useAuth } from "@/hooks/use-auth"
import { useTeachers } from "@/lib/api/teachers"
import Link from "next/link"

export default function TeacherStudentsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClassId, setFilterClassId] = useState<number | "all">("all")

  const { data: teachersData } = useTeachers()
  const { data: classesData } = useClasses()
  const { data: studentsData, isLoading } = useStudents({
    search: searchTerm || undefined,
    class_id: filterClassId !== "all" ? filterClassId : undefined,
    per_page: 100,
  })

  const teachers = Array.isArray(teachersData?.data) ? teachersData.data : (teachersData?.teachers?.data || [])
  const classes = Array.isArray(classesData) ? classesData : (classesData?.data || [])
  const students = Array.isArray(studentsData?.data) ? studentsData.data : []

  // Get current teacher's classes
  const currentTeacher = teachers.find((t: any) => t.id === Number(user?.id) || t.email === user?.email)
  const teacherClasses = currentTeacher?.classes || []
  const teacherClassIds = teacherClasses.map((c: any) => c.id)

  // Filter students by teacher's classes
  const myStudents = students.filter((s: any) => 
    teacherClassIds.includes(s.class?.id) || teacherClassIds.includes(s.class_id)
  )

  // Filter by selected class if not "all"
  const filteredStudents = filterClassId !== "all" 
    ? myStudents.filter((s: any) => s.class?.id === filterClassId || s.class_id === filterClassId)
    : myStudents

  // Filter by search term
  const searchedStudents = searchTerm
    ? filteredStudents.filter((s: any) => 
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.admission_number?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredStudents

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
          <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
          <p className="text-muted-foreground">Manage and view your students</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search students..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={filterClassId === "all" ? "all" : filterClassId.toString()}
              onValueChange={(value) => setFilterClassId(value === "all" ? "all" : parseInt(value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {teacherClasses.map((classItem: any) => (
                  <SelectItem key={classItem.id} value={classItem.id.toString()}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            {searchedStudents.length} student{searchedStudents.length !== 1 ? 's' : ''} in your classes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {searchedStudents.length > 0 ? (
            <div className="space-y-4">
              {searchedStudents.map((student: any) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>
                        {student.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase() || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{student.name || `${student.first_name} ${student.last_name}`}</h3>
                      <p className="text-sm text-muted-foreground">
                        {student.class?.name || student.class_name || "No class"}
                        {student.admission_number && ` • ${student.admission_number}`}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        {student.email && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="w-3 h-3 mr-1" />
                            {student.email}
                          </div>
                        )}
                        {student.phone && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="w-3 h-3 mr-1" />
                            {student.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={student.status === "active" ? "default" : "secondary"}>
                      {student.status || "Active"}
                    </Badge>
                    <Link href={`/teacher/students/${student.id}`}>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No students found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
