import prisma from "@/lib/prisma"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(req: Request, context: any) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { id } = context.params
        if (!id) return NextResponse.json({ message: "No invoice id" }, { status: 400 })

        const invoice = await prisma.invoice.findUnique({
            where: {
                id: id
            },
            include: {
                customer: true,
                organization: true,
                payments: true
            }
        })
        return NextResponse.json({ message: "success", invoice }, { status: 200 })

    } catch (error) {
        console.log("Error while getting invoice @/api/bills/[id]", error);
        return NextResponse.json({ message: "Error while getting invoice" }, { status: 500 })
    }
}

export async function PATCH(req: Request, context: any) {
    try {
        const supabase = await createClient()

        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const { id } = context.params
        if (!id) return NextResponse.json({ message: "No invoice id" }, { status: 400 })

        const data = await req.json()
        if (data.status === "COMPLETED") {
            const invoice = await prisma.invoice.update({
                where: {
                    id: id
                },
                data: {
                    ...data
                }
            })
            const payment = await prisma.payment.create({
                data: {
                    invoiceId: id,
                    amount: invoice.grandTotal,
                    paymentDate: new Date()
                }
            })
            return NextResponse.json({ message: "Invoice Updated Successfully", invoice, payment }, { status: 200 })
        }
        const invoice = await prisma.invoice.update({
            where: {
                id: id
            },
            data: {
                ...data
            }
        })
        return NextResponse.json({ message: "Invoice Updated Successfully", invoice }, { status: 200 })
    } catch (error) {
        console.log("Error while updating invoice @/api/bills/[id]", error);
        return NextResponse.json({ message: "Error while updating invoice" }, { status: 500 })
    }
}