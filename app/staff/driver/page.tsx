"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useDriverDashboard } from "@/lib/api/dashboard"
import {
  useMyRoute,
  useMyStudents,
  useMarkStudentPickup,
  useMarkStudentDropoff,
  useStartTrip,
  useEndTrip,
  useMyTrips,
  useMyVehicle,
  useReportVehicleIssue,
  useMyMaintenance,
} from "@/lib/api/transport"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Bus,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  Fuel,
  Wrench,
  Play,
  Square,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

export default function DriverDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)

  // Dashboard data
  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useDriverDashboard()
  const { data: myRoute } = useMyRoute()
  const { data: myStudentsData } = useMyStudents()
  const { data: myTripsData } = useMyTrips()
  const { data: myVehicleData } = useMyVehicle()
  const { data: maintenanceData } = useMyMaintenance()

  // Mutations
  const markPickup = useMarkStudentPickup()
  const markDropoff = useMarkStudentDropoff()
  const startTrip = useStartTrip()
  const endTrip = useEndTrip()
  const reportIssue = useReportVehicleIssue()

  const dashboard = dashboardData
  const students = myStudentsData?.data || dashboard?.students_list || []
  const trips = myTripsData?.data || []
  const vehicle = myVehicleData?.data || dashboard?.vehicle
  const route = myRoute?.data || dashboard?.route
  const maintenance = maintenanceData?.data || []

  const handlePickup = async (studentId: number) => {
    try {
      const student = students.find((s: any) => s.id === studentId || s.student_id === studentId)
      await markPickup.mutateAsync({
        student_id: studentId,
        pickup_point_id: student?.pickup_point_id,
        pickup_time: new Date().toTimeString().slice(0, 8),
        status: "picked_up",
      })
      toast.success("Student pickup marked successfully")
      refetchDashboard()
    } catch (error: any) {
      console.error("Error marking pickup:", error)
      let errorMessage = "Failed to mark pickup"
      if (error?.response?.data) {
        const data = error.response.data
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        } else if (data.messages) {
          const messages = data.messages
          const errorMessages = Object.entries(messages).map(([field, msg]: [string, any]) => {
            const message = Array.isArray(msg) ? msg.join(", ") : msg
            return `${field}: ${message}`
          })
          errorMessage = errorMessages.join("; ")
        } else {
          errorMessage = data.message || data.error || data.detail || errorMessage
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleDropoff = async (studentId: number) => {
    try {
      const student = students.find((s: any) => s.id === studentId || s.student_id === studentId)
      await markDropoff.mutateAsync({
        student_id: studentId,
        dropoff_point_id: student?.dropoff_point_id,
        dropoff_time: new Date().toTimeString().slice(0, 8),
        status: "dropped_off",
      })
      toast.success("Student dropoff marked successfully")
      refetchDashboard()
    } catch (error: any) {
      console.error("Error marking dropoff:", error)
      let errorMessage = "Failed to mark dropoff"
      if (error?.response?.data) {
        const data = error.response.data
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        } else if (data.messages) {
          const messages = data.messages
          const errorMessages = Object.entries(messages).map(([field, msg]: [string, any]) => {
            const message = Array.isArray(msg) ? msg.join(", ") : msg
            return `${field}: ${message}`
          })
          errorMessage = errorMessages.join("; ")
        } else {
          errorMessage = data.message || data.error || data.detail || errorMessage
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleStartTrip = async () => {
    try {
      await startTrip.mutateAsync({
        route_id: route?.id,
        vehicle_id: vehicle?.id,
      })
      toast.success("Trip started successfully")
      refetchDashboard()
    } catch (error: any) {
      console.error("Error starting trip:", error)
      let errorMessage = "Failed to start trip"
      if (error?.response?.data) {
        const data = error.response.data
        errorMessage = data.message || data.error || data.detail || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleEndTrip = async () => {
    try {
      await endTrip.mutateAsync({})
      toast.success("Trip ended successfully")
      refetchDashboard()
    } catch (error: any) {
      console.error("Error ending trip:", error)
      let errorMessage = "Failed to end trip"
      if (error?.response?.data) {
        const data = error.response.data
        errorMessage = data.message || data.error || data.detail || errorMessage
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleReportIssue = async () => {
    if (!vehicle?.id) {
      toast.error("No vehicle assigned")
      return
    }

    const issueType = prompt("Enter issue type (e.g., Engine, Brakes, Tires):")
    if (!issueType) return

    const description = prompt("Enter issue description:")
    if (!description) return

    try {
      await reportIssue.mutateAsync({
        id: vehicle.id,
        data: {
          issue_type: issueType,
          description,
          severity: "medium",
        },
      })
      toast.success("Vehicle issue reported successfully")
      refetchDashboard()
    } catch (error: any) {
      console.error("Error reporting issue:", error)
      let errorMessage = "Failed to report issue"
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

  const stats = dashboard?.stats || {
    today_trips: 0,
    students_today: 0,
    total_trips_this_month: 0,
    pending_maintenance: false,
    fuel_status: "N/A",
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {dashboard?.user?.name || user?.name}</p>
        </div>
        <Badge variant="outline">Driver</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Trips</CardTitle>
            <Bus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today_trips}</div>
            <p className="text-xs text-muted-foreground">Trips completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.students_today}</div>
            <p className="text-xs text-muted-foreground">Total students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Trips</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_trips_this_month}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fuel Status</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fuel_status}</div>
            <p className="text-xs text-muted-foreground">Current level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending_maintenance ? "⚠️" : "✓"}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pending_maintenance ? "Pending" : "All good"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="route">My Route</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="trips">Trip History</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Vehicle Info */}
            {vehicle && (
              <Card>
                <CardHeader>
                  <CardTitle>Assigned Vehicle</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle</p>
                      <p className="font-medium">{vehicle.name || vehicle.plate_number}</p>
                    </div>
                    <Badge variant={vehicle.status === "active" ? "default" : "secondary"}>
                      {vehicle.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Plate Number</p>
                      <p className="font-medium">{vehicle.plate_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="font-medium">{vehicle.capacity} seats</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleReportIssue}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Report Issue
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Route Info */}
            {route && (
              <Card>
                <CardHeader>
                  <CardTitle>My Route</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Route Name</p>
                    <p className="font-medium">{route.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Students</p>
                      <p className="font-medium">{route.students_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pickup Points</p>
                      <p className="font-medium">{route.pickup_points}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Today's Schedule */}
          {dashboard?.today_schedule && dashboard.today_schedule.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dashboard.today_schedule.map((schedule: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{schedule.time}</p>
                          <p className="text-sm text-muted-foreground">{schedule.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={schedule.type === "pickup" ? "default" : "secondary"}>
                          {schedule.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {schedule.students_count} students
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button onClick={handleStartTrip}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Trip
                </Button>
                <Button variant="outline" onClick={handleEndTrip}>
                  <Square className="w-4 h-4 mr-2" />
                  End Trip
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Route Tab */}
        <TabsContent value="route" className="space-y-4">
          {route ? (
            <Card>
              <CardHeader>
                <CardTitle>Route Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Route Name</p>
                  <p className="font-medium text-lg">{route.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="font-medium">{route.students_count}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup Points</p>
                    <p className="font-medium">{route.pickup_points}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No route assigned
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Students on My Route</CardTitle>
              <CardDescription>Mark pickup and dropoff for students</CardDescription>
            </CardHeader>
            <CardContent>
              {students.length > 0 ? (
                <div className="space-y-2">
                  {students.map((student: any) => {
                    const studentId = student.id || student.student_id
                    const studentName = student.name || student.student?.name
                    const admissionNumber =
                      student.admission_number || student.student?.admission_number
                    const pickupPoint = student.pickup_point || student.pickup_location
                    const pickupTime = student.pickup_time
                    const status = student.status || student.attendance_status

                    return (
                      <div
                        key={studentId}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{studentName}</p>
                            <Badge variant="outline" className="text-xs">
                              {admissionNumber}
                            </Badge>
                            {status && (
                              <Badge
                                variant={
                                  status === "picked_up" || status === "dropped_off"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {status}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 space-y-1">
                            {pickupPoint && (
                              <p className="text-sm text-muted-foreground">
                                <MapPin className="w-3 h-3 inline mr-1" />
                                {pickupPoint}
                              </p>
                            )}
                            {pickupTime && (
                              <p className="text-sm text-muted-foreground">
                                <Clock className="w-3 h-3 inline mr-1" />
                                {pickupTime}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePickup(studentId)}
                          >
                            <ArrowUp className="w-4 h-4 mr-1" />
                            Pickup
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDropoff(studentId)}
                          >
                            <ArrowDown className="w-4 h-4 mr-1" />
                            Dropoff
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No students assigned</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trip History Tab */}
        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trip History</CardTitle>
              <CardDescription>View your past trips</CardDescription>
            </CardHeader>
            <CardContent>
              {trips.length > 0 ? (
                <div className="space-y-2">
                  {trips.map((trip: any) => (
                    <div key={trip.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {trip.route_name || trip.route?.name || "Trip"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {trip.start_time && format(new Date(trip.start_time), "MMM dd, yyyy HH:mm")}
                            {trip.end_time && ` - ${format(new Date(trip.end_time), "HH:mm")}`}
                          </p>
                        </div>
                        <Badge variant={trip.status === "completed" ? "default" : "secondary"}>
                          {trip.status}
                        </Badge>
                      </div>
                      {trip.students_count && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {trip.students_count} students transported
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No trips recorded</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vehicle Tab */}
        <TabsContent value="vehicle" className="space-y-4">
          {vehicle ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle Name</p>
                      <p className="font-medium">{vehicle.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Plate Number</p>
                      <p className="font-medium">{vehicle.plate_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Make & Model</p>
                      <p className="font-medium">
                        {vehicle.make} {vehicle.model}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="font-medium">{vehicle.capacity} seats</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={vehicle.status === "active" ? "default" : "secondary"}>
                        {vehicle.status}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fuel Status</p>
                      <p className="font-medium">{stats.fuel_status}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleReportIssue}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Report Vehicle Issue
                  </Button>
                </CardContent>
              </Card>

              {/* Maintenance Schedule */}
              {maintenance.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {maintenance.map((item: any) => (
                        <div key={item.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{item.type || item.maintenance_type}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.description || item.notes}
                              </p>
                            </div>
                            <div className="text-right">
                              {item.due_date && (
                                <p className="text-sm font-medium">
                                  {format(new Date(item.due_date), "MMM dd, yyyy")}
                                </p>
                              )}
                              <Badge
                                variant={
                                  item.status === "pending" || item.status === "overdue"
                                    ? "destructive"
                                    : "default"
                                }
                              >
                                {item.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No vehicle assigned
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
