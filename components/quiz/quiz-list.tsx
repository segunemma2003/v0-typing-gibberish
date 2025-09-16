import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Clock, Users, BarChart3 } from "lucide-react"

interface Quiz {
  id: string
  title: string
  subject: string
  description: string
  questions: number
  timeLimit: number
  totalPoints: number
  attempts: number
  averageScore: number
  status: "draft" | "published" | "archived"
  createdBy: string
  createdAt: string
}

export function QuizList() {
  const quizzes: Quiz[] = [
    {
      id: "1",
      title: "Algebra Fundamentals",
      subject: "Mathematics",
      description: "Basic algebraic concepts and problem solving",
      questions: 15,
      timeLimit: 45,
      totalPoints: 100,
      attempts: 28,
      averageScore: 82.5,
      status: "published",
      createdBy: "Dr. Sarah Wilson",
      createdAt: "2024-03-01",
    },
    {
      id: "2",
      title: "Newton's Laws of Motion",
      subject: "Physics",
      description: "Understanding the three laws of motion with practical examples",
      questions: 12,
      timeLimit: 30,
      totalPoints: 80,
      attempts: 24,
      averageScore: 76.8,
      status: "published",
      createdBy: "Mr. John Davis",
      createdAt: "2024-03-05",
    },
    {
      id: "3",
      title: "Chemical Bonding",
      subject: "Chemistry",
      description: "Types of chemical bonds and molecular structures",
      questions: 20,
      timeLimit: 60,
      totalPoints: 120,
      attempts: 0,
      averageScore: 0,
      status: "draft",
      createdBy: "Dr. Michael Brown",
      createdAt: "2024-03-10",
    },
    {
      id: "4",
      title: "Shakespeare's Hamlet",
      subject: "English",
      description: "Character analysis and themes in Hamlet",
      questions: 10,
      timeLimit: 40,
      totalPoints: 75,
      attempts: 32,
      averageScore: 88.2,
      status: "published",
      createdBy: "Ms. Emily Chen",
      createdAt: "2024-02-28",
    },
  ]

  const getStatusColor = (status: Quiz["status"]) => {
    switch (status) {
      case "published":
        return "default"
      case "draft":
        return "secondary"
      case "archived":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Quiz Management</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search quizzes..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Quiz Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{quiz.subject}</Badge>
                <Badge variant={getStatusColor(quiz.status)}>{quiz.status}</Badge>
              </div>
              <CardTitle className="text-lg">{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{quiz.timeLimit} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{quiz.attempts} attempts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span>{quiz.questions} questions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">Avg:</span>
                  <span className="font-medium">{quiz.averageScore}%</span>
                </div>
              </div>

              <div className="pt-2 border-t text-xs text-muted-foreground">
                <p>Created by {quiz.createdBy}</p>
                <p>Total Points: {quiz.totalPoints}</p>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Results
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
