"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useSecurityDashboard } from "@/lib/api/dashboard"
import {
  useActiveVisitors,
  useVehiclesOnCampus,
  useIncidents,
  usePatrolSchedule,
  useLostItems,
} from "@/lib/api/security"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Shield,
  Users,
  Car,
  Ticket,
  AlertTriangle,
  MapPin,
  Camera,
  Search,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function SecurityDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useSecurityDashboard()
  const { data: activeVisitorsData } = useActiveVisitors()
  const { data: vehiclesOnCampusData } = useVehiclesOnCampus()
  const { data: incidentsData } = useIncidents({ status: "open" })
  const { data: patrolScheduleData } = usePatrolSchedule()
  const { data: lostItemsData } = useLostItems({ status: "lost" })

  const dashboard = dashboardData
  const stats = dashboard?.stats || {
    visitors_today: 0,
    vehicles_in_campus: 0,
    gate_passes_issued: 0,
    incidents_this_week: 0,
    patrol_checkpoints: 0,
    cctv_cameras_active: 0,
    cctv_cameras_inactive: 0,
  }

  const currentVisitors = dashboard?.current_visitors || activeVisitorsData || []
  const recentIncidents = dashboard?.recent_incidents || incidentsData || []
  const patrolSchedule = dashboard?.patrol_schedule || patrolScheduleData || []
  const vehicles = vehiclesOnCampusData || []
  const lostItems = lostItemsData || []

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
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {dashboard?.user?.name || user?.name || "Security"}!
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Security
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors Today</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.visitors_today}</div>
            <p className="text-xs text-muted-foreground">Total visitors</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles on Campus</CardTitle>
            <Car className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.vehicles_in_campus}</div>
            <p className="text-xs text-muted-foreground">Currently parked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gate Passes</CardTitle>
            <Ticket className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.gate_passes_issued}</div>
            <p className="text-xs text-muted-foreground">Issued today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.incidents_this_week}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patrol Checkpoints</CardTitle>
            <MapPin className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.patrol_checkpoints}</div>
            <p className="text-xs text-muted-foreground">Total checkpoints</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CCTV Active</CardTitle>
            <Camera className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.cctv_cameras_active}</div>
            <p className="text-xs text-muted-foreground">Cameras online</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CCTV Inactive</CardTitle>
            <Camera className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cctv_cameras_inactive}</div>
            <p className="text-xs text-muted-foreground">Cameras offline</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="patrol">Patrol</TabsTrigger>
          <TabsTrigger value="lost-found">Lost & Found</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Current Visitors */}
              {currentVisitors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Current Visitors</CardTitle>
                    <CardDescription>Visitors currently on campus</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentVisitors.map((visitor: any) => (
                        <div
                          key={visitor.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{visitor.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {visitor.purpose} • Meeting: {visitor.person_to_see}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Entry:{" "}
                              {visitor.entry_time && format(new Date(visitor.entry_time), "HH:mm")}
                            </p>
                          </div>
                          <Badge variant="default">Active</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Incidents */}
              {recentIncidents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Incidents</CardTitle>
                    <CardDescription>Latest security incidents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentIncidents.map((incident: any) => (
                        <div
                          key={incident.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{incident.type}</p>
                              <Badge
                                variant={
                                  incident.severity === "critical"
                                    ? "destructive"
                                    : incident.severity === "high"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {incident.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {incident.location} •{" "}
                              {incident.reported_time &&
                                format(new Date(incident.reported_time), "MMM dd, yyyy HH:mm")}
                            </p>
                          </div>
                          <Badge variant="outline">{incident.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Vehicles on Campus */}
              {vehicles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Vehicles on Campus</CardTitle>
                    <CardDescription>Currently parked vehicles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {vehicles.map((vehicle: any) => (
                        <div
                          key={vehicle.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{vehicle.vehicle_number}</p>
                            {vehicle.owner_name && (
                              <p className="text-sm text-muted-foreground">
                                Owner: {vehicle.owner_name} • Entry:{" "}
                                {vehicle.entry_time && format(new Date(vehicle.entry_time), "HH:mm")}
                              </p>
                            )}
                          </div>
                          <Badge variant="default">On Campus</Badge>
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
                    href="/staff/security/visitors/register"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span>Register Visitor</span>
                  </Link>
                  <Link
                    href="/staff/security/gate-passes/issue"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Ticket className="w-5 h-5 mr-3" />
                    <span>Issue Gate Pass</span>
                  </Link>
                  <Link
                    href="/staff/security/incidents/report"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    <span>Report Incident</span>
                  </Link>
                  <Link
                    href="/staff/security/vehicles/entry"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Car className="w-5 h-5 mr-3" />
                    <span>Log Vehicle Entry</span>
                  </Link>
                  <Link
                    href="/staff/security/patrols/check"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <MapPin className="w-5 h-5 mr-3" />
                    <span>Record Patrol</span>
                  </Link>
                  <Link
                    href="/staff/security/lost-found/register"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Search className="w-5 h-5 mr-3" />
                    <span>Register Lost Item</span>
                  </Link>
                </CardContent>
              </Card>

              {/* CCTV Status */}
              <Card>
                <CardHeader>
                  <CardTitle>CCTV Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Active Cameras</span>
                    </div>
                    <span className="font-bold text-green-600">{stats.cctv_cameras_active}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Inactive Cameras</span>
                    </div>
                    <span className="font-bold text-red-600">{stats.cctv_cameras_inactive}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Total: {stats.cctv_cameras_active + stats.cctv_cameras_inactive} cameras
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Visitors Tab */}
        <TabsContent value="visitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Visitors</CardTitle>
              <CardDescription>Visitors currently on campus</CardDescription>
            </CardHeader>
            <CardContent>
              {currentVisitors.length > 0 ? (
                <div className="space-y-3">
                  {currentVisitors.map((visitor: any) => (
                    <div
                      key={visitor.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{visitor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {visitor.phone} • {visitor.purpose}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Meeting: {visitor.person_to_see} • Entry:{" "}
                          {visitor.entry_time && format(new Date(visitor.entry_time), "MMM dd, yyyy HH:mm")}
                        </p>
                        {visitor.vehicle_number && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Vehicle: {visitor.vehicle_number}
                          </p>
                        )}
                      </div>
                      <Badge variant="default">Active</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No active visitors</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicles Tab */}
        <TabsContent value="vehicles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicles on Campus</CardTitle>
              <CardDescription>Currently parked vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              {vehicles.length > 0 ? (
                <div className="space-y-3">
                  {vehicles.map((vehicle: any) => (
                    <div
                      key={vehicle.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{vehicle.vehicle_number}</p>
                        {vehicle.owner_name && (
                          <p className="text-sm text-muted-foreground">
                            Owner: {vehicle.owner_name} {vehicle.owner_phone && `• ${vehicle.owner_phone}`}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Entry: {vehicle.entry_time && format(new Date(vehicle.entry_time), "MMM dd, yyyy HH:mm")}
                          {vehicle.purpose && ` • ${vehicle.purpose}`}
                        </p>
                      </div>
                      <Badge variant="default">On Campus</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No vehicles on campus</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Incidents</CardTitle>
              <CardDescription>Open and recent incidents</CardDescription>
            </CardHeader>
            <CardContent>
              {recentIncidents.length > 0 ? (
                <div className="space-y-3">
                  {recentIncidents.map((incident: any) => (
                    <div key={incident.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{incident.type}</p>
                          <Badge
                            variant={
                              incident.severity === "critical"
                                ? "destructive"
                                : incident.severity === "high"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {incident.severity}
                          </Badge>
                        </div>
                        <Badge variant="outline">{incident.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {incident.location}
                        </span>
                        <span>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {incident.reported_time &&
                            format(new Date(incident.reported_time), "MMM dd, yyyy HH:mm")}
                        </span>
                      </div>
                      {incident.action_taken && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Action: {incident.action_taken}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No incidents reported</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Patrol Tab */}
        <TabsContent value="patrol" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patrol Schedule</CardTitle>
              <CardDescription>Security patrol checkpoints</CardDescription>
            </CardHeader>
            <CardContent>
              {patrolSchedule.length > 0 ? (
                <div className="space-y-3">
                  {patrolSchedule.map((patrol: any) => (
                    <div
                      key={patrol.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{patrol.checkpoint}</p>
                        <p className="text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {patrol.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Scheduled:{" "}
                          {patrol.scheduled_time &&
                            format(new Date(patrol.scheduled_time), "MMM dd, yyyy HH:mm")}
                          {patrol.frequency && ` • ${patrol.frequency}`}
                        </p>
                      </div>
                      <Badge
                        variant={
                          patrol.status === "completed"
                            ? "default"
                            : patrol.status === "missed"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {patrol.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No patrol schedule</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lost & Found Tab */}
        <TabsContent value="lost-found" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lost & Found</CardTitle>
              <CardDescription>Unclaimed items</CardDescription>
            </CardHeader>
            <CardContent>
              {lostItems.length > 0 ? (
                <div className="space-y-3">
                  {lostItems.map((item: any) => (
                    <div key={item.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{item.item_name}</p>
                        <Badge variant="outline">{item.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>
                          <MapPin className="w-3 h-3 inline mr-1" />
                          Found at: {item.location_found}
                        </span>
                        <span>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {item.found_date && format(new Date(item.found_date), "MMM dd, yyyy")}
                        </span>
                      </div>
                      {item.category && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {item.category}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No lost items</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
