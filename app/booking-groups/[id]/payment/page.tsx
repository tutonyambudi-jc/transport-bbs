import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const bookingGroup = await prisma.bookingGroup.findUnique({
      where: { id }
    })

    if (!bookingGroup) {
      return NextResponse.json(
        { error: "Booking group not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      bookingGroup
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    )
  }
}