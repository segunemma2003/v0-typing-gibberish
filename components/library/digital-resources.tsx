import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Headphones, FileText, Video, Download, ExternalLink } from "lucide-react"

interface DigitalResource {
  id: string
  title: string
  type: "ebook" | "audiobook" | "video" | "document"
  category: string
  author?: string
  duration?: string
  size?: string
  format: string
  downloads: number
  rating: number
  description: string
  url: string
}

export function DigitalResources() {
  const resources: DigitalResource[] = [
    {
      id: "1",
      title: "Introduction to Computer Science",
      type: "ebook",
      category: "Technology",
      author: "Dr. John Smith",
      format: "PDF",
      size: "15.2 MB",
      downloads: 245,
      rating: 4.7,
      description: "Comprehensive guide to computer science fundamentals and programming concepts.",
      url: "#",
    },
    {
      id: "2",
      title: "Shakespeare's Complete Works",
      type: "audiobook",
      category: "Literature",
      author: "William Shakespeare",
      duration: "45h 30m",
      format: "MP3",
      size: "2.1 GB",
      downloads: 189,
      rating: 4.9,
      description: "Complete collection of Shakespeare's plays and sonnets in audio format.",
      url: "#",
    },
    {
      id: "3",
      title: "Physics Experiments Demo",
      type: "video",
      category: "Science",
      author: "Prof. Emily Chen",
      duration: "2h 15m",
      format: "MP4",
      size: "850 MB",
      downloads: 156,
      rating: 4.6,
      description: "Interactive physics experiments and demonstrations for high school students.",
      url: "#",
    },
    {
      id: "4",
      title: "World History Timeline",
      type: "document",
      category: "History",
      author: "History Department",
      format: "PDF",
      size: "8.5 MB",
      downloads: 312,
      rating: 4.4,
      description: "Comprehensive timeline of world historical events from ancient to modern times.",
      url: "#",
    },
  ]

  const getTypeIcon = (type: DigitalResource["type"]) => {
    switch (type) {
      case "ebook":
        return <FileText className="w-5 h-5 text-blue-500" />
      case "audiobook":
        return <Headphones className="w-5 h-5 text-green-500" />
      case "video":
        return <Video className="w-5 h-5 text-red-500" />
      case "document":
        return <FileText className="w-5 h-5 text-purple-500" />
    }
  }

  const getTypeColor = (type: DigitalResource["type"]) => {
    switch (type) {
      case "ebook":
        return "default"
      case "audiobook":
        return "secondary"
      case "video":
        return "destructive"
      case "document":
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Digital Resources</h2>
        <Button>Upload Resource</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {resources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-muted rounded-lg">
                  {getTypeIcon(resource.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg line-clamp-1">{resource.title}</CardTitle>
                    <Badge variant={getTypeColor(resource.type)} className="text-xs">
                      {resource.type}
                    </Badge>
                  </div>
                  {resource.author && <p className="text-sm text-muted-foreground">by {resource.author}</p>}
                  <Badge variant="outline" className="text-xs">
                    {resource.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{resource.description}</p>

              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Format:</span> {resource.format}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {resource.size || resource.duration}
                </div>
                <div>
                  <span className="font-medium">Downloads:</span> {resource.downloads}
                </div>
                <div>
                  <span className="font-medium">Rating:</span> {resource.rating}/5
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Popularity</span>
                  <span>{Math.round((resource.downloads / 500) * 100)}%</span>
                </div>
                <Progress value={(resource.downloads / 500) * 100} className="h-2" />
              </div>

              <div className="flex space-x-2">
                <Button size="sm" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
