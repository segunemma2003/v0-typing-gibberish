"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { usePrincipalDashboard } from "@/lib/api/dashboard"
import {
  usePendingApprovals,
  useApproveLeaveRequest,
  useRejectLeaveRequest,
  useApproveExpense,
  useRejectExpense,
  useDisciplinaryCases,
  useReviewDisciplinaryCase,
  useClassPerformanceReport,
  useTeacherPerformance,
  useDepartmentPerformance,
  useStaffOverview,
  useSendSchoolWideAnnouncement,
} from "@/lib/api/principal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Users,
  TrendingUp,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Award,
  BarChart3,
  Building2,
  UserCheck,
  XCircle,
  MessageSquare,
  Send,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import Link from "next/link"

export default function PrincipalDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Dashboard data
  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = usePrincipalDashboard()
  const { data: pendingApprovalsData } = usePendingApprovals()
  const { data: disciplinaryCasesData } = useDisciplinaryCases()
  const { data: classPerformanceData } = useClassPerformanceReport()
  const { data: teacherPerformanceData } = useTeacherPerformance()
  const { data: departmentPerformanceData } = useDepartmentPerformance()
  const { data: staffOverviewData } = useStaffOverview()

  // Mutations
  const approveLeave = useApproveLeaveRequest()
  const rejectLeave = useRejectLeaveRequest()
  const approveExpense = useApproveExpense()
  const rejectExpense = useRejectExpense()
  const reviewCase = useReviewDisciplinaryCase()
  const sendAnnouncement = useSendSchoolWideAnnouncement()

  const dashboard = dashboardData
  const schoolOverview = dashboard?.school_overview || {
    total_students: 0,
    total_teachers: 0,
    total_staff: 0,
    total_classes: 0,
    student_teacher_ratio: 0,
  }
  const academicPerformance = dashboard?.academic_performance || {
    overall_average: 0,
    top_performing_class: "N/A",
    pass_rate: 0,
  }
  const attendance = dashboard?.attendance || {
    student_attendance_today: 0,
    teacher_attendance_today: 0,
    absent_students: 0,
    absent_teachers: 0,
  }
  const pendingApprovals = dashboard?.pending_approvals || {
    leave_requests: 0,
    disciplinary_cases: 0,
    expense_approvals: 0,
  }
  const recentActivities = dashboard?.recent_activities || []

  const approvals = pendingApprovalsData?.data || []
  const disciplinaryCases = disciplinaryCasesData?.data || []
  const classPerformance = classPerformanceData?.data || []
  const teacherPerformance = teacherPerformanceData?.data || []
  const departmentPerformance = departmentPerformanceData?.data || []
  const staffOverview = staffOverviewData?.data

  const handleApproveLeave = async (id: number) => {
    try {
      await approveLeave.mutateAsync({ id })
      toast.success("Leave request approved successfully")
      refetchDashboard()
    } catch (error: any) {
      console.error("Error approving leave:", error)
      let errorMessage = "Failed to approve leave request"
      if (error?.response?.data) {
        const data = error.response.data
        errorMessage = data.message || data.error || data.detail || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleRejectLeave = async (id: number) => {
    const reason = prompt("Enter rejection reason:")
    if (!reason) return

    try {
      await rejectLeave.mutateAsync({ id, data: { reason } })
      toast.success("Leave request rejected")
      refetchDashboard()
    } catch (error: any) {
      console.error("Error rejecting leave:", error)
      let errorMessage = "Failed to reject leave request"
      if (error?.response?.data) {
        const data = error.response.data
        errorMessage = data.message || data.error || data.detail || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleApproveExpense = async (id: number) => {
    try {
      await approveExpense.mutateAsync({ id })
      toast.success("Expense approved successfully")
      refetchDashboard()
    } catch (error: any) {
      console.error("Error approving expense:", error)
      let errorMessage = "Failed to approve expense"
      if (error?.response?.data) {
        const data = error.response.data
        errorMessage = data.message || data.error || data.detail || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleRejectExpense = async (id: number) => {
    const reason = prompt("Enter rejection reason:")
    if (!reason) return

    try {
      await rejectExpense.mutateAsync({ id, data: { reason } })
      toast.success("Expense rejected")
      refetchDashboard()
    } catch (error: any) {
      console.error("Error rejecting expense:", error)
      let errorMessage = "Failed to reject expense"
      if (error?.response?.data) {
        const data = error.response.data
        errorMessage = data.message || data.error || data.detail || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleReviewCase = async (id: number, action: string) => {
    const notes = prompt("Enter review notes:")
    if (!notes) return

    try {
      await reviewCase.mutateAsync({
        id,
        data: {
          action,
          notes,
          status: action === "resolve" ? "resolved" : "reviewed",
        },
      })
      toast.success("Disciplinary case reviewed successfully")
      refetchDashboard()
    } catch (error: any) {
      console.error("Error reviewing case:", error)
      let errorMessage = "Failed to review case"
      if (error?.response?.data) {
        const data = error.response.data
        errorMessage = data.message || data.error || data.detail || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Principal Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {dashboard?.user?.name || user?.name}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {dashboard?.user?.role || "Principal"}
        </Badge>
      </div>

      {/* School Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolOverview.total_students.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolOverview.total_teachers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active teachers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolOverview.total_staff.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All staff members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolOverview.total_classes}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student:Teacher Ratio</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schoolOverview.student_teacher_ratio.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* Academic Performance & Attendance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <Award className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{academicPerformance.overall_average.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">School average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{academicPerformance.pass_rate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Overall pass rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendance.student_attendance_today.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {attendance.absent_students} absent today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teacher Attendance</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendance.teacher_attendance_today.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {attendance.absent_teachers} absent today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Alert */}
      {(pendingApprovals.leave_requests > 0 ||
        pendingApprovals.disciplinary_cases > 0 ||
        pendingApprovals.expense_approvals > 0) && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertCircle className="h-5 w-5" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-orange-700 dark:text-orange-300">Leave Requests</p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {pendingApprovals.leave_requests}
                </p>
              </div>
              <div>
                <p className="text-sm text-orange-700 dark:text-orange-300">Disciplinary Cases</p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {pendingApprovals.disciplinary_cases}
                </p>
              </div>
              <div>
                <p className="text-sm text-orange-700 dark:text-orange-300">Expense Approvals</p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                  {pendingApprovals.expense_approvals}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setActiveTab("approvals")}
            >
              Review Approvals
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="disciplinary">Disciplinary</TabsTrigger>
          <TabsTrigger value="activities">Recent Activities</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Top Performing Class */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Class</CardTitle>
                  <CardDescription>Best performing class this term</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{academicPerformance.top_performing_class}</p>
                      <p className="text-sm text-muted-foreground mt-1">Leading class</p>
                    </div>
                    <Award className="w-12 h-12 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              {/* Department Performance */}
              {departmentPerformance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Department Performance</CardTitle>
                    <CardDescription>Performance by department</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {departmentPerformance.slice(0, 5).map((dept: any) => (
                        <div
                          key={dept.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{dept.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {dept.student_count} students • {dept.teacher_count} teachers
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{dept.average_score.toFixed(1)}%</p>
                            <p className="text-xs text-muted-foreground">
                              {dept.pass_rate.toFixed(1)}% pass rate
                            </p>
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
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const title = prompt("Announcement title:")
                      if (!title) return
                      const content = prompt("Announcement content:")
                      if (!content) return

                      sendAnnouncement.mutate(
                        { title, content, priority: "high" },
                        {
                          onSuccess: () => {
                            toast.success("Announcement sent successfully")
                          },
                          onError: (error: any) => {
                            toast.error(error?.response?.data?.message || "Failed to send announcement")
                          },
                        }
                      )
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Announcement
                  </Button>
                  <Link href="/admin/reports">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Reports
                    </Button>
                  </Link>
                  <Link href="/admin/students">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Students
                    </Button>
                  </Link>
                  <Link href="/admin/teachers">
                    <Button variant="outline" className="w-full justify-start">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Manage Teachers
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          {/* Class Performance */}
          {classPerformance.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Class Performance Report</CardTitle>
                <CardDescription>Performance by class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {classPerformance.map((classPerf: any) => (
                    <div
                      key={classPerf.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-lg">
                          #{classPerf.rank}
                        </Badge>
                        <div>
                          <p className="font-medium">{classPerf.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {classPerf.total_students} students
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{classPerf.average_score.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">
                          {classPerf.pass_rate.toFixed(1)}% pass rate
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Teacher Performance */}
          {teacherPerformance.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Teacher Performance</CardTitle>
                <CardDescription>Performance by teacher</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacherPerformance.slice(0, 10).map((teacher: any) => (
                    <div
                      key={teacher.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{teacher.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {teacher.department} • {teacher.student_count} students •{" "}
                          {teacher.subject_count} subjects
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{teacher.average_score.toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">
                          {teacher.attendance_rate.toFixed(1)}% attendance
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Items awaiting your approval</CardDescription>
            </CardHeader>
            <CardContent>
              {approvals.length > 0 ? (
                <div className="space-y-3">
                  {approvals.map((approval: any) => (
                    <div
                      key={approval.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium">{approval.title || approval.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {approval.type} • Requested by {approval.requested_by} •{" "}
                            {approval.requested_at &&
                              format(new Date(approval.requested_at), "MMM dd, yyyy")}
                          </p>
                          {approval.amount && (
                            <p className="text-sm font-medium mt-1">
                              Amount: ₦{approval.amount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {approval.type === "leave_request" ? (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApproveLeave(approval.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectLeave(approval.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        ) : approval.type === "expense" ? (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleApproveExpense(approval.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectExpense(approval.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
                  <p>No pending approvals</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Disciplinary Tab */}
        <TabsContent value="disciplinary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Disciplinary Cases</CardTitle>
              <CardDescription>Cases requiring review</CardDescription>
            </CardHeader>
            <CardContent>
              {disciplinaryCases.length > 0 ? (
                <div className="space-y-3">
                  {disciplinaryCases.map((caseItem: any) => (
                    <div
                      key={caseItem.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircle
                          className={`w-5 h-5 ${
                            caseItem.severity === "critical"
                              ? "text-red-600"
                              : caseItem.severity === "high"
                              ? "text-orange-600"
                              : "text-yellow-600"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{caseItem.student_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {caseItem.case_type} • Reported by {caseItem.reported_by} •{" "}
                            {caseItem.reported_at &&
                              format(new Date(caseItem.reported_at), "MMM dd, yyyy")}
                          </p>
                          <p className="text-sm mt-1">{caseItem.description}</p>
                          <Badge
                            variant={
                              caseItem.severity === "critical"
                                ? "destructive"
                                : caseItem.severity === "high"
                                ? "default"
                                : "secondary"
                            }
                            className="mt-1"
                          >
                            {caseItem.severity}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReviewCase(caseItem.id, "review")}
                        >
                          Review
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleReviewCase(caseItem.id, "resolve")}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
                  <p>No disciplinary cases</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Activities Tab */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest school activities</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-3">
                  {recentActivities.map((activity: any) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timestamp && format(new Date(activity.timestamp), "MMM dd, yyyy HH:mm")}
                          {activity.user && ` • ${activity.user}`}
                        </p>
                      </div>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No recent activities</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

