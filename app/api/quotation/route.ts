import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, schoolName, schoolType, studentCount, message } = body

    // Validate required fields
    if (!name || !email || !phone || !schoolName || !schoolType) {
      return NextResponse.json(
        { error: "Name, email, phone, school name, and school type are required" },
        { status: 400 }
      )
    }

    // Validate email formatmjbdskfnl
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

 
    // For now, we'll just log it and return success
    console.log("Quotation request received:", {
      name,
      email,
      phone,
      schoolName,
      schoolType,
      studentCount,
      message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      message: "Quotation request submitted successfully. We'll contact you within 24 hours.",
    })

  } catch (error) {
    console.error("Quotation request error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

