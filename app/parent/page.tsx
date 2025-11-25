"use client"

import { useAuth } from "@/hooks/use-auth"
import { useParentDashboard } from "@/lib/api/dashboard"
import { useGuardians } from "@/lib/api/guardians"
import { useStudents } from "@/lib/api/students"
import { useAnnouncements } from "@/lib/api/announcements"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, TrendingUp, FileText, Calendar, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ParentDashboard() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading } = useParentDashboard()
  const { data: guardiansData } = useGuardians({ search: user?.email })
  const { data: studentsData } = useStudents({ per_page: 100 })
  const { data: announcementsData } = useAnnouncements({ per_page: 5 })

  const dashboard = dashboardData?.dashboard
  const guardian = Array.isArray(guardiansData?.data) ? guardiansData.data[0] : null
  const students = Array.isArray(studentsData?.data) ? studentsData.data : []
  
  // Get guardian's children (students linked to this guardian)
  const children = students.filter((s: any) => {
    if (guardian?.id) {
      return s.guardians?.some((g: any) => g.id === guardian.id || g.pivot?.guardian_id === guardian.id)
    }
    // Fallback: check by email or name match
    return s.guardian_email === user?.email || s.parent_email === user?.email
  })

  const announcements = Array.isArray(announcementsData?.data) ? announcementsData.data : (announcementsData?.announcements?.data || [])

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
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Stay connected with your children's academic journey and school activities.
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {children.length} {children.length === 1 ? "Child" : "Children"}
        </Badge>
      </div>

      {/* Children Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {children.length > 0 ? (
          children.map((child: any) => (
            <Card key={child.id}>
              <CardHeader>
                <CardTitle className="text-lg">{child.name || "Student"}</CardTitle>
                <CardDescription>
                  {child.class?.name || "Class TBD"} {child.arm?.name ? `- ${child.arm.name}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Attendance Rate</span>
                    <span className="font-medium">{child.attendance_rate || dashboard?.children?.find((c: any) => c.id === child.id)?.attendance_rate || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={child.status === "active" ? "default" : "secondary"}>
                      {child.status || "active"}
                    </Badge>
                  </div>
                  <Link
                    href={`/parent/children/${child.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No children linked to your account</p>
              <p className="text-sm text-muted-foreground mt-1">Please contact the school administrator</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{children.length || dashboard?.children?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.upcoming_events?.length || 0}</div>
            <p className="text-xs text-muted-foreground">School events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.pending_payments || 0}</div>
            <p className="text-xs text-muted-foreground">Outstanding fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Announcements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Latest school announcements</CardDescription>
          </CardHeader>
          <CardContent>
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement: any) => (
                  <div key={announcement.id} className="p-3 border rounded-lg">
                    <p className="font-medium">{announcement.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {announcement.description || announcement.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString() : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No announcements</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>School calendar events</CardDescription>
          </CardHeader>
          <CardContent>
            {dashboard?.upcoming_events && dashboard.upcoming_events.length > 0 ? (
              <div className="space-y-4">
                {dashboard.upcoming_events.map((event: any) => (
                  <div key={event.id} className="p-3 border rounded-lg">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.date ? new Date(event.date).toLocaleDateString() : ""}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/parent/children"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Users className="w-6 h-6 mb-2" />
              <span className="text-sm">My Children</span>
            </Link>
            <Link
              href="/parent/reports"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <FileText className="w-6 h-6 mb-2" />
              <span className="text-sm">Reports</span>
            </Link>
            <Link
              href="/parent/payments"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <TrendingUp className="w-6 h-6 mb-2" />
              <span className="text-sm">Payments</span>
            </Link>
            <Link
              href="/parent/events"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <Calendar className="w-6 h-6 mb-2" />
              <span className="text-sm">Events</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
