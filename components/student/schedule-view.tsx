import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin } from "lucide-react"

interface ScheduleItem {
  id: string
  subject: string
  teacher: string
  time: string
  room: string
  type: "class" | "lab" | "exam" | "break"
}

export function ScheduleView() {
  const todaySchedule: ScheduleItem[] = [
    {
      id: "1",
      subject: "Mathematics Advanced",
      teacher: "Dr. Sarah Wilson",
      time: "8:00 AM - 9:00 AM",
      room: "Room 201",
      type: "class",
    },
    {
      id: "2",
      subject: "Break",
      teacher: "",
      time: "9:00 AM - 9:15 AM",
      room: "",
      type: "break",
    },
    {
      id: "3",
      subject: "Physics Lab",
      teacher: "Mr. John Davis",
      time: "9:15 AM - 10:45 AM",
      room: "Lab 1",
      type: "lab",
    },
    {
      id: "4",
      subject: "English Literature",
      teacher: "Ms. Emily Chen",
      time: "11:00 AM - 12:00 PM",
      room: "Room 105",
      type: "class",
    },
    {
      id: "5",
      subject: "Lunch Break",
      teacher: "",
      time: "12:00 PM - 1:00 PM",
      room: "Cafeteria",
      type: "break",
    },
    {
      id: "6",
      subject: "Chemistry Exam",
      teacher: "Dr. Michael Brown",
      time: "1:00 PM - 2:30 PM",
      room: "Exam Hall",
      type: "exam",
    },
  ]

  const getTypeColor = (type: ScheduleItem["type"]) => {
    switch (type) {
      case "class":
        return "default"
      case "lab":
        return "secondary"
      case "exam":
        return "destructive"
      case "break":
        return "outline"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: ScheduleItem["type"]) => {
    if (type === "break") {
      return <Clock className="w-4 h-4 text-muted-foreground" />
    }
    return <Clock className="w-4 h-4 text-muted-foreground" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Schedule</CardTitle>
        <CardDescription>Your classes and activities for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todaySchedule.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-lg">
                {getTypeIcon(item.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{item.subject}</h4>
                  <Badge variant={getTypeColor(item.type)} className="text-xs">
                    {item.type}
                  </Badge>
                </div>
                {item.teacher && <p className="text-sm text-muted-foreground">{item.teacher}</p>}
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{item.time}</span>
                  </div>
                  {item.room && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.room}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
