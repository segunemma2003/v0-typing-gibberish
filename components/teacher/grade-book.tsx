import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Users, BookOpen, Award } from "lucide-react"

export function GradeBook() {
  const gradeData = [
    { grade: "A", count: 8, percentage: 28.6 },
    { grade: "B", count: 12, percentage: 42.9 },
    { grade: "C", count: 6, percentage: 21.4 },
    { grade: "D", count: 2, percentage: 7.1 },
    { grade: "F", count: 0, percentage: 0 },
  ]

  const classStats = [
    { label: "Class Average", value: "82.5%", icon: TrendingUp, color: "text-green-600" },
    { label: "Total Students", value: "28", icon: Users, color: "text-blue-600" },
    { label: "Assignments", value: "12", icon: BookOpen, color: "text-purple-600" },
    { label: "Top Performer", value: "Alice J.", icon: Award, color: "text-yellow-600" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Grade Book</h2>
        <Button>Export Grades</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {classStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Grade Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Current class performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
            <CardDescription>Latest assignment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { assignment: "Midterm Exam", average: 85, graded: 28, total: 28 },
                { assignment: "Lab Report #3", average: 78, graded: 26, total: 28 },
                { assignment: "Quiz #5", average: 92, graded: 28, total: 28 },
                { assignment: "Homework Set 8", average: 88, graded: 24, total: 28 },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{item.assignment}</h4>
                    <Badge variant="outline">{item.average}% avg</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      Graded: {item.graded}/{item.total}
                    </span>
                    <span>{Math.round((item.graded / item.total) * 100)}% complete</span>
                  </div>
                  <Progress value={(item.graded / item.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
