"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, FileText, BarChart, TrendingUp, Users } from "lucide-react"

export default function ReportsPage() {
  const reports = [
    {
      id: "1",
      title: "Academic Performance Report",
      description: "Overall student performance metrics for Q1 2024",
      type: "Academic",
      date: "2024-03-15",
      status: "Published",
      downloads: 45,
    },
    {
      id: "2",
      title: "Attendance Report",
      description: "Student attendance summary for March 2024",
      type: "Attendance",
      date: "2024-03-01",
      status: "Published",
      downloads: 32,
    },
    {
      id: "3",
      title: "Financial Report Q1",
      description: "Quarterly financial summary and budget analysis",
      type: "Financial",
      date: "2024-03-30",
      status: "Draft",
      downloads: 12,
    },
    {
      id: "4",
      title: "Staff Performance Review",
      description: "Annual staff evaluation and performance metrics",
      type: "HR",
      date: "2024-03-20",
      status: "Published",
      downloads: 28,
    },
  ]

  const stats = [
    {
      title: "Total Reports",
      value: "24",
      icon: FileText,
      trend: "+12%",
      color: "text-blue-600",
    },
    {
      title: "Published",
      value: "18",
      icon: BarChart,
      trend: "+8%",
      color: "text-green-600",
    },
    {
      title: "Downloads",
      value: "542",
      icon: TrendingUp,
      trend: "+24%",
      color: "text-purple-600",
    },
    {
      title: "Active Users",
      value: "89",
      icon: Users,
      trend: "+5%",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and manage school reports</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.trend}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>View and download generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline">{report.type}</Badge>
                      <span className="text-xs text-muted-foreground">Generated: {report.date}</span>
                      <span className="text-xs text-muted-foreground">{report.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={report.status === "Published" ? "default" : "secondary"}>
                    {report.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    View
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
