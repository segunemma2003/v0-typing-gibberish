import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface Submission {
  id: string
  studentName: string
  assignment: string
  subject: string
  submittedAt: string
  status: "pending" | "graded" | "late"
  grade?: string
}

export function RecentSubmissions() {
  const submissions: Submission[] = [
    {
      id: "1",
      studentName: "Alice Johnson",
      assignment: "Quadratic Equations Worksheet",
      subject: "Mathematics",
      submittedAt: "2 hours ago",
      status: "pending",
    },
    {
      id: "2",
      studentName: "Bob Smith",
      assignment: "Physics Lab Report",
      subject: "Physics",
      submittedAt: "4 hours ago",
      status: "graded",
      grade: "A-",
    },
    {
      id: "3",
      studentName: "Carol Davis",
      assignment: "Calculus Problem Set",
      subject: "Mathematics",
      submittedAt: "1 day ago",
      status: "late",
    },
    {
      id: "4",
      studentName: "David Wilson",
      assignment: "Motion Analysis",
      subject: "Physics",
      submittedAt: "6 hours ago",
      status: "pending",
    },
  ]

  const getStatusIcon = (status: Submission["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "graded":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "late":
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: Submission["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending Review</Badge>
      case "graded":
        return <Badge variant="default">Graded</Badge>
      case "late":
        return <Badge variant="destructive">Late Submission</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Submissions</CardTitle>
        <CardDescription>Latest assignment submissions from your students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback>
                    {submission.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{submission.studentName}</h4>
                    {getStatusIcon(submission.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{submission.assignment}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {submission.subject}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{submission.submittedAt}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {submission.grade && (
                  <div className="text-right">
                    <p className="text-sm font-medium">Grade: {submission.grade}</p>
                  </div>
                )}
                {getStatusBadge(submission.status)}
                <Button size="sm" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
