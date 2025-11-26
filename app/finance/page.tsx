"use client"

import { useAuth } from "@/hooks/use-auth"
import { useFinanceDashboard } from "@/lib/api/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Users,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  Receipt,
  CreditCard,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function FinancePage() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useFinanceDashboard()

  const dashboard = dashboardData
  const stats = dashboard?.stats || {
    total_revenue: { today: 0, this_month: 0, this_term: 0, this_year: 0 },
    pending_fees: { amount: 0, students: 0 },
    expenses: { today: 0, this_month: 0, this_term: 0 },
    payroll: { pending: 0, paid_this_month: 0 },
    outstanding_invoices: 0,
    overdue_payments: 0,
    profit_margin: 0,
  }

  const recentTransactions = dashboard?.recent_transactions || []
  const pendingApprovals = dashboard?.pending_approvals || []

  if (dashboardLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {dashboard?.user?.name || user?.name}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {dashboard?.user?.role || "Finance Officer"}
        </Badge>
      </div>

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue.today)}</div>
            <p className="text-xs text-muted-foreground">Collected today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue.this_month)}</div>
            <p className="text-xs text-muted-foreground">Monthly revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Term</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue.this_term)}</div>
            <p className="text-xs text-muted-foreground">Term revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue.this_year)}</div>
            <p className="text-xs text-muted-foreground">Annual revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pending_fees.amount)}</div>
            <p className="text-xs text-muted-foreground">{stats.pending_fees.students} students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses (Month)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.expenses.this_month)}</div>
            <p className="text-xs text-muted-foreground">Monthly expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payroll Pending</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.payroll.pending)}</div>
            <p className="text-xs text-muted-foreground">Unpaid salaries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profit_margin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Current margin</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertCircle className="h-5 w-5" />
              Outstanding Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-800 dark:text-orange-200">
              {stats.outstanding_invoices}
            </div>
            <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
              Invoices pending payment
            </p>
            <Link href="/finance/invoices">
              <Button variant="outline" size="sm" className="mt-3">
                View Invoices
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              Overdue Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-800 dark:text-red-200">
              {stats.overdue_payments}
            </div>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Payments past due date
            </p>
            <Link href="/finance/payments">
              <Button variant="outline" size="sm" className="mt-3">
                View Payments
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Expense Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Expense Summary</CardTitle>
                  <CardDescription>Expense breakdown by period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Today</p>
                        <p className="text-xs text-muted-foreground">Daily expenses</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(stats.expenses.today)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">This Month</p>
                        <p className="text-xs text-muted-foreground">Monthly expenses</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(stats.expenses.this_month)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">This Term</p>
                        <p className="text-xs text-muted-foreground">Term expenses</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{formatCurrency(stats.expenses.this_term)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payroll Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Payroll Summary</CardTitle>
                  <CardDescription>Salary payment overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Pending Payments</p>
                        <p className="text-xs text-muted-foreground">Unpaid salaries</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">
                          {formatCurrency(stats.payroll.pending)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Paid This Month</p>
                        <p className="text-xs text-muted-foreground">Completed payments</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          {formatCurrency(stats.payroll.paid_this_month)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Link href="/finance/salary">
                    <Button variant="outline" className="mt-4 w-full">
                      Manage Payroll
                    </Button>
                  </Link>
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
                    href="/finance/payments"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <CreditCard className="w-5 h-5 mr-3" />
                    <span>Record Payment</span>
                  </Link>
                  <Link
                    href="/finance/fees"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    <span>Manage Fees</span>
                  </Link>
                  <Link
                    href="/finance/structure"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    <span>Fee Structure</span>
                  </Link>
                  <Link
                    href="/finance/reports"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <BarChart3 className="w-5 h-5 mr-3" />
                    <span>View Reports</span>
                  </Link>
                  <Link
                    href="/finance/accounts"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span>Student Accounts</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Recent Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {transaction.type === "payment" ? (
                          <Receipt className="w-5 h-5 text-green-600" />
                        ) : transaction.type === "expense" ? (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-blue-600" />
                        )}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.date && format(new Date(transaction.date), "MMM dd, yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold ${
                            transaction.type === "payment" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "payment" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge
                          variant={
                            transaction.status === "completed" || transaction.status === "paid"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No recent transactions</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Items awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingApprovals.length > 0 ? (
                <div className="space-y-3">
                  {pendingApprovals.map((approval: any) => (
                    <div
                      key={approval.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium">{approval.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Requested by {approval.requested_by} •{" "}
                            {approval.date && format(new Date(approval.date), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(approval.amount)}</p>
                        <Badge variant="outline" className="mt-1">
                          {approval.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
                  <p>No pending approvals</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
