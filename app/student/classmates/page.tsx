import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function StudentClassmatesPage() {
  const classmates = [
    { name: "Alice Johnson", class: "Grade 10A" },
    { name: "Bob Smith", class: "Grade 10A" },
    { name: "Carol Davis", class: "Grade 10A" },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Classmates</h1>
      <Card>
        <CardHeader><CardTitle>Grade 10A</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classmates.map((mate, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 border rounded-lg">
                <Avatar><AvatarFallback>{mate.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                <div><p className="font-semibold">{mate.name}</p><p className="text-sm text-muted-foreground">{mate.class}</p></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
