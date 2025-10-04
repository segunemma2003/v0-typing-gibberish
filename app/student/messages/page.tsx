import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StudentMessagesPage() {
  const messages = [
    { from: "Dr. Wilson", subject: "Assignment feedback", date: "2024-04-01", unread: true },
    { from: "School Admin", subject: "Event reminder", date: "2024-03-30", unread: false },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Messages</h1>
      <Card>
        <CardHeader><CardTitle>Inbox</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`p-4 border rounded-lg ${msg.unread ? 'bg-blue-50' : ''}`}>
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">{msg.from}</p>
                    <p className="text-sm">{msg.subject}</p>
                  </div>
                  {msg.unread && <Badge>New</Badge>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
