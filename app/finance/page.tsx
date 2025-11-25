"use client"

import { useAuth } from "@/hooks/use-auth"
import { useFinanceDashboard } from "@/lib/api/dashboard"
import { useFees, usePayments } from "@/lib/api/finance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, DollarSign, TrendingUp, AlertCircle, Users, FileText, Calendar } from "lucide-react"
import Link from "next/link"

export default function FinancePage() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading } = useFinanceDashboard()
  const { data: feesData } = useFees()
  const { data: paymentsData } = usePayments()

  const dashboard = dashboardData?.dashboard
  const fees = Array.isArray(feesData?.data) ? feesData.data : (feesData?.fees?.data || [])
  const payments = Array.isArray(paymentsData?.data) ? paymentsData.data : (paymentsData?.payments?.data || [])

  // Calculate stats from real data
  const totalRevenue = payments
    .filter((p: any) => p.status === "paid" || p.status === "completed")
    .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0)

  const pendingPayments = fees.filter((f: any) => 
    !f.paid || f.status === "pending" || f.status === "unpaid"
  )

  const totalPendingAmount = pendingPayments.reduce((sum: number, f: any) => 
    sum + (Number(f.amount) || 0), 0
  )

  const paidCount = payments.filter((p: any) => 
    p.status === "paid" || p.status === "completed"
  ).length

  const upcomingDue = fees
    .filter((f: any) => !f.paid && f.due_date)
    .sort((a: any, b: any) => 
      new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
    )
    .slice(0, 5)

  if (dashboardLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Manage school fees, payments, and financial operations
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Finance Officer
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{totalRevenue.toLocaleString() || dashboard?.total_revenue?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">Collected payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments.length || dashboard?.pending_payments || 0}</div>
            <p className="text-xs text-muted-foreground">
              ₦{totalPendingAmount.toLocaleString() || "0"} outstanding
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCount || dashboard?.total_students_paid || 0}</div>
            <p className="text-xs text-muted-foreground">With completed payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length || 0}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Due Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Due Dates</CardTitle>
              <CardDescription>Fees that are due soon</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingDue.length > 0 ? (
                <div className="space-y-3">
                  {upcomingDue.map((fee: any) => (
                    <div key={fee.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{fee.student_name || fee.student?.name || "Student"}</p>
                        <p className="text-sm text-muted-foreground">
                          {fee.fee_type || fee.type || "Fee"} • ₦{Number(fee.amount || 0).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">
                        <Calendar className="w-3 h-3 mr-1" />
                        {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : "TBD"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming due dates</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/finance/fees"
                className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <FileText className="w-5 h-5 mr-3" />
                <span>Manage Fees</span>
              </Link>
              <Link
                href="/finance/payments"
                className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <DollarSign className="w-5 h-5 mr-3" />
                <span>Record Payment</span>
              </Link>
              <Link
                href="/finance/reports"
                className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                <span>View Reports</span>
              </Link>
              <Link
                href="/finance/structure"
                className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
              >
                <FileText className="w-5 h-5 mr-3" />
                <span>Fee Structure</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
