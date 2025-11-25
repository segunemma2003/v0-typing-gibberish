"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { useClasses } from "@/lib/api/academic"
import { useAuth } from "@/hooks/use-auth"
import { useTeachers } from "@/lib/api/teachers"
import { useResults } from "@/lib/api/exams"
import { useAttendance } from "@/lib/api/attendance"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function TeacherReportsPage() {
  const { user } = useAuth()
  const [reportType, setReportType] = useState<"academic" | "attendance">("academic")
  const [selectedClassId, setSelectedClassId] = useState<number | "">("")

  const { data: classesData } = useClasses()
  const { data: teachersData } = useTeachers()
  const { data: resultsData } = useResults({
    per_page: 1000,
  })
  const { data: attendanceData } = useAttendance({
    class_id: selectedClassId ? Number(selectedClassId) : undefined,
  })

  const classes = Array.isArray(classesData) ? classesData : (classesData?.data || [])
  const teachers = Array.isArray(teachersData?.data) ? teachersData.data : (teachersData?.teachers?.data || [])
  const results = Array.isArray(resultsData?.results?.data) ? resultsData.results.data : []
  const attendance = Array.isArray(attendanceData?.data) ? attendanceData.data : []

  // Get current teacher's classes
  const currentTeacher = teachers.find((t: any) => t.id === Number(user?.id) || t.email === user?.email)
  const teacherClasses = currentTeacher?.classes || []

  // Generate reports based on data
  const generateReports = () => {
    const reports: Array<{ id: string; title: string; date: string; type: string }> = []

    if (selectedClassId) {
      const classItem = classes.find((c: any) => c.id === Number(selectedClassId))
      const classResults = results.filter((r: any) => 
        r.exam?.class_id === Number(selectedClassId) || r.student?.class_id === Number(selectedClassId)
      )
      const classAttendance = attendance.filter((a: any) => 
        a.attendanceable_type === "student" && 
        (a.class_id === Number(selectedClassId) || a.attendanceable?.class_id === Number(selectedClassId))
      )

      if (classResults.length > 0) {
        reports.push({
          id: `academic-${selectedClassId}`,
          title: `${classItem?.name || "Class"} - Academic Performance Report`,
          date: new Date().toISOString().split('T')[0],
          type: "Academic",
        })
      }

      if (classAttendance.length > 0) {
        reports.push({
          id: `attendance-${selectedClassId}`,
          title: `${classItem?.name || "Class"} - Attendance Summary`,
          date: new Date().toISOString().split('T')[0],
          type: "Attendance",
        })
      }
    } else {
      // Generate reports for all classes
      teacherClasses.forEach((classItem: any) => {
        const classResults = results.filter((r: any) => 
          r.exam?.class_id === classItem.id || r.student?.class_id === classItem.id
        )
        if (classResults.length > 0) {
          reports.push({
            id: `academic-${classItem.id}`,
            title: `${classItem.name} - Academic Performance Report`,
            date: new Date().toISOString().split('T')[0],
            type: "Academic",
          })
        }
      })
    }

    return reports
  }

  const reports = generateReports()

  const handleDownload = (reportId: string) => {
    // This would typically call an API endpoint to generate and download the report
    toast.info("Report download functionality will be implemented with backend API")
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and view class reports</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={reportType} onValueChange={(value: "academic" | "attendance") => setReportType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="attendance">Attendance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Class (Optional)</Label>
              <Select
                value={selectedClassId === "" ? "" : selectedClassId.toString()}
                onValueChange={(value) => setSelectedClassId(value === "" ? "" : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Classes</SelectItem>
                  {teacherClasses.map((classItem: any) => (
                    <SelectItem key={classItem.id} value={classItem.id.toString()}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Download and view reports for your classes</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">{report.title}</p>
                      <p className="text-sm text-muted-foreground">{report.type} • {report.date}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleDownload(report.id)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reports available. Generate reports by selecting a class and viewing data.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
