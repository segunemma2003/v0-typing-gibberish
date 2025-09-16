import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Mail, Phone, Calendar } from "lucide-react"

interface Communication {
  id: string
  from: string
  fromRole: string
  subject: string
  message: string
  date: string
  type: "message" | "email" | "call" | "meeting"
  priority: "low" | "medium" | "high"
  childName: string
}

export function RecentCommunications() {
  const communications: Communication[] = [
    {
      id: "1",
      from: "Dr. Sarah Wilson",
      fromRole: "Mathematics Teacher",
      subject: "Emma's Excellent Progress",
      message: "Emma has shown remarkable improvement in her algebra skills. She scored 95% on her recent test.",
      date: "2 hours ago",
      type: "message",
      priority: "medium",
      childName: "Emma Johnson",
    },
    {
      id: "2",
      from: "Mr. John Davis",
      fromRole: "Physics Teacher",
      subject: "Parent-Teacher Conference",
      message: "I'd like to schedule a meeting to discuss Alex's lab performance and upcoming projects.",
      date: "1 day ago",
      type: "meeting",
      priority: "high",
      childName: "Alex Johnson",
    },
    {
      id: "3",
      from: "School Administration",
      fromRole: "Principal's Office",
      subject: "School Event Reminder",
      message: "Don't forget about the Science Fair this Friday. Emma's project will be presented at 2:00 PM.",
      date: "2 days ago",
      type: "email",
      priority: "medium",
      childName: "Emma Johnson",
    },
    {
      id: "4",
      from: "Ms. Emily Chen",
      fromRole: "English Teacher",
      subject: "Reading Assignment",
      message: "Alex needs to catch up on his reading assignments. Please ensure he completes Chapter 5-7 by Monday.",
      date: "3 days ago",
      type: "message",
      priority: "high",
      childName: "Alex Johnson",
    },
  ]

  const getTypeIcon = (type: Communication["type"]) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case "email":
        return <Mail className="w-4 h-4 text-green-500" />
      case "call":
        return <Phone className="w-4 h-4 text-yellow-500" />
      case "meeting":
        return <Calendar className="w-4 h-4 text-purple-500" />
    }
  }

  const getPriorityColor = (priority: Communication["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Communications</CardTitle>
        <CardDescription>Messages and updates from teachers and school staff</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {communications.map((comm) => (
            <div key={comm.id} className="flex items-start space-x-4 p-3 border rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  {comm.from
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{comm.from}</h4>
                  {getTypeIcon(comm.type)}
                  <Badge variant={getPriorityColor(comm.priority)} className="text-xs">
                    {comm.priority}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{comm.fromRole}</p>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{comm.subject}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{comm.message}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {comm.childName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{comm.date}</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
