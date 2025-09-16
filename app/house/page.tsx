import { HouseOverview } from "@/components/house/house-overview"
import { HouseCompetitions } from "@/components/house/house-competitions"
import { HousePoints } from "@/components/house/house-points"

export default function HousePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">House Management</h1>
        <p className="text-muted-foreground">Manage house activities, competitions, and point systems</p>
      </div>

      <HouseOverview />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <HouseCompetitions />
        </div>
        <div>
          <HousePoints />
        </div>
      </div>
    </div>
  )
}
