"use client"

import { useAuth } from "@/hooks/use-auth"
import { useStaffDashboard } from "@/lib/api/dashboard"
import { useStaff } from "@/lib/api/staff"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Briefcase, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { getRoleDisplayName } from "@/lib/auth"

export default function StaffDashboard() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading } = useStaffDashboard()
  const { data: staffData } = useStaff({ role: "staff" })

  const dashboard = dashboardData?.dashboard
  const staff = Array.isArray(staffData?.data) ? staffData.data : []
  const currentStaff = staff.find((s: any) => s.id === Number(user?.id) || s.email === user?.email)

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
          <h1 className="text-3xl font-bold tracking-tight">Staff Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's an overview of your tasks and activities.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {getRoleDisplayName(user?.role as any)}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.total_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">Assigned tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboard?.completed_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">Finished tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{dashboard?.pending_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{currentStaff?.department || "N/A"}</div>
            <p className="text-xs text-muted-foreground">{currentStaff?.position || "Position"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      {dashboard?.recent_activities && dashboard.recent_activities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your recent work activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboard.recent_activities.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : ""}
                    </p>
                  </div>
                  <Badge variant="outline">{activity.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

