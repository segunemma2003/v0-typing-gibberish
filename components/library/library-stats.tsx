import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { BookOpen, Users, Download, TrendingUp } from "lucide-react"

export function LibraryStats() {
  const monthlyData = [
    { month: "Sep", borrowed: 145, returned: 132, digital: 89 },
    { month: "Oct", borrowed: 167, returned: 154, digital: 102 },
    { month: "Nov", borrowed: 189, returned: 178, digital: 125 },
    { month: "Dec", borrowed: 134, returned: 145, digital: 98 },
    { month: "Jan", borrowed: 198, returned: 187, digital: 156 },
    { month: "Feb", borrowed: 223, returned: 201, digital: 178 },
  ]

  const categoryData = [
    { name: "Literature", value: 35, color: "#8884d8" },
    { name: "Science", value: 25, color: "#82ca9d" },
    { name: "History", value: 20, color: "#ffc658" },
    { name: "Technology", value: 15, color: "#ff7300" },
    { name: "Other", value: 5, color: "#00ff00" },
  ]

  const stats = [
    { label: "Total Books", value: "2,847", icon: BookOpen, color: "text-blue-600" },
    { label: "Active Borrowers", value: "456", icon: Users, color: "text-green-600" },
    { label: "Digital Downloads", value: "1,234", icon: Download, color: "text-purple-600" },
    { label: "This Month", value: "+18%", icon: TrendingUp, color: "text-orange-600" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Library Statistics</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Monthly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="borrowed" fill="hsl(var(--primary))" name="Borrowed" />
                <Bar dataKey="returned" fill="hsl(var(--secondary))" name="Returned" />
                <Bar dataKey="digital" fill="hsl(var(--accent))" name="Digital" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Collection by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
