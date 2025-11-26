"use client"

import { useAuth } from "@/hooks/use-auth"
import { useLibrarianDashboard } from "@/lib/api/dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  BookOpen,
  Users,
  AlertCircle,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Tag,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default function LibraryDashboard() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading, refetch: refetchDashboard } = useLibrarianDashboard()

  const dashboard = dashboardData
  const stats = dashboard?.stats || {
    total_books: 0,
    available_books: 0,
    borrowed_books: 0,
    overdue_books: 0,
    total_members: 0,
    active_members: 0,
    books_added_this_month: 0,
    popular_categories: [],
  }

  const recentBorrows = dashboard?.recent_borrows || []
  const overdueList = dashboard?.overdue_list || []
  const pendingRequests = dashboard?.pending_requests || []

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
          <h1 className="text-3xl font-bold tracking-tight">Library Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {dashboard?.user?.name || user?.name}
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {dashboard?.user?.role || "Librarian"}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_books.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">In library collection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Books</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.available_books.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Ready to borrow</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed Books</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.borrowed_books.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Currently out</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdue_books.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_members.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Library members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_members.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active borrowers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Books (Month)</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.books_added_this_month}</div>
            <p className="text-xs text-muted-foreground">Added this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.overdue_books > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              Overdue Books Alert
            </CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              {stats.overdue_books} book{stats.overdue_books !== 1 ? "s" : ""} need to be returned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/library/borrowed">
              <Button variant="outline" size="sm">
                View Overdue Books
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent">Recent Borrows</TabsTrigger>
          <TabsTrigger value="overdue">Overdue List</TabsTrigger>
          <TabsTrigger value="requests">Pending Requests</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Popular Categories */}
              {stats.popular_categories && stats.popular_categories.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Categories</CardTitle>
                    <CardDescription>Most borrowed book categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.popular_categories.map((category: any) => (
                        <div
                          key={category.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <Badge variant="outline">{category.count} books</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Library Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Borrow Rate</p>
                      <p className="text-2xl font-bold">
                        {stats.total_books > 0
                          ? ((stats.borrowed_books / stats.total_books) * 100).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Availability Rate</p>
                      <p className="text-2xl font-bold text-green-600">
                        {stats.total_books > 0
                          ? ((stats.available_books / stats.total_books) * 100).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Member Activity</p>
                      <p className="text-2xl font-bold">
                        {stats.total_members > 0
                          ? ((stats.active_members / stats.total_members) * 100).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Overdue Rate</p>
                      <p className="text-2xl font-bold text-red-600">
                        {stats.borrowed_books > 0
                          ? ((stats.overdue_books / stats.borrowed_books) * 100).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
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
                    href="/library/catalog"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <BookOpen className="w-5 h-5 mr-3" />
                    <span>View Catalog</span>
                  </Link>
                  <Link
                    href="/library/borrowed"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span>Borrowed Books</span>
                  </Link>
                  <Link
                    href="/library/stats"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <FileText className="w-5 h-5 mr-3" />
                    <span>Statistics</span>
                  </Link>
                  <Link
                    href="/library/members"
                    className="flex items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    <span>Members</span>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Recent Borrows Tab */}
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Borrows</CardTitle>
              <CardDescription>Latest book borrowing activities</CardDescription>
            </CardHeader>
            <CardContent>
              {recentBorrows.length > 0 ? (
                <div className="space-y-3">
                  {recentBorrows.map((borrow: any) => (
                    <div
                      key={borrow.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{borrow.book?.title || "Book"}</p>
                          <p className="text-sm text-muted-foreground">
                            by {borrow.book?.author || "Unknown"} • Borrowed by{" "}
                            {borrow.student?.name || "Student"} ({borrow.student?.admission_number || ""})
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Borrowed:{" "}
                            {borrow.borrowed_at &&
                              format(new Date(borrow.borrowed_at), "MMM dd, yyyy HH:mm")}
                            {" • "}
                            Due:{" "}
                            {borrow.due_date && format(new Date(borrow.due_date), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          borrow.status === "returned"
                            ? "default"
                            : new Date(borrow.due_date) < new Date()
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {borrow.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No recent borrows</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overdue List Tab */}
        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Overdue Books
              </CardTitle>
              <CardDescription>Books that need to be returned immediately</CardDescription>
            </CardHeader>
            <CardContent>
              {overdueList.length > 0 ? (
                <div className="space-y-3">
                  {overdueList.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20"
                    >
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="font-medium">{item.book?.title || "Book"}</p>
                          <p className="text-sm text-muted-foreground">
                            by {item.book?.author || "Unknown"} • Borrowed by{" "}
                            {item.student?.name || "Student"} ({item.student?.admission_number || ""})
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            Due: {item.due_date && format(new Date(item.due_date), "MMM dd, yyyy")} •{" "}
                            {item.days_overdue} day{item.days_overdue !== 1 ? "s" : ""} overdue
                            {item.fine && ` • Fine: ₦${item.fine.toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant="destructive">Overdue</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
                  <p>No overdue books</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>Book requests awaiting approval</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length > 0 ? (
                <div className="space-y-3">
                  {pendingRequests.map((request: any) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="font-medium">{request.book?.title || "Book"}</p>
                          <p className="text-sm text-muted-foreground">
                            Requested by {request.student?.name || "Student"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Requested:{" "}
                            {request.requested_at &&
                              format(new Date(request.requested_at), "MMM dd, yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{request.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-600" />
                  <p>No pending requests</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
