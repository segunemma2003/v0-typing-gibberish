"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Loader2,
  Calendar,
  BookOpen,
  Users,
  FileText,
  Eye,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BarChart3,
  Download,
  Pencil,
} from "lucide-react"
import {
  useExams,
  useExam,
  useExamQuestions,
  useExamAttempts,
  useCreateExam,
  useUpdateExam,
  useDeleteExam,
  usePublishExam,
  useCreateQuestions,
  useResults,
  useCreateResult,
  useUpdateResult,
  useDeleteResult,
  useGenerateResults,
  usePublishResults,
  type ExamType,
  type ExamStatus,
  type QuestionType,
} from "@/lib/api/exams"
import { useClasses } from "@/lib/api/academic"
import { useSubjects } from "@/lib/api/academic"
import { useTeachers } from "@/lib/api/teachers"
import { useTerms } from "@/lib/api/academic"
import { useAcademicYears } from "@/lib/api/academic"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

const EXAM_TYPES: { value: ExamType; label: string }[] = [
  { value: "mid_term", label: "Mid-Term" },
  { value: "end_term", label: "End-Term" },
  { value: "ca1", label: "CA1" },
  { value: "ca2", label: "CA2" },
  { value: "mock", label: "Mock" },
  { value: "final", label: "Final" },
]

const EXAM_STATUSES: { value: ExamStatus; label: string; color: string }[] = [
  { value: "scheduled", label: "Scheduled", color: "blue" },
  { value: "ongoing", label: "Ongoing", color: "green" },
  { value: "completed", label: "Completed", color: "gray" },
  { value: "cancelled", label: "Cancelled", color: "red" },
]

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "true_false", label: "True/False" },
  { value: "short_answer", label: "Short Answer" },
  { value: "essay", label: "Essay" },
  { value: "fill_in_blank", label: "Fill in the Blank" },
]

