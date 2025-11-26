"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useParentDashboard } from "@/lib/api/dashboard"
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
  DollarSign,
  MessageSquare,
  BookOpen,
  BarChart3,
  Award,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function ParentDashboard() {
  const { user } = useAuth()
  const [selectedChild, setSelectedChild] = useState<number | null>(null)
  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useParentDashboard()

  const dashboard = dashboardData
  const children = dashboard?.children || []
  const stats = dashboard?.stats || {
    total_children: 0,
    upcoming_events: 0,
    pending_fees: 0,
    unread_messages: 0,
  }

  if (dashboardLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {dashboard?.user?.name || dashboard?.guardian?.first_name || user?.name}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {dashboard?.user?.role || "Parent/Guardian"}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_children}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcoming_events}</div>
            <p className="text-xs text-muted-foreground">School events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pending_fees)}</div>
            <p className="text-xs text-muted-foreground">Outstanding fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unread_messages}</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Children Overview */}
      {children.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {children.map((child: any) => (
            <Card key={child.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{child.name}</CardTitle>
                    <CardDescription>
                      {child.admission_number} • {child.class}
                    </CardDescription>
                  </div>
                  {child.profile_picture && (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Average Score</p>
                    <p className="font-bold text-lg">{child.stats?.average_score?.toFixed(1) || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                    <p className="font-bold text-lg">{child.stats?.attendance_rate?.toFixed(1) || "N/A"}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Class Rank</p>
                    <p className="font-bold text-lg">#{child.stats?.rank || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pending Assignments</p>
                    <p className="font-bold text-lg text-orange-600">{child.stats?.pending_assignments || 0}</p>
                  </div>
                </div>
                <Link href={`/parent/children/${child.id}`}>
                  <Button variant="outline" className="w-full" size="sm">
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No children linked to your account</p>
            <p className="text-sm text-muted-foreground mt-1">Please contact the school administrator</p>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Children Performance Summary */}
              {children.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Children Performance Summary</CardTitle>
                    <CardDescription>Overall academic performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {children.map((child: any) => (
                        <div key={child.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{child.name}</p>
                              <p className="text-sm text-muted-foreground">{child.class}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Average</p>
                                <p className="font-bold">{child.stats?.average_score?.toFixed(1) || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Rank</p>
                                <p className="font-bold">#{child.stats?.rank || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Attendance</p>
                                <p className="font-bold">{child.stats?.attendance_rate?.toFixed(1) || "N/A"}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Total Pending Fees</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600">
                      {formatCurrency(stats.pending_fees)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Across all children</p>
                    <Link href="/parent/payments">
                      <Button variant="outline" size="sm" className="mt-3">
                        View Fees
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Unread Messages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">{stats.unread_messages}</div>
                    <p className="text-sm text-muted-foreground mt-1">From teachers and school</p>
                    <Link href="/parent/messages">
                      <Button variant="outline" size="sm" className="mt-3">
                        View Messages
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href="/parent/children"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span>My Children</span>
                  </Link>
                  <Link
                    href="/parent/reports"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    <span>Reports</span>
                  </Link>
                  <Link
                    href="/parent/payments"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <DollarSign className="w-5 h-5 mr-3" />
                    <span>Payments</span>
                  </Link>
                  <Link
                    href="/parent/messages"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 mr-3" />
                    <span>Messages</span>
                  </Link>
                  <Link
                    href="/parent/events"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    <span>Events</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          {children.length > 0 ? (
            <div className="space-y-4">
              {children.map((child: any) => (
                <Card key={child.id}>
                  <CardHeader>
                    <CardTitle>{child.name}</CardTitle>
                    <CardDescription>{child.class} • {child.admission_number}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Score</p>
                        <p className="text-2xl font-bold">{child.stats?.average_score?.toFixed(1) || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Class Rank</p>
                        <p className="text-2xl font-bold">#{child.stats?.rank || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        <p className="text-2xl font-bold text-green-600">
                          {child.stats?.attendance_rate?.toFixed(1) || "N/A"}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Assignments</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {child.stats?.pending_assignments || 0}
                        </p>
                      </div>
                    </div>
                    <Link href={`/parent/children/${child.id}/performance`}>
                      <Button variant="outline" className="mt-4 w-full">
                        View Full Performance Report
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No children data available
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          {children.length > 0 ? (
            <div className="space-y-4">
              {children.map((child: any) => (
                <Card key={child.id}>
                  <CardHeader>
                    <CardTitle>{child.name}</CardTitle>
                    <CardDescription>Attendance Overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Attendance Rate</p>
                        <p className="text-3xl font-bold text-green-600">
                          {child.stats?.attendance_rate?.toFixed(1) || "N/A"}%
                        </p>
                      </div>
                      <Badge variant="outline" className="text-lg">
                        {child.class}
                      </Badge>
                    </div>
                    <Link href={`/parent/children/${child.id}/attendance`}>
                      <Button variant="outline" className="w-full">
                        View Detailed Attendance
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No children data available
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          {children.length > 0 ? (
            <div className="space-y-4">
              {children.map((child: any) => (
                <Card key={child.id}>
                  <CardHeader>
                    <CardTitle>{child.name}</CardTitle>
                    <CardDescription>Assignments Status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Assignments</p>
                        <p className="text-3xl font-bold text-orange-600">
                          {child.stats?.pending_assignments || 0}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-lg">
                        {child.class}
                      </Badge>
                    </div>
                    <Link href={`/parent/children/${child.id}/assignments`}>
                      <Button variant="outline" className="w-full">
                        View All Assignments
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No children data available
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
