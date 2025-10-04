import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

export default function StudentSchedulePage() {
  const schedule = [
    { day: "Monday", time: "8:00 - 9:00", subject: "Mathematics", teacher: "Dr. Wilson", room: "201" },
    { day: "Monday", time: "9:00 - 10:00", subject: "English", teacher: "Mr. Davis", room: "202" },
    { day: "Tuesday", time: "8:00 - 9:00", subject: "Physics", teacher: "Dr. Wilson", room: "Lab 1" },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Schedule</h1>
      <Card>
        <CardHeader><CardTitle>Weekly Schedule</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{item.day} - {item.subject}</p>
                  <p className="text-sm text-muted-foreground">{item.teacher} • {item.room}</p>
                </div>
                <Badge variant="outline"><Clock className="w-3 h-3 mr-1 inline" />{item.time}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
