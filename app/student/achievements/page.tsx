import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award, Medal } from "lucide-react"

export default function StudentAchievementsPage() {
  const achievements = [
    { title: "Perfect Attendance", icon: Trophy, date: "March 2024", color: "text-yellow-600" },
    { title: "Top Grade in Mathematics", icon: Award, date: "Q1 2024", color: "text-blue-600" },
    { title: "Science Fair Winner", icon: Medal, date: "February 2024", color: "text-green-600" },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Achievements</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((ach, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6 text-center">
              <ach.icon className={`w-12 h-12 mx-auto mb-2 ${ach.color}`} />
              <p className="font-semibold">{ach.title}</p>
              <p className="text-sm text-muted-foreground">{ach.date}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
