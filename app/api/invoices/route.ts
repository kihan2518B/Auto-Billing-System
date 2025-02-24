import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { customerId, organizationId, items, totalAmount, gstAmount } = body

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    })

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const invoiceNumber = `${organization.invoiceCount + 1}`

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId,
        organizationId,
        items,
        totalAmount,
        gstAmount,
        status: 'PENDING',
      },
    })

    await prisma.organization.update({
      where: { id: organizationId },
      data: { invoiceCount: { increment: 1 } },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(request.url)
    const getorgandcustid = searchParams.get('getorgandcust')

    if (getorgandcustid) {
      const user = await prisma.user.findUnique({
        where: { id: data.user?.id },
        include: { Organization: true, customers: true },
      })
      if (!user) return NextResponse.json({ message: "Failed to get user" }, { status: 500 })
      return NextResponse.json({
        message: "success",
        organizations: user.Organization,
        customers: user.customers
      }, {
        status: 200
      })
    }

    const invoices = await prisma.invoice.findMany({
      include: { customer: true, organization: true },
      orderBy: { createdAt: 'desc' },
    })
    if (!invoices) throw new Error("Error while getting invoices")

    return NextResponse.json({ message: "success", invoices }, { status: 200 })
  } catch (error) {
    console.log("Error while getting invoices", error)
    return NextResponse.json({ message: "Failed to get invoices" }, { status: 500 })
  }
}