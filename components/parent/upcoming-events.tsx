import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Users } from "lucide-react"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: "academic" | "sports" | "social" | "meeting"
  childName?: string
  attendees?: number
}

export function UpcomingEvents() {
  const events: Event[] = [
    {
      id: "1",
      title: "Science Fair",
      description: "Emma will present her volcano project",
      date: "March 15, 2024",
      time: "2:00 PM - 4:00 PM",
      location: "School Gymnasium",
      type: "academic",
      childName: "Emma Johnson",
      attendees: 150,
    },
    {
      id: "2",
      title: "Parent-Teacher Conference",
      description: "Discuss Alex's progress with Mr. Davis",
      date: "March 18, 2024",
      time: "3:30 PM - 4:00 PM",
      location: "Room 105",
      type: "meeting",
      childName: "Alex Johnson",
    },
    {
      id: "3",
      title: "Basketball Game",
      description: "School team vs. Riverside High",
      date: "March 20, 2024",
      time: "6:00 PM - 8:00 PM",
      location: "Main Gymnasium",
      type: "sports",
      attendees: 200,
    },
    {
      id: "4",
      title: "Spring Concert",
      description: "Annual music performance",
      date: "March 25, 2024",
      time: "7:00 PM - 9:00 PM",
      location: "School Auditorium",
      type: "social",
      attendees: 300,
    },
  ]

  const getTypeColor = (type: Event["type"]) => {
    switch (type) {
      case "academic":
        return "default"
      case "sports":
        return "secondary"
      case "social":
        return "outline"
      case "meeting":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTypeIcon = (type: Event["type"]) => {
    switch (type) {
      case "academic":
        return "📚"
      case "sports":
        return "🏀"
      case "social":
        return "🎭"
      case "meeting":
        return "👥"
      default:
        return "📅"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>School events and important dates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-start space-x-4 p-3 border rounded-lg">
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-lg">
                <span className="text-lg">{getTypeIcon(event.type)}</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{event.title}</h4>
                  <Badge variant={getTypeColor(event.type)} className="text-xs">
                    {event.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{event.location}</span>
                  </div>
                  {event.attendees && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees} expected</span>
                    </div>
                  )}
                </div>
                {event.childName && (
                  <Badge variant="outline" className="text-xs">
                    {event.childName}
                  </Badge>
                )}
              </div>
              <Button size="sm" variant="outline">
                Add to Calendar
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
