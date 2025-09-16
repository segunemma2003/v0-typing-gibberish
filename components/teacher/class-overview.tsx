import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, BookOpen, TrendingUp } from "lucide-react"

interface ClassData {
  id: string
  name: string
  subject: string
  grade: string
  students: number
  nextClass: string
  progress: number
  recentActivity: string
}

export function ClassOverview() {
  const classes: ClassData[] = [
    {
      id: "1",
      name: "Mathematics Advanced",
      subject: "Mathematics",
      grade: "Grade 11",
      students: 28,
      nextClass: "Today 10:00 AM",
      progress: 75,
      recentActivity: "Assignment submitted by 24 students",
    },
    {
      id: "2",
      name: "Physics Fundamentals",
      subject: "Physics",
      grade: "Grade 10",
      students: 32,
      nextClass: "Tomorrow 2:00 PM",
      progress: 60,
      recentActivity: "Quiz completed by 30 students",
    },
    {
      id: "3",
      name: "Calculus",
      subject: "Mathematics",
      grade: "Grade 12",
      students: 22,
      nextClass: "Friday 9:00 AM",
      progress: 85,
      recentActivity: "New lesson materials uploaded",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Classes</h2>
        <Button variant="outline">View All Classes</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classData) => (
          <Card key={classData.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{classData.subject}</Badge>
                <Badge variant="outline">{classData.grade}</Badge>
              </div>
              <CardTitle className="text-lg">{classData.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{classData.students} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{classData.nextClass}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Course Progress</span>
                  <span className="font-medium">{classData.progress}%</span>
                </div>
                <Progress value={classData.progress} className="h-2" />
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">{classData.recentActivity}</p>
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
