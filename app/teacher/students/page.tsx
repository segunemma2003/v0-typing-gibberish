import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Filter, Mail, Phone, MessageSquare } from "lucide-react"

export default function TeacherStudentsPage() {
  const students = [
    {
      id: "1",
      name: "Alice Johnson",
      class: "Grade 10A",
      email: "alice.johnson@school.edu",
      phone: "+1 555-0101",
      attendance: 95,
      grade: 88,
      status: "Active",
    },
    {
      id: "2",
      name: "Bob Smith",
      class: "Grade 10A",
      email: "bob.smith@school.edu",
      phone: "+1 555-0102",
      attendance: 92,
      grade: 85,
      status: "Active",
    },
    {
      id: "3",
      name: "Carol Davis",
      class: "Grade 11B",
      email: "carol.davis@school.edu",
      phone: "+1 555-0103",
      attendance: 88,
      grade: 90,
      status: "Active",
    },
    {
      id: "4",
      name: "David Martinez",
      class: "Grade 10A",
      email: "david.martinez@school.edu",
      phone: "+1 555-0104",
      attendance: 90,
      grade: 82,
      status: "Active",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Students</h1>
          <p className="text-muted-foreground">Manage and view your students</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search students..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter by Class
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>Students in your classes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{student.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.class}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Mail className="w-3 h-3 mr-1" />
                        {student.email}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Phone className="w-3 h-3 mr-1" />
                        {student.phone}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Attendance</p>
                    <p className="text-sm font-bold text-green-600">{student.attendance}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Average</p>
                    <p className="text-sm font-bold">{student.grade}%</p>
                  </div>
                  <Badge variant="default">{student.status}</Badge>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact
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
