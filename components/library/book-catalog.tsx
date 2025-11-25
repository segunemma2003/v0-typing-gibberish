"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, BookOpen, Loader2 } from "lucide-react"
import { useBooks } from "@/lib/api/library"
import { useState } from "react"

export function BookCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const { data: booksResponse, isLoading } = useBooks({
    search: searchTerm || undefined,
    per_page: 50,
  })

  const books = booksResponse?.books || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default"
      case "unavailable":
        return "destructive"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Book Catalog</h2>
        <Button>Add New Book</Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search books, authors, ISBN..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book: any) => (
            <Card key={book.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-20 bg-muted rounded-md flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{book.category}</Badge>
                  <Badge variant={getStatusColor(book.status)}>{book.status}</Badge>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  {book.isbn && (
                    <div className="flex items-center justify-between">
                      <span>ISBN: {book.isbn}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>
                      Available: {book.available_copies}/{book.total_copies}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1" disabled={book.available_copies === 0}>
                    {book.status === "available" ? "Borrow" : "Unavailable"}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center py-12">
            <p className="text-muted-foreground">No books found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
