"use client"

import { useAuth } from "@/hooks/use-auth"
import { useStudentDashboard } from "@/lib/api/dashboard"
import { useStudents } from "@/lib/api/students"
import { useAssignments } from "@/lib/api/assignments"
import { useTimetable } from "@/lib/api/timetable"
import { useAnnouncements } from "@/lib/api/announcements"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen, FileText, Calendar, TrendingUp, Clock, Award, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading } = useStudentDashboard()
  const { data: studentsData } = useStudents({ per_page: 1, search: user?.email })
  const { data: assignmentsData } = useAssignments()
  const { data: timetableData } = useTimetable({ student_id: user?.id ? Number(user.id) : undefined })
  const { data: announcementsData } = useAnnouncements({ per_page: 5 })

  const dashboard = dashboardData?.dashboard
  const student = Array.isArray(studentsData?.data) ? studentsData.data[0] : null
  const assignments = Array.isArray(assignmentsData?.data) ? assignmentsData.data : (assignmentsData?.assignments?.data || [])
  const timetableEntries = Array.isArray(timetableData?.data) ? timetableData.data : (timetableData?.timetable?.data || [])
  const announcements = Array.isArray(announcementsData?.data) ? announcementsData.data : (announcementsData?.announcements?.data || [])

  // Filter assignments for current student
  const myAssignments = assignments.filter((a: any) => 
    a.student_id === Number(user?.id) || a.class_id === student?.class_id
  )
  const pendingAssignments = myAssignments.filter((a: any) => 
    !a.submitted || a.status === "pending"
  )
  const completedAssignments = myAssignments.filter((a: any) => 
    a.submitted || a.status === "completed"
  )

  // Filter timetable for student's class
  const myTimetable = timetableEntries.filter((t: any) => 
    t.class_id === student?.class_id || t.class?.id === student?.class?.id
  )

  // Get today's schedule
  const today = new Date()
  const todaySchedule = myTimetable.filter((entry: any) => {
    const entryDate = new Date(entry.date || entry.day)
    return entryDate.toDateString() === today.toDateString()
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
            Welcome back, {user?.name || student?.name || "Student"}! Here's your academic overview and upcoming tasks.
          </p>
        </div>
        {student?.class && (
          <Badge variant="outline" className="text-sm">
            {student.class.name} {student.arm?.name ? `- ${student.arm.name}` : ""}
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student?.subjects?.length || dashboard?.my_courses || 0}</div>
            <p className="text-xs text-muted-foreground">Active subjects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAssignments.length || dashboard?.pending_assignments || 0}</div>
            <p className="text-xs text-muted-foreground">To be completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Assignments done</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.attendance_rate || 0}%</div>
            <p className="text-xs text-muted-foreground">This term</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Your classes for today</CardDescription>
            </CardHeader>
            <CardContent>
              {todaySchedule.length > 0 ? (
                <div className="space-y-3">
                  {todaySchedule.map((entry: any, index: number) => (
                    <div key={entry.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{entry.subject?.name || entry.subject || "Class"}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.start_time || "Time TBD"} - {entry.end_time || ""}
                          {entry.room && ` • Room: ${entry.room}`}
                        </p>
                      </div>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {entry.start_time || "TBD"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No classes scheduled for today</p>
              )}
            </CardContent>
          </Card>

          {/* Pending Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Assignments</CardTitle>
              <CardDescription>Assignments that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingAssignments.length > 0 ? (
                <div className="space-y-3">
                  {pendingAssignments.slice(0, 5).map((assignment: any) => (
                    <Link
                      key={assignment.id}
                      href={`/student/assignments/${assignment.id}`}
                      className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {assignment.subject?.name || assignment.subject} • Due:{" "}
                            {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : "TBD"}
                          </p>
                        </div>
                        <Badge variant="destructive">Pending</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No pending assignments</p>
              )}
            </CardContent>
          </Card>
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
                <span>View Assignments</span>
              </Link>
              <Link
                href="/student/grades"
                className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <Award className="w-5 h-5 mr-3" />
                <span>View Grades</span>
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
                <span>Attendance</span>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          {announcements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcements.slice(0, 3).map((announcement: any) => (
                    <div key={announcement.id} className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">{announcement.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString() : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
