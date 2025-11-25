"use client"

import { useState, useEffect } from "react"
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Clock, Loader2, Save } from "lucide-react"
import { useStudents } from "@/lib/api/students"
import { useClasses } from "@/lib/api/academic"
import { useAttendance, useMarkClassAttendance } from "@/lib/api/attendance"
import { useAuth } from "@/hooks/use-auth"
import { useTeachers } from "@/lib/api/teachers"
import { toast } from "sonner"

export default function TeacherAttendancePage() {
  const { user } = useAuth()
  const [selectedClassId, setSelectedClassId] = useState<number | "">("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [attendanceRecords, setAttendanceRecords] = useState<Record<number, { status: string; check_in_time?: string; notes?: string }>>({})

  const { data: classesData } = useClasses()
  const { data: teachersData } = useTeachers()
  const { data: studentsData, isLoading: studentsLoading } = useStudents({
    class_id: selectedClassId ? Number(selectedClassId) : undefined,
    per_page: 100,
  })
  const { data: attendanceData } = useAttendance({
    class_id: selectedClassId ? Number(selectedClassId) : undefined,
    date: selectedDate,
  })
  const markAttendance = useMarkClassAttendance()

  const classes = Array.isArray(classesData) ? classesData : (classesData?.data || [])
  const teachers = Array.isArray(teachersData?.data) ? teachersData.data : (teachersData?.teachers?.data || [])
  const students = Array.isArray(studentsData?.data) ? studentsData.data : []
  const existingAttendance = Array.isArray(attendanceData?.data) ? attendanceData.data : []

  // Get current teacher's classes
  const currentTeacher = teachers.find((t: any) => t.id === Number(user?.id) || t.email === user?.email)
  const teacherClasses = currentTeacher?.classes || []

  // Initialize attendance records from existing data or default to present
  React.useEffect(() => {
    if (students.length > 0 && Object.keys(attendanceRecords).length === 0) {
      const initialRecords: Record<number, { status: string; check_in_time?: string; notes?: string }> = {}
      students.forEach((student: any) => {
        const existing = existingAttendance.find((a: any) => 
          a.attendanceable_id === student.id && a.attendanceable_type === "student"
        )
        initialRecords[student.id] = {
          status: existing?.status || "present",
          check_in_time: existing?.check_in_time,
          notes: existing?.notes,
        }
      })
      setAttendanceRecords(initialRecords)
    }
  }, [students.length, existingAttendance.length])

  const handleStatusChange = (studentId: number, status: string) => {
    setAttendanceRecords({
      ...attendanceRecords,
      [studentId]: {
        ...attendanceRecords[studentId],
        status,
        check_in_time: status === "present" || status === "late" ? new Date().toTimeString().slice(0, 5) : undefined,
      },
    })
  }

  const handleSave = async () => {
    if (!selectedClassId) {
      toast.error("Please select a class")
      return
    }

    try {
      const attendance = students.map((student: any) => {
        const record = attendanceRecords[student.id] || { status: "present" }
        return {
          attendanceable_id: student.id,
          attendanceable_type: "student",
          date: selectedDate,
          status: record.status,
          check_in_time: record.check_in_time || (record.status === "present" ? "08:00:00" : undefined),
          notes: record.notes,
        }
      })

      await markAttendance.mutateAsync({
        class_id: Number(selectedClassId),
        date: selectedDate,
        attendance,
      })

      toast.success("Attendance saved successfully")
    } catch (error: any) {
      console.error("Error saving attendance:", error)
      toast.error(error?.response?.data?.message || "Failed to save attendance")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Mark and track student attendance</p>
        </div>
        <Button onClick={handleSave} disabled={markAttendance.isPending || !selectedClassId}>
          {markAttendance.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Attendance
            </>
          )}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Select Class</Label>
              <Select
                value={selectedClassId === "" ? "" : selectedClassId.toString()}
                onValueChange={(value) => {
                  setSelectedClassId(value === "" ? "" : parseInt(value))
                  setAttendanceRecords({})
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {teacherClasses.map((classItem: any) => (
                    <SelectItem key={classItem.id} value={classItem.id.toString()}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance List */}
      {selectedClassId && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance - {classes.find((c: any) => c.id === Number(selectedClassId))?.name || "Class"}</CardTitle>
            <CardDescription>{new Date(selectedDate).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : students.length > 0 ? (
              <div className="space-y-3">
                {students.map((student: any) => {
                  const record = attendanceRecords[student.id] || { status: "present" }
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-semibold">{student.name || `${student.first_name} ${student.last_name}`}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.admission_number || ""}
                          {record.check_in_time && ` • Check-in: ${record.check_in_time}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={record.status === "present" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(student.id, "present")}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          variant={record.status === "late" ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(student.id, "late")}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Late
                        </Button>
                        <Button
                          variant={record.status === "absent" ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleStatusChange(student.id, "absent")}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Absent
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students found in this class</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedClassId && (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">Please select a class to mark attendance</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
