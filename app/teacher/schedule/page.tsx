import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"

export default function TeacherSchedulePage() {
  const schedule = [
    { day: "Monday", time: "8:00 - 9:00", class: "Grade 10A", subject: "Mathematics", room: "Room 201" },
    { day: "Monday", time: "9:00 - 10:00", class: "Grade 11B", subject: "Physics", room: "Lab 1" },
    { day: "Tuesday", time: "8:00 - 9:00", class: "Grade 10A", subject: "Mathematics", room: "Room 201" },
    { day: "Tuesday", time: "10:00 - 11:00", class: "Grade 11B", subject: "Physics", room: "Lab 1" },
    { day: "Wednesday", time: "8:00 - 9:00", class: "Grade 10A", subject: "Mathematics", room: "Room 201" },
  ]

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
          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">{item.day}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.time}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-muted-foreground">{item.class}</p>
                  </div>
                </div>
                <Badge variant="outline">{item.room}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
