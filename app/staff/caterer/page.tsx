"use client"

import { useAuth } from "@/hooks/use-auth"
import { useStaffDashboard } from "@/lib/api/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, UtensilsCrossed, Clock, CheckCircle, Users } from "lucide-react"

export default function CatererDashboard() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading } = useStaffDashboard("caterer")

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
          <h1 className="text-3xl font-bold tracking-tight">Caterer Dashboard</h1>
          <p className="text-muted-foreground">Manage meal preparation and food service</p>
        </div>
        <Badge variant="outline">Caterer</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Meals</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.total_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">Meals to prepare</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dashboard?.completed_tasks || 0}</div>
            <p className="text-xs text-muted-foreground">Prepared today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Served</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Today's count</p>
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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meal Service Responsibilities</CardTitle>
          <CardDescription>Your catering duties and schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Prepare meals according to schedule</p>
            <p>• Maintain food hygiene standards</p>
            <p>• Serve students and staff</p>
            <p>• Manage kitchen inventory</p>
            <p>• Ensure nutritional meal quality</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

