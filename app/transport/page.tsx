import { BusFleet } from "@/components/transport/bus-fleet"
import { RouteManagement } from "@/components/transport/route-management"
import { StudentTransport } from "@/components/transport/student-transport"

export default function TransportPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transport Management</h1>
        <p className="text-muted-foreground">Manage school transportation, routes, and student assignments</p>
      </div>

      <BusFleet />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <RouteManagement />
        </div>
        <div>
          <StudentTransport />
        </div>
      </div>
    </div>
  )
}
