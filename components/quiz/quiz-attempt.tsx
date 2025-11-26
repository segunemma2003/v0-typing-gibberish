"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useQuiz, useQuizQuestions, useStartQuizAttempt, useSubmitQuiz } from "@/lib/api/quiz"
import { toast } from "sonner"

interface QuizAttemptProps {
  quizId: string
}

export function QuizAttempt({ quizId }: QuizAttemptProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptId, setAttemptId] = useState<number | null>(null)

  const { data: quizData, isLoading: quizLoading } = useQuiz(Number(quizId))
  const { data: questionsData, isLoading: questionsLoading } = useQuizQuestions(Number(quizId))
  const startAttempt = useStartQuizAttempt()
  const submitQuiz = useSubmitQuiz()

  const quiz = quizData
  const questions = questionsData?.data || []
  const currentQuestion = questions[currentQuestionIndex]

  // Initialize time remaining from quiz data
  useEffect(() => {
    if (quiz?.time_limit) {
      setTimeRemaining(quiz.time_limit * 60) // Convert minutes to seconds
    }
  }, [quiz])

  // Start attempt when component loads
  useEffect(() => {
    if (quiz && !attemptId) {
      startAttempt.mutate(
        { id: Number(quizId), data: {} },
        {
          onSuccess: (data) => {
            setAttemptId(data.attempt.id)
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Failed to start quiz attempt")
          },
        }
      )
    }
  }, [quiz, quizId, attemptId, startAttempt])

  useEffect(() => {
    if (timeRemaining > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      handleSubmit()
    }
  }, [timeRemaining, isSubmitted])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer })
  }

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    if (!attemptId || !quiz) return

    const submitData = {
      id: Number(quizId),
      data: {
        attempt_id: attemptId,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          question_id: Number(questionId),
          answer: Array.isArray(answer) ? answer : [answer],
        })),
      },
    }

    submitQuiz.mutate(submitData, {
      onSuccess: () => {
        setIsSubmitted(true)
        toast.success("Quiz submitted successfully")
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to submit quiz")
      },
    })
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const getProgressPercentage = () => {
    if (questions.length === 0) return 0
    return (getAnsweredCount() / questions.length) * 100
  }

  if (quizLoading || questionsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No quiz data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Quiz Submitted Successfully!</h2>
            <p className="text-muted-foreground">
              Your answers have been recorded. Results will be available once the quiz is graded.
            </p>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">
                Questions answered: {getAnsweredCount()} / {questions.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{quiz.title || "Quiz"}</CardTitle>
              {quiz.subject && <Badge variant="outline">{quiz.subject}</Badge>}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className={`font-mono ${timeRemaining < 300 ? "text-red-500" : ""}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              {timeRemaining < 300 && <AlertCircle className="w-4 h-4 text-red-500" />}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>
                {getAnsweredCount()} / {quiz.questions.length} answered
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Question {currentQuestionIndex + 1} of {questions.length}
            </CardTitle>
            {currentQuestion?.points && (
              <Badge variant="outline">{currentQuestion.points} points</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentQuestion ? (
            <>
              <p className="text-lg">{currentQuestion.question}</p>

              {(currentQuestion.type === "multiple-choice" || currentQuestion.type === "multiple_choice") && currentQuestion.options && (
                <RadioGroup
                  value={answers[currentQuestion.id?.toString() || ""] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id?.toString() || "", value)}
                >
                  {currentQuestion.options.map((option: any, index: number) => {
                    const optionValue = typeof option === "string" ? option : option.value || option.key
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <RadioGroupItem value={optionValue} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="cursor-pointer">
                          {optionValue}
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              )}

              {(currentQuestion.type === "true-false" || currentQuestion.type === "true_false") && (
                <RadioGroup
                  value={answers[currentQuestion.id?.toString() || ""] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id?.toString() || "", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="True" id="true" />
                    <Label htmlFor="true" className="cursor-pointer">
                      True
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="False" id="false" />
                    <Label htmlFor="false" className="cursor-pointer">
                      False
                    </Label>
                  </div>
                </RadioGroup>
              )}

              {(currentQuestion.type === "short-answer" || currentQuestion.type === "short_answer" || currentQuestion.type === "essay") && (
                <Textarea
                  placeholder="Enter your answer here..."
                  value={answers[currentQuestion.id?.toString() || ""] || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id?.toString() || "", e.target.value)}
                  rows={currentQuestion.type === "essay" ? 8 : 3}
                />
              )}
            </>
          ) : (
            <p className="text-muted-foreground">No question available</p>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            if (currentQuestionIndex === 0) {
              // Already at first question, show message if needed
              return;
            }
            handlePrevious();
          }}
        >
          Previous
        </Button>

        <div className="flex space-x-2">
          {questions.map((question: any, index: number) => (
            <Button
              key={question.id || index}
              variant={
                index === currentQuestionIndex
                  ? "default"
                  : answers[question.id?.toString() || ""]
                  ? "secondary"
                  : "outline"
              }
              size="sm"
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <Button onClick={handleSubmit}>
            {submitQuiz.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Quiz"
            )}
          </Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  )
}
