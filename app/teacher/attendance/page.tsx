"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

export default function TeacherAttendancePage() {
  const students = [
    { id: "1", name: "Alice Johnson", status: "present", time: "8:00 AM" },
    { id: "2", name: "Bob Smith", status: "present", time: "8:02 AM" },
    { id: "3", name: "Carol Davis", status: "absent", time: "-" },
    { id: "4", name: "David Martinez", status: "late", time: "8:15 AM" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Mark and track student attendance</p>
        </div>
        <Button>Save Attendance</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance - Grade 10A</CardTitle>
          <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.time}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={student.status === "present" ? "default" : "outline"}
                    size="sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Present
                  </Button>
                  <Button
                    variant={student.status === "late" ? "default" : "outline"}
                    size="sm"
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Late
                  </Button>
                  <Button
                    variant={student.status === "absent" ? "destructive" : "outline"}
                    size="sm"
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Absent
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
