"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Calendar, Loader2 } from "lucide-react"
import { useAnnouncements } from "@/lib/api/announcements"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LatestAnnouncements() {
  const { data: announcementsResponse, isLoading, error } = useAnnouncements({
    status: "published",
    per_page: 5,
    page: 1,
  })

  const announcements = Array.isArray(announcementsResponse?.data) ? announcementsResponse.data : []

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      general: { variant: "default", label: "General" },
      urgent: { variant: "destructive", label: "Urgent" },
      event: { variant: "secondary", label: "Event" },
      academic: { variant: "outline", label: "Academic" },
    }
    return badges[type?.toLowerCase()] || { variant: "default" as const, label: type || "General" }
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Latest Announcements</CardTitle>
          <CardDescription>Recent school announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Failed to load announcements</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Latest Announcements</CardTitle>
            <CardDescription>Recent school announcements and updates</CardDescription>
          </div>
          <Link href="/admin/announcements">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">No announcements yet</p>
            <Link href="/admin/announcements">
              <Button variant="outline" size="sm" className="mt-4">
                Create Announcement
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement: any) => {
              const badge = getTypeBadge(announcement.type)
              const publishedDate = announcement.published_at || announcement.created_at
              const timeAgo = publishedDate
                ? formatDistanceToNow(new Date(publishedDate), { addSuffix: true })
                : "Recently"

              return (
                <div key={announcement.id} className="flex items-start space-x-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bell className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm leading-tight">{announcement.title}</h4>
                      <Badge variant={badge.variant} className="text-xs shrink-0">
                        {badge.label}
                      </Badge>
                    </div>
                    {announcement.content && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {announcement.content}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{timeAgo}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

