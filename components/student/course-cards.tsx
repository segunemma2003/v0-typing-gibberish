import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, User, TrendingUp } from "lucide-react"

interface Course {
  id: string
  name: string
  subject: string
  teacher: string
  nextClass: string
  progress: number
  grade: string
  assignments: number
  pendingAssignments: number
}

export function CourseCards() {
  const courses: Course[] = [
    {
      id: "1",
      name: "Mathematics Advanced",
      subject: "Mathematics",
      teacher: "Dr. Sarah Wilson",
      nextClass: "Today 10:00 AM",
      progress: 75,
      grade: "A-",
      assignments: 12,
      pendingAssignments: 2,
    },
    {
      id: "2",
      name: "Physics Fundamentals",
      subject: "Physics",
      teacher: "Mr. John Davis",
      nextClass: "Tomorrow 2:00 PM",
      progress: 68,
      grade: "B+",
      assignments: 10,
      pendingAssignments: 1,
    },
    {
      id: "3",
      name: "English Literature",
      subject: "English",
      teacher: "Ms. Emily Chen",
      nextClass: "Friday 9:00 AM",
      progress: 82,
      grade: "A",
      assignments: 8,
      pendingAssignments: 0,
    },
    {
      id: "4",
      name: "Chemistry Lab",
      subject: "Chemistry",
      teacher: "Dr. Michael Brown",
      nextClass: "Monday 1:00 PM",
      progress: 60,
      grade: "B",
      assignments: 15,
      pendingAssignments: 3,
    },
  ]

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600"
    if (grade.startsWith("B")) return "text-blue-600"
    if (grade.startsWith("C")) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Courses</h2>
        <Button variant="outline">View All Courses</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{course.subject}</Badge>
                <Badge variant="outline" className={getGradeColor(course.grade)}>
                  {course.grade}
                </Badge>
              </div>
              <CardTitle className="text-lg">{course.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{course.teacher}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{course.nextClass}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Course Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <span>Assignments: {course.assignments}</span>
                {course.pendingAssignments > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {course.pendingAssignments} pending
                  </Badge>
                )}
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Course
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Grades
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
