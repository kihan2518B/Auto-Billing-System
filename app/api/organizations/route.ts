import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, gstNumber, address, accountNumber, ifscCode, bankName, rulesAndPolicies } = await request.json()

  try {
    const organization = await prisma.organization.create({
      data: {
        name,
        gstNumber,
        address,
        accountNumber,
        ifscCode,
        bankName,
        rulesAndPolicies,
        users: {
          connect: { id: session.user.id },
        },
      },
    })

    return NextResponse.json(organization)
  } catch (error) {
    console.error("Error creating organization:", error)
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
  }
}

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const organizations = await prisma.organization.findMany({
      where: {
        users: {
          some: {
            id: session.user.id,
          },
        },
      },
    })

    return NextResponse.json(organizations)
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 })
  }
}

