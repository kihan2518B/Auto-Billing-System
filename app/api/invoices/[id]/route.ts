import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: any) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = context.params;
    if (!id)
      return NextResponse.json({ message: "No invoice id" }, { status: 400 });

    const invoice = await prisma.invoice.findUnique({
      where: {
        id: id,
      },
      include: {
        customer: true,
        organization: true,
        payments: true,
      },
    });
    return NextResponse.json({ message: "success", invoice }, { status: 200 });
  } catch (error) {
    console.log("Error while getting invoice @/api/bills/[id]", error);
    return NextResponse.json(
      { message: "Error while getting invoice" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: any) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const AddPaymentLog = searchParams.get("AddPaymentLog");
    const { id } = context.params;
    if (!id)
      return NextResponse.json({ message: "No invoice id" }, { status: 400 });

    const data = await req.json();

    // Get the current invoice to check the amount
    const currentInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!currentInvoice) {
      return NextResponse.json(
        { message: "Invoice not found" },
        { status: 404 }
      );
    }
    if (AddPaymentLog) {
      console.log("data: ", data);
      if (!data.amount) {
        return NextResponse.json(
          { message: "Amount is required to add payment log" },
          { status: 400 }
        );
      }
      // If payment amount is provided in the request
      if (data.amount) {
        if (data.amount === currentInvoice.grandTotal) {
          data.status = "COMPLETED";
        } else if (data.amount > currentInvoice.grandTotal) {
          return NextResponse.json(
            { message: "Payment amount cannot be greater than invoice amount" },
            { status: 400 }
          );
        }
      }

      // Continue with existing COMPLETED status logic
      if (data.status === "COMPLETED") {
        const invoice = await prisma.invoice.update({
          where: {
            id: id,
          },
          data: {
            status: "COMPLETED",
          },
        });
        const payment = await prisma.paymentLog.create({
          data: {
            invoiceId: id,
            amount: data.amount,
            note: data.note,
            paymentDate: data.paymentDate,
          },
        });
        return NextResponse.json(
          { message: "Invoice Updated Successfully", invoice, payment },
          { status: 200 }
        );
      }
    }

    //update invoice
    const invoice = await prisma.invoice.update({
      where: {
        id: id,
      },
      data: {
        ...data,
      },
    });

    return NextResponse.json(
      { message: "Invoice Updated Successfully", invoice },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while updating invoice @/api/bills/[id]", error);
    return NextResponse.json(
      { message: "Error while updating invoice" },
      { status: 500 }
    );
  }
}
