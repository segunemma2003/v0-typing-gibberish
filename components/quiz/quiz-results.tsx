import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Trophy, Clock, Users, Target } from "lucide-react"

interface QuizResult {
  id: string
  studentName: string
  score: number
  totalPoints: number
  percentage: number
  timeSpent: number
  submittedAt: string
  answers: Record<string, string>
}

export function QuizResults() {
  const quizResults: QuizResult[] = [
    {
      id: "1",
      studentName: "Alice Johnson",
      score: 85,
      totalPoints: 100,
      percentage: 85,
      timeSpent: 38,
      submittedAt: "2024-03-15 10:30:00",
      answers: {},
    },
    {
      id: "2",
      studentName: "Bob Smith",
      score: 92,
      totalPoints: 100,
      percentage: 92,
      timeSpent: 42,
      submittedAt: "2024-03-15 10:35:00",
      answers: {},
    },
    {
      id: "3",
      studentName: "Carol Davis",
      score: 78,
      totalPoints: 100,
      percentage: 78,
      timeSpent: 45,
      submittedAt: "2024-03-15 10:28:00",
      answers: {},
    },
    {
      id: "4",
      studentName: "David Wilson",
      score: 88,
      totalPoints: 100,
      percentage: 88,
      timeSpent: 40,
      submittedAt: "2024-03-15 10:32:00",
      answers: {},
    },
  ]

  const scoreDistribution = [
    { range: "90-100", count: 1 },
    { range: "80-89", count: 2 },
    { range: "70-79", count: 1 },
    { range: "60-69", count: 0 },
    { range: "0-59", count: 0 },
  ]

  const averageScore = quizResults.reduce((sum, result) => sum + result.percentage, 0) / quizResults.length
  const highestScore = Math.max(...quizResults.map((r) => r.percentage))
  const lowestScore = Math.min(...quizResults.map((r) => r.percentage))
  const averageTime = quizResults.reduce((sum, result) => sum + result.timeSpent, 0) / quizResults.length

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return { variant: "default" as const, label: "A" }
    if (percentage >= 80) return { variant: "secondary" as const, label: "B" }
    if (percentage >= 70) return { variant: "outline" as const, label: "C" }
    if (percentage >= 60) return { variant: "destructive" as const, label: "D" }
    return { variant: "destructive" as const, label: "F" }
  }

  const stats = [
    { label: "Average Score", value: `${averageScore.toFixed(1)}%`, icon: Target, color: "text-blue-600" },
    { label: "Highest Score", value: `${highestScore}%`, icon: Trophy, color: "text-green-600" },
    { label: "Total Attempts", value: quizResults.length.toString(), icon: Users, color: "text-purple-600" },
    { label: "Avg Time", value: `${averageTime.toFixed(0)} min`, icon: Clock, color: "text-orange-600" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Quiz Results</h2>
        <Badge variant="outline">Algebra Fundamentals</Badge>
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
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Number of students by score range</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Individual Results */}
        <Card>
          <CardHeader>
            <CardTitle>Individual Results</CardTitle>
            <CardDescription>Student performance breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {quizResults.map((result) => {
                const badge = getGradeBadge(result.percentage)
                return (
                  <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <h4 className="font-medium">{result.studentName}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>Time: {result.timeSpent} min</span>
                        <span>•</span>
                        <span>{result.submittedAt.split(" ")[1]}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className={`font-bold ${getGradeColor(result.percentage)}`}>{result.percentage}%</p>
                        <p className="text-xs text-muted-foreground">
                          {result.score}/{result.totalPoints}
                        </p>
                      </div>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
