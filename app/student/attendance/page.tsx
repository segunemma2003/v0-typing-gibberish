import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

export default function StudentAttendancePage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Attendance</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">95%</div><p className="text-sm text-muted-foreground">Overall Attendance</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">38</div><p className="text-sm text-muted-foreground">Days Present</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">2</div><p className="text-sm text-muted-foreground">Days Absent</p></CardContent></Card>
      </div>
    </div>
  )
}
