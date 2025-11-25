"use client"

import { useAuth } from "@/hooks/use-auth"
import { useTeacherDashboard } from "@/lib/api/dashboard"
import { useTeachers } from "@/lib/api/teachers"
import { useStudents } from "@/lib/api/students"
import { useClasses } from "@/lib/api/academic"
import { useTimetable } from "@/lib/api/timetable"
import { useAssignments } from "@/lib/api/assignments"
import { useAnnouncements } from "@/lib/api/announcements"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, BookOpen, FileText, Calendar, TrendingUp, AlertCircle, Clock, Award } from "lucide-react"
import { getRoleDisplayName } from "@/lib/auth"

export default function TeacherDashboard() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading } = useTeacherDashboard()
  const { data: teachersData } = useTeachers()
  const { data: studentsData } = useStudents({ per_page: 100 })
  const { data: classesData } = useClasses()
  const { data: timetableData } = useTimetable({ teacher_id: user?.id ? Number(user.id) : undefined })
  const { data: assignmentsData } = useAssignments()
  const { data: announcementsData } = useAnnouncements({ per_page: 5 })

  const dashboard = dashboardData?.dashboard
  const teachers = Array.isArray(teachersData?.data) ? teachersData.data : (teachersData?.teachers?.data || [])
  const students = Array.isArray(studentsData?.data) ? studentsData.data : []
  const classes = Array.isArray(classesData) ? classesData : (classesData?.data || [])
  const timetableEntries = Array.isArray(timetableData?.data) ? timetableData.data : (timetableData?.timetable?.data || [])
  const assignments = Array.isArray(assignmentsData?.data) ? assignmentsData.data : (assignmentsData?.assignments?.data || [])
  const announcements = Array.isArray(announcementsData?.data) ? announcementsData.data : (announcementsData?.announcements?.data || [])

  // Filter data based on teacher role
  const currentTeacher = teachers.find((t: any) => t.id === Number(user?.id) || t.email === user?.email)
  const teacherRole = user?.role || "teacher"
  
  // Get teacher's classes and subjects
  const teacherClasses = currentTeacher?.classes || []
  const teacherSubjects = currentTeacher?.subjects || []
  const teacherClassIds = teacherClasses.map((c: any) => c.id)
  
  // Filter students by teacher's classes
  const myStudents = students.filter((s: any) => 
    teacherClassIds.includes(s.class?.id) || teacherClassIds.includes(s.class_id)
  )

  // Filter assignments by teacher
  const myAssignments = assignments.filter((a: any) => 
    a.teacher_id === Number(user?.id) || a.created_by === Number(user?.id)
  )
  const pendingAssignments = myAssignments.filter((a: any) => 
    !a.is_completed && !a.status || a.status === "pending"
  )

  // Filter timetable by teacher
  const myTimetable = timetableEntries.filter((t: any) => 
    t.teacher_id === Number(user?.id)
  )

  // Get upcoming classes (today and next few days)
  const today = new Date()
  const upcomingClasses = myTimetable
    .filter((entry: any) => {
      const classDate = new Date(entry.date || entry.day)
      return classDate >= today
    })
    .slice(0, 5)

  // Role-specific stats
  const getRoleSpecificStats = () => {
    switch (teacherRole) {
      case "principal":
      case "vice_principal":
        return {
          totalTeachers: teachers.length,
          totalStudents: students.length,
          totalClasses: classes.length,
        }
      case "head_teacher": // HOD
        const departmentSubjects = teacherSubjects
        const departmentTeachers = teachers.filter((t: any) => 
          t.subjects?.some((s: any) => departmentSubjects.some((ds: any) => ds.id === s.id))
        )
        return {
          departmentTeachers: departmentTeachers.length,
          departmentSubjects: departmentSubjects.length,
          departmentStudents: students.filter((s: any) => 
            s.subjects?.some((subj: any) => departmentSubjects.some((ds: any) => ds.id === subj.id))
          ).length,
        }
      case "head_tutor": // Year Tutor
        const yearClasses = teacherClasses
        const yearStudents = students.filter((s: any) => 
          yearClasses.some((yc: any) => yc.id === s.class?.id || yc.id === s.class_id)
        )
        return {
          yearClasses: yearClasses.length,
          yearStudents: yearStudents.length,
        }
      case "class_teacher":
        return {
          myClasses: teacherClasses.length,
          myStudents: myStudents.length,
        }
      default: // subject_teacher or teacher
        return {
          mySubjects: teacherSubjects.length,
          myClasses: teacherClasses.length,
          myStudents: myStudents.length,
        }
    }
  }

  const roleStats = getRoleSpecificStats()

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
          <h1 className="text-3xl font-bold tracking-tight">
            {getRoleDisplayName(teacherRole as any)} Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's an overview of your {teacherRole === "principal" || teacherRole === "vice_principal" ? "school" : "classes"} and activities.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {getRoleDisplayName(teacherRole as any)}
        </Badge>
      </div>

      {/* Stats Cards - Role-based */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {teacherRole === "principal" || teacherRole === "vice_principal" ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roleStats.totalTeachers || 0}</div>
                <p className="text-xs text-muted-foreground">Active teachers</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roleStats.totalStudents || 0}</div>
                <p className="text-xs text-muted-foreground">Enrolled students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roleStats.totalClasses || 0}</div>
                <p className="text-xs text-muted-foreground">Active classes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboard?.attendance_rate || 0}%</div>
                <p className="text-xs text-muted-foreground">Overall attendance</p>
              </CardContent>
            </Card>
          </>
        ) : teacherRole === "head_teacher" ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department Teachers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roleStats.departmentTeachers || 0}</div>
                <p className="text-xs text-muted-foreground">In your department</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roleStats.departmentSubjects || 0}</div>
                <p className="text-xs text-muted-foreground">Subjects managed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roleStats.departmentStudents || 0}</div>
                <p className="text-xs text-muted-foreground">Students in department</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingAssignments.length || dashboard?.pending_assignments || 0}</div>
                <p className="text-xs text-muted-foreground">To be reviewed</p>
              </CardContent>
            </Card>
          </>
        ) : teacherRole === "head_tutor" ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Year Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roleStats.yearClasses || teacherClasses.length || 0}</div>
                <p className="text-xs text-muted-foreground">Classes under you</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Year Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roleStats.yearStudents || myStudents.length || 0}</div>
                <p className="text-xs text-muted-foreground">Students in your year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingAssignments.length || dashboard?.pending_assignments || 0}</div>
                <p className="text-xs text-muted-foreground">To be reviewed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherClasses.length || dashboard?.my_classes || 0}</div>
                <p className="text-xs text-muted-foreground">Active classes</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherClasses.length || dashboard?.my_classes || 0}</div>
                <p className="text-xs text-muted-foreground">Active classes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{myStudents.length || dashboard?.my_students || 0}</div>
                <p className="text-xs text-muted-foreground">Total students</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingAssignments.length || dashboard?.pending_assignments || 0}</div>
                <p className="text-xs text-muted-foreground">To be reviewed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">My Subjects</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teacherSubjects.length || 0}</div>
                <p className="text-xs text-muted-foreground">Subjects taught</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>Your scheduled classes for the coming days</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingClasses.length > 0 ? (
                <div className="space-y-4">
                  {upcomingClasses.map((entry: any, index: number) => (
                    <div key={entry.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{entry.subject?.name || entry.subject || "Class"}</p>
                        <p className="text-sm text-muted-foreground">
                          {entry.class?.name || entry.class_name || "Class"} • {entry.start_time || "Time TBD"}
                        </p>
                      </div>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {entry.date ? new Date(entry.date).toLocaleDateString() : "Today"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming classes scheduled</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          {announcements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
                <CardDescription>Latest school announcements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.slice(0, 5).map((announcement: any) => (
                    <div key={announcement.id} className="p-3 border rounded-lg">
                      <p className="font-medium">{announcement.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {announcement.description || announcement.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString() : ""}
                      </p>
                    </div>
                  ))}
                </div>
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
              <a
                href="/teacher/assignments"
                className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <FileText className="w-5 h-5 mr-3" />
                <span>Create Assignment</span>
              </a>
              <a
                href="/teacher/attendance"
                className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <Users className="w-5 h-5 mr-3" />
                <span>Mark Attendance</span>
              </a>
              <a
                href="/teacher/grades"
                className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <Award className="w-5 h-5 mr-3" />
                <span>Record Grades</span>
              </a>
              <a
                href="/teacher/schedule"
                className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <Calendar className="w-5 h-5 mr-3" />
                <span>View Schedule</span>
              </a>
            </CardContent>
          </Card>

          {/* Role-specific Info */}
          {(teacherRole === "principal" || teacherRole === "vice_principal") && (
            <Card>
              <CardHeader>
                <CardTitle>School Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Teachers</span>
                    <span className="font-medium">{teachers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Students</span>
                    <span className="font-medium">{students.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Classes</span>
                    <span className="font-medium">{classes.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {teacherRole === "head_teacher" && (
            <Card>
              <CardHeader>
                <CardTitle>Department Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Subjects</p>
                    <div className="flex flex-wrap gap-1">
                      {teacherSubjects.slice(0, 3).map((subject: any) => (
                        <Badge key={subject.id} variant="secondary" className="text-xs">
                          {subject.name}
                        </Badge>
                      ))}
                      {teacherSubjects.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{teacherSubjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {teacherRole === "class_teacher" && (
            <Card>
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teacherClasses.slice(0, 5).map((classItem: any) => (
                    <div key={classItem.id} className="p-2 border rounded text-sm">
                      {classItem.name}
                    </div>
                  ))}
                  {teacherClasses.length === 0 && (
                    <p className="text-sm text-muted-foreground">No classes assigned</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
