"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useStudentDashboard } from "@/lib/api/dashboard"
import { useMyGuardians } from "@/lib/api/students"
import {
  useMyAssignments,
  useMyExams,
  useSubmitAssignment,
} from "@/lib/api/assessment"
import { useMyTimetable } from "@/lib/api/timetable"
import { useMyAttendance } from "@/lib/api/attendance"
import { useMyClass, useMySubjects } from "@/lib/api/academic"
import { useMyGrades } from "@/lib/api/grades"
import { useMyAnnouncements } from "@/lib/api/announcements"
import { useMyMessages } from "@/lib/api/communication"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  BookOpen,
  FileText,
  Calendar,
  TrendingUp,
  Clock,
  Award,
  AlertCircle,
  CheckCircle,
  Users,
  BarChart3,
  MessageSquare,
  User,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function StudentDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Dashboard data
  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useStudentDashboard()
  const { data: myAssignmentsData } = useMyAssignments()
  const { data: myExamsData } = useMyExams()
  const { data: myTimetableData } = useMyTimetable()
  const { data: myAttendanceData } = useMyAttendance()
  const { data: myClassData } = useMyClass()
  const { data: mySubjectsData } = useMySubjects()
  const { data: myGuardiansData } = useMyGuardians()
  const { data: myGradesData } = useMyGrades()
  const { data: announcementsData } = useMyAnnouncements()
  const { data: messagesData } = useMyMessages()

  const dashboard = dashboardData
  const student = dashboard?.student
  const stats = dashboard?.stats || {
    my_class: { id: 0, name: "N/A" },
    my_subjects: 0,
    pending_assignments: 0,
    upcoming_exams: 0,
    recent_grades: [],
    attendance_rate: 0,
  }

  const assignments = myAssignmentsData?.assignments || []
  const assignmentsSummary = myAssignmentsData?.summary || {
    total: 0,
    pending: 0,
    submitted: 0,
    graded: 0,
    late: 0,
  }
  const exams = myExamsData?.exams || []
  const timetable = myTimetableData?.timetable || []
  const attendance = myAttendanceData?.attendance || []
  const attendanceSummary = myAttendanceData?.summary || {
    total_days: 0,
    present: 0,
    absent: 0,
    late: 0,
    attendance_rate: 0,
    punctuality_rate: 0,
  }
  const myClass = myClassData
  const subjects = mySubjectsData || []
  const guardians = myGuardiansData?.guardians || []
  const recentGrades = stats.recent_grades || []
  const announcements = announcementsData?.announcements || []
  const messages = messagesData?.data || []

  // Get today's schedule
  const today = new Date()
  const todayDay = today.toLocaleDateString("en-US", { weekday: "long" })
  const todaySchedule = timetable.find((day: any) => day.day === todayDay)?.periods || []

  // Upcoming exams
  const upcomingExams = exams.filter((exam: any) => {
    if (exam.status === "upcoming" || exam.status === "ongoing") return true
    if (exam.start_date) {
      return new Date(exam.start_date) >= today
    }
    return false
  })

  if (dashboardLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {dashboard?.user?.name || student?.first_name || user?.name}!
          </p>
        </div>
        <div className="flex items-center gap-2">
          {student?.class && (
            <Badge variant="outline" className="text-sm">
              {student.class.name} {student.arm?.name ? `- ${student.arm.name}` : ""}
            </Badge>
          )}
          <Badge variant="outline" className="text-sm">
            {student?.admission_number || "Student"}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.my_subjects || subjects.length}</div>
            <p className="text-xs text-muted-foreground">Active subjects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pending_assignments || assignmentsSummary.pending}
            </div>
            <p className="text-xs text-muted-foreground">To be completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming_exams || upcomingExams.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled exams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.attendance_rate?.toFixed(1) || attendanceSummary.attendance_rate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">This term</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Teacher</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {stats.my_class?.class_teacher || myClass?.class_teacher?.name || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">{stats.my_class?.name || "Class"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your classes for {todayDay}</CardDescription>
                </CardHeader>
                <CardContent>
                  {todaySchedule.length > 0 ? (
                    <div className="space-y-3">
                      {todaySchedule.map((period: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <span className="text-sm font-bold">{period.period}</span>
                            </div>
                            <div>
                              <p className="font-medium">{period.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {period.teacher} {period.room && `• ${period.room}`}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {period.time}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No classes scheduled for today
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Grades */}
              {recentGrades.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Grades</CardTitle>
                    <CardDescription>Latest assessment results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentGrades.map((grade: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{grade.subject}</p>
                            <p className="text-sm text-muted-foreground">Latest assessment</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{grade.score || grade.marks || "N/A"}</p>
                            <Badge variant="outline">{grade.grade}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link href="/student/grades">
                      <Button variant="outline" className="mt-4 w-full">
                        View All Grades
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Pending Assignments */}
              {assignmentsSummary.pending > 0 && (
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                      <AlertCircle className="h-5 w-5" />
                      Pending Assignments
                    </CardTitle>
                    <CardDescription className="text-orange-700 dark:text-orange-300">
                      {assignmentsSummary.pending} assignment{assignmentsSummary.pending !== 1 ? "s" : ""}{" "}
                      need your attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/student/assignments">
                      <Button variant="outline" size="sm">
                        View Assignments
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Upcoming Exams */}
              {upcomingExams.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Exams</CardTitle>
                    <CardDescription>Exams scheduled soon</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingExams.slice(0, 3).map((exam: any) => (
                        <div
                          key={exam.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{exam.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {exam.subject?.name || exam.subject} •{" "}
                              {exam.start_date && format(new Date(exam.start_date), "MMM dd, yyyy HH:mm")}
                            </p>
                          </div>
                          <Badge variant={exam.is_cbt ? "default" : "outline"}>
                            {exam.is_cbt ? "CBT" : "Paper"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Link href="/student/exams">
                      <Button variant="outline" className="mt-4 w-full">
                        View All Exams
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href="/student/assignments"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    <span>My Assignments</span>
                  </Link>
                  <Link
                    href="/student/exams"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>My Exams</span>
                  </Link>
                  <Link
                    href="/student/grades"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Award className="w-5 h-5 mr-3" />
                    <span>My Grades</span>
                  </Link>
                  <Link
                    href="/student/schedule"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Full Schedule</span>
                  </Link>
                  <Link
                    href="/student/attendance"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <TrendingUp className="w-5 h-5 mr-3" />
                    <span>My Attendance</span>
                  </Link>
                </CardContent>
              </Card>

              {/* My Class Info */}
              {myClass && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Class</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="font-medium">{myClass.name}</p>
                    </div>
                    {myClass.class_teacher && (
                      <div>
                        <p className="text-sm text-muted-foreground">Class Teacher</p>
                        <p className="font-medium">{myClass.class_teacher.name}</p>
                        {myClass.class_teacher.email && (
                          <p className="text-xs text-muted-foreground">{myClass.class_teacher.email}</p>
                        )}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="font-medium">
                        {myClass.students_count} / {myClass.capacity}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Announcements */}
              {announcements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Announcements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {announcements.slice(0, 3).map((announcement: any) => (
                        <div key={announcement.id} className="p-3 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{announcement.title}</p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {announcement.content}
                              </p>
                            </div>
                            {announcement.priority === "high" && (
                              <Badge variant="destructive" className="ml-2">
                                High
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {announcement.created_at &&
                              format(new Date(announcement.created_at), "MMM dd, yyyy")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Assignments</CardTitle>
              <CardDescription>All your assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid grid-cols-4 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-2xl font-bold">{assignmentsSummary.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{assignmentsSummary.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{assignmentsSummary.submitted}</p>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                </div>
                <div className="text-center p-3 border rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{assignmentsSummary.graded}</p>
                  <p className="text-xs text-muted-foreground">Graded</p>
                </div>
              </div>
              {assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.map((assignment: any) => (
                    <Link
                      key={assignment.id}
                      href={`/student/assignments/${assignment.id}`}
                      className="block p-4 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{assignment.title}</p>
                            <Badge
                              variant={
                                assignment.status === "graded"
                                  ? "default"
                                  : assignment.status === "submitted"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {assignment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {assignment.subject?.name || assignment.subject} •{" "}
                            {assignment.teacher?.name || "Teacher"} • Due:{" "}
                            {assignment.due_date && format(new Date(assignment.due_date), "MMM dd, yyyy HH:mm")}
                          </p>
                          {assignment.submission?.marks && (
                            <p className="text-sm font-medium mt-1">
                              Score: {assignment.submission.marks} / {assignment.total_marks} (
                              {assignment.submission.grade})
                            </p>
                          )}
                        </div>
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No assignments</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exams Tab */}
        <TabsContent value="exams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Exams</CardTitle>
              <CardDescription>All your exams</CardDescription>
            </CardHeader>
            <CardContent>
              {exams.length > 0 ? (
                <div className="space-y-3">
                  {exams.map((exam: any) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{exam.title}</p>
                          {exam.is_cbt && <Badge variant="default">CBT</Badge>}
                          <Badge
                            variant={
                              exam.status === "completed"
                                ? "default"
                                : exam.status === "ongoing"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {exam.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {exam.subject?.name || exam.subject} •{" "}
                          {exam.start_date && format(new Date(exam.start_date), "MMM dd, yyyy HH:mm")}
                          {exam.duration_minutes && ` • ${exam.duration_minutes} minutes`}
                        </p>
                        {exam.my_result && (
                          <div className="mt-2 flex items-center gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Score</p>
                              <p className="font-bold">{exam.my_result.marks} / {exam.total_marks}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Grade</p>
                              <Badge variant="default">{exam.my_result.grade}</Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Position</p>
                              <p className="font-bold">#{exam.my_result.position}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {exam.status === "upcoming" && exam.is_cbt && (
                        <Link href={`/student/exams/${exam.id}`}>
                          <Button size="sm">Start Exam</Button>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No exams</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Grades</CardTitle>
              <CardDescription>Academic performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              {myGradesData ? (
                <div className="space-y-4">
                  {myGradesData.summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Average</p>
                        <p className="text-2xl font-bold">
                          {myGradesData.summary.overall_average?.toFixed(1) || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Grade</p>
                        <Badge variant="default" className="text-lg">
                          {myGradesData.summary.overall_grade || "N/A"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Class Position</p>
                        <p className="text-2xl font-bold">
                          #{myGradesData.summary.overall_position || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Subjects</p>
                        <p className="text-2xl font-bold">{myGradesData.summary.total_subjects || 0}</p>
                      </div>
                    </div>
                  )}
                  {myGradesData.grades && myGradesData.grades.length > 0 ? (
                    <div className="space-y-3">
                      {myGradesData.grades.map((grade: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{grade.subject}</p>
                            <p className="text-sm text-muted-foreground">
                              {grade.exam_type} • Position: #{grade.position}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {grade.marks} / {grade.total_marks} ({grade.percentage}%)
                            </p>
                            <Badge variant="outline" className="mt-1">
                              {grade.grade}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">No grades available</div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No grades data available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Timetable</CardTitle>
              <CardDescription>Weekly class schedule</CardDescription>
            </CardHeader>
            <CardContent>
              {timetable.length > 0 ? (
                <div className="space-y-4">
                  {timetable.map((day: any) => (
                    <div key={day.day} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">{day.day}</h3>
                      <div className="space-y-2">
                        {day.periods.map((period: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <span className="text-xs font-bold">{period.period}</span>
                              </div>
                              <div>
                                <p className="font-medium">{period.subject}</p>
                                <p className="text-sm text-muted-foreground">
                                  {period.teacher} {period.room && `• ${period.room}`}
                                </p>
                              </div>
                            </div>
                            <Badge variant="outline">{period.time}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No timetable available</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Attendance</CardTitle>
              <CardDescription>Attendance history and summary</CardDescription>
            </CardHeader>
            <CardContent>
              {attendanceSummary && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{attendanceSummary.present}</p>
                    <p className="text-xs text-muted-foreground">Present</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{attendanceSummary.absent}</p>
                    <p className="text-xs text-muted-foreground">Absent</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{attendanceSummary.late}</p>
                    <p className="text-xs text-muted-foreground">Late</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">{attendanceSummary.attendance_rate?.toFixed(1) || 0}%</p>
                    <p className="text-xs text-muted-foreground">Attendance Rate</p>
                  </div>
                </div>
              )}
              {attendance.length > 0 ? (
                <div className="space-y-2">
                  {attendance.slice(0, 10).map((record: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            record.status === "present"
                              ? "bg-green-500"
                              : record.status === "late"
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">
                            {record.date && format(new Date(record.date), "MMM dd, yyyy")} ({record.day})
                          </p>
                          {record.check_in_time && (
                            <p className="text-sm text-muted-foreground">
                              Check-in: {record.check_in_time}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          record.status === "present"
                            ? "default"
                            : record.status === "late"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No attendance records</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
