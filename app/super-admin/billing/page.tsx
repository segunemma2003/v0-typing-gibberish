"use client"

import { CreditCard, DollarSign, Receipt, History } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const billingSections = [
  {
    title: "Plan management",
    description: "Adjust subscription tiers and add-ons for each tenant.",
    icon: CreditCard,
  },
  {
    title: "Invoices",
    description: "Review paid, pending, and failed invoices across the platform.",
    icon: Receipt,
  },
  {
    title: "Revenue tracking",
    description: "Monitor MRR, ARR, and upcoming renewals for Compasse tenants.",
    icon: DollarSign,
  },
]

export default function SuperAdminBillingPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Revenue</h1>
          <p className="text-gray-600 mt-1">
            Centralised view of tenant subscriptions, invoices, and overall revenue performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {billingSections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title}>
              <CardHeader className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Transaction history (coming soon)</CardTitle>
              <CardDescription>
                We’re wiring the billing service so you can download statements and reconcile revenue inside Compasse.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-600">
          <p>
            Until then, please continue using your external billing provider console. This page will soon surface current
            charges, auto-renew settings, and dunning workflows.
          </p>
          <Button disabled className="opacity-60 cursor-not-allowed">
            View transactions (coming soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

