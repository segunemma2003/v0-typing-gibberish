import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export default function StudentSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between"><h1 className="text-3xl font-bold">Settings</h1><Button><Save className="w-4 h-4 mr-2" />Save</Button></div>
      <Card>
        <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Full Name</Label><Input defaultValue="John Student" /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" defaultValue="john.student@school.edu" /></div>
          <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+1 555-0123" /></div>
        </CardContent>
      </Card>
    </div>
  )
}
