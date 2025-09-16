import { FeeOverview } from "@/components/finance/fee-overview"
import { PaymentTracking } from "@/components/finance/payment-tracking"

export default function FinancePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Management</h1>
        <p className="text-muted-foreground">Manage school fees, payments, and financial operations</p>
      </div>

      <FeeOverview />

      <PaymentTracking />
    </div>
  )
}
