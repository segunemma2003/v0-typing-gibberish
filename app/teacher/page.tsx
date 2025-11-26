"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useTeacherDashboard } from "@/lib/api/dashboard"
import { useMyClasses, useMySubjects, useMyProfile } from "@/lib/api/teachers"
import { useStudents } from "@/lib/api/students"
import { useAssignments } from "@/lib/api/assignments"
import { useExams } from "@/lib/api/assessment"
import { useTeacherTimetable } from "@/lib/api/timetable"
import { useClassGrades } from "@/lib/api/grades"
import { useAnnouncements } from "@/lib/api/announcements"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Users,
  BookOpen,
  FileText,
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  Award,
  CheckCircle,
  BarChart3,
  MessageSquare,
  User,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useTeacherDashboard()
  const { data: myClassesData } = useMyClasses()
  const { data: mySubjectsData } = useMySubjects()
  const { data: myProfileData } = useMyProfile()
  const { data: assignmentsData } = useAssignments({ teacher_id: user?.id ? Number(user.id) : undefined })
  const { data: examsData } = useExams({ teacher_id: user?.id ? Number(user.id) : undefined })
  const { data: timetableData } = useTeacherTimetable(user?.id ? Number(user.id) : 0)
  const { data: announcementsData } = useAnnouncements({ per_page: 5 })

  const dashboard = dashboardData
  const teacher = dashboard?.teacher
  const stats = dashboard?.stats || {
    my_classes: 0,
    my_subjects: 0,
    my_students: 0,
    pending_assignments: 0,
    upcoming_exams: 0,
  }

  const myClasses = myClassesData || []
  const mySubjects = mySubjectsData || []
  const assignments = Array.isArray(assignmentsData?.data) ? assignmentsData.data : (assignmentsData?.assignments?.data || [])
  const exams = Array.isArray(examsData?.data) ? examsData.data : (examsData?.exams?.data || [])
  const timetable = timetableData?.timetable || []
  const announcements = Array.isArray(announcementsData?.data) ? announcementsData.data : (announcementsData?.announcements?.data || [])

  // Calculate total students from classes
  const totalStudents = myClasses.reduce((sum: number, cls: any) => sum + (cls.students_count || 0), 0)

  // Pending assignments (not graded)
  const pendingAssignments = assignments.filter((a: any) => a.status === "published" || a.status === "draft")

  // Upcoming exams
  const today = new Date()
  const upcomingExams = exams.filter((exam: any) => {
    if (exam.status === "scheduled" || exam.status === "upcoming") return true
    if (exam.start_date) {
      return new Date(exam.start_date) >= today
    }
    return false
  })

  // Get today's schedule
  const todayDay = today.toLocaleDateString("en-US", { weekday: "long" })
  const todaySchedule = timetable.find((day: any) => day.day === todayDay)?.periods || []

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
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {dashboard?.user?.name || user?.name || "Teacher"}!
          </p>
        </div>
        <div className="flex items-center gap-2">
          {teacher?.employee_id && (
            <Badge variant="outline" className="text-sm">
              {teacher.employee_id}
            </Badge>
          )}
          {teacher?.qualification && (
            <Badge variant="outline" className="text-sm">
              {teacher.qualification}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.my_classes || myClasses.length}</div>
            <p className="text-xs text-muted-foreground">Classes assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.my_subjects || mySubjects.length}</div>
            <p className="text-xs text-muted-foreground">Subjects teaching</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Students</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.my_students || totalStudents}</div>
            <p className="text-xs text-muted-foreground">Total students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pending_assignments || pendingAssignments.length}
            </div>
            <p className="text-xs text-muted-foreground">To be graded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming_exams || upcomingExams.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled exams</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="subjects">My Subjects</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
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
                                {period.class} {period.room && `• ${period.room}`}
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

              {/* Pending Assignments */}
              {pendingAssignments.length > 0 && (
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                      <AlertCircle className="h-5 w-5" />
                      Pending Assignments
                    </CardTitle>
                    <CardDescription className="text-orange-700 dark:text-orange-300">
                      {pendingAssignments.length} assignment{pendingAssignments.length !== 1 ? "s" : ""} need
                      grading
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {pendingAssignments.slice(0, 3).map((assignment: any) => (
                        <Link
                          key={assignment.id}
                          href={`/teacher/assignments/${assignment.id}`}
                          className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                        >
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.class?.name || "Class"} • Due:{" "}
                            {assignment.due_date && format(new Date(assignment.due_date), "MMM dd, yyyy")}
                          </p>
                        </Link>
                      ))}
                    </div>
                    <Link href="/teacher/assignments">
                      <Button variant="outline" className="mt-4 w-full">
                        View All Assignments
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
                    <Link href="/teacher/exams">
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
                    href="/teacher/assignments/create"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    <span>Create Assignment</span>
                  </Link>
                  <Link
                    href="/teacher/exams/create"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Create Exam</span>
                  </Link>
                  <Link
                    href="/teacher/question-bank"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <BookOpen className="w-5 h-5 mr-3" />
                    <span>Question Bank</span>
                  </Link>
                  <Link
                    href="/teacher/attendance"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span>Mark Attendance</span>
                  </Link>
                  <Link
                    href="/teacher/grades"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <BarChart3 className="w-5 h-5 mr-3" />
                    <span>View Grades</span>
                  </Link>
                </CardContent>
              </Card>

              {/* My Profile Summary */}
              {myProfileData && (
                <Card>
                  <CardHeader>
                    <CardTitle>My Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {myProfileData.qualification && (
                      <div>
                        <p className="text-sm text-muted-foreground">Qualification</p>
                        <p className="font-medium">{myProfileData.qualification}</p>
                      </div>
                    )}
                    {myProfileData.specialization && (
                      <div>
                        <p className="text-sm text-muted-foreground">Specialization</p>
                        <p className="font-medium">{myProfileData.specialization}</p>
                      </div>
                    )}
                    {myProfileData.department && (
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{myProfileData.department.name}</p>
                      </div>
                    )}
                    <Link href="/teacher/settings">
                      <Button variant="outline" size="sm" className="w-full">
                        Edit Profile
                      </Button>
                    </Link>
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

        {/* My Classes Tab */}
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Classes</CardTitle>
              <CardDescription>Classes you are assigned as class teacher</CardDescription>
            </CardHeader>
            <CardContent>
              {myClasses.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {myClasses.map((cls: any) => (
                    <Card key={cls.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{cls.name}</CardTitle>
                        <CardDescription>
                          {cls.class_teacher?.name && `Class Teacher: ${cls.class_teacher.name}`}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Students</span>
                          <span className="font-medium">
                            {cls.students_count} / {cls.capacity}
                          </span>
                        </div>
                        <Link href={`/teacher/classes/${cls.id}`}>
                          <Button variant="outline" className="w-full">
                            View Class Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No classes assigned</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Subjects</CardTitle>
              <CardDescription>Subjects you are teaching</CardDescription>
            </CardHeader>
            <CardContent>
              {mySubjects.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {mySubjects.map((subject: any) => (
                    <Card key={subject.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        {subject.code && (
                          <CardDescription>Code: {subject.code}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Classes</span>
                          <span className="font-medium">{subject.classes?.length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Students</span>
                          <span className="font-medium">{subject.students_count || 0}</span>
                        </div>
                        {subject.classes && subject.classes.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Teaching in:</p>
                            <div className="flex flex-wrap gap-1">
                              {subject.classes.map((cls: any) => (
                                <Badge key={cls.id} variant="outline" className="text-xs">
                                  {cls.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No subjects assigned</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Assignments</CardTitle>
              <CardDescription>All your assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {assignments.length > 0 ? (
                <div className="space-y-3">
                  {assignments.map((assignment: any) => (
                    <Link
                      key={assignment.id}
                      href={`/teacher/assignments/${assignment.id}`}
                      className="block p-4 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{assignment.title}</p>
                            <Badge
                              variant={
                                assignment.status === "published"
                                  ? "default"
                                  : assignment.status === "closed"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {assignment.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {assignment.subject?.name || assignment.subject} •{" "}
                            {assignment.class?.name || "Class"} • Due:{" "}
                            {assignment.due_date && format(new Date(assignment.due_date), "MMM dd, yyyy HH:mm")}
                          </p>
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
                      </div>
                      <Link href={`/teacher/exams/${exam.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No exams</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Timetable</CardTitle>
              <CardDescription>Weekly teaching schedule</CardDescription>
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
                                  {period.class} {period.room && `• ${period.room}`}
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
      </Tabs>
    </div>
  )
}
