import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { CreatePdfFromTemplate } from "@/app/_helpers/bills";
import path from "path";

type inputBody = {
  customerId: string;
  organizationId: string;
  items: string;
  totalAmount: number;
  gstAmount: number;
  grandTotal: number;
  vehicalNumber: string;
  invoiceType: string;
  invoiceNumber: string | null;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as inputBody;
  const {
    invoiceNumber,
    customerId,
    organizationId,
    items,
    totalAmount,
    gstAmount,
    grandTotal,
    vehicalNumber,
    invoiceType,
  } = body;
  console.log("body:", body);

  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const invNumber = `${invoiceNumber ?? organization.invoiceCount + 1}`;
    console.log(invNumber, invoiceNumber);
    const invoice = await prisma.invoice.create({
      data: {
        userId: data.user.id,
        invoiceNumber: invNumber,
        customerId,
        organizationId,
        items,
        totalAmount,
        grandTotal,
        gstAmount,
        vehicalNumber,
        status: "PENDING",
        invoiceType,
      },
      include: { customer: true, organization: true },
    });
    // const templatePath = path.join(process.cwd(), "public/templates/template7.pdf");

    // const customer = invoice.customer
    // if (!customer) throw new Error("Cannot find Customer")
    // let outputPath
    // if (invoiceType === "DEBIT") {
    //   outputPath = await CreatePdfFromTemplate({ ...body, invoiceNumber, customer, organization }, templatePath)
    //   await prisma.organization.update({
    //     where: { id: organizationId },
    //     data: { invoiceCount: { increment: 1 } },
    //   })
    // }
    if (invoice.invoiceType == "DEBIT") {
      await prisma.organization.update({
        where: { id: organizationId },
        data: {
          invoiceCount: organization.invoiceCount + 1,
        },
      });
    }
    console.log("invoice: ", invoice);

    return NextResponse.json(
      { message: "Invoice created successfully", invoice },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const getorgandcustid = searchParams.get("getorgandcust");

    if (getorgandcustid) {
      const user = await prisma.user.findUnique({
        where: { id: data.user?.id },
        include: { Organization: true, customers: true },
      });
      if (!user)
        return NextResponse.json(
          { message: "Failed to get user" },
          { status: 500 }
        );
      return NextResponse.json(
        {
          message: "success",
          organizations: user.Organization,
          customers: user.customers,
        },
        {
          status: 200,
        }
      );
    }

    const invoices = await prisma.invoice.findMany({
      where: { userId: data.user?.id },
      include: { customer: true, organization: true },
      orderBy: { createdAt: "desc" },
    });
    if (!invoices) throw new Error("Error while getting invoices");

    return NextResponse.json({ message: "success", invoices }, { status: 200 });
  } catch (error) {
    console.log("Error while getting invoices", error);
    return NextResponse.json(
      { message: "Failed to get invoices" },
      { status: 500 }
    );
  }
}
