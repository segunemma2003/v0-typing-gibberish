import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Activity {
  id: string
  user: string
  action: string
  target: string
  time: string
  type: "enrollment" | "grade" | "attendance" | "system"
}

export function RecentActivities() {
  const activities: Activity[] = [
    {
      id: "1",
      user: "Sarah Johnson",
      action: "enrolled",
      target: "Mathematics Grade 10",
      time: "2 minutes ago",
      type: "enrollment",
    },
    {
      id: "2",
      user: "Mike Chen",
      action: "submitted grades for",
      target: "Physics Grade 11",
      time: "15 minutes ago",
      type: "grade",
    },
    {
      id: "3",
      user: "Emma Wilson",
      action: "marked attendance for",
      target: "English Grade 9",
      time: "1 hour ago",
      type: "attendance",
    },
    {
      id: "4",
      user: "System",
      action: "generated report for",
      target: "Monthly Performance",
      time: "2 hours ago",
      type: "system",
    },
    {
      id: "5",
      user: "David Brown",
      action: "updated profile for",
      target: "Student ID: 12345",
      time: "3 hours ago",
      type: "system",
    },
  ]

  const getActivityBadge = (type: Activity["type"]) => {
    const badges = {
      enrollment: { variant: "default" as const, label: "Enrollment" },
      grade: { variant: "secondary" as const, label: "Grade" },
      attendance: { variant: "outline" as const, label: "Attendance" },
      system: { variant: "destructive" as const, label: "System" },
    }
    return badges[type]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest actions across the school system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const badge = getActivityBadge(activity.type)
            return (
              <div key={activity.id} className="flex items-center space-x-4">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                    <span className="font-medium">{activity.target}</span>
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={badge.variant} className="text-xs">
                      {badge.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
