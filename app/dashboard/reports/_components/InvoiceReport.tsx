"use client";
import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from "luxon";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: string;
  invoiceNumber: string;
  createdAt: string;
  vehicalNumber: string;
  invoiceType: string;
  billerName: string;
  totalAmount: number;
  gstAmount: number;
  grandTotal: number;
  status: string;
  organization: { name: string };
  customer: { name: string };
  items: { name: string; quantity: number; price: number; amount: number }[];
  payments: { amount: number; paymentDate: string }[];
}

const fetchInvoicesByDateRange = async (startDate: string, endDate: string) => {
  console.log("startDate,endDate: ", startDate, endDate);
  const res = await axios.get("/api/invoices", {
    params: {
      startDate,
      endDate,
    },
  });
  console.log("res:", res);
  return res.data.invoices as Invoice[];
};

const generatePDF = (invoices: Invoice[], startDate: Date, endDate: Date) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Invoice Report", 20, 20);
  doc.setFontSize(12);
  const startDateTime = DateTime.fromJSDate(startDate);
  const endDateTime = DateTime.fromJSDate(endDate);
  doc.text(
    `Date Range: ${startDateTime.toFormat(
      "MMM dd, yyyy"
    )} - ${endDateTime.toFormat("MMM dd, yyyy")}`,
    20,
    30
  );

  const headers = [
    "Invoice #",
    "Date",
    "Vehicle",
    "Type",
    "Biller",
    "Total (₹)",
    "Status",
  ];
  const data = invoices.map((inv) => [
    inv.invoiceNumber,
    DateTime.fromISO(inv.createdAt).toFormat("MMM dd, yyyy"),
    inv.vehicalNumber || "N/A",
    inv.invoiceType,
    inv.billerName || "N/A",
    inv.grandTotal.toFixed(2),
    inv.status,
  ]);

  (doc as any).autoTable({
    startY: 40,
    head: [headers],
    body: data,
    theme: "striped",
    headStyles: { fillColor: "#1F2A44", textColor: "#FFFFFF" },
    styles: { textColor: "#374151", fontSize: 10 },
    alternateRowStyles: { fillColor: "#F9FAFB" },
  });

  doc.save(
    `invoice-report-${startDateTime.toFormat(
      "yyyyMMdd"
    )}-${endDateTime.toFormat("yyyyMMdd")}.pdf`
  );
};

const generateExcel = (invoices: Invoice[], startDate: Date, endDate: Date) => {
  const startDateTime = DateTime.fromJSDate(startDate);
  const endDateTime = DateTime.fromJSDate(endDate);
  const wsData = [
    ["Invoice Report"],
    [
      `Date Range: ${startDateTime.toFormat(
        "MMM dd, yyyy"
      )} - ${endDateTime.toFormat("MMM dd, yyyy")}`,
    ],
    [],
    ["Invoice #", "Date", "Vehicle", "Type", "Biller", "Total (₹)", "Status"],
    ...invoices.map((inv) => [
      inv.invoiceNumber,
      DateTime.fromISO(inv.createdAt).toFormat("MMM dd, yyyy"),
      inv.vehicalNumber || "N/A",
      inv.invoiceType,
      inv.billerName || "N/A",
      inv.grandTotal,
      inv.status,
    ]),
  ];

  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Invoices");
  XLSX.write(
    wb,
    `invoice-report-${startDateTime.toFormat(
      "yyyyMMdd"
    )}-${endDateTime.toFormat("yyyyMMdd")}.xlsx`
  );
};

