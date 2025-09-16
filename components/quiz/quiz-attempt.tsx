"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay"
  question: string
  options?: string[]
  points: number
}

interface QuizAttemptProps {
  quizId: string
}

export function QuizAttempt({ quizId }: QuizAttemptProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(45 * 60) // 45 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Mock quiz data
  const quiz = {
    id: quizId,
    title: "Algebra Fundamentals",
    subject: "Mathematics",
    timeLimit: 45,
    totalPoints: 100,
    questions: [
      {
        id: "1",
        type: "multiple-choice" as const,
        question: "What is the value of x in the equation 2x + 5 = 13?",
        options: ["x = 3", "x = 4", "x = 5", "x = 6"],
        points: 10,
      },
      {
        id: "2",
        type: "multiple-choice" as const,
        question: "Which of the following is a quadratic equation?",
        options: ["2x + 3 = 0", "x² + 5x + 6 = 0", "3x = 12", "x + y = 10"],
        points: 10,
      },
      {
        id: "3",
        type: "true-false" as const,
        question: "The slope of a horizontal line is zero.",
        options: ["True", "False"],
        points: 5,
      },
      {
        id: "4",
        type: "short-answer" as const,
        question: "Solve for y: 3y - 7 = 14",
        points: 15,
      },
    ],
  }

  const currentQuestion = quiz.questions[currentQuestionIndex]

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
    setIsSubmitted(true)
    // Here you would typically send the answers to your backend
    console.log("Quiz submitted:", answers)
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const getProgressPercentage = () => {
    return (getAnsweredCount() / quiz.questions.length) * 100
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
                Questions answered: {getAnsweredCount()} / {quiz.questions.length}
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
              <CardTitle>{quiz.title}</CardTitle>
              <Badge variant="outline">{quiz.subject}</Badge>
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
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </CardTitle>
            <Badge variant="outline">{currentQuestion.points} points</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg">{currentQuestion.question}</p>

          {currentQuestion.type === "multiple-choice" && (
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === "true-false" && (
            <RadioGroup
              value={answers[currentQuestion.id] || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
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

          {(currentQuestion.type === "short-answer" || currentQuestion.type === "essay") && (
            <Textarea
              placeholder="Enter your answer here..."
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              rows={currentQuestion.type === "essay" ? 8 : 3}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>

        <div className="flex space-x-2">
          {quiz.questions.map((_, index) => (
            <Button
              key={index}
              variant={
                index === currentQuestionIndex ? "default" : answers[quiz.questions[index].id] ? "secondary" : "outline"
              }
              size="sm"
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>

        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <Button onClick={handleSubmit}>Submit Quiz</Button>
        ) : (
          <Button onClick={handleNext}>Next</Button>
        )}
      </div>
    </div>
  )
}
