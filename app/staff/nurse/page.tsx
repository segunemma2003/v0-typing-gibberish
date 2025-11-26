"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useNurseDashboard } from "@/lib/api/dashboard"
import {
  useTodayMedications,
  useChronicConditions,
  useVaccinationSchedule,
  useSupplies,
} from "@/lib/api/health"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  Heart,
  Clock,
  AlertCircle,
  Users,
  CheckCircle,
  Pill,
  Syringe,
  Package,
  Activity,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function NurseDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Dashboard data
  const { data: dashboardData, isLoading: dashboardLoading } = useNurseDashboard()
  const { data: todayMedicationsData } = useTodayMedications()
  const { data: chronicConditionsData } = useChronicConditions()
  const { data: vaccinationScheduleData } = useVaccinationSchedule({ upcoming: true })
  const { data: suppliesData } = useSupplies({ status: "low_stock" })

  const dashboard = dashboardData
  const stats = dashboard?.stats || {
    clinic_visits_today: 0,
    students_with_chronic_conditions: 0,
    medications_due_today: 0,
    pending_vaccinations: 0,
    first_aid_cases_this_week: 0,
    medical_supplies_low: 0,
  }

  const todayAppointments = dashboard?.today_appointments || []
  const medicationSchedule = dashboard?.medication_schedule || []
  const recentCases = dashboard?.recent_cases || []
  const medications = todayMedicationsData || []
  const chronicConditions = chronicConditionsData || []
  const pendingVaccinations = vaccinationScheduleData || []
  const lowStockSupplies = suppliesData || []

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
          <h1 className="text-3xl font-bold tracking-tight">Nurse Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {dashboard?.user?.name || user?.name || "Nurse"}!
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Nurse
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clinic Visits Today</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clinic_visits_today}</div>
            <p className="text-xs text-muted-foreground">Medical visits</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chronic Conditions</CardTitle>
            <Activity className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.students_with_chronic_conditions}
            </div>
            <p className="text-xs text-muted-foreground">Students monitored</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medications Due</CardTitle>
            <Pill className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.medications_due_today}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Vaccinations</CardTitle>
            <Syringe className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.pending_vaccinations}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Aid Cases</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.first_aid_cases_this_week}
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <Package className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.medical_supplies_low}</div>
            <p className="text-xs text-muted-foreground">Supplies</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
          <TabsTrigger value="chronic">Chronic Conditions</TabsTrigger>
          <TabsTrigger value="supplies">Supplies</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Appointments */}
              {todayAppointments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Appointments</CardTitle>
                    <CardDescription>Scheduled clinic visits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {todayAppointments.map((appointment: any) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{appointment.student_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.reason} •{" "}
                              {appointment.appointment_time &&
                                format(new Date(appointment.appointment_time), "HH:mm")}
                            </p>
                          </div>
                          <Badge variant={appointment.status === "completed" ? "default" : "outline"}>
                            {appointment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Medication Schedule */}
              {medicationSchedule.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Today's Medication Schedule</CardTitle>
                    <CardDescription>Medications due today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {medicationSchedule.map((med: any) => (
                        <div
                          key={med.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Pill className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium">{med.student_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {med.medication_name} • {med.time}
                              </p>
                            </div>
                          </div>
                          <Badge variant={med.status === "administered" ? "default" : "destructive"}>
                            {med.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Cases */}
              {recentCases.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Cases</CardTitle>
                    <CardDescription>Latest medical visits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentCases.map((caseItem: any) => (
                        <div
                          key={caseItem.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{caseItem.student_name}</p>
                            <p className="text-sm text-muted-foreground">
                              {caseItem.complaint} •{" "}
                              {caseItem.visit_date &&
                                format(new Date(caseItem.visit_date), "MMM dd, yyyy")}
                            </p>
                          </div>
                          <Badge variant="outline">{caseItem.status}</Badge>
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
                    href="/staff/nurse/records/create"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Heart className="w-5 h-5 mr-3" />
                    <span>Add Medical Record</span>
                  </Link>
                  <Link
                    href="/staff/nurse/medications/schedule"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Pill className="w-5 h-5 mr-3" />
                    <span>Schedule Medication</span>
                  </Link>
                  <Link
                    href="/staff/nurse/vaccinations/record"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Syringe className="w-5 h-5 mr-3" />
                    <span>Record Vaccination</span>
                  </Link>
                  <Link
                    href="/staff/nurse/supplies"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Package className="w-5 h-5 mr-3" />
                    <span>Manage Supplies</span>
                  </Link>
                  <Link
                    href="/staff/nurse/reports"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Activity className="w-5 h-5 mr-3" />
                    <span>Health Reports</span>
                  </Link>
                </CardContent>
              </Card>

              {/* Low Stock Alert */}
              {lowStockSupplies.length > 0 && (
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                      <AlertCircle className="h-5 w-5" />
                      Low Stock Supplies
                    </CardTitle>
                    <CardDescription className="text-red-700 dark:text-red-300">
                      {lowStockSupplies.length} supply{lowStockSupplies.length !== 1 ? "ies" : ""} need
                      restocking
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {lowStockSupplies.slice(0, 3).map((supply: any) => (
                        <div key={supply.id} className="p-2 border rounded-lg">
                          <p className="font-medium text-sm">{supply.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {supply.quantity} {supply.unit} remaining
                          </p>
                        </div>
                      ))}
                    </div>
                    <Link href="/staff/nurse/supplies">
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        View All Supplies
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Medication Schedule</CardTitle>
              <CardDescription>Medications due for administration</CardDescription>
            </CardHeader>
            <CardContent>
              {medications.length > 0 ? (
                <div className="space-y-3">
                  {medications.map((med: any) => (
                    <div
                      key={med.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Pill className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{med.student?.name || med.student_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {med.medication_name} • {med.dosage} • {med.frequency}
                          </p>
                          {med.due_times && med.due_times.length > 0 && (
                            <div className="flex gap-2 mt-1">
                              {med.due_times.map((time: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {time}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          med.status === "administered"
                            ? "default"
                            : med.status === "missed"
                            ? "destructive"
                            : "outline"
                        }
                      >
                        {med.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No medications due today</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vaccinations Tab */}
        <TabsContent value="vaccinations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vaccination Schedule</CardTitle>
              <CardDescription>Upcoming and pending vaccinations</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingVaccinations.length > 0 ? (
                <div className="space-y-3">
                  {pendingVaccinations.map((vaccination: any) => (
                    <div
                      key={vaccination.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Syringe className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="font-medium">
                            {vaccination.student?.name || vaccination.student_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {vaccination.vaccine_name} • Dose {vaccination.dose_number}
                          </p>
                          {vaccination.vaccination_date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Scheduled: {format(new Date(vaccination.vaccination_date), "MMM dd, yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No pending vaccinations</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chronic Conditions Tab */}
        <TabsContent value="chronic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Students with Chronic Conditions</CardTitle>
              <CardDescription>Students requiring ongoing medical monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              {chronicConditions.length > 0 ? (
                <div className="space-y-3">
                  {chronicConditions.map((item: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{item.student.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.student.admission_number} • {item.student.class || "N/A"}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-orange-600">
                          Chronic
                        </Badge>
                      </div>
                      {item.conditions && item.conditions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-1">Conditions:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.conditions.map((condition: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {condition}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.medications && item.medications.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-1">Medications:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.medications.map((med: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {med}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {item.last_visit && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Last visit: {format(new Date(item.last_visit), "MMM dd, yyyy")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No students with chronic conditions
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supplies Tab */}
        <TabsContent value="supplies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Supplies</CardTitle>
              <CardDescription>Inventory status</CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockSupplies.length > 0 ? (
                <div className="space-y-3">
                  {lowStockSupplies.map((supply: any) => (
                    <div
                      key={supply.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Package
                          className={`w-5 h-5 ${
                            supply.status === "out_of_stock"
                              ? "text-red-600"
                              : supply.status === "low_stock"
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        />
                        <div>
                          <p className="font-medium">{supply.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {supply.category} • {supply.quantity} {supply.unit} remaining
                          </p>
                          {supply.min_quantity && (
                            <p className="text-xs text-muted-foreground">
                              Min: {supply.min_quantity} {supply.unit}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          supply.status === "out_of_stock"
                            ? "destructive"
                            : supply.status === "low_stock"
                            ? "secondary"
                            : "default"
                        }
                      >
                        {supply.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">All supplies in stock</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
