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

  const { customerId, organizationId, totalAmount, gstAmount, items } = await request.json()

  try {
    const invoice = await prisma.invoice.create({
      data: {
        customerId,
        organizationId,
        totalAmount,
        gstAmount,
        invoiceNumber: await generateInvoiceNumber(organizationId),
        items: {
          create: items,
        },
      },
      include: {
        items: true,
        customer: true,
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const organizationId = searchParams.get("organizationId")

  if (!organizationId) {
    return NextResponse.json({ error: "Organization ID is required" }, { status: 400 })
  }

  try {
    const invoices = await prisma.invoice.findMany({
      where: {
        organizationId,
      },
      include: {
        customer: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

async function generateInvoiceNumber(organizationId: string): Promise<string> {
  const latestInvoice = await prisma.invoice.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  })

  const lastNumber = latestInvoice ? Number.parseInt(latestInvoice.invoiceNumber.split("-")[1]) : 0

  return `INV-${(lastNumber + 1).toString().padStart(6, "0")}`
}

