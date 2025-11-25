"use client"

import { useAuth } from "@/hooks/use-auth"
import { useStaffDashboard } from "@/lib/api/dashboard"
import { useTransportVehicles, useTransportRoutes } from "@/lib/api/transport"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Bus, MapPin, Users, Clock, CheckCircle } from "lucide-react"

export default function DriverDashboard() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading } = useStaffDashboard("driver")
  const { data: vehiclesData } = useTransportVehicles()
  const { data: routesData } = useTransportRoutes()

  const dashboard = dashboardData?.dashboard
  const vehicles = Array.isArray(vehiclesData?.data) ? vehiclesData.data : (vehiclesData?.vehicles?.data || [])
  const routes = Array.isArray(routesData?.data) ? routesData.data : (vehiclesData?.routes?.data || [])

  // Filter driver's assigned vehicle and routes
  const assignedVehicle = vehicles.find((v: any) => v.driver_id === Number(user?.id) || v.driver?.id === Number(user?.id))
  const assignedRoutes = routes.filter((r: any) => r.driver_id === Number(user?.id) || r.driver?.id === Number(user?.id))

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
          <h1 className="text-3xl font-bold tracking-tight">Driver Dashboard</h1>
          <p className="text-muted-foreground">Manage your routes, vehicles, and transport schedule</p>
        </div>
        <Badge variant="outline">Driver</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Vehicle</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedVehicle ? "1" : "0"}</div>
            <p className="text-xs text-muted-foreground">{assignedVehicle?.plate_number || "No vehicle assigned"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedRoutes.length}</div>
            <p className="text-xs text-muted-foreground">Routes assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Transported</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assignedRoutes.reduce((sum: number, r: any) => sum + (r.students_count || 0), 0)}</div>
            <p className="text-xs text-muted-foreground">Total students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Trips</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.total_tasks || assignedRoutes.length}</div>
            <p className="text-xs text-muted-foreground">Scheduled trips</p>
          </CardContent>
        </Card>
      </div>

      {assignedVehicle && (
        <Card>
          <CardHeader>
            <CardTitle>Assigned Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <p className="font-medium">{assignedVehicle.plate_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-medium">{assignedVehicle.model || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">{assignedVehicle.capacity || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={assignedVehicle.status === "active" ? "default" : "secondary"}>
                  {assignedVehicle.status || "active"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {assignedRoutes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>My Routes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignedRoutes.map((route: any) => (
                <div key={route.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{route.name || route.route_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {route.start_point} → {route.end_point}
                      </p>
                    </div>
                    <Badge variant="outline">{route.students_count || 0} students</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

