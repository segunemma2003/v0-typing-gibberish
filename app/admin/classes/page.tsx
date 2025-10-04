import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, Users, BookOpen, Clock } from "lucide-react"

export default function ClassesPage() {
  const classes = [
    {
      id: "1",
      name: "Grade 9A",
      level: "Grade 9",
      section: "A",
      classTeacher: "Ms. Emily Chen",
      students: 28,
      subjects: 8,
      schedule: "Morning Shift",
      room: "Room 101",
      status: "Active",
    },
    {
      id: "2",
      name: "Grade 10A",
      level: "Grade 10",
      section: "A",
      classTeacher: "Dr. Sarah Wilson",
      students: 30,
      subjects: 9,
      schedule: "Morning Shift",
      room: "Room 201",
      status: "Active",
    },
    {
      id: "3",
      name: "Grade 11B",
      level: "Grade 11",
      section: "B",
      classTeacher: "Mr. John Davis",
      students: 25,
      subjects: 10,
      schedule: "Afternoon Shift",
      room: "Room 301",
      status: "Active",
    },
    {
      id: "4",
      name: "Grade 12C",
      level: "Grade 12",
      section: "C",
      classTeacher: "Dr. Maria Garcia",
      students: 22,
      subjects: 8,
      schedule: "Morning Shift",
      room: "Room 401",
      status: "Active",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage class sections and assignments</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search classes..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Grade
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{classItem.name}</CardTitle>
                <Badge variant={classItem.status === "Active" ? "default" : "secondary"}>
                  {classItem.status}
                </Badge>
              </div>
              <CardDescription>{classItem.room}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Class Teacher:</span>
                  <span className="font-medium">{classItem.classTeacher}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    Students
                  </div>
                  <span className="font-medium">{classItem.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <BookOpen className="w-4 h-4 mr-1" />
                    Subjects
                  </div>
                  <span className="font-medium">{classItem.subjects}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    Schedule
                  </div>
                  <span className="font-medium">{classItem.schedule}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
