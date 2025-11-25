"use client"

import { useAuth } from "@/hooks/use-auth"
import { useLibrarianDashboard } from "@/lib/api/dashboard"
import { useLibraryBooks, useLibraryBorrowed } from "@/lib/api/library"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen, Users, AlertCircle, Calendar, FileText } from "lucide-react"
import Link from "next/link"

export default function LibraryDashboard() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading: dashboardLoading } = useLibrarianDashboard()
  const { data: booksData } = useLibraryBooks()
  const { data: borrowedData } = useLibraryBorrowed()

  const dashboard = dashboardData?.dashboard
  const books = Array.isArray(booksData?.data) ? booksData.data : (booksData?.books?.data || [])
  const borrowed = Array.isArray(borrowedData?.data) ? borrowedData.data : (borrowedData?.borrowed?.data || [])

  // Calculate stats
  const totalBooks = books.length || dashboard?.total_books || 0
  const borrowedBooks = borrowed.filter((b: any) => 
    !b.returned || b.status === "borrowed" || b.status === "active"
  )
  const overdueBooks = borrowed.filter((b: any) => {
    if (!b.due_date || b.returned) return false
    return new Date(b.due_date) < new Date()
  })

  // Recent borrows
  const recentBorrows = borrowed
    .sort((a: any, b: any) => 
      new Date(b.created_at || b.borrowed_at || 0).getTime() - 
      new Date(a.created_at || a.borrowed_at || 0).getTime()
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
          <h1 className="text-3xl font-bold tracking-tight">Library Dashboard</h1>
          <p className="text-muted-foreground">Manage books, digital resources, and library operations</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Librarian
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
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">In library</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed Books</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{borrowedBooks.length || dashboard?.borrowed_books || 0}</div>
            <p className="text-xs text-muted-foreground">Currently out</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{overdueBooks.length || dashboard?.overdue_books || 0}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks - borrowedBooks.length}</div>
            <p className="text-xs text-muted-foreground">Ready to borrow</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Borrows */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Borrows</CardTitle>
              <CardDescription>Latest book borrowing activities</CardDescription>
            </CardHeader>
            <CardContent>
              {recentBorrows.length > 0 ? (
                <div className="space-y-3">
                  {recentBorrows.map((borrow: any) => (
                    <div key={borrow.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{borrow.book?.title || borrow.book_title || "Book"}</p>
                        <p className="text-sm text-muted-foreground">
                          {borrow.student?.name || borrow.student_name || "Student"} • 
                          Due: {borrow.due_date ? new Date(borrow.due_date).toLocaleDateString() : "TBD"}
                        </p>
                      </div>
                      {new Date(borrow.due_date) < new Date() && !borrow.returned ? (
                        <Badge variant="destructive">Overdue</Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent borrows</p>
              )}
            </CardContent>
          </Card>

          {/* Overdue Books Alert */}
          {overdueBooks.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Overdue Books
                </CardTitle>
                <CardDescription>Books that need to be returned</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {overdueBooks.slice(0, 5).map((borrow: any) => (
                    <div key={borrow.id} className="p-2 border border-red-200 rounded bg-white">
                      <p className="font-medium text-sm">{borrow.book?.title || borrow.book_title}</p>
                      <p className="text-xs text-muted-foreground">
                        {borrow.student?.name || borrow.student_name} • 
                        Overdue since: {borrow.due_date ? new Date(borrow.due_date).toLocaleDateString() : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
