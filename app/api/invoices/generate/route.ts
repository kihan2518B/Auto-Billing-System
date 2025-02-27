import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
    const { invoiceNumber, items, totalAmount, customer, invoiceDate, vehicalNumber, gst, organization } = await req.json();
    const templatePath = path.join(process.cwd(), "public/templates/template4.pdf");
    const pdfBytes = fs.readFileSync(templatePath);

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    // Load fonts
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const TimesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const HelveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const TimesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const italicBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

    const grandTotal = totalAmount + gst;
    const totalAmountInWords = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(grandTotal);

    // Fill form fields dynamically
    form.getTextField("OrganizationName")?.setText(organization.name)
    form.getTextField("OrganizationName")?.updateAppearances(HelveticaBoldFont)
    form.getTextField("OrganizationAddress")?.setText(organization.address)
    form.getTextField("OrganizationAddress")?.updateAppearances(TimesRomanFont)
    form.getTextField("OrganizationGstNumber")?.setText(organization.gstNumber)
    form.getTextField("OrganizationGstNumber")?.updateAppearances(TimesRomanFont)

    form.getTextField("OrganizationBankName")?.setText(`${organization.bankName}:`)
    form.getTextField("OrganizationBankName")?.updateAppearances(TimesRomanBoldFont)
    form.getTextField("OrganizationAccountNumber")?.setText(organization.accountNumber)
    form.getTextField("OrganizationAccountNumber")?.updateAppearances(TimesRomanBoldFont)
    form.getTextField("OrganizationIfscCode")?.setText(`IFSC: ${organization.ifscCode}`)
    form.getTextField("OrganizationIfscCode")?.updateAppearances(TimesRomanBoldFont)

    form.getTextField("CustomerName")?.setText(`${customer.name},`)
    form.getTextField("CustomerName")?.updateAppearances(boldFont)
    form.getTextField("CustomerAddress")?.setText(customer.address)
    form.getTextField("CustomerAddress")?.updateAppearances(boldFont)
    form.getTextField("CustomerGstNumber")?.setText(customer.gstNumber)
    form.getTextField("CustomerGstNumber")?.updateAppearances(boldFont)

    form.getTextField("InvoiceNumber")?.setText(invoiceNumber)
    form.getTextField("InvoiceNumber")?.updateAppearances(boldFont)
    form.getTextField("InvoiceDate")?.setText(`${new Date(invoiceDate).getDay()}/${new Date(invoiceDate).getMonth()}/${new Date(invoiceDate).getFullYear()}`)
    form.getTextField("InvoiceDate")?.updateAppearances(boldFont)

    for (let i = 1; i < items.length + 1; i++) {
        const item = items[i - 1];
        form.getTextField(`Item${i}Description`)?.setText(`${item.hsnCode} - ${item.name}`);
        form.getTextField(`Item${i}Description`)?.updateAppearances(boldFont);
        form.getTextField(`Item${i}Quantity`)?.setText(`${item.quantity}`);
        form.getTextField(`Item${i}Quantity`)?.updateAppearances(boldFont)
        form.getTextField(`Item${i}Price`)?.setText(`${item.price}`);
        form.getTextField(`Item${i}Price`)?.updateAppearances(boldFont)
        form.getTextField(`Item${i}Unit`)?.setText(`${item.unit}`);
        form.getTextField(`Item${i}Unit`)?.updateAppearances(boldFont)
        form.getTextField(`Item${i}Amount`)?.setText(`${item.amount}`);
        form.getTextField(`Item${i}Amount`)?.updateAppearances(boldFont)
    }

    form.getTextField("TotalAmount")?.setText(`${totalAmount}`);
    form.getTextField("TotalAmount")?.updateAppearances(boldFont)
    form.getTextField("VehicalNumber")?.setText(vehicalNumber)
    form.getTextField("VehicalNumber")?.updateAppearances(boldFont)
    form.getTextField("sgst")?.setText(`${gst / 2}`)
    form.getTextField("cgst")?.setText(`${gst / 2}`)
    form.getTextField("GrandTotal")?.setText(`${grandTotal}`)
    form.getTextField("GrandTotal")?.updateAppearances(boldFont)
    form.getTextField("TotalAmountInWords")?.setText(`${totalAmountInWords}`)
    form.getTextField("TotalAmountInWords")?.updateAppearances(TimesRomanFont)
    form.getTextField("For")?.setText(`For ${organization.name}`)
    form.getTextField("For")?.updateAppearances(italicBoldFont)

    form.flatten()
    const newPdfBytes = await pdfDoc.save();
    console.log("newPdfBytes: ", newPdfBytes)
    const outputPath = path.join(process.cwd(), "public/generated/invoice.pdf");
    fs.writeFileSync(outputPath, newPdfBytes);

    return NextResponse.json({ message: "Invoice generated", url: "/generated/invoice.pdf" });
}