import { QuizList } from "@/components/quiz/quiz-list"
import { QuizResults } from "@/components/quiz/quiz-results"

export default function QuizDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quiz & Assessment System</h1>
          <p className="text-muted-foreground">Create, manage, and analyze quizzes and assessments.</p>
        </div>
      </div>

      {/* Quiz Management */}
      <QuizList />

      {/* Recent Results */}
      <QuizResults />
    </div>
  )
}
