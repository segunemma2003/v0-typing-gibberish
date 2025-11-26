import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText, AlertTriangle } from "lucide-react"

interface Assignment {
  id: string
  title: string
  subject: string
  teacher: string
  dueDate: string
  dueTime: string
  type: "homework" | "quiz" | "project" | "exam"
  status: "pending" | "submitted" | "overdue"
  priority: "low" | "medium" | "high"
}

export function UpcomingAssignments() {
  const assignments: Assignment[] = [
    {
      id: "1",
      title: "Quadratic Equations Worksheet",
      subject: "Mathematics",
      teacher: "Dr. Sarah Wilson",
      dueDate: "Today",
      dueTime: "11:59 PM",
      type: "homework",
      status: "pending",
      priority: "high",
    },
    {
      id: "2",
      title: "Physics Lab Report",
      subject: "Physics",
      teacher: "Mr. John Davis",
      dueDate: "Tomorrow",
      dueTime: "2:00 PM",
      type: "project",
      status: "pending",
      priority: "medium",
    },
    {
      id: "3",
      title: "Literature Essay",
      subject: "English",
      teacher: "Ms. Emily Chen",
      dueDate: "March 20",
      dueTime: "9:00 AM",
      type: "project",
      status: "submitted",
      priority: "low",
    },
    {
      id: "4",
      title: "Chemistry Quiz",
      subject: "Chemistry",
      teacher: "Dr. Michael Brown",
      dueDate: "March 18",
      dueTime: "1:00 PM",
      type: "quiz",
      status: "overdue",
      priority: "high",
    },
  ]

  const getTypeColor = (type: Assignment["type"]) => {
    switch (type) {
      case "homework":
        return "default"
      case "quiz":
        return "secondary"
      case "project":
        return "outline"
      case "exam":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusColor = (status: Assignment["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-600"
      case "submitted":
        return "text-green-600"
      case "overdue":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getPriorityIcon = (priority: Assignment["priority"]) => {
    if (priority === "high") {
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assignments</CardTitle>
        <CardDescription>Your pending assignments and deadlines</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-lg">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{assignment.title}</h4>
                    {getPriorityIcon(assignment.priority)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {assignment.subject} • {assignment.teacher}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{assignment.dueDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{assignment.dueTime}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant={getTypeColor(assignment.type)} className="text-xs">
                    {assignment.type}
                  </Badge>
                  <span className={`text-xs font-medium ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    if (assignment.status === "submitted") {
                      // Show toast or navigate to view submission
                      return;
                    }
                    // Handle submit logic
                  }}
                >
                  {assignment.status === "submitted" ? "Submitted" : "Submit"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
