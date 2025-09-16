import { QuizAttempt } from "@/components/quiz/quiz-attempt"

interface QuizAttemptPageProps {
  params: {
    id: string
  }
}

export default function QuizAttemptPage({ params }: QuizAttemptPageProps) {
  return <QuizAttempt quizId={params.id} />
}