export default function InvoiceReport({ user }: { user: User }) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    DateTime.now().minus({ days: 30 }).toJSDate(),
    DateTime.now().toJSDate(),
  ]);

  const startDate = dateRange[0]
    ? DateTime.fromJSDate(dateRange[0]).toFormat("yyyy-MM-dd")
    : "";
  const endDate = dateRange[1]
    ? DateTime.fromJSDate(dateRange[1]).toFormat("yyyy-MM-dd")
    : "";

  const {
    data: invoices,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["invoices", "startDate", "endDate"],
    queryFn: () => fetchInvoicesByDateRange(startDate, endDate),
    enabled: !!user || !!startDate || !!endDate,
  });

  console.log("error: ", error, isError, invoices, isLoading, user);
  const handleDownloadPDF = () => {
    if (!invoices || !dateRange[0] || !dateRange[1]) return;
    try {
      generatePDF(invoices, dateRange[0], dateRange[1]);
      toast.success("PDF Downloaded\nReport generated successfully.", {
        className:
          "bg-neutral-white text-primary-DEFAULT font-medium text-sm border border-primary-DEFAULT",
      });
    } catch (error) {
      toast.error("Download Failed\nFailed to generate PDF.", {
        className:
          "bg-neutral-white text-accent-red font-medium text-sm border border-accent-red",
      });
    }
  };

  const handleDownloadExcel = () => {
    if (!invoices || !dateRange[0] || !dateRange[1]) return;
    try {
      generateExcel(invoices, dateRange[0], dateRange[1]);
      toast.success("Excel Downloaded\nReport generated successfully.", {
        className:
          "bg-neutral-white text-primary-DEFAULT font-medium text-sm border border-primary-DEFAULT",
      });
    } catch (error) {
      toast.error("Download Failed\nFailed to generate Excel.", {
        className:
          "bg-neutral-white text-accent-red font-medium text-sm border border-accent-red",
      });
    }
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case "PAID":
      case "COMPLETED":
        return "bg-emerald-500 text-white";
      case "PENDING":
        return "bg-amber-500 text-white";
      case "OVERDUE":
        return "bg-red-500 text-white";
      default:
        return "bg-slate-500 text-white";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-neutral-light min-h-screen">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "font-sans",
        }}
      />
      <div className="bg-neutral-white rounded-xl shadow-lg border border-neutral-border">
        {/* Header */}
        <div className="bg-navy-600 bg-gradient-to-r from-navy-600 to-navy-800 text-white p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <FileText className="w-8 h-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">Invoice Report</h1>
                <p className="text-white/80">
                  Generate and download invoice reports by date range
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-navy-600" />
              <label className="text-neutral-heading font-medium">
                Select Date Range
              </label>
            </div>
            <DatePicker
              selectsRange
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onChange={(update: [Date | null, Date | null]) =>
                setDateRange(update)
              }
              dateFormat="MMM dd, yyyy"
              className="border-neutral-border rounded-md px-3 py-2 text-neutral-text focus:border-navy-600 focus:ring-1 focus:ring-navy-600 w-full sm:w-auto"
              placeholderText="Select date range"
              maxDate={new Date()}
            />
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadPDF}
                disabled={!invoices || invoices.length === 0}
                className="bg-neutral-white text-navy-600 hover:bg-neutral-light transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
              <Button
                onClick={handleDownloadExcel}
                disabled={!invoices || invoices.length === 0}
                className="bg-neutral-white text-navy-600 hover:bg-neutral-light transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Excel
              </Button>
            </div>
          </div>

          {/* Invoices Table */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-navy-600 animate-spin" />
              <span className="ml-2 text-neutral-text">
                Loading invoices...
              </span>
            </div>
          ) : isError || !invoices ? (
            <div className="flex justify-center items-center py-12">
              <AlertCircle className="w-8 h-8 text-accent-red mr-2" />
              <span className="text-accent-red">
                Error loading invoices. Please try again.
              </span>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 mx-auto mb-3 VBoxLayout-neutral-text opacity-50" />
              <p className="text-neutral-text font-medium">
                No invoices found for the selected date range.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-neutral-border">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy-600 text-white">
                    <th className="p-3 text-sm font-semibold">Invoice #</th>
                    <th className="p-3 text-sm font-semibold">Date</th>
                    <th className="p-3 text-sm font-semibold">Vehicle</th>
                    <th className="p-3 text-sm font-semibold">Type</th>
                    <th className="p-3 text-sm font-semibold">Biller</th>
                    <th className="p-3 text-sm font-semibold text-right">
                      Total (₹)
                    </th>
                    <th className="p-3 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice, index) => (
                    <tr
                      key={invoice.id}
                      className={`border-t border-neutral-border ${
                        index % 2 === 0
                          ? "bg-neutral-white"
                          : "bg-neutral-light/50"
                      }`}
                    >
                      <td className="p-3 text-neutral-heading font-medium">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="p-3 text-neutral-text">
                        {DateTime.fromISO(invoice.createdAt).toFormat(
                          "MMM dd, yyyy"
                        )}
                      </td>
                      <td className="p-3 text-neutral-text">
                        {invoice.vehicalNumber || "N/A"}
                      </td>
                      <td className="p-3 text-neutral-text">
                        {invoice.invoiceType}
                      </td>
                      <td className="p-3 text-neutral-text">
                        {invoice.billerName || "N/A"}
                      </td>
                      <td className="p-3 text-neutral-heading font-medium text-right">
                        {invoice.grandTotal.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <Badge
                          className={`px-2 py-1 text-xs ${getStatusColors(
                            invoice.status
                          )}`}
                        >
                          {invoice.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
