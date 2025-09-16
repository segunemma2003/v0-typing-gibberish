import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, User, AlertTriangle } from "lucide-react"

interface BorrowedBook {
  id: string
  title: string
  author: string
  borrower: string
  borrowerRole: "student" | "teacher" | "staff"
  borrowDate: string
  dueDate: string
  status: "active" | "overdue" | "renewed"
  renewals: number
  maxRenewals: number
}

export function BorrowedBooks() {
  const borrowedBooks: BorrowedBook[] = [
    {
      id: "1",
      title: "1984",
      author: "George Orwell",
      borrower: "Alice Johnson",
      borrowerRole: "student",
      borrowDate: "2024-02-15",
      dueDate: "2024-03-15",
      status: "active",
      renewals: 0,
      maxRenewals: 2,
    },
    {
      id: "2",
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      borrower: "Bob Smith",
      borrowerRole: "student",
      borrowDate: "2024-02-10",
      dueDate: "2024-03-10",
      status: "overdue",
      renewals: 1,
      maxRenewals: 2,
    },
    {
      id: "3",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      borrower: "Dr. Sarah Wilson",
      borrowerRole: "teacher",
      borrowDate: "2024-02-20",
      dueDate: "2024-03-20",
      status: "renewed",
      renewals: 1,
      maxRenewals: 3,
    },
    {
      id: "4",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      borrower: "Carol Davis",
      borrowerRole: "student",
      borrowDate: "2024-02-25",
      dueDate: "2024-03-25",
      status: "active",
      renewals: 0,
      maxRenewals: 2,
    },
  ]

  const getStatusColor = (status: BorrowedBook["status"]) => {
    switch (status) {
      case "active":
        return "default"
      case "overdue":
        return "destructive"
      case "renewed":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleColor = (role: BorrowedBook["borrowerRole"]) => {
    switch (role) {
      case "student":
        return "outline"
      case "teacher":
        return "secondary"
      case "staff":
        return "default"
      default:
        return "outline"
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currently Borrowed Books</CardTitle>
        <CardDescription>Books currently checked out from the library</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {borrowedBooks.map((book) => {
            const daysUntilDue = getDaysUntilDue(book.dueDate)
            return (
              <div key={book.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-lg">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{book.title}</h4>
                      {book.status === "overdue" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{book.borrower}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Due: {book.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getRoleColor(book.borrowerRole)} className="text-xs">
                        {book.borrowerRole}
                      </Badge>
                      <Badge variant={getStatusColor(book.status)} className="text-xs">
                        {book.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {daysUntilDue > 0 ? `${daysUntilDue} days left` : `${Math.abs(daysUntilDue)} days overdue`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Renewals: {book.renewals}/{book.maxRenewals}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Button size="sm" variant="outline">
                      Return
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={book.renewals >= book.maxRenewals}
                      className="bg-transparent"
                    >
                      Renew
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
