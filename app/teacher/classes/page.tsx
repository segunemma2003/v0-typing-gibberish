import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, BookOpen, TrendingUp, Plus, Filter } from "lucide-react"

export default function TeacherClassesPage() {
  const classes = [
    {
      id: "1",
      name: "Mathematics Advanced",
      subject: "Mathematics",
      grade: "Grade 11",
      students: 28,
      schedule: "Mon, Wed, Fri - 10:00 AM",
      room: "Room 201",
      progress: 75,
      nextAssignment: "Quadratic Equations Test",
      dueDate: "March 15, 2024",
    },
    {
      id: "2",
      name: "Physics Fundamentals",
      subject: "Physics",
      grade: "Grade 10",
      students: 32,
      schedule: "Tue, Thu - 2:00 PM",
      room: "Lab 1",
      progress: 60,
      nextAssignment: "Motion Lab Report",
      dueDate: "March 18, 2024",
    },
    {
      id: "3",
      name: "Calculus",
      subject: "Mathematics",
      grade: "Grade 12",
      students: 22,
      schedule: "Mon, Wed, Fri - 9:00 AM",
      room: "Room 203",
      progress: 85,
      nextAssignment: "Integration Problems",
      dueDate: "March 20, 2024",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">Manage your classes and track student progress</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classData) => (
          <Card key={classData.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{classData.subject}</Badge>
                <Badge variant="outline">{classData.grade}</Badge>
              </div>
              <CardTitle className="text-lg">{classData.name}</CardTitle>
              <CardDescription>{classData.schedule}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{classData.students} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{classData.room}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Course Progress</span>
                  <span className="font-medium">{classData.progress}%</span>
                </div>
                <Progress value={classData.progress} className="h-2" />
              </div>

              <div className="pt-2 border-t space-y-2">
                <p className="text-sm font-medium">Next Assignment:</p>
                <p className="text-sm text-muted-foreground">{classData.nextAssignment}</p>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Due: {classData.dueDate}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
