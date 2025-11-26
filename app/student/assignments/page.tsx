import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Calendar, Clock, FileText, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export default function StudentAssignmentsPage() {
  const assignments = [
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
      description: "Complete problems 1-20 from Chapter 5",
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
      description: "Analyze motion data from pendulum experiment",
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
      description: "5-page analysis of Shakespeare's Hamlet",
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
      description: "Covers chapters 8-10 on chemical bonding",
    },
  ]

  const getTypeColor = (type: string) => {
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

  const getStatusColor = (status: string) => {
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

  const getPriorityIcon = (priority: string) => {
    if (priority === "high") {
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
    return null
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">Manage your assignments and track deadlines</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search assignments..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>{assignments.length} assignments total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-lg">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{assignment.title}</h4>
                      {getPriorityIcon(assignment.priority)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {assignment.subject} • {assignment.teacher}
                    </p>
                    <p className="text-sm text-muted-foreground">{assignment.description}</p>
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
                  <div className="flex flex-col items-end space-y-2">
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
                        toast.error("This assignment has already been submitted")
                        return
                      }
                      // Handle submit logic here
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
    </div>
  )
}
