"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, CreditCard, Calendar, User } from "lucide-react"

const recentPayments = [
  {
    id: 1,
    studentName: "Alice Johnson",
    studentId: "STU-001",
    grade: "Grade 10",
    feeType: "Tuition Fees",
    amount: 5000,
    paymentMethod: "Credit Card",
    transactionId: "TXN-2024-001",
    paymentDate: "2024-02-28",
    status: "completed",
  },
  {
    id: 2,
    studentName: "Bob Smith",
    studentId: "STU-002",
    grade: "Grade 8",
    feeType: "Transport Fees",
    amount: 2500,
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-2024-002",
    paymentDate: "2024-02-27",
    status: "completed",
  },
  {
    id: 3,
    studentName: "Carol Davis",
    studentId: "STU-003",
    grade: "Grade 12",
    feeType: "Tuition Fees",
    amount: 5000,
    paymentMethod: "Cash",
    transactionId: "TXN-2024-003",
    paymentDate: "2024-02-26",
    status: "pending",
  },
  {
    id: 4,
    studentName: "David Wilson",
    studentId: "STU-004",
    grade: "Grade 9",
    feeType: "Activity Fees",
    amount: 500,
    paymentMethod: "Online Payment",
    transactionId: "TXN-2024-004",
    paymentDate: "2024-02-25",
    status: "completed",
  },
  {
    id: 5,
    studentName: "Emma Brown",
    studentId: "STU-005",
    grade: "Grade 11",
    feeType: "Library Fees",
    amount: 150,
    paymentMethod: "Credit Card",
    transactionId: "TXN-2024-005",
    paymentDate: "2024-02-24",
    status: "failed",
  },
]

export function PaymentTracking() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Payment Tracking</h3>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button>Record Payment</Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search payments..." className="pl-10" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by fee type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fee Types</SelectItem>
            <SelectItem value="tuition">Tuition Fees</SelectItem>
            <SelectItem value="transport">Transport Fees</SelectItem>
            <SelectItem value="library">Library Fees</SelectItem>
            <SelectItem value="activity">Activity Fees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {recentPayments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{payment.studentName}</h4>
                      <Badge variant="outline">{payment.studentId}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {payment.grade}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {payment.paymentDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">${payment.amount.toLocaleString()}</span>
                    <Badge
                      variant={
                        payment.status === "completed"
                          ? "default"
                          : payment.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {payment.feeType} • {payment.paymentMethod}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Transaction ID: {payment.transactionId}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    View Receipt
                  </Button>
                  {payment.status === "failed" && <Button size="sm">Retry Payment</Button>}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
