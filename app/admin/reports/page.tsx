"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Download, FileText, BarChart, TrendingUp, Users, Loader2 } from "lucide-react"
import { useAttendanceReport, useAcademicReport, useFinancialReport } from "@/lib/api/reports"
import { useClasses } from "@/lib/api/academic"
import { useTerms } from "@/lib/api/academic"
import { useAcademicYears } from "@/lib/api/academic"
import { toast } from "sonner"

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"attendance" | "academic" | "financial">("attendance")
  const [filters, setFilters] = useState({
    start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    class_id: null as number | null,
    term_id: null as number | null,
    academic_year_id: null as number | null,
  })

  const { data: classesResponse } = useClasses()
  const { data: termsResponse } = useTerms()
  const { data: academicYearsResponse } = useAcademicYears()

  const classes = classesResponse?.data || []
  // API returns direct array for terms
  const terms = Array.isArray(termsResponse) ? termsResponse : (termsResponse?.data || [])
  // API returns direct array for academic years
  const academicYears = Array.isArray(academicYearsResponse) ? academicYearsResponse : (academicYearsResponse?.data || [])

  // Fetch reports based on type
  const { data: attendanceReport, isLoading: attendanceLoading } = useAttendanceReport(
    reportType === "attendance" ? filters : undefined
  )

  const { data: academicReport, isLoading: academicLoading } = useAcademicReport(
    reportType === "academic" ? filters : undefined
  )

  const { data: financialReport, isLoading: financialLoading } = useFinancialReport(
    reportType === "financial" ? filters : undefined
  )

  const isLoading = attendanceLoading || academicLoading || financialLoading

  const handleExport = async (format: "pdf" | "excel" | "csv") => {
    try {
      toast.info(`Exporting ${reportType} report as ${format.toUpperCase()}...`)
      // Export functionality would be implemented here
    } catch (error: any) {
      toast.error(error?.message || "Failed to export report")
    }
  }

  const renderAttendanceReport = () => {
    const data = attendanceReport?.data || []
    if (data.length === 0) {
      return <p className="text-center text-muted-foreground py-8">No attendance data available</p>
    }

    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {data.map((report: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-sm">{new Date(report.date).toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Students:</span>
                    <span className="font-medium">{report.total_students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Present:</span>
                    <span className="font-medium text-green-600">{report.present}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Absent:</span>
                    <span className="font-medium text-red-600">{report.absent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Late:</span>
                    <span className="font-medium text-yellow-600">{report.late}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-sm font-medium">Attendance Rate:</span>
                    <span className="font-bold">{report.attendance_percentage}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const renderAcademicReport = () => {
    const data = academicReport?.data || []
    if (data.length === 0) {
      return <p className="text-center text-muted-foreground py-8">No academic data available</p>
    }

    return (
      <div className="space-y-4">
        {data.map((report: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{report.class_name}</CardTitle>
              <CardDescription>Academic Performance Report</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold">{report.total_students}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                  <p className="text-2xl font-bold">{report.average_score}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pass Rate</p>
                  <p className="text-2xl font-bold">{report.pass_rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Students</p>
                  <p className="text-2xl font-bold">{report.top_students?.length || 0}</p>
                </div>
              </div>
              {report.top_students && report.top_students.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Top Performing Students:</p>
                  <div className="space-y-1">
                    {report.top_students.map((student: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{student.name} ({student.admission_number})</span>
                        <span className="font-medium">{student.average_score}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const renderFinancialReport = () => {
    const data = financialReport?.data || []
    if (data.length === 0) {
      return <p className="text-center text-muted-foreground py-8">No financial data available</p>
    }

    return (
      <div className="space-y-4">
        {data.map((report: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>Financial Report - {report.period}</CardTitle>
              <CardDescription>Revenue and Fee Collection Summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${report.total_revenue?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Fees</p>
                  <p className="text-2xl font-bold">${report.total_fees?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid Fees</p>
                  <p className="text-2xl font-bold text-green-600">${report.paid_fees?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Fees</p>
                  <p className="text-2xl font-bold text-red-600">${report.pending_fees?.toLocaleString() || 0}</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Collection Rate:</span>
                  <span className="text-lg font-bold">{report.collection_rate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and manage school reports</p>
        </div>
        <Button onClick={() => handleExport("pdf")} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Report Type Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label>Report Type:</Label>
            <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendance">Attendance Report</SelectItem>
                <SelectItem value="academic">Academic Report</SelectItem>
                <SelectItem value="financial">Financial Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
            </CardContent>
          </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Class (Optional)</Label>
              <Select
                value={filters.class_id?.toString() || "all"}
                onValueChange={(value) => setFilters({ ...filters, class_id: value === "all" ? null : parseInt(value) })}
              >
                <SelectTrigger>
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
                  </div>
            <div className="space-y-2">
              <Label>Term (Optional)</Label>
              <Select
                value={filters.term_id?.toString() || "all"}
                onValueChange={(value) => setFilters({ ...filters, term_id: value === "all" ? null : parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  {terms.map((term: any) => (
                    <SelectItem key={term.id} value={term.id.toString()}>
                      {term.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                    </div>
            <div className="space-y-2">
              <Label>Academic Year (Optional)</Label>
              <Select
                value={filters.academic_year_id?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, academic_year_id: value === "all" ? null : parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {academicYears.map((year: any) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {reportType === "attendance"
                    ? "Attendance Report"
                    : reportType === "academic"
                      ? "Academic Report"
                      : "Financial Report"}
                </CardTitle>
                <CardDescription>
                  {reportType === "attendance"
                    ? "Daily attendance summary"
                    : reportType === "academic"
                      ? "Academic performance metrics"
                      : "Financial revenue and fee collection"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleExport("excel")}>
                  <Download className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {reportType === "attendance" && renderAttendanceReport()}
            {reportType === "academic" && renderAcademicReport()}
            {reportType === "financial" && renderFinancialReport()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