export default function ExamsPage() {
  const [activeTab, setActiveTab] = useState<"exams" | "results">("exams")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showQuestionsForm, setShowQuestionsForm] = useState(false)
  const [showAttemptsView, setShowAttemptsView] = useState(false)
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClassId, setFilterClassId] = useState<number | "all">("all")
  const [filterSubjectId, setFilterSubjectId] = useState<number | "all">("all")
  const [filterExamType, setFilterExamType] = useState<ExamType | "all">("all")
  const [filterStatus, setFilterStatus] = useState<ExamStatus | "all">("all")

  const { data: classesResponse } = useClasses()
  const { data: subjectsResponse } = useSubjects()
  const { data: teachersResponse } = useTeachers()
  const { data: termsResponse } = useTerms({ per_page: 100 })
  const { data: academicYearsResponse } = useAcademicYears({ per_page: 100 })

  const classes = classesResponse?.data || []
  const subjects = subjectsResponse?.data || []
  const teachers = teachersResponse?.data || []
  const terms = termsResponse?.data || []
  // API returns direct array for academic years
  const academicYears = Array.isArray(academicYearsResponse) ? academicYearsResponse : (academicYearsResponse?.data || [])

  const { data: examsResponse, isLoading, error, refetch } = useExams({
    search: searchTerm || undefined,
    class_id: filterClassId !== "all" ? filterClassId : undefined,
    subject_id: filterSubjectId !== "all" ? filterSubjectId : undefined,
    exam_type: filterExamType !== "all" ? filterExamType : undefined,
    status: filterStatus !== "all" ? filterStatus : undefined,
    per_page: 50,
  })

  const exams = examsResponse?.exams?.data || []

  const { data: examDetail } = useExam(selectedExamId || 0)
  const { data: questionsData } = useExamQuestions(selectedExamId || 0)
  const { data: attemptsData } = useExamAttempts(selectedExamId || 0)

  const exam = examDetail?.exam
  const questions = questionsData?.questions || []
  const attempts = attemptsData?.attempts || []

  const { data: resultsResponse, refetch: refetchResults } = useResults({
    exam_id: selectedExamId || undefined,
    per_page: 50,
  })

  const results = resultsResponse?.results?.data || []

  const createExam = useCreateExam()
  const updateExam = useUpdateExam()
  const deleteExam = useDeleteExam()
  const publishExam = usePublishExam()
  const createQuestions = useCreateQuestions()
  const createResult = useCreateResult()
  const updateResult = useUpdateResult()
  const deleteResult = useDeleteResult()
  const generateResults = useGenerateResults()
  const publishResults = usePublishResults()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject_id: "",
    class_id: "",
    teacher_id: "",
    term_id: "",
    academic_year_id: "",
    start_date: "",
    end_date: "",
    duration_minutes: "",
    total_marks: "",
    passing_marks: "",
    exam_type: "mid_term" as ExamType,
    is_cbt: false,
    status: "scheduled" as ExamStatus,
    instructions: "",
    venue: "",
  })

  const [questionFormData, setQuestionFormData] = useState({
    questions: [
      {
        question_text: "",
        question_type: "multiple_choice" as QuestionType,
        marks: "",
        options: [""],
        correct_answer: "",
        explanation: "",
        order: 1,
      },
    ],
  })

  const [resultFormData, setResultFormData] = useState({
    student_id: "",
    exam_id: "",
    subject_id: "",
    score: "",
    total_marks: "",
    grade: "",
    remarks: "",
  })

  useEffect(() => {
    if (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error loading exams"
      toast.error(`Error loading exams: ${errorMessage}`)
    }
  }, [error])

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject_id: "",
      class_id: "",
      teacher_id: "",
      term_id: "",
      academic_year_id: "",
      start_date: "",
      end_date: "",
      duration_minutes: "",
      total_marks: "",
      passing_marks: "",
      exam_type: "mid_term",
      is_cbt: false,
      status: "scheduled",
      instructions: "",
      venue: "",
    })
  }

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.subject_id || !formData.class_id || !formData.term_id || !formData.academic_year_id) {
        toast.error("Please fill in all required fields")
        return
      }

      if (!formData.start_date || !formData.end_date) {
        toast.error("Please select start and end dates")
        return
      }

      if (new Date(formData.end_date) <= new Date(formData.start_date)) {
        toast.error("End date must be after start date")
        return
      }

      if (!formData.total_marks || !formData.passing_marks) {
        toast.error("Please enter total marks and passing marks")
        return
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description || undefined,
        subject_id: parseInt(formData.subject_id),
        class_id: parseInt(formData.class_id),
        teacher_id: formData.teacher_id ? parseInt(formData.teacher_id) : undefined,
        term_id: parseInt(formData.term_id),
        academic_year_id: parseInt(formData.academic_year_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : undefined,
        total_marks: parseInt(formData.total_marks),
        passing_marks: parseInt(formData.passing_marks),
        exam_type: formData.exam_type,
        is_cbt: formData.is_cbt,
        status: formData.status,
        instructions: formData.instructions || undefined,
        venue: formData.venue || undefined,
      }

      if (editingId) {
        await updateExam.mutateAsync({ id: editingId, data: payload })
        toast.success("Exam updated successfully")
      } else {
        await createExam.mutateAsync(payload)
        toast.success("Exam created successfully")
      }

      setShowCreateForm(false)
      setEditingId(null)
      resetForm()
      refetch()
    } catch (error: any) {
      console.error("Error saving exam:", error)
      let errorMessage = "Failed to save exam"
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

  const handleEdit = (examItem: any) => {
    setFormData({
      title: examItem.title || "",
      description: examItem.description || "",
      subject_id: examItem.subject_id?.toString() || "",
      class_id: examItem.class_id?.toString() || "",
      teacher_id: examItem.teacher_id?.toString() || "",
      term_id: examItem.term_id?.toString() || "",
      academic_year_id: examItem.academic_year_id?.toString() || "",
      start_date: examItem.start_date ? new Date(examItem.start_date).toISOString().slice(0, 16) : "",
      end_date: examItem.end_date ? new Date(examItem.end_date).toISOString().slice(0, 16) : "",
      duration_minutes: examItem.duration_minutes?.toString() || "",
      total_marks: examItem.total_marks?.toString() || "",
      passing_marks: examItem.passing_marks?.toString() || "",
      exam_type: examItem.exam_type || "mid_term",
      is_cbt: examItem.is_cbt || false,
      status: examItem.status || "scheduled",
      instructions: examItem.instructions || "",
      venue: examItem.venue || "",
    })
    setEditingId(examItem.id)
    setShowCreateForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this exam?")) return

    try {
      await deleteExam.mutateAsync(id)
      toast.success("Exam deleted successfully")
      if (selectedExamId === id) {
        setSelectedExamId(null)
        setShowAttemptsView(false)
      }
      refetch()
    } catch (error: any) {
      console.error("Error deleting exam:", error)
      toast.error(error?.response?.data?.message || "Failed to delete exam")
    }
  }

  const handlePublish = async (id: number) => {
    try {
      await publishExam.mutateAsync(id)
      toast.success("Exam published successfully")
      refetch()
    } catch (error: any) {
      console.error("Error publishing exam:", error)
      toast.error(error?.response?.data?.message || "Failed to publish exam")
    }
  }

  const handleViewAttempts = (examId: number) => {
    setSelectedExamId(examId)
    setShowAttemptsView(true)
  }

  const handleAddQuestion = () => {
    setQuestionFormData({
      questions: [
        ...questionFormData.questions,
        {
          question_text: "",
          question_type: "multiple_choice",
          marks: "",
          options: [""],
          correct_answer: "",
          explanation: "",
          order: questionFormData.questions.length + 1,
        },
      ],
    })
  }

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = questionFormData.questions.filter((_, i) => i !== index)
    setQuestionFormData({ questions: newQuestions.map((q, i) => ({ ...q, order: i + 1 })) })
  }

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...questionFormData.questions]
    newQuestions[index] = { ...newQuestions[index], [field]: value }
    setQuestionFormData({ questions: newQuestions })
  }

  const handleAddOption = (questionIndex: number) => {
    const newQuestions = [...questionFormData.questions]
    newQuestions[questionIndex].options = [...(newQuestions[questionIndex].options || []), ""]
    setQuestionFormData({ questions: newQuestions })
  }

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questionFormData.questions]
    newQuestions[questionIndex].options = newQuestions[questionIndex].options?.filter((_, i) => i !== optionIndex) || []
    setQuestionFormData({ questions: newQuestions })
  }

  const handleSubmitQuestions = async () => {
    if (!selectedExamId) {
      toast.error("No exam selected")
      return
    }

    try {
      const validQuestions = questionFormData.questions
        .filter((q) => q.question_text.trim())
        .map((q) => ({
          question_text: q.question_text.trim(),
          question_type: q.question_type,
          marks: parseInt(q.marks) || 1,
          options: q.question_type === "multiple_choice" || q.question_type === "true_false" ? q.options?.filter((o) => o.trim()) : undefined,
          correct_answer: q.correct_answer || undefined,
          explanation: q.explanation || undefined,
          order: q.order,
        }))

      if (validQuestions.length === 0) {
        toast.error("Please add at least one valid question")
        return
      }

      await createQuestions.mutateAsync({ examId: selectedExamId, data: { questions: validQuestions } })
      toast.success(`${validQuestions.length} questions created successfully`)
      setShowQuestionsForm(false)
      setQuestionFormData({
        questions: [
          {
            question_text: "",
            question_type: "multiple_choice",
            marks: "",
            options: [""],
            correct_answer: "",
            explanation: "",
            order: 1,
          },
        ],
      })
      refetch()
    } catch (error: any) {
      console.error("Error creating questions:", error)
      toast.error(error?.response?.data?.message || "Failed to create questions")
    }
  }

  const handleCreateQuestions = (examId: number) => {
    setSelectedExamId(examId)
    setShowQuestionsForm(true)
  }

  const handleSubmitResult = async () => {
    try {
      if (!resultFormData.student_id || !resultFormData.exam_id || !resultFormData.subject_id || !resultFormData.score || !resultFormData.total_marks) {
        toast.error("Please fill in all required fields")
        return
      }

      const payload = {
        student_id: parseInt(resultFormData.student_id),
        exam_id: parseInt(resultFormData.exam_id),
        subject_id: parseInt(resultFormData.subject_id),
        score: parseFloat(resultFormData.score),
        total_marks: parseFloat(resultFormData.total_marks),
        grade: resultFormData.grade || undefined,
        remarks: resultFormData.remarks || undefined,
      }

      await createResult.mutateAsync(payload)
      toast.success("Result created successfully")
      setResultFormData({
        student_id: "",
        exam_id: "",
        subject_id: "",
        score: "",
        total_marks: "",
        grade: "",
        remarks: "",
      })
      refetchResults()
    } catch (error: any) {
      console.error("Error creating result:", error)
      toast.error(error?.response?.data?.message || "Failed to create result")
    }
  }

  if (isLoading && !exams.length) {
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
          <h1 className="text-3xl font-bold tracking-tight">Exams & CBT</h1>
          <p className="text-muted-foreground">Manage exams and computer-based testing</p>
        </div>
        <Button
          onClick={() => {
            setShowCreateForm(true)
            setEditingId(null)
            resetForm()
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Exam
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "exams" | "results")}>
        <TabsList>
          <TabsTrigger value="exams">Exams</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search exams..."
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
                  <Select value={filterExamType} onValueChange={(value: ExamType | "all") => setFilterExamType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {EXAM_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={(value: ExamStatus | "all") => setFilterStatus(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {EXAM_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Create/Edit Exam Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{editingId ? "Edit Exam" : "Create New Exam"}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => { setShowCreateForm(false); setEditingId(null); resetForm() }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Title *</Label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Exam title" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Exam description..."
                      rows={3}
                    />
                  </div>

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
                    <Label>Teacher</Label>
                    <Select 
                      value={formData.teacher_id || undefined} 
                      onValueChange={(value) => setFormData({ ...formData, teacher_id: value === "none" ? "" : value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {teachers.map((teacher: any) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            {teacher.name}
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
                    <Label>Exam Type *</Label>
                    <Select value={formData.exam_type} onValueChange={(value: ExamType) => setFormData({ ...formData, exam_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXAM_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={(value: ExamStatus) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXAM_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Start Date & Time *</Label>
                    <Input
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>End Date & Time *</Label>
                    <Input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                      placeholder="60"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Venue</Label>
                    <Input value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} placeholder="Hall A" />
                  </div>

                  <div className="space-y-2">
                    <Label>Total Marks *</Label>
                    <Input
                      type="number"
                      value={formData.total_marks}
                      onChange={(e) => setFormData({ ...formData, total_marks: e.target.value })}
                      placeholder="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Passing Marks *</Label>
                    <Input
                      type="number"
                      value={formData.passing_marks}
                      onChange={(e) => setFormData({ ...formData, passing_marks: e.target.value })}
                      placeholder="50"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Instructions</Label>
                    <Textarea
                      value={formData.instructions}
                      onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                      placeholder="Exam instructions..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_cbt"
                        checked={formData.is_cbt}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_cbt: !!checked })}
                      />
                      <Label htmlFor="is_cbt" className="cursor-pointer">
                        Computer-Based Testing (CBT)
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" onClick={handleSubmit} disabled={createExam.isPending || updateExam.isPending}>
                    {(createExam.isPending || updateExam.isPending) ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {editingId ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        {editingId ? "Update" : "Create"} Exam
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

          {/* Questions Form */}
          {showQuestionsForm && selectedExamId && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Add Questions to Exam</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowQuestionsForm(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {questionFormData.questions.map((question, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        {questionFormData.questions.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveQuestion(index)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Question Text *</Label>
                        <Textarea
                          value={question.question_text}
                          onChange={(e) => handleQuestionChange(index, "question_text", e.target.value)}
                          placeholder="Enter question..."
                          rows={2}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Question Type *</Label>
                          <Select
                            value={question.question_type}
                            onValueChange={(value: QuestionType) => {
                              handleQuestionChange(index, "question_type", value)
                              if (value === "multiple_choice" || value === "true_false") {
                                handleQuestionChange(index, "options", value === "true_false" ? ["True", "False"] : [""])
                              }
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
                          <Label>Marks *</Label>
                          <Input
                            type="number"
                            value={question.marks}
                            onChange={(e) => handleQuestionChange(index, "marks", e.target.value)}
                            placeholder="2"
                          />
                        </div>
                      </div>

                      {(question.question_type === "multiple_choice" || question.question_type === "true_false") && (
                        <div className="space-y-2">
                          <Label>Options *</Label>
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex gap-2">
                              <Input
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(question.options || [])]
                                  newOptions[optIndex] = e.target.value
                                  handleQuestionChange(index, "options", newOptions)
                                }}
                                placeholder={`Option ${optIndex + 1}`}
                              />
                              {question.options && question.options.length > 1 && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveOption(index, optIndex)}>
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                          <Button type="button" variant="outline" size="sm" onClick={() => handleAddOption(index)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Option
                          </Button>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Correct Answer {question.question_type !== "essay" ? "*" : ""}</Label>
                        {question.question_type === "multiple_choice" || question.question_type === "true_false" ? (
                          <Select
                            value={question.correct_answer}
                            onValueChange={(value) => handleQuestionChange(index, "correct_answer", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select correct answer" />
                            </SelectTrigger>
                            <SelectContent>
                              {question.options?.filter((o) => o.trim()).map((option, optIndex) => (
                                <SelectItem key={optIndex} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            value={question.correct_answer}
                            onChange={(e) => handleQuestionChange(index, "correct_answer", e.target.value)}
                            placeholder="Correct answer"
                          />
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Explanation</Label>
                        <Textarea
                          value={question.explanation}
                          onChange={(e) => handleQuestionChange(index, "explanation", e.target.value)}
                          placeholder="Explanation for the answer..."
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handleAddQuestion}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                  <Button type="button" onClick={handleSubmitQuestions} disabled={createQuestions.isPending}>
                    {createQuestions.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Questions
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowQuestionsForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attempts View */}
          {showAttemptsView && exam && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{exam.title}</CardTitle>
                    <CardDescription>Exam Attempts & Results</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => { setShowAttemptsView(false); setSelectedExamId(null) }}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{exam.students_count || 0}</div>
                    <div className="text-sm text-muted-foreground">Total Students</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{attempts.length}</div>
                    <div className="text-sm text-muted-foreground">Attempts</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold">{exam.completed_count || 0}</div>
                    <div className="text-sm text-muted-foreground">Completed</div>
                  </div>
                </div>

                {exam.questions_count !== undefined && exam.questions_count > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowQuestionsForm(true)
                      refetch()
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add More Questions
                  </Button>
                )}

                {exam.questions_count === undefined || exam.questions_count === 0 ? (
                  exam.is_cbt && (
                    <Button type="button" onClick={() => handleCreateQuestions(exam.id)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Questions
                    </Button>
                  )
                ) : null}

                {questions.length > 0 && (
                  <div>
                    <Label className="mb-2">Questions ({questions.length})</Label>
                    <div className="space-y-2">
                      {questions.map((q: any) => (
                        <div key={q.id} className="p-3 bg-muted rounded">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{q.question_text}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{q.question_type}</Badge>
                                <Badge variant="secondary">{q.marks} marks</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {attempts.length > 0 && (
                  <div>
                    <Label className="mb-2">Attempts</Label>
                    <div className="space-y-2">
                      {attempts.map((attempt: any) => (
                        <div key={attempt.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{attempt.student?.name || `Student ${attempt.student_id}`}</p>
                              <p className="text-sm text-muted-foreground">{attempt.student?.admission_number}</p>
                            </div>
                            <div className="text-right">
                              {attempt.score !== undefined && (
                                <>
                                  <div className="text-lg font-bold">
                                    {attempt.score} / {attempt.total_marks || exam.total_marks}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {attempt.percentage?.toFixed(1)}%
                                  </div>
                                </>
                              )}
                              <Badge variant={attempt.status === "completed" ? "default" : "outline"} className="mt-1">
                                {attempt.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Exams List */}
          <div className="space-y-4">
            {exams.map((examItem: any) => (
              <Card key={examItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{examItem.title}</CardTitle>
                        {examItem.is_cbt && <Badge variant="default">CBT</Badge>}
                        <Badge variant="outline">{EXAM_TYPES.find((t) => t.value === examItem.exam_type)?.label}</Badge>
                        <Badge
                          variant={
                            examItem.status === "completed"
                              ? "secondary"
                              : examItem.status === "ongoing"
                                ? "default"
                                : examItem.status === "cancelled"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {EXAM_STATUSES.find((s) => s.value === examItem.status)?.label}
                        </Badge>
                      </div>
                      <CardDescription>{examItem.description || examItem.subject?.name}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Subject</p>
                      <p className="font-medium">{examItem.subject?.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Class</p>
                      <p className="font-medium">{examItem.class?.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Marks</p>
                      <p className="font-medium">{examItem.total_marks}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Passing Marks</p>
                      <p className="font-medium">{examItem.passing_marks}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(examItem.start_date).toLocaleString()}
                      </div>
                      {examItem.duration_minutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {examItem.duration_minutes} minutes
                        </div>
                      )}
                      {examItem.questions_count !== undefined && (
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {examItem.questions_count} questions
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleViewAttempts(examItem.id)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    {examItem.is_cbt && examItem.questions_count === 0 && (
                      <Button type="button" variant="outline" size="sm" onClick={() => handleCreateQuestions(examItem.id)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Questions
                      </Button>
                    )}
                    {examItem.status === "scheduled" && (
                      <Button type="button" variant="outline" size="sm" onClick={() => handlePublish(examItem.id)}>
                        <Send className="w-4 h-4 mr-2" />
                        Publish
                      </Button>
                    )}
                    <Button type="button" variant="outline" size="sm" onClick={() => handleEdit(examItem)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(examItem.id)}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {exams.length === 0 && !isLoading && (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No exams found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {/* Results Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Results Management</CardTitle>
                <Button onClick={() => setActiveTab("exams")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Result
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((result: any) => (
                    <div key={result.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{result.student?.name || `Student ${result.student_id}`}</p>
                          <p className="text-sm text-muted-foreground">{result.exam?.title || `Exam ${result.exam_id}`}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {result.score} / {result.total_marks}
                          </div>
                          <div className="text-sm text-muted-foreground">{result.percentage?.toFixed(1)}%</div>
                          {result.grade && <Badge className="mt-1">{result.grade}</Badge>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No results found. Select an exam to view results.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

