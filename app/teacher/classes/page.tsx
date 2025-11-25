"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, BookOpen, TrendingUp, Filter, Loader2 } from "lucide-react"
import { useClasses } from "@/lib/api/academic"
import { useAuth } from "@/hooks/use-auth"
import { useTeachers } from "@/lib/api/teachers"
import { useAssignments } from "@/lib/api/assignments"
import Link from "next/link"

export default function TeacherClassesPage() {
  const { user } = useAuth()
  const { data: teachersData } = useTeachers()
  const { data: classesData, isLoading: classesLoading } = useClasses()
  const { data: assignmentsData } = useAssignments({ teacher_id: user?.id ? Number(user.id) : undefined })

  const teachers = Array.isArray(teachersData?.data) ? teachersData.data : (teachersData?.teachers?.data || [])
  const allClasses = Array.isArray(classesData) ? classesData : (classesData?.data || [])
  const assignments = Array.isArray(assignmentsData?.data) ? assignmentsData.data : []

  // Get current teacher
  const currentTeacher = teachers.find((t: any) => t.id === Number(user?.id) || t.email === user?.email)
  const teacherClasses = currentTeacher?.classes || []
  const teacherSubjects = currentTeacher?.subjects || []

  // Get classes where teacher is class teacher or teaches subjects
  const myClasses = allClasses.filter((classItem: any) => {
    // Check if teacher is class teacher
    if (classItem.class_teacher_id === Number(user?.id)) return true
    // Check if teacher teaches any subject in this class
    if (teacherSubjects.some((subject: any) => 
      classItem.subjects?.some((s: any) => s.id === subject.id)
    )) return true
    // Check if class is in teacher's classes list
    if (teacherClasses.some((tc: any) => tc.id === classItem.id)) return true
    return false
  })

  // Get assignments for each class
  const getClassAssignments = (classId: number) => {
    return assignments.filter((a: any) => a.class_id === classId)
  }

  if (classesLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">Manage your classes and track student progress</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Link href="/teacher/assignments">
            <Button>
              New Assignment
            </Button>
          </Link>
        </div>
      </div>

      {/* Classes Grid */}
      {myClasses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myClasses.map((classData: any) => {
            const classAssignments = getClassAssignments(classData.id)
            const nextAssignment = classAssignments
              .filter((a: any) => {
                const dueDate = a.due_date ? new Date(a.due_date) : null
                return dueDate && dueDate > new Date()
              })
              .sort((a: any, b: any) => {
                const dateA = a.due_date ? new Date(a.due_date).getTime() : 0
                const dateB = b.due_date ? new Date(b.due_date).getTime() : 0
                return dateA - dateB
              })[0]

            return (
              <Card key={classData.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {classData.level || "Class"}
                    </Badge>
                    <Badge variant="outline">
                      {classData.student_count || 0} students
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{classData.name}</CardTitle>
                  <CardDescription>
                    {classData.class_teacher?.name || "No class teacher assigned"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{classData.student_count || 0} students</span>
                    </div>
                    {classData.subjects && classData.subjects.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {classData.subjects.length} subject{classData.subjects.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {nextAssignment && (
                    <div className="pt-2 border-t space-y-2">
                      <p className="text-sm font-medium">Next Assignment:</p>
                      <p className="text-sm text-muted-foreground">{nextAssignment.title}</p>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Due: {nextAssignment.due_date ? new Date(nextAssignment.due_date).toLocaleDateString() : "TBD"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Link href={`/teacher/classes/${classData.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                    </Link>
                    <Link href={`/teacher/grades?class_id=${classData.id}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">No classes assigned to you</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
