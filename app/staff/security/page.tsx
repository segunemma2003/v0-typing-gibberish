"use client"

import { useAuth } from "@/hooks/use-auth"
import { useStaffDashboard } from "@/lib/api/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield, Clock, CheckCircle, AlertCircle, Users } from "lucide-react"

export default function SecurityDashboard() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading } = useStaffDashboard("security")

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
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor school security and access control</p>
        </div>
        <Badge variant="outline">Security</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Shifts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.total_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">Scheduled shifts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboard?.completed_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">Shifts completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">0</div>
            <p className="text-xs text-muted-foreground">Reported today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Checked in today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Security Activities</CardTitle>
          <CardDescription>Your security duties and responsibilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Monitor school entrance and exits</p>
            <p>• Control visitor access</p>
            <p>• Patrol school premises</p>
            <p>• Report security incidents</p>
            <p>• Ensure student safety during school hours</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

