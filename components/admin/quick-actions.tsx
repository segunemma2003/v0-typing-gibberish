import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, FileText, Calendar, Bell, Download, Settings } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Add New Student",
      description: "Register a new student",
      icon: UserPlus,
      href: "/admin/students/new",
    },
    {
      title: "Generate Report",
      description: "Create performance reports",
      icon: FileText,
      href: "/admin/reports",
    },
    {
      title: "Schedule Event",
      description: "Add school events",
      icon: Calendar,
      href: "/admin/events/new",
    },
    {
      title: "Send Announcement",
      description: "Broadcast to all users",
      icon: Bell,
      href: "/admin/announcements/new",
    },
    {
      title: "Export Data",
      description: "Download school data",
      icon: Download,
      href: "/admin/export",
    },
    {
      title: "System Settings",
      description: "Configure school settings",
      icon: Settings,
      href: "/admin/settings",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button key={action.title} variant="outline" className="h-auto p-4 justify-start bg-transparent" asChild>
                <a href={action.href}>
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </div>
                </a>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
