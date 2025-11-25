"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, TrendingUp, Award, Users, BarChart3 } from "lucide-react"
import { useClasses } from "@/lib/api/academic"
import { useAuth } from "@/hooks/use-auth"
import { useTeachers } from "@/lib/api/teachers"
import { useResults } from "@/lib/api/exams"
import { useRouter, useSearchParams } from "next/navigation"

export default function TeacherGradesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [filterClassId, setFilterClassId] = useState<number | "all">("all")

  useEffect(() => {
    const selectedClassId = searchParams.get('class_id')
    if (selectedClassId) {
      setFilterClassId(parseInt(selectedClassId))
    }
  }, [searchParams])

  const { data: classesData, isLoading: classesLoading } = useClasses()
  const { data: teachersData } = useTeachers()
  const { data: resultsData, isLoading: resultsLoading } = useResults({
    per_page: 1000,
  })

  const classes = Array.isArray(classesData) ? classesData : (classesData?.data || [])
  const teachers = Array.isArray(teachersData?.data) ? teachersData.data : (teachersData?.teachers?.data || [])
  const results = Array.isArray(resultsData?.results?.data) ? resultsData.results.data : []

  // Get current teacher's classes
  const currentTeacher = teachers.find((t: any) => t.id === Number(user?.id) || t.email === user?.email)
  const teacherClasses = currentTeacher?.classes || []
  const teacherClassIds = teacherClasses.map((c: any) => c.id)

  // Filter classes
  const myClasses = classes.filter((c: any) => teacherClassIds.includes(c.id))

  // Filter results by class
  const filteredResults = filterClassId !== "all"
    ? results.filter((r: any) => r.exam?.class_id === filterClassId || r.student?.class_id === filterClassId)
    : results.filter((r: any) => {
        const classId = r.exam?.class_id || r.student?.class_id
        return teacherClassIds.includes(classId)
      })

  // Group results by student
  const studentResults = filteredResults.reduce((acc: any, result: any) => {
    const studentId = result.student_id
    if (!acc[studentId]) {
      acc[studentId] = {
        student: result.student,
        results: [],
        totalScore: 0,
        totalMarks: 0,
      }
    }
    acc[studentId].results.push(result)
    acc[studentId].totalScore += result.score || 0
    acc[studentId].totalMarks += result.total_marks || 0
    return acc
  }, {})

  const studentList = Object.values(studentResults).map((sr: any) => ({
    ...sr,
    average: sr.totalMarks > 0 ? (sr.totalScore / sr.totalMarks) * 100 : 0,
  })).sort((a: any, b: any) => b.average - a.average)

  // Calculate class statistics
  const classStats = studentList.length > 0 ? {
    totalStudents: studentList.length,
    averageScore: studentList.reduce((sum: number, s: any) => sum + s.average, 0) / studentList.length,
    highestScore: Math.max(...studentList.map((s: any) => s.average)),
    lowestScore: Math.min(...studentList.map((s: any) => s.average)),
    passRate: (studentList.filter((s: any) => s.average >= 50).length / studentList.length) * 100,
  } : null

  if (classesLoading || resultsLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Grade Book</h1>
          <p className="text-muted-foreground">View and manage student grades</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="space-y-2">
              <Label>Filter by Class</Label>
              <Select
                value={filterClassId === "all" ? "all" : filterClassId.toString()}
                onValueChange={(value) => setFilterClassId(value === "all" ? "all" : parseInt(value))}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {myClasses.map((classItem: any) => (
                    <SelectItem key={classItem.id} value={classItem.id.toString()}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {classStats && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classStats.totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classStats.averageScore.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classStats.highestScore.toFixed(1)}%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classStats.passRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grades List */}
      <Card>
        <CardHeader>
          <CardTitle>Student Grades</CardTitle>
          <CardDescription>
            {studentList.length} student{studentList.length !== 1 ? 's' : ''} with grades
          </CardDescription>
        </CardHeader>
        <CardContent>
          {studentList.length > 0 ? (
            <div className="space-y-4">
              {studentList.map((studentData: any, index: number) => (
                <div key={studentData.student?.id || index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">
                        {studentData.student?.name || `Student ${studentData.student?.id || index + 1}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {studentData.student?.admission_number || ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{studentData.average.toFixed(1)}%</div>
                      <Badge variant={studentData.average >= 70 ? "default" : studentData.average >= 50 ? "secondary" : "destructive"}>
                        {studentData.average >= 70 ? "A" : studentData.average >= 60 ? "B" : studentData.average >= 50 ? "C" : "F"}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {studentData.results.slice(0, 4).map((result: any, idx: number) => (
                      <div key={idx} className="p-2 bg-muted rounded">
                        <p className="text-xs text-muted-foreground">
                          {result.exam?.title || "Exam"}
                        </p>
                        <p className="font-medium">
                          {result.score || 0} / {result.total_marks || 0}
                        </p>
                        {result.grade && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {result.grade}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No grades found for selected class</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
