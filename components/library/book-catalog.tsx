import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, BookOpen, Star } from "lucide-react"

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  status: "available" | "borrowed" | "reserved"
  rating: number
  publishYear: number
  copies: number
  availableCopies: number
  cover?: string
  description: string
}

export function BookCatalog() {
  const books: Book[] = [
    {
      id: "1",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      category: "Literature",
      status: "available",
      rating: 4.8,
      publishYear: 1960,
      copies: 5,
      availableCopies: 3,
      description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    },
    {
      id: "2",
      title: "1984",
      author: "George Orwell",
      isbn: "978-0-452-28423-4",
      category: "Science Fiction",
      status: "borrowed",
      rating: 4.7,
      publishYear: 1949,
      copies: 4,
      availableCopies: 0,
      description: "A dystopian social science fiction novel about totalitarian control.",
    },
    {
      id: "3",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
      category: "Literature",
      status: "available",
      rating: 4.5,
      publishYear: 1925,
      copies: 6,
      availableCopies: 4,
      description: "A classic American novel about the Jazz Age and the American Dream.",
    },
    {
      id: "4",
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      isbn: "978-0-553-38016-3",
      category: "Science",
      status: "reserved",
      rating: 4.6,
      publishYear: 1988,
      copies: 3,
      availableCopies: 1,
      description: "A landmark volume in science writing exploring the nature of the universe.",
    },
  ]

  const getStatusColor = (status: Book["status"]) => {
    switch (status) {
      case "available":
        return "default"
      case "borrowed":
        return "destructive"
      case "reserved":
        return "secondary"
      default:
        return "outline"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
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
              <Input placeholder="Search books, authors, ISBN..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card key={book.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-20 bg-muted rounded-md flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                  <div className="flex items-center space-x-1">
                    {renderStars(book.rating)}
                    <span className="text-xs text-muted-foreground ml-1">({book.rating})</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{book.category}</Badge>
                <Badge variant={getStatusColor(book.status)}>{book.status}</Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Published: {book.publishYear}</span>
                  <span>ISBN: {book.isbn.slice(-4)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    Available: {book.availableCopies}/{book.copies}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1" disabled={book.availableCopies === 0}>
                  {book.status === "available" ? "Borrow" : "Reserve"}
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
