import { FeeStructure } from "@/components/finance/fee-structure"

export default function FeeStructurePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fee Structure</h1>
        <p className="text-muted-foreground">Configure fee categories and amounts for different grades</p>
      </div>

      <FeeStructure />
    </div>
  )
}
