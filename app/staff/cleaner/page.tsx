"use client"

import { useAuth } from "@/hooks/use-auth"
import { useStaffDashboard } from "@/lib/api/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function CleanerDashboard() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading } = useStaffDashboard("cleaner")

  const dashboard = dashboardData?.dashboard

  if (dashboardLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cleaner Dashboard</h1>
          <p className="text-muted-foreground">Manage cleaning tasks and maintenance schedules</p>
        </div>
        <Badge variant="outline">Cleaner</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.total_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">Assigned areas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboard?.completed_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">Cleaned today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{dashboard?.pending_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">Remaining tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Areas Covered</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.completed_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">Of {dashboard?.total_tasks || 0} assigned</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cleaning Responsibilities</CardTitle>
          <CardDescription>Your assigned cleaning areas and duties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Clean classrooms and common areas</p>
            <p>• Maintain restroom facilities</p>
            <p>• Dispose of waste properly</p>
            <p>• Report maintenance issues</p>
            <p>• Ensure clean and safe environment</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

