"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Loader2,
  BookOpen,
  FileText,
  Copy,
} from "lucide-react"
import {
  useQuestionBank,
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useDuplicateQuestion,
} from "@/lib/api/question-bank"
import { useClasses } from "@/lib/api/academic"
import { useSubjects } from "@/lib/api/academic"
import { useTerms } from "@/lib/api/academic"
import { useAcademicYears } from "@/lib/api/academic"
import { toast } from "sonner"

const QUESTION_TYPES = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "true_false", label: "True/False" },
  { value: "short_answer", label: "Short Answer" },
  { value: "essay", label: "Essay" },
  { value: "fill_in_blank", label: "Fill in the Blank" },
  { value: "matching", label: "Matching" },
  { value: "ordering", label: "Ordering" },
]

const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
]

export default function TeacherQuestionBankPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClassId, setFilterClassId] = useState<number | "all">("all")
  const [filterSubjectId, setFilterSubjectId] = useState<number | "all">("all")
  const [filterQuestionType, setFilterQuestionType] = useState<string | "all">("all")
  const [filterDifficulty, setFilterDifficulty] = useState<string | "all">("all")

  const { data: classesResponse } = useClasses()
  const { data: subjectsResponse } = useSubjects()
  const { data: termsResponse } = useTerms({ per_page: 100 })
  const { data: academicYearsResponse } = useAcademicYears({ per_page: 100 })

  const classes = classesResponse?.data || []
  const subjects = subjectsResponse?.data || []
  const terms = termsResponse?.data || []
  const academicYears = Array.isArray(academicYearsResponse) ? academicYearsResponse : (academicYearsResponse?.data || [])

  const { data: questionsResponse, isLoading, refetch } = useQuestionBank({
    search: searchTerm || undefined,
    class_id: filterClassId !== "all" ? filterClassId : undefined,
    subject_id: filterSubjectId !== "all" ? filterSubjectId : undefined,
    question_type: filterQuestionType !== "all" ? filterQuestionType : undefined,
    difficulty: filterDifficulty !== "all" ? (filterDifficulty as "easy" | "medium" | "hard") : undefined,
    per_page: 50,
  })

  const questions = Array.isArray(questionsResponse) 
    ? questionsResponse 
    : (questionsResponse?.data || [])

  const createQuestion = useCreateQuestion()
  const updateQuestion = useUpdateQuestion()
  const deleteQuestion = useDeleteQuestion()
  const duplicateQuestion = useDuplicateQuestion()

  const [formData, setFormData] = useState({
    subject_id: "",
    class_id: "",
    term_id: "",
    academic_year_id: "",
    question_type: "multiple_choice" as "multiple_choice" | "true_false" | "short_answer" | "essay" | "fill_in_blank" | "matching" | "ordering",
    question: "",
    options: [{ key: "A", value: "" }],
    correct_answer: [""],
    explanation: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
    marks: "",
    tags: "",
    topic: "",
    hints: "",
  })

  const resetForm = () => {
    setFormData({
      subject_id: "",
      class_id: "",
      term_id: "",
      academic_year_id: "",
      question_type: "multiple_choice",
      question: "",
      options: [{ key: "A", value: "" }],
      correct_answer: [""],
      explanation: "",
      difficulty: "medium",
      marks: "",
      tags: "",
      topic: "",
      hints: "",
    })
  }

  const handleSubmit = async () => {
    try {
      if (!formData.subject_id || !formData.class_id || !formData.term_id || !formData.academic_year_id || !formData.question.trim()) {
        toast.error("Please fill in all required fields")
        return
      }

      if ((formData.question_type === "multiple_choice" || formData.question_type === "true_false") && formData.options.length < 2) {
        toast.error("Please add at least 2 options")
        return
      }

      if (formData.correct_answer.length === 0 || !formData.correct_answer[0]?.trim()) {
        toast.error("Please provide a correct answer")
        return
      }

      const payload = {
        subject_id: parseInt(formData.subject_id),
        class_id: parseInt(formData.class_id),
        term_id: parseInt(formData.term_id),
        academic_year_id: parseInt(formData.academic_year_id),
        question_type: formData.question_type,
        question: formData.question.trim(),
        options: (formData.question_type === "multiple_choice" || formData.question_type === "matching") 
          ? formData.options.filter(opt => opt.value.trim()) 
          : undefined,
        correct_answer: formData.correct_answer.filter(ans => ans.trim()),
        explanation: formData.explanation.trim() || undefined,
        difficulty: formData.difficulty,
        marks: formData.marks ? parseInt(formData.marks) : undefined,
        tags: formData.tags.trim() ? formData.tags.split(",").map(t => t.trim()) : undefined,
        topic: formData.topic.trim() || undefined,
        hints: formData.hints.trim() || undefined,
      }

      if (editingId) {
        await updateQuestion.mutateAsync({ id: editingId, data: payload })
        toast.success("Question updated successfully")
      } else {
        await createQuestion.mutateAsync(payload)
        toast.success("Question added to question bank successfully")
      }

      setShowCreateForm(false)
      setEditingId(null)
      resetForm()
      refetch()
    } catch (error: any) {
      console.error("Error saving question:", error)
      let errorMessage = "Failed to save question"
      if (error?.response?.data) {
        const data = error.response.data
        errorMessage = data.message || data.error || data.detail || errorMessage
        if (data.errors) {
          const errors = data.errors
          const errorMessages = Object.entries(errors).map(([field, messages]: [string, any]) => {
            const msg = Array.isArray(messages) ? messages.join(", ") : messages
            return `${field}: ${msg}`
          })
          errorMessage = errorMessages.join("; ")
        }
      } else if (error?.message) {
        errorMessage = error.message
      }
      toast.error(errorMessage)
    }
  }

  const handleEdit = (questionItem: any) => {
    setFormData({
      subject_id: questionItem.subject_id?.toString() || "",
      class_id: questionItem.class_id?.toString() || "",
      term_id: questionItem.term_id?.toString() || "",
      academic_year_id: questionItem.academic_year_id?.toString() || "",
      question_type: questionItem.question_type || "multiple_choice",
      question: questionItem.question || "",
      options: questionItem.options && questionItem.options.length > 0 
        ? questionItem.options 
        : [{ key: "A", value: "" }],
      correct_answer: questionItem.correct_answer && questionItem.correct_answer.length > 0
        ? questionItem.correct_answer
        : [""],
      explanation: questionItem.explanation || "",
      difficulty: questionItem.difficulty || "medium",
      marks: questionItem.marks?.toString() || "",
      tags: questionItem.tags?.join(", ") || "",
      topic: questionItem.topic || "",
      hints: questionItem.hints || "",
    })
    setEditingId(questionItem.id)
    setShowCreateForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      await deleteQuestion.mutateAsync(id)
      toast.success("Question deleted successfully")
      refetch()
    } catch (error: any) {
      console.error("Error deleting question:", error)
      toast.error(error?.response?.data?.message || "Failed to delete question")
    }
  }

  const handleDuplicate = async (id: number) => {
    try {
      await duplicateQuestion.mutateAsync(id)
      toast.success("Question duplicated successfully")
      refetch()
    } catch (error: any) {
      console.error("Error duplicating question:", error)
      toast.error(error?.response?.data?.message || "Failed to duplicate question")
    }
  }

  const handleAddOption = () => {
    const optionKeys = ["A", "B", "C", "D", "E", "F", "G", "H"]
    const nextKey = optionKeys[formData.options.length] || String.fromCharCode(65 + formData.options.length)
    setFormData({
      ...formData,
      options: [...formData.options, { key: nextKey, value: "" }],
    })
  }

  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 1) {
      toast.error("At least one option is required")
      return
    }
    setFormData({
      ...formData,
      options: formData.options.filter((_, i) => i !== index),
    })
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = { ...newOptions[index], value }
    setFormData({ ...formData, options: newOptions })
  }

  const handleAddCorrectAnswer = () => {
    setFormData({
      ...formData,
      correct_answer: [...formData.correct_answer, ""],
    })
  }

  const handleRemoveCorrectAnswer = (index: number) => {
    if (formData.correct_answer.length <= 1) {
      toast.error("At least one correct answer is required")
      return
    }
    setFormData({
      ...formData,
      correct_answer: formData.correct_answer.filter((_, i) => i !== index),
    })
  }

  const handleCorrectAnswerChange = (index: number, value: string) => {
    const newAnswers = [...formData.correct_answer]
    newAnswers[index] = value
    setFormData({ ...formData, correct_answer: newAnswers })
  }

  if (isLoading && !questions.length) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground">Add and manage questions for your exams</p>
        </div>
        <Button
          onClick={() => {
            setShowCreateForm(true)
            setEditingId(null)
            resetForm()
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select
                value={filterClassId === "all" ? "all" : filterClassId.toString()}
                onValueChange={(value) => setFilterClassId(value === "all" ? "all" : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((classItem: any) => (
                    <SelectItem key={classItem.id} value={classItem.id.toString()}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select
                value={filterSubjectId === "all" ? "all" : filterSubjectId.toString()}
                onValueChange={(value) => setFilterSubjectId(value === "all" ? "all" : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject: any) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={filterQuestionType} onValueChange={(value) => setFilterQuestionType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {QUESTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select value={filterDifficulty} onValueChange={(value) => setFilterDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  {DIFFICULTY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Question" : "Add New Question"}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => { setShowCreateForm(false); setEditingId(null); resetForm() }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select value={formData.subject_id || undefined} onValueChange={(value) => setFormData({ ...formData, subject_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject: any) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Class *</Label>
                <Select value={formData.class_id || undefined} onValueChange={(value) => setFormData({ ...formData, class_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem: any) => (
                      <SelectItem key={classItem.id} value={classItem.id.toString()}>
                        {classItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Term *</Label>
                <Select value={formData.term_id || undefined} onValueChange={(value) => setFormData({ ...formData, term_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map((term: any) => (
                      <SelectItem key={term.id} value={term.id.toString()}>
                        {term.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Academic Year *</Label>
                <Select value={formData.academic_year_id || undefined} onValueChange={(value) => setFormData({ ...formData, academic_year_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year: any) => (
                      <SelectItem key={year.id} value={year.id.toString()}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Question Type *</Label>
                <Select
                  value={formData.question_type}
                  onValueChange={(value: any) => {
                    setFormData({
                      ...formData,
                      question_type: value,
                      options: value === "true_false" ? [{ key: "A", value: "True" }, { key: "B", value: "False" }] : formData.options,
                      correct_answer: value === "true_false" ? ["True"] : formData.correct_answer,
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value: "easy" | "medium" | "hard") => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Marks</Label>
                <Input
                  type="number"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                  placeholder="2"
                />
              </div>

              <div className="space-y-2">
                <Label>Topic</Label>
                <Input
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., Algebra, Photosynthesis"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Question *</Label>
              <Textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter your question..."
                rows={3}
              />
            </div>

            {(formData.question_type === "multiple_choice" || formData.question_type === "matching") && (
              <div className="space-y-2">
                <Label>Options *</Label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="w-10 flex items-center justify-center font-medium">
                      {option.key}
                    </div>
                    <Input
                      value={option.value}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${option.key}`}
                    />
                    {formData.options.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveOption(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Option
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label>Correct Answer(s) *</Label>
              {formData.correct_answer.map((answer, index) => (
                <div key={index} className="flex gap-2">
                  {formData.question_type === "multiple_choice" || formData.question_type === "true_false" ? (
                    <Select
                      value={answer}
                      onValueChange={(value) => handleCorrectAnswerChange(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.question_type === "true_false" ? (
                          <>
                            <SelectItem value="True">True</SelectItem>
                            <SelectItem value="False">False</SelectItem>
                          </>
                        ) : (
                          formData.options.filter(opt => opt.value.trim()).map((option) => (
                            <SelectItem key={option.key} value={option.value}>
                              {option.key}: {option.value}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={answer}
                      onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                      placeholder="Enter correct answer"
                    />
                  )}
                  {formData.correct_answer.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCorrectAnswer(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {formData.question_type !== "multiple_choice" && formData.question_type !== "true_false" && (
                <Button type="button" variant="outline" size="sm" onClick={handleAddCorrectAnswer}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Answer
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Explanation</Label>
              <Textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Explain why this is the correct answer..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Hints</Label>
              <Textarea
                value={formData.hints}
                onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
                placeholder="Provide hints for students..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., algebra, quadratic, equations"
              />
            </div>

            <div className="flex gap-2">
              <Button type="button" onClick={handleSubmit}>
                {(createQuestion.isPending || updateQuestion.isPending) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    {editingId ? "Update" : "Add"} Question
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setShowCreateForm(false); setEditingId(null); resetForm() }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question: any) => (
          <Card key={question.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{question.question}</CardTitle>
                    <Badge variant="outline">{QUESTION_TYPES.find((t) => t.value === question.question_type)?.label}</Badge>
                    {question.difficulty && (
                      <Badge variant="secondary">{question.difficulty}</Badge>
                    )}
                    {question.marks && (
                      <Badge variant="outline">{question.marks} marks</Badge>
                    )}
                  </div>
                  <CardDescription>
                    {question.subject?.name} • {question.class?.name} • {question.topic || "No topic"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {question.options && question.options.length > 0 && (
                <div className="mb-4">
                  <Label className="mb-2">Options:</Label>
                  <div className="space-y-1">
                    {question.options.map((option: any, index: number) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{option.key}:</span> {option.value}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {question.correct_answer && question.correct_answer.length > 0 && (
                <div className="mb-4">
                  <Label className="mb-2">Correct Answer(s):</Label>
                  <div className="flex flex-wrap gap-2">
                    {question.correct_answer.map((answer: string, index: number) => (
                      <Badge key={index} variant="default">{answer}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {question.explanation && (
                <div className="mb-4">
                  <Label className="mb-2">Explanation:</Label>
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </div>
              )}

              {question.tags && question.tags.length > 0 && (
                <div className="mb-4">
                  <Label className="mb-2">Tags:</Label>
                  <div className="flex flex-wrap gap-1">
                    {question.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => handleEdit(question)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => handleDuplicate(question.id)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(question.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {questions.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No questions found. Add your first question to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

