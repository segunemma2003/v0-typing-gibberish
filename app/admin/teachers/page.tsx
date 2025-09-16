import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, Filter, Download } from "lucide-react"

export default function TeachersPage() {
  const teachers = [
    {
      id: "1",
      name: "Dr. Sarah Wilson",
      email: "sarah.wilson@school.edu",
      subjects: ["Mathematics", "Physics"],
      department: "Science",
      status: "Active",
      joinDate: "2020-08-15",
    },
    {
      id: "2",
      name: "Mr. John Davis",
      email: "john.davis@school.edu",
      subjects: ["English Literature", "Creative Writing"],
      department: "Languages",
      status: "Active",
      joinDate: "2019-09-01",
    },
    {
      id: "3",
      name: "Ms. Emily Chen",
      email: "emily.chen@school.edu",
      subjects: ["History", "Geography"],
      department: "Social Studies",
      status: "On Leave",
      joinDate: "2021-01-10",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground">Manage teaching staff and assignments</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search teachers..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Teachers List */}
      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
          <CardDescription>{teachers.length} teachers on staff</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {teacher.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground">{teacher.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{teacher.department}</p>
                    <p className="text-sm text-muted-foreground">Since {teacher.joinDate}</p>
                  </div>
                  <Badge variant={teacher.status === "Active" ? "default" : "secondary"}>{teacher.status}</Badge>
                  <Button variant="outline" size="sm">
                    View Details
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
