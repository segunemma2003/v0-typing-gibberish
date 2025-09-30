import { NextRequest, NextResponse } from "next/server"
import { registerNewSchool, validateSchoolSubdomain, getDynamicSchoolBySubdomain } from "@/lib/dynamic-schools"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, subdomain, email, phone, address } = body

    // Validate required fields
    if (!name || !subdomain || !email) {
      return NextResponse.json(
        { error: "Name, subdomain, and email are required" },
        { status: 400 }
      )
    }

    // Validate subdomain format and availability
    if (!validateSchoolSubdomain(subdomain)) {
      return NextResponse.json(
        { error: "Invalid or unavailable subdomain" },
        { status: 400 }
      )
    }

    // Check if subdomain already exists
    const existingSchool = getDynamicSchoolBySubdomain(subdomain)
    if (existingSchool) {
      return NextResponse.json(
        { error: "Subdomain already taken" },
        { status: 409 }
      )
    }

    // Register new school
    const newSchool = registerNewSchool({
      name,
      subdomain,
      isActive: true,
    })

    // In production, you would:
    // 1. Save to database
    // 2. Set up DNS records automatically
    // 3. Provision SSL certificates
    // 4. Send welcome email

    return NextResponse.json({
      success: true,
      school: newSchool,
      schoolUrl: `https://${subdomain}.theqcare.org`,
      message: "School registered successfully! DNS and SSL setup may take up to 24 hours."
    })

  } catch (error) {
    console.error("School registration error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subdomain = searchParams.get('subdomain')

    if (subdomain) {
      const school = getDynamicSchoolBySubdomain(subdomain)
      if (!school) {
        return NextResponse.json(
          { error: "School not found" },
          { status: 404 }
        )
      }
      return NextResponse.json({ school })
    }

    // Return all schools (for super admin)
    return NextResponse.json({ schools: [] })

  } catch (error) {
    console.error("Get school error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
