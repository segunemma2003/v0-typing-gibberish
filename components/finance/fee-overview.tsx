"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react"

const feeCategories = [
  {
    id: 1,
    name: "Tuition Fees",
    totalAmount: 2500000,
    collectedAmount: 2100000,
    pendingAmount: 400000,
    dueDate: "2024-03-31",
    studentsTotal: 500,
    studentsPaid: 420,
    studentsPending: 80,
  },
  {
    id: 2,
    name: "Transport Fees",
    totalAmount: 450000,
    collectedAmount: 380000,
    pendingAmount: 70000,
    dueDate: "2024-03-15",
    studentsTotal: 180,
    studentsPaid: 152,
    studentsPending: 28,
  },
  {
    id: 3,
    name: "Library Fees",
    totalAmount: 75000,
    collectedAmount: 68000,
    pendingAmount: 7000,
    dueDate: "2024-04-30",
    studentsTotal: 500,
    studentsPaid: 453,
    studentsPending: 47,
  },
  {
    id: 4,
    name: "Activity Fees",
    totalAmount: 125000,
    collectedAmount: 95000,
    pendingAmount: 30000,
    dueDate: "2024-03-20",
    studentsTotal: 250,
    studentsPaid: 190,
    studentsPending: 60,
  },
]

export function FeeOverview() {
  const totalCollected = feeCategories.reduce((sum, fee) => sum + fee.collectedAmount, 0)
  const totalPending = feeCategories.reduce((sum, fee) => sum + fee.pendingAmount, 0)
  const totalAmount = feeCategories.reduce((sum, fee) => sum + fee.totalAmount, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Expected this term</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalCollected / totalAmount) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((totalPending / totalAmount) * 100).toFixed(1)}% remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">Students paid on time</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Fee Categories</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {feeCategories.map((fee) => (
            <Card key={fee.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{fee.name}</CardTitle>
                  <Badge variant="outline">Due: {fee.dueDate}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collection Progress</span>
                    <span className="font-medium">
                      ${fee.collectedAmount.toLocaleString()} / ${fee.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(fee.collectedAmount / fee.totalAmount) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Students Paid:</span>
                    <p className="font-medium text-green-600">
                      {fee.studentsPaid} / {fee.studentsTotal}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pending:</span>
                    <p className="font-medium text-orange-600">{fee.studentsPending} students</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Send Reminders
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
