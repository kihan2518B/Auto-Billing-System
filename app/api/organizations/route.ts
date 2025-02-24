import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  const session = await supabase.auth.getUser()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { name, gstNumber, address, bankName, accountNumber, ifscCode,userId } = body

  try {
    const organization = await prisma.organization.create({
      data: {
        name,
        userId,
        gstNumber,
        address,
        bankName,
        accountNumber,
        ifscCode,
      },
    })

    return NextResponse.json(organization)
  } catch (error) {
    console.error('Error creating organization:', error)
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
  }
}