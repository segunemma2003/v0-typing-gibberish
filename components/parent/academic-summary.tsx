import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, Award, BookOpen, Clock } from "lucide-react"

export function AcademicSummary() {
  const gradeData = [
    { month: "Sep", emma: 3.6, alex: 3.4 },
    { month: "Oct", emma: 3.7, alex: 3.5 },
    { month: "Nov", emma: 3.8, alex: 3.6 },
    { month: "Dec", emma: 3.7, alex: 3.5 },
    { month: "Jan", emma: 3.8, alex: 3.6 },
    { month: "Feb", emma: 3.8, alex: 3.6 },
  ]

  const attendanceData = [
    { name: "Emma", attendance: 95, absences: 5 },
    { name: "Alex", attendance: 92, absences: 8 },
  ]

  const stats = [
    { label: "Family GPA", value: "3.7", icon: Award, color: "text-green-600" },
    { label: "Total Subjects", value: "11", icon: BookOpen, color: "text-blue-600" },
    { label: "Avg Attendance", value: "93.5%", icon: Clock, color: "text-purple-600" },
    { label: "This Month", value: "↗ +0.1", icon: TrendingUp, color: "text-green-600" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Academic Summary</h2>
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
        {/* GPA Trends */}
        <Card>
          <CardHeader>
            <CardTitle>GPA Trends</CardTitle>
            <CardDescription>Academic progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="text-center space-y-4">
                <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground" />
                <div className="space-y-2 text-sm">
                  <p className="font-medium">GPA Trends</p>
                  <div className="space-y-1 text-xs">
                    <div>Emma: 3.8 GPA ↗</div>
                    <div>Alex: 3.6 GPA ↗</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Current attendance rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {attendanceData.map((child) => (
                <div key={child.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{child.name}</h4>
                      <Badge variant={child.attendance >= 95 ? "default" : "secondary"}>{child.attendance}%</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">{child.absences} absences</span>
                  </div>
                  <Progress value={child.attendance} className="h-3" />
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="h-[200px] flex items-center justify-center bg-muted/20 rounded-lg">
                <div className="text-center space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Attendance Chart</p>
                  <p className="text-xs text-muted-foreground">Visual representation will appear here</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
