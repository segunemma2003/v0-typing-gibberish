"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Send } from "lucide-react"
import { useState } from "react"

export default function TeacherMessagesPage() {
  const [showCompose, setShowCompose] = useState(false)

  const messages = [
    { id: "1", from: "Parent - Alice Johnson", subject: "Question about homework", date: "2024-04-01", unread: true },
    { id: "2", from: "Admin Office", subject: "Staff meeting reminder", date: "2024-03-30", unread: false },
    { id: "3", from: "Parent - Bob Smith", subject: "Absence notification", date: "2024-03-28", unread: false },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Communicate with parents and staff</p>
        </div>
        <Button onClick={() => setShowCompose(!showCompose)}>
          <Plus className="w-4 h-4 mr-2" />
          Compose
        </Button>
      </div>

      {showCompose && (
        <Card>
          <CardHeader>
            <CardTitle>New Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="To:" />
            <Input placeholder="Subject:" />
            <Textarea placeholder="Message..." rows={5} />
            <div className="flex gap-2">
              <Button>
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
              <Button variant="outline" onClick={() => setShowCompose(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {messages.map((message) => (
              <div key={message.id} className={`p-4 border rounded-lg hover:bg-accent cursor-pointer ${message.unread ? 'bg-blue-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-semibold ${message.unread ? 'text-blue-600' : ''}`}>{message.from}</p>
                      {message.unread && <Badge variant="default">New</Badge>}
                    </div>
                    <p className="text-sm">{message.subject}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
