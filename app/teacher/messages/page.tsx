"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Send, X, Loader2 } from "lucide-react"
import { useMyMessages, useSendMessage } from "@/lib/api/communication"
import { useStudents } from "@/lib/api/students"
import { useAuth } from "@/hooks/use-auth"
import { useTeachers } from "@/lib/api/teachers"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function TeacherMessagesPage() {
  const { user } = useAuth()
  const [showCompose, setShowCompose] = useState(false)
  const [recipientType, setRecipientType] = useState<"students" | "parents" | "staff">("students")
  const [selectedRecipients, setSelectedRecipients] = useState<number[]>([])
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const { data: messagesData, isLoading } = useMyMessages({ per_page: 50 })
  const { data: studentsData } = useStudents({ per_page: 100 })
  const { data: teachersData } = useTeachers()
  const sendMessage = useSendMessage()

  const messages = Array.isArray(messagesData?.data) ? messagesData.data : []
  const students = Array.isArray(studentsData?.data) ? studentsData.data : []
  const teachers = Array.isArray(teachersData?.data) ? teachersData.data : (teachersData?.teachers?.data || [])

  // Get current teacher's students
  const currentTeacher = teachers.find((t: any) => t.id === Number(user?.id) || t.email === user?.email)
  const teacherClasses = currentTeacher?.classes || []
  const teacherClassIds = teacherClasses.map((c: any) => c.id)
  const myStudents = students.filter((s: any) => 
    teacherClassIds.includes(s.class?.id) || teacherClassIds.includes(s.class_id)
  )

  const handleSend = async () => {
    if (!subject.trim() || !message.trim() || selectedRecipients.length === 0) {
      toast.error("Please fill in all fields and select at least one recipient")
      return
    }

    try {
      await sendMessage.mutateAsync({
        recipients: selectedRecipients,
        recipient_type: recipientType,
        subject: subject.trim(),
        message: message.trim(),
        priority: "normal",
      })
      toast.success("Message sent successfully")
      setShowCompose(false)
      setSubject("")
      setMessage("")
      setSelectedRecipients([])
    } catch (error: any) {
      console.error("Error sending message:", error)
      toast.error(error?.response?.data?.message || "Failed to send message")
    }
  }

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
            <div className="flex items-center justify-between">
              <CardTitle>New Message</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowCompose(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Recipient Type</Label>
              <Select value={recipientType} onValueChange={(value: "students" | "parents" | "staff") => {
                setRecipientType(value)
                setSelectedRecipients([])
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="parents">Parents</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Recipients</Label>
              <Select
                value=""
                onValueChange={(value) => {
                  if (value && !selectedRecipients.includes(parseInt(value))) {
                    setSelectedRecipients([...selectedRecipients, parseInt(value)])
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  {recipientType === "students" && myStudents.map((student: any) => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name || `${student.first_name} ${student.last_name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRecipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedRecipients.map((id) => {
                    const recipient = recipientType === "students" 
                      ? myStudents.find((s: any) => s.id === id)
                      : null
                    return recipient ? (
                      <Badge key={id} variant="secondary" className="cursor-pointer" onClick={() => {
                        setSelectedRecipients(selectedRecipients.filter((rId) => rId !== id))
                      }}>
                        {recipient.name || `${recipient.first_name} ${recipient.last_name}`}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>
            <Input 
              placeholder="Subject:" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea 
              placeholder="Message..." 
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleSend} disabled={sendMessage.isPending}>
                {sendMessage.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </>
                )}
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
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-2">
              {messages.map((message: any) => (
                <div 
                  key={message.id} 
                  className={`p-4 border rounded-lg hover:bg-accent cursor-pointer ${message.status === 'unread' ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${message.status === 'unread' ? 'text-blue-600' : ''}`}>
                          {message.sender?.name || message.recipient?.name || "Unknown"}
                        </p>
                        {message.status === 'unread' && <Badge variant="default">New</Badge>}
                      </div>
                      <p className="text-sm">{message.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{message.message}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {message.created_at ? new Date(message.created_at).toLocaleDateString() : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No messages found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
