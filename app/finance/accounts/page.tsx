"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, User, Calendar, AlertCircle } from "lucide-react"

const studentAccounts = [
  {
    id: 1,
    studentName: "Alice Johnson",
    studentId: "STU-001",
    grade: "Grade 10",
    totalFees: 7650,
    paidAmount: 7650,
    pendingAmount: 0,
    overdueAmount: 0,
    lastPayment: "2024-02-28",
    status: "paid",
    parentContact: "+1 234-567-8901",
  },
  {
    id: 2,
    studentName: "Bob Smith",
    studentId: "STU-002",
    grade: "Grade 8",
    totalFees: 7150,
    paidAmount: 5000,
    pendingAmount: 2150,
    overdueAmount: 0,
    lastPayment: "2024-02-15",
    status: "partial",
    parentContact: "+1 234-567-8902",
  },
  {
    id: 3,
    studentName: "Carol Davis",
    studentId: "STU-003",
    grade: "Grade 12",
    totalFees: 8000,
    paidAmount: 3000,
    pendingAmount: 2500,
    overdueAmount: 2500,
    lastPayment: "2024-01-20",
    status: "overdue",
    parentContact: "+1 234-567-8903",
  },
  {
    id: 4,
    studentName: "David Wilson",
    studentId: "STU-004",
    grade: "Grade 9",
    totalFees: 7650,
    paidAmount: 7150,
    pendingAmount: 500,
    overdueAmount: 0,
    lastPayment: "2024-02-25",
    status: "partial",
    parentContact: "+1 234-567-8904",
  },
]

export default function StudentAccountsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Accounts</h1>
          <p className="text-muted-foreground">Track individual student fee payments and balances</p>
        </div>
        <Button>Generate Statements</Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="paid">Fully Paid</SelectItem>
            <SelectItem value="partial">Partial Payment</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by grade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            <SelectItem value="grade-1-5">Grade 1-5</SelectItem>
            <SelectItem value="grade-6-8">Grade 6-8</SelectItem>
            <SelectItem value="grade-9-10">Grade 9-10</SelectItem>
            <SelectItem value="grade-11-12">Grade 11-12</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {studentAccounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">{account.studentName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {account.studentId} • {account.grade}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    account.status === "paid" ? "default" : account.status === "overdue" ? "destructive" : "secondary"
                  }
                >
                  {account.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Fees:</span>
                  <p className="font-medium">${account.totalFees.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Paid Amount:</span>
                  <p className="font-medium text-green-600">${account.paidAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pending:</span>
                  <p className="font-medium text-orange-600">${account.pendingAmount.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Overdue:</span>
                  <p className="font-medium text-red-600">${account.overdueAmount.toLocaleString()}</p>
                </div>
              </div>

              {account.overdueAmount > 0 && (
                <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">
                    ${account.overdueAmount.toLocaleString()} overdue payment
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last Payment: {account.lastPayment}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View Statement
                </Button>
                <Button size="sm" className="flex-1">
                  Send Reminder
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
