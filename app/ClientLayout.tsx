"use client"

import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
// import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { TenantProvider } from "@/components/tenant/tenant-provider"
import { TenantDebug } from "@/components/debug/tenant-debug"
import { LoginTest } from "@/components/debug/login-test"
import "./globals.css"

// const montserrat = Montserrat({
//   subsets: ["latin"],
//   variable: "--font-montserrat",
//   weight: ["400", "600", "700", "900"],
// })

function ClientContent({ children }: { children: React.ReactNode }) {
  return (
    <TenantProvider>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>}>
        {children}
        <TenantDebug />
        <LoginTest />
      </Suspense>
    </TenantProvider>
  )
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ClientContent>{children}</ClientContent>
        <Analytics />
      </body>
    </html>
  )
}
