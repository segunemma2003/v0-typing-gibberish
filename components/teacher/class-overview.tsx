"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, BookOpen, TrendingUp, Loader2 } from "lucide-react"
import { useMyClasses } from "@/lib/api/teachers"
import { useTeacherTimetable } from "@/lib/api/timetable"
import { useAuth } from "@/hooks/use-auth"

export function ClassOverview() {
  const { user } = useAuth()
  const { data: classesData, isLoading } = useMyClasses()
  const { data: timetableData } = useTeacherTimetable(user?.id ? Number(user.id) : 0)

  const classes = classesData || []
  const timetable = timetableData?.timetable || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Get next class from timetable
  const getNextClass = (classId: number) => {
    const today = new Date()
    const todayDay = today.toLocaleDateString("en-US", { weekday: "long" })
    const todaySchedule = timetable.find((day: any) => day.day === todayDay)?.periods || []
    const classPeriod = todaySchedule.find((period: any) => period.class?.includes(classId.toString()))
    if (classPeriod) {
      return `Today ${classPeriod.time}`
    }
    return "No class today"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">My Classes</h2>
        <Button variant="outline">View All Classes</Button>
      </div>

      {classes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classData: any) => (
            <Card key={classData.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Class</Badge>
                  <Badge variant="outline">{classData.name}</Badge>
                </div>
                <CardTitle className="text-lg">{classData.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{classData.students_count || 0} students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{getNextClass(classData.id)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Capacity: {classData.students_count || 0} / {classData.capacity || 0}
                  </p>
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
      ) : (
        <div className="py-8 text-center text-muted-foreground">No classes assigned</div>
      )}
    </div>
  )
}
