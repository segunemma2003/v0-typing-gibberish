import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Filter, BookOpen, Users, Clock } from "lucide-react"

export default function SubjectsPage() {
  const subjects = [
    {
      id: "1",
      name: "Mathematics",
      code: "MATH101",
      department: "Science",
      teacher: "Dr. Sarah Wilson",
      level: "Grades 9-12",
      students: 120,
      hours: 5,
      status: "Active",
    },
    {
      id: "2",
      name: "English Literature",
      code: "ENG101",
      department: "Languages",
      teacher: "Mr. John Davis",
      level: "Grades 9-12",
      students: 115,
      hours: 4,
      status: "Active",
    },
    {
      id: "3",
      name: "Physics",
      code: "PHY101",
      department: "Science",
      teacher: "Dr. Sarah Wilson",
      level: "Grades 10-12",
      students: 85,
      hours: 6,
      status: "Active",
    },
    {
      id: "4",
      name: "History",
      code: "HIST101",
      department: "Social Studies",
      teacher: "Ms. Emily Chen",
      level: "Grades 9-12",
      students: 100,
      hours: 4,
      status: "Active",
    },
    {
      id: "5",
      name: "Chemistry",
      code: "CHEM101",
      department: "Science",
      teacher: "Dr. Robert Johnson",
      level: "Grades 10-12",
      students: 78,
      hours: 6,
      status: "Active",
    },
    {
      id: "6",
      name: "Computer Science",
      code: "CS101",
      department: "Technology",
      teacher: "Mr. David Lee",
      level: "Grades 9-12",
      students: 95,
      hours: 5,
      status: "Active",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">Manage subjects and curriculum</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search subjects..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Department
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{subject.name}</CardTitle>
                  <CardDescription className="mt-1">{subject.code}</CardDescription>
                </div>
                <Badge variant={subject.status === "Active" ? "default" : "secondary"}>
                  {subject.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="font-medium">{subject.department}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Teacher:</span>
                  <span className="font-medium">{subject.teacher}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Level:</span>
                  <span className="font-medium">{subject.level}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="w-4 h-4 mr-1" />
                    Students
                  </div>
                  <span className="font-medium">{subject.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    Weekly Hours
                  </div>
                  <span className="font-medium">{subject.hours}h</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
