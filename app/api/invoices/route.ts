import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";

type inputBody = {
  customerId: string;
  organizationId: string;
  items: item[];
  totalAmount: number;
  gstAmount: number;
  grandTotal: number;
  vehicalNumber: string;
  gstPercentage: number;
  invoiceType: string;
  referenceInvoiceNumber: string;
};

type item = {
  name: string;
  unit: string;
  price: string;
  amount: string;
  hsncode: string;
  quantity: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as inputBody;
  const {
    referenceInvoiceNumber,
    customerId,
    organizationId,
    items,
    totalAmount,
    gstAmount,
    grandTotal,
    gstPercentage,
    vehicalNumber,
    invoiceType,
  } = body;

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
    const isFireWood = items.some((item) => item.name === "FireWood");
    const invNumber = `${
      referenceInvoiceNumber
        ? referenceInvoiceNumber
        : isFireWood
        ? `${organization.fireWoodInvoiceCount + 1} J`
        : organization.invoiceCount + 1
    }`;
    const invoice = await prisma.invoice.create({
      data: {
        userId: data.user.id,
        invoiceNumber: invNumber,
        customerId,
        organizationId,
        items,
        gstPercentage,
        totalAmount,
        grandTotal,
        gstAmount,
        vehicalNumber,
        status: "PENDING",
        invoiceType,
      },
    });

    if (invoice.invoiceType == "DEBIT") {
      if (isFireWood) {
        await prisma.organization.update({
          where: { id: organizationId },
          data: {
            fireWoodInvoiceCount: organization.fireWoodInvoiceCount + 1,
          },
        });
      } else {
        await prisma.organization.update({
          where: { id: organizationId },
          data: {
            invoiceCount: organization.invoiceCount + 1,
          },
        });
      }
    }

    return NextResponse.json(
      { message: "Invoice created successfully", invoice },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.log("Error creating invoice:", error);
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
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");

    if (startDateStr && endDateStr) {
      const startDate = new Date(startDateStr);
      const endDate = new Date(endDateStr);

      // Ensure endDate covers the entire day
      endDate.setHours(23, 59, 59, 999);

      console.log("Fetching invoices between dates:", startDate, endDate);

      const invoices = await prisma.invoice.findMany({
        where: {
          userId: data.user?.id,
          // createdAt: {
          //   gte: startDate,
          //   lte: endDate,
          // },
        },
        include: {
          customer: true,
          organization: true,
          payments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log("Invoices fetched:", invoices);
      if (!invoices) throw new Error("Error while getting invoices");

      return NextResponse.json(
        { message: "success", invoices },
        { status: 200 }
      );
    }

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
