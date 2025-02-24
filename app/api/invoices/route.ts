import { NextResponse } from 'next/server'
import prisma  from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const session = await supabase.auth.getUser()

  if (!session) {
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

    const invoiceNumber = `INV-${organization.invoiceCount + 1}`

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