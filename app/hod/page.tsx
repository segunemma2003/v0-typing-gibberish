"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useHODDashboard } from "@/lib/api/dashboard"
import {
  useDepartmentTeachers,
  useDepartmentSubjects,
  useDepartmentPerformance,
  useTeacherAttendance,
} from "@/lib/api/departments"
import { useSubjectPerformance, useCurriculumProgress } from "@/lib/api/academic"
import { useTeacherPerformanceReview } from "@/lib/api/principal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Users,
  BookOpen,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Clock,
  Award,
  User,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function HODDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useHODDashboard()
  const departmentId = dashboardData?.department?.id

  // Department-specific data
  const { data: departmentTeachersData } = useDepartmentTeachers(departmentId || 0)
  const { data: departmentSubjectsData } = useDepartmentSubjects(departmentId || 0)
  const { data: departmentPerformanceData } = useDepartmentPerformance(departmentId || 0)
  const { data: teacherAttendanceData } = useTeacherAttendance(departmentId || 0)

  const dashboard = dashboardData
  const department = dashboard?.department || {
    id: 0,
    name: "N/A",
    total_teachers: 0,
    total_subjects: 0,
    total_students: 0,
  }
  const stats = dashboard?.stats || {
    department_average: 0,
    teachers_present_today: 0,
    subjects_taught: 0,
    pending_approvals: 0,
  }

  const teachers = departmentTeachersData || []
  const subjects = departmentSubjectsData || []
  const performance = departmentPerformanceData
  const attendance = teacherAttendanceData
  const teacherPerformance = dashboard?.teacher_performance || []
  const subjectStatistics = dashboard?.subject_statistics || []
  const recentActivities = dashboard?.recent_activities || []

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
          <h1 className="text-3xl font-bold tracking-tight">HOD Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {dashboard?.user?.name || user?.name || "HOD"}!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {department.name}
          </Badge>
          <Badge variant="outline" className="text-sm">
            Head of Department
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{department.total_teachers}</div>
            <p className="text-xs text-muted-foreground">Department teachers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{department.total_subjects}</div>
            <p className="text-xs text-muted-foreground">Subjects taught</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{department.total_students}</div>
            <p className="text-xs text-muted-foreground">Students in department</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.department_average?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Overall performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teachers Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.teachers_present_today} / {department.total_teachers}
            </div>
            <p className="text-xs text-muted-foreground">Today's attendance</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Department Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Overview</CardTitle>
                  <CardDescription>{department.name} statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Teachers</p>
                      <p className="text-2xl font-bold">{department.total_teachers}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Subjects</p>
                      <p className="text-2xl font-bold">{department.total_subjects}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="text-2xl font-bold">{department.total_students}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Department Average</p>
                      <p className="text-2xl font-bold">{stats.department_average?.toFixed(1) || 0}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Teacher Performance */}
              {teacherPerformance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Teachers</CardTitle>
                    <CardDescription>Teachers with best performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teacherPerformance.slice(0, 5).map((teacher: any) => (
                        <div
                          key={teacher.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium">{teacher.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {teacher.student_count} students • {teacher.attendance_rate?.toFixed(1) || 0}%
                                attendance
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{teacher.average_score?.toFixed(1) || 0}%</p>
                            <Badge variant="outline">Average</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Subject Statistics */}
              {subjectStatistics.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Performance</CardTitle>
                    <CardDescription>Performance by subject</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subjectStatistics.map((subject: any) => (
                        <div
                          key={subject.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {subject.student_count} students • Pass rate: {subject.pass_rate?.toFixed(1) || 0}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{subject.average_score?.toFixed(1) || 0}%</p>
                            <Badge variant="outline">Average</Badge>
                          </div>
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
                  <Link
                    href={`/hod/teachers`}
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span>Manage Teachers</span>
                  </Link>
                  <Link
                    href={`/hod/subjects`}
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <BookOpen className="w-5 h-5 mr-3" />
                    <span>Manage Subjects</span>
                  </Link>
                  <Link
                    href={`/hod/performance`}
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <BarChart3 className="w-5 h-5 mr-3" />
                    <span>View Performance</span>
                  </Link>
                  <Link
                    href={`/hod/attendance`}
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 mr-3" />
                    <span>Teacher Attendance</span>
                  </Link>
                  <Link
                    href={`/hod/reports`}
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    <span>Generate Reports</span>
                  </Link>
                </CardContent>
              </Card>

              {/* Pending Approvals */}
              {stats.pending_approvals > 0 && (
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                      <AlertCircle className="h-5 w-5" />
                      Pending Approvals
                    </CardTitle>
                    <CardDescription className="text-orange-700 dark:text-orange-300">
                      {stats.pending_approvals} request{stats.pending_approvals !== 1 ? "s" : ""} need your
                      attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/hod/approvals">
                      <Button variant="outline" size="sm" className="w-full">
                        View Approvals
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Recent Activities */}
              {recentActivities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivities.slice(0, 5).map((activity: any) => (
                        <div key={activity.id} className="p-3 border rounded-lg">
                          <p className="font-medium text-sm">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.timestamp && format(new Date(activity.timestamp), "MMM dd, yyyy HH:mm")}
                            {activity.user && ` • ${activity.user}`}
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

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Teachers</CardTitle>
              <CardDescription>All teachers in {department.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {teachers.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {teachers.map((teacher: any) => (
                    <Card key={teacher.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{teacher.name}</CardTitle>
                        {teacher.qualification && (
                          <CardDescription>{teacher.qualification}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {teacher.email && (
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium text-sm">{teacher.email}</p>
                          </div>
                        )}
                        {teacher.subjects && teacher.subjects.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Subjects</p>
                            <div className="flex flex-wrap gap-1">
                              {teacher.subjects.map((subject: any) => (
                                <Badge key={subject.id} variant="outline" className="text-xs">
                                  {subject.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <Link href={`/hod/teachers/${teacher.id}`}>
                          <Button variant="outline" className="w-full" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No teachers found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Subjects</CardTitle>
              <CardDescription>All subjects in {department.name}</CardDescription>
            </CardHeader>
            <CardContent>
              {subjects.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {subjects.map((subject: any) => (
                    <Card key={subject.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        {subject.code && <CardDescription>Code: {subject.code}</CardDescription>}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Teachers</span>
                          <span className="font-medium">{subject.teacher_count || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Students</span>
                          <span className="font-medium">{subject.student_count || 0}</span>
                        </div>
                        <Link href={`/hod/subjects/${subject.id}`}>
                          <Button variant="outline" className="w-full" size="sm">
                            View Performance
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No subjects found</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          {performance ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>Overall department statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <p className="text-2xl font-bold">
                        {performance.statistics?.average_score?.toFixed(1) || 0}%
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                      <p className="text-2xl font-bold">
                        {performance.statistics?.pass_rate?.toFixed(1) || 0}%
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Teachers</p>
                      <p className="text-2xl font-bold">{performance.statistics?.total_teachers || 0}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Students</p>
                      <p className="text-2xl font-bold">{performance.statistics?.total_students || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {performance.teacher_performance && performance.teacher_performance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Teacher Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {performance.teacher_performance.map((teacher: any) => (
                        <div
                          key={teacher.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {teacher.student_count} students • {teacher.attendance_rate?.toFixed(1) || 0}%
                              attendance
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{teacher.average_score?.toFixed(1) || 0}%</p>
                            <Badge variant="outline">Average</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {performance.subject_performance && performance.subject_performance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {performance.subject_performance.map((subject: any) => (
                        <div
                          key={subject.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{subject.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {subject.student_count} students • Pass rate: {subject.pass_rate?.toFixed(1) || 0}%
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{subject.average_score?.toFixed(1) || 0}%</p>
                            <Badge variant="outline">Average</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No performance data available
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          {attendance ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Teacher Attendance Summary</CardTitle>
                  <CardDescription>Attendance statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  {attendance.summary && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Days</p>
                        <p className="text-2xl font-bold">{attendance.summary.total_days || 0}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Present</p>
                        <p className="text-2xl font-bold text-green-600">
                          {attendance.summary.present || 0}
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Absent</p>
                        <p className="text-2xl font-bold text-red-600">{attendance.summary.absent || 0}</p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        <p className="text-2xl font-bold">
                          {attendance.summary.attendance_rate?.toFixed(1) || 0}%
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {attendance.attendance && attendance.attendance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Attendance Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {attendance.attendance.slice(0, 10).map((record: any, index: number) => (
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
                              <p className="font-medium">{record.teacher_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {record.date && format(new Date(record.date), "MMM dd, yyyy")}
                                {record.check_in_time && ` • ${record.check_in_time}`}
                              </p>
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
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No attendance data available
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

