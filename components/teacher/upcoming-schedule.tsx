import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users } from "lucide-react"

interface ScheduleItem {
  id: string
  subject: string
  class: string
  time: string
  room: string
  students: number
  type: "class" | "meeting" | "exam"
}

export function UpcomingSchedule() {
  const schedule: ScheduleItem[] = [
    {
      id: "1",
      subject: "Mathematics Advanced",
      class: "Grade 11A",
      time: "10:00 AM - 11:00 AM",
      room: "Room 201",
      students: 28,
      type: "class",
    },
    {
      id: "2",
      subject: "Physics Lab",
      class: "Grade 10B",
      time: "2:00 PM - 3:30 PM",
      room: "Lab 1",
      students: 32,
      type: "class",
    },
    {
      id: "3",
      subject: "Parent Meeting",
      class: "Grade 11A",
      time: "4:00 PM - 5:00 PM",
      room: "Conference Room",
      students: 5,
      type: "meeting",
    },
    {
      id: "4",
      subject: "Calculus Exam",
      class: "Grade 12",
      time: "9:00 AM - 11:00 AM",
      room: "Exam Hall",
      students: 22,
      type: "exam",
    },
  ]

  const getTypeColor = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "class":
        return "default"
      case "meeting":
        return "secondary"
      case "exam":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
        <CardDescription>Your upcoming classes and meetings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedule.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-lg">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{item.subject}</h4>
                    <Badge variant={getTypeColor(item.type)} className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.class}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.room}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{item.students} students</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
