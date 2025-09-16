import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, GraduationCap, TrendingUp, Calendar } from "lucide-react"

interface Child {
  id: string
  name: string
  grade: string
  class: string
  avatar?: string
  gpa: number
  attendance: number
  nextEvent: string
  recentGrade: string
  subjects: number
}

export function ChildrenOverview() {
  const children: Child[] = [
    {
      id: "1",
      name: "Emma Johnson",
      grade: "Grade 10",
      class: "10A",
      gpa: 3.8,
      attendance: 95,
      nextEvent: "Math Test - Tomorrow",
      recentGrade: "A- in Physics",
      subjects: 6,
    },
    {
      id: "2",
      name: "Alex Johnson",
      grade: "Grade 7",
      class: "7B",
      gpa: 3.6,
      attendance: 92,
      nextEvent: "Science Fair - Friday",
      recentGrade: "B+ in English",
      subjects: 5,
    },
  ]

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return "text-green-600"
    if (gpa >= 3.0) return "text-blue-600"
    if (gpa >= 2.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return "text-green-600"
    if (attendance >= 90) return "text-blue-600"
    if (attendance >= 85) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Children</h2>
        <Button variant="outline">View All Reports</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {children.map((child) => (
          <Card key={child.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={child.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {child.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{child.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{child.grade}</Badge>
                    <Badge variant="outline">Class {child.class}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">GPA</span>
                    <span className={`font-medium ${getGPAColor(child.gpa)}`}>{child.gpa}</span>
                  </div>
                  <Progress value={(child.gpa / 4.0) * 100} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Attendance</span>
                    <span className={`font-medium ${getAttendanceColor(child.attendance)}`}>{child.attendance}%</span>
                  </div>
                  <Progress value={child.attendance} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span>{child.subjects} subjects enrolled</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span>{child.recentGrade}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{child.nextEvent}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Progress
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
