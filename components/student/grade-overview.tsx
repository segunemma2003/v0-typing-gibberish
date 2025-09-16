import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Award, BookOpen, Target } from "lucide-react"

export function GradeOverview() {
  const gradeData = [
    { month: "Sep", gpa: 3.2 },
    { month: "Oct", gpa: 3.4 },
    { month: "Nov", gpa: 3.6 },
    { month: "Dec", gpa: 3.5 },
    { month: "Jan", gpa: 3.7 },
    { month: "Feb", gpa: 3.8 },
  ]

  const subjects = [
    { name: "Mathematics", grade: "A-", percentage: 88, trend: "up" },
    { name: "Physics", grade: "B+", percentage: 85, trend: "up" },
    { name: "English", grade: "A", percentage: 92, trend: "stable" },
    { name: "Chemistry", grade: "B", percentage: 82, trend: "down" },
    { name: "History", grade: "A-", percentage: 89, trend: "up" },
  ]

  const stats = [
    { label: "Current GPA", value: "3.8", icon: Award, color: "text-green-600" },
    { label: "Class Rank", value: "5/28", icon: Target, color: "text-blue-600" },
    { label: "Completed", value: "85%", icon: BookOpen, color: "text-purple-600" },
    { label: "Trend", value: "↗ +0.3", icon: TrendingUp, color: "text-green-600" },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗"
      case "down":
        return "↘"
      default:
        return "→"
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Academic Performance</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
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
        {/* GPA Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>GPA Trend</CardTitle>
            <CardDescription>Your academic progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[3.0, 4.0]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="gpa"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Grades</CardTitle>
            <CardDescription>Current performance by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{subject.name}</h4>
                      <span className={`text-sm ${getTrendColor(subject.trend)}`}>{getTrendIcon(subject.trend)}</span>
                    </div>
                    <Badge variant="outline">{subject.grade}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{subject.percentage}%</span>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
