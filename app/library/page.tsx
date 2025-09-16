import { BookCatalog } from "@/components/library/book-catalog"
import { BorrowedBooks } from "@/components/library/borrowed-books"
import { DigitalResources } from "@/components/library/digital-resources"
import { LibraryStats } from "@/components/library/library-stats"

export default function LibraryDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Library Management</h1>
          <p className="text-muted-foreground">Manage books, digital resources, and library operations.</p>
        </div>
      </div>

      {/* Library Stats */}
      <LibraryStats />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <BookCatalog />
        </div>
        <div className="space-y-6">
          <BorrowedBooks />
        </div>
      </div>

      {/* Digital Resources */}
      <DigitalResources />
    </div>
  )
}
