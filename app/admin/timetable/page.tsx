"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download, Calendar, Edit, Trash2, X, Loader2 } from "lucide-react"
import { useTimetable, useClassTimetable, useCreateTimetable, useUpdateTimetable, useDeleteTimetable } from "@/lib/api/timetable"
import { useClasses } from "@/lib/api/academic"
import { useSubjects } from "@/lib/api/academic"
import { useTeachers } from "@/lib/api/teachers"
import { toast } from "sonner"

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const { data: classesResponse } = useClasses()
  const { data: subjectsResponse } = useSubjects()
  const { data: teachersResponse } = useTeachers()

  const classes = classesResponse?.data || []
  const subjects = subjectsResponse?.data || []
  const teachers = teachersResponse?.data || []

  // Fetch timetable based on filters
  const { data: timetableResponse, isLoading, error, refetch } = useTimetable({
    class_id: selectedClass || undefined,
    teacher_id: selectedTeacher || undefined,
    day: selectedDay || undefined,
  })

  const { data: classTimetableResponse } = useClassTimetable(selectedClass || 0)
  const classTimetable = selectedClass ? classTimetableResponse?.data || [] : []

  const createTimetable = useCreateTimetable()
  const updateTimetable = useUpdateTimetable()
  const deleteTimetable = useDeleteTimetable()

  const timetable = timetableResponse?.data || []

  const [formData, setFormData] = useState({
    class_id: "",
    subject_id: "",
    teacher_id: "",
    day: "",
    start_time: "",
    end_time: "",
    room: "",
  })

  // Group timetable by day
  const groupedTimetable = DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = timetable.filter((entry: any) => entry.day === day)
    return acc
  }, {} as Record<string, any[]>)

  const handleAdd = async () => {
    if (!formData.class_id || !formData.subject_id || !formData.teacher_id || !formData.day || !formData.start_time || !formData.end_time) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      await createTimetable.mutateAsync({
        class_id: parseInt(formData.class_id),
        subject_id: parseInt(formData.subject_id),
        teacher_id: parseInt(formData.teacher_id),
        day: formData.day,
        start_time: formData.start_time,
        end_time: formData.end_time,
        room: formData.room || undefined,
      })
      toast.success("Timetable entry created successfully")
      setFormData({ class_id: "", subject_id: "", teacher_id: "", day: "", start_time: "", end_time: "", room: "" })
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create timetable entry")
    }
  }

  const handleEdit = (entry: any) => {
    setFormData({
      class_id: entry.class_id?.toString() || "",
      subject_id: entry.subject_id?.toString() || "",
      teacher_id: entry.teacher_id?.toString() || "",
      day: entry.day || "",
      start_time: entry.start_time || "",
      end_time: entry.end_time || "",
      room: entry.room || "",
    })
    setEditingId(entry.id)
    setShowAddForm(true)
  }

  const handleUpdate = async () => {
    if (!editingId || !formData.class_id || !formData.subject_id || !formData.teacher_id || !formData.day || !formData.start_time || !formData.end_time) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      await updateTimetable.mutateAsync({
        id: editingId,
        data: {
          class_id: parseInt(formData.class_id),
          subject_id: parseInt(formData.subject_id),
          teacher_id: parseInt(formData.teacher_id),
          day: formData.day,
          start_time: formData.start_time,
          end_time: formData.end_time,
          room: formData.room || undefined,
        },
      })
      toast.success("Timetable entry updated successfully")
      setFormData({ class_id: "", subject_id: "", teacher_id: "", day: "", start_time: "", end_time: "", room: "" })
      setEditingId(null)
      setShowAddForm(false)
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update timetable entry")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this timetable entry?")) return

    try {
      await deleteTimetable.mutateAsync(id)
      toast.success("Timetable entry deleted successfully")
      refetch()
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete timetable entry")
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading timetable: {error?.message || "Unknown error"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          <p className="text-muted-foreground">Manage class schedules and timetables</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button
            onClick={() => {
              setShowAddForm(true)
              setEditingId(null)
              setFormData({ class_id: "", subject_id: "", teacher_id: "", day: "", start_time: "", end_time: "", room: "" })
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Timetable
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit Timetable Entry" : "Add New Timetable Entry"}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingId(null)
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Class *</Label>
                <Select value={formData.class_id} onValueChange={(value) => setFormData({ ...formData, class_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem: any) => (
                      <SelectItem key={classItem.id} value={classItem.id.toString()}>
                        {classItem.name} ({classItem.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Select value={formData.subject_id} onValueChange={(value) => setFormData({ ...formData, subject_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject: any) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Teacher *</Label>
                <Select value={formData.teacher_id} onValueChange={(value) => setFormData({ ...formData, teacher_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher: any) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>
                        {teacher.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Day *</Label>
                <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Start Time *</Label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time *</Label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Room</Label>
                <Input
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="e.g., Room 101"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={editingId ? handleUpdate : handleAdd}
                disabled={createTimetable.isPending || updateTimetable.isPending}
              >
                {createTimetable.isPending || updateTimetable.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingId ? "Update" : "Create"} Entry</>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
            <Select
              value={selectedClass?.toString() || "all"}
              onValueChange={(value) => setSelectedClass(value === "all" ? null : parseInt(value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Classes" />
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
            <Select
              value={selectedTeacher?.toString() || "all"}
              onValueChange={(value) => setSelectedTeacher(value === "all" ? null : parseInt(value))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Teachers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map((teacher: any) => (
                  <SelectItem key={teacher.id} value={teacher.id.toString()}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDay || "all"} onValueChange={(value) => setSelectedDay(value === "all" ? "" : value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Days</SelectItem>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(selectedClass || selectedTeacher || selectedDay) && (
              <Button variant="outline" onClick={() => { setSelectedClass(null); setSelectedTeacher(null); setSelectedDay("") }}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Timetable */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Current academic week timetable</CardDescription>
        </CardHeader>
        <CardContent>
          {timetable.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No timetable entries found</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="space-y-3">
                  <h3 className="font-semibold text-lg pb-2 border-b">{day}</h3>
                  <div className="space-y-2">
                    {groupedTimetable[day] && groupedTimetable[day].length > 0 ? (
                      groupedTimetable[day]
                        .sort((a: any, b: any) => a.start_time.localeCompare(b.start_time))
                        .map((entry: any) => (
                          <div
                            key={entry.id}
                            className="p-3 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer relative group"
                          >
                            <div className="text-xs text-muted-foreground mb-1">
                              {entry.start_time} - {entry.end_time}
                            </div>
                            <div className="font-medium text-sm">{entry.subject?.name || "Subject"}</div>
                            <div className="text-xs text-muted-foreground mt-1">{entry.teacher?.name || "Teacher"}</div>
                            {entry.room && <div className="text-xs text-muted-foreground">{entry.room}</div>}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleEdit(entry)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleDelete(entry.id)}
                                disabled={deleteTimetable.isPending}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-muted-foreground text-center py-4">No classes scheduled</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
