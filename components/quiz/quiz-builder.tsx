"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Save, Eye } from "lucide-react"

interface Question {
  id: string
  type: "multiple-choice" | "true-false" | "short-answer" | "essay"
  question: string
  options?: string[]
  correctAnswer?: string | string[]
  points: number
}

export function QuizBuilder() {
  const [quizTitle, setQuizTitle] = useState("")
  const [quizDescription, setQuizDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState("60")
  const [subject, setSubject] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    type: "multiple-choice",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 1,
  })

  const addQuestion = () => {
    if (currentQuestion.question.trim()) {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString(),
      }
      setQuestions([...questions, newQuestion])
      setCurrentQuestion({
        id: "",
        type: "multiple-choice",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 1,
      })
    }
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(currentQuestion.options || [])]
    newOptions[index] = value
    setCurrentQuestion({ ...currentQuestion, options: newOptions })
  }

  const getTotalPoints = () => {
    return questions.reduce((total, q) => total + q.points, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Quiz Builder</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>

      {/* Quiz Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                placeholder="Enter quiz title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter quiz description"
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
            <Input
              id="timeLimit"
              type="number"
              placeholder="60"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Question Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Add Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Question Type</Label>
              <Select
                value={currentQuestion.type}
                onValueChange={(value: Question["type"]) => setCurrentQuestion({ ...currentQuestion, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Points</Label>
              <Input
                type="number"
                value={currentQuestion.points}
                onChange={(e) =>
                  setCurrentQuestion({ ...currentQuestion, points: Number.parseInt(e.target.value) || 1 })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Question</Label>
            <Textarea
              placeholder="Enter your question"
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
            />
          </div>

          {currentQuestion.type === "multiple-choice" && (
            <div className="space-y-2">
              <Label>Answer Options</Label>
              <div className="space-y-2">
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                    />
                    <Checkbox
                      checked={currentQuestion.correctAnswer === option}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCurrentQuestion({ ...currentQuestion, correctAnswer: option })
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentQuestion.type === "true-false" && (
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <RadioGroup
                value={currentQuestion.correctAnswer as string}
                onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, correctAnswer: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="true" />
                  <Label htmlFor="true">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="false" />
                  <Label htmlFor="false">False</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <Button onClick={addQuestion} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </CardContent>
      </Card>

      {/* Questions List */}
      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Questions ({questions.length}) - Total Points: {getTotalPoints()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Q{index + 1}</Badge>
                      <Badge variant="secondary">{question.type}</Badge>
                      <Badge variant="outline">{question.points} pts</Badge>
                    </div>
                    <p className="font-medium">{question.question}</p>
                    {question.options && (
                      <div className="text-sm text-muted-foreground">
                        Options: {question.options.filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => removeQuestion(question.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
