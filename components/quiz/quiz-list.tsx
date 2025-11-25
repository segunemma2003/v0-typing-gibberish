"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Plus, Clock, Users, BarChart3, Loader2 } from "lucide-react"
import { useQuizzes } from "@/lib/api/quiz"
import { useState } from "react"

export function QuizList() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: quizzesResponse, isLoading } = useQuizzes({
    search: searchTerm || undefined,
    per_page: 50,
  })

  const quizzes = quizzesResponse?.data || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "draft":
        return "secondary"
      case "closed":
        return "outline"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
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
            <Input 
              placeholder="Search quizzes..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Quiz Grid */}
      {quizzes.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {quizzes.map((quiz: any) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{quiz.subject || "General"}</Badge>
                  <Badge variant={getStatusColor(quiz.status)}>{quiz.status}</Badge>
                </div>
                <CardTitle className="text-lg">{quiz.name}</CardTitle>
                <CardDescription>{quiz.description || "No description"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{quiz.duration_minutes || 0} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <span>{quiz.total_marks || 0} marks</span>
                  </div>
                </div>

                {quiz.start_date && (
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    <p>Start: {new Date(quiz.start_date).toLocaleDateString()}</p>
                    {quiz.end_date && <p>End: {new Date(quiz.end_date).toLocaleDateString()}</p>}
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">No quizzes found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
