"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Loader2 } from "lucide-react"
import { useTimetable } from "@/lib/api/timetable"
import { useAuth } from "@/hooks/use-auth"

export default function TeacherSchedulePage() {
  const { user } = useAuth()
  const { data: timetableData, isLoading } = useTimetable({
    teacher_id: user?.id ? Number(user.id) : undefined,
  })

  const timetableEntries = Array.isArray(timetableData?.data) ? timetableData.data : (timetableData?.timetable?.data || [])

  // Group by day
  const scheduleByDay = timetableEntries.reduce((acc: any, entry: any) => {
    const day = entry.day || entry.date || "Unknown"
    if (!acc[day]) {
      acc[day] = []
    }
    acc[day].push(entry)
    return acc
  }, {})

  // Sort entries by time
  Object.keys(scheduleByDay).forEach((day) => {
    scheduleByDay[day].sort((a: any, b: any) => {
      const timeA = a.start_time || a.time || ""
      const timeB = b.start_time || b.time || ""
      return timeA.localeCompare(timeB)
    })
  })

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const sortedDays = Object.keys(scheduleByDay).sort((a, b) => {
    const indexA = daysOfWeek.indexOf(a)
    const indexB = daysOfWeek.indexOf(b)
    if (indexA === -1 && indexB === -1) return a.localeCompare(b)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
        <p className="text-muted-foreground">Your weekly teaching schedule</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Your class schedule for this week</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedDays.length > 0 ? (
            <div className="space-y-4">
              {sortedDays.map((day) => (
                <div key={day} className="space-y-2">
                  <h3 className="font-semibold text-lg mb-2">{day}</h3>
                  {scheduleByDay[day].map((item: any, idx: number) => (
                    <div key={item.id || idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.start_time && item.end_time 
                              ? `${item.start_time} - ${item.end_time}`
                              : item.time || "Time TBD"
                            }
                          </div>
                        </div>
                        <div>
                          <p className="font-medium">{item.subject?.name || item.subject || "Subject"}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.class?.name || item.class_name || "Class"}
                          </p>
                        </div>
                      </div>
                      {item.room && (
                        <Badge variant="outline">{item.room}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No schedule found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
