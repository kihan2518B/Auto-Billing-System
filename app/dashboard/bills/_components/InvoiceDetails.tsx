"use client";

import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import {
  Download,
  CheckCircle,
  Edit,
  Calendar,
  Plus,
  CreditCard,
  FileText,
  Tag,
  Truck,
  User as UserIcon,
  Building,
  Clock,
  ArrowDown,
  AlertCircle,
  DollarSign,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const fetchInvoices = async (id: string) => {
  const res = await axios.get(`/api/invoices/${id}`);
  return res.data.invoice;
};

const downloadInvoice = async (invoice: any) => {
  const res = await axios.post(
    "/api/invoices/generate",
    {
      invoiceNumber: invoice.invoiceNumber,
      items: invoice.items,
      totalAmount: invoice.totalAmount,
      customer: invoice.customer || {},
      invoiceDate: invoice.createdAt,
      vehicalNumber: invoice.vehicalNumber,
      gstAmount: invoice.gstAmount,
      organization: invoice.organization,
    },
    {
      responseType: "blob",
    }
  );

  const fileName = `invoice-${
    invoice.invoiceNumber
  }-${invoice.organization.name.replace(/\s+/g, "")}.pdf`;
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

const updateInvoice = async ({ id, data }: { id: string; data: any }) => {
  const res = await axios.patch(`/api/invoices/${id}`, data);
  return res.data.invoice;
};

const addPaymentLog = async ({
  invoiceId,
  amount,
  note,
  paymentDate,
  status,
}: {
  invoiceId: string;
  amount: number;
  note?: string;
  paymentDate: Date;
  status: "COMPLETED" | "PENDING";
}) => {
  const res = await axios.patch(
    `/api/invoices/${invoiceId}`,
    {
      amount,
      note,
      paymentDate: paymentDate.toISOString(),
      status,
    },
    {
      params: { AddPaymentLog: true },
    }
  );
  return res.data;
};

export default function InvoiceDetails({ user }: { user: User }) {
  const { id } = useParams();
  const queryClient = useQueryClient();

  // State for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  // State for edit form
  const [editForm, setEditForm] = useState({
    billerName: "",
    vehicalNumber: "",
    invoiceType: "",
  });

  // State for payment form
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    note: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  const {
    data: invoice,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => fetchInvoices(id as string),
    enabled: !!user,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: updateInvoice,
    onSuccess: (updatedInvoice) => {
      queryClient.setQueryData(["invoice", id], updatedInvoice);
      setEditDialogOpen(false);
      setErrorMessage(null);
      toast.success("Invoice Updated\nInvoice details updated successfully.", {
        style: {
          background: "#FFFFFF",
          color: "#4F46E5",
          fontFamily: "inherit",
          fontSize: "0.875rem",
          fontWeight: "500",
          border: "1px solid #4F46E5",
        },
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message);
        console.log("errorMessage: ", errorMessage);
        toast.error(error.response.data.message || "something found wrong", {
          style: {
            background: "#FFFFFF",
            color: "#DC2626",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            fontWeight: "500",
            border: "1px solid #DC2626",
          },
        });
      } else {
        setErrorMessage("Error\nFailed to update invoice. Please try again.");
        toast.error("Error\nFailed to update invoice. Please try again.", {
          style: {
            background: "#FFFFFF",
            color: "#DC2626",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            fontWeight: "500",
            border: "1px solid #DC2626",
          },
        });
      }
    },
  });

  const paymentMutation = useMutation({
    mutationFn: addPaymentLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", id] });
      setPaymentDialogOpen(false);
      toast.success("Payment Added\nPayment log added successfully.", {
        style: {
          background: "#FFFFFF",
          color: "#4F46E5",
          fontFamily: "inherit",
          fontSize: "0.875rem",
          fontWeight: "500",
          border: "1px solid #4F46E5",
        },
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Something went wrong", {
          style: {
            background: "#FFFFFF",
            color: "#DC2626",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            fontWeight: "500",
            border: "1px solid #DC2626",
          },
        });
      } else {
        toast.error("Error\nFailed to add payment log. Please try again.", {
          style: {
            background: "#FFFFFF",
            color: "#DC2626",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            fontWeight: "500",
            border: "1px solid #DC2626",
          },
        });
      }
    },
  });

  const handleDownload = () => {
    if (!invoice) return;
    downloadInvoice(invoice)
      .then(() => {
        toast.success("Invoice Downloaded\nDownload completed successfully.", {
          style: {
            background: "#FFFFFF",
            color: "#4F46E5",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            fontWeight: "500",
            border: "1px solid #4F46E5",
          },
        });
      })
      .catch(() => {
        toast.error(
          "Download Failed\nFailed to download invoice. Please try again.",
          {
            style: {
              background: "#FFFFFF",
              color: "#DC2626",
              fontFamily: "inherit",
              fontSize: "0.875rem",
              fontWeight: "500",
              border: "1px solid #DC2626",
            },
          }
        );
      });
  };

  const handleEditDialogOpen = () => {
    if (!invoice) return;
    setEditForm({
      billerName: invoice.billerName || "",
      vehicalNumber: invoice.vehicalNumber || "",
      invoiceType: invoice.invoiceType || "",
    });
    setEditDialogOpen(true);
  };

  const handlePaymentDialogOpen = () => {
    if (!invoice) return;
    setPaymentForm({
      amount: remainingAmount,
      note: "",
      paymentDate: new Date().toISOString().split("T")[0],
    });
    setPaymentDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;

    updateMutation.mutate({
      id: invoice.id,
      data: editForm,
    });
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice) return;

    paymentMutation.mutate({
      invoiceId: invoice.id,
      amount: parseFloat(paymentForm.amount.toString()),
      note: paymentForm.note,
      paymentDate: new Date(paymentForm.paymentDate),
      status:
        Number(remainingAmount) == Number(paymentForm.amount)
          ? "COMPLETED"
          : "PENDING",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-light">
        <div className="flex flex-col items-center p-8 rounded-lg bg-neutral-white shadow-md">
          <div className="w-12 h-12 border-4 border-primary-DEFAULT border-t-neutral-light rounded-full animate-spin mb-4"></div>
          <p className="text-neutral-text text-lg font-medium">
            Loading invoice details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-light">
        <div className="flex flex-col items-center p-8 rounded-lg bg-neutral-white shadow-md">
          <AlertCircle className="w-12 h-12 text-accent-red mb-4" />
          <p className="text-accent-red text-lg font-medium">
            Error loading invoice details
          </p>
          <p className="text-neutral-text mt-2">
            Please try refreshing the page or contact support.
          </p>
        </div>
      </div>
    );
  }

  const items = invoice.items || [];
  const paymentLogs = invoice.payments || [];
  const totalPaid = paymentLogs.reduce(
    (sum: number, log: any) => sum + log.amount,
    0
  );
  const remainingAmount = invoice.grandTotal - totalPaid;
  const isPaid = invoice.status === "PAID" || invoice.status === "COMPLETED";

  // Helper function to get status colors
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
    <div className="max-w-5xl mx-auto p-4 sm:p-6 bg-neutral-light min-h-screen">
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
      <div className="bg-neutral-white rounded-xl shadow-lg overflow-hidden border border-neutral-border">
        {/* Header with invoice number and status */}
        <div className="bg-navy-600 bg-gradient-to-r from-navy-600 to-navy-800 text-white p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <FileText className="w-8 h-8 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">
                  Invoice #{invoice.invoiceNumber}
                </h1>
                <p className="text-white/80">
                  {new Date(invoice.createdAt).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColors(
                  invoice.status
                )}`}
              >
                {isPaid ? (
                  <CheckCircle className="w-4 h-4 mr-1" />
                ) : (
                  <Clock className="w-4 h-4 mr-1" />
                )}
                {invoice.status}
              </Badge>
              <Button
                onClick={handleEditDialogOpen}
                size="sm"
                className="bg-white text-navy-600 hover:bg-neutral-light transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {/* Organization and Customer Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-neutral-light rounded-lg p-5 border border-neutral-border">
              <div className="flex items-center mb-3">
                <Building className="w-5 h-5 text-navy-600 mr-2" />
                <h3 className="text-lg font-semibold text-neutral-heading">
                  Organization
                </h3>
              </div>
              <p className="text-neutral-heading font-medium text-lg">
                {invoice.organization.name}
              </p>
              {invoice.organization.address && (
                <p className="text-neutral-text mt-1">
                  {invoice.organization.address}
                </p>
              )}
            </div>

            <div className="bg-neutral-light rounded-lg p-5 border border-neutral-border">
              <div className="flex items-center mb-3">
                <UserIcon className="w-5 h-5 text-navy-600 mr-2" />
                <h3 className="text-lg font-semibold text-neutral-heading">
                  Customer
                </h3>
              </div>
              <p className="text-neutral-heading font-medium text-lg">
                {invoice.customer?.name || "N/A"}
              </p>
              {invoice.customer?.address && (
                <p className="text-neutral-text mt-1">
                  {invoice.customer.address}
                </p>
              )}
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-neutral-light rounded-lg p-4 border border-neutral-border">
              <div className="flex items-center mb-2">
                <Tag className="w-4 h-4 text-navy-600 mr-2" />
                <h4 className="text-sm font-medium text-neutral-text">
                  Invoice Type
                </h4>
              </div>
              <p className="text-neutral-heading font-medium">
                {invoice.invoiceType}
              </p>
            </div>

            <div className="bg-neutral-light rounded-lg p-4 border border-neutral-border">
              <div className="flex items-center mb-2">
                <Truck className="w-4 h-4 text-navy-600 mr-2" />
                <h4 className="text-sm font-medium text-neutral-text">
                  Vehicle Number
                </h4>
              </div>
              <p className="text-neutral-heading font-medium">
                {invoice.vehicalNumber || "N/A"}
              </p>
            </div>

            <div className="bg-neutral-light rounded-lg p-4 border border-neutral-border">
              <div className="flex items-center mb-2">
                <UserIcon className="w-4 h-4 text-navy-600 mr-2" />
                <h4 className="text-sm font-medium text-neutral-text">
                  Biller Name
                </h4>
              </div>
              <p className="text-neutral-heading font-medium">
                {invoice.billerName || "N/A"}
              </p>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold text-neutral-heading">
                Items
              </h3>
              <div className="flex-grow border-b border-neutral-border ml-4"></div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-neutral-border">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy-600 text-white">
                    <th className="p-3 text-sm font-semibold">Name</th>
                    <th className="p-3 text-sm font-semibold">HSN Code</th>
                    <th className="p-3 text-sm font-semibold">Quantity</th>
                    <th className="p-3 text-sm font-semibold">Price</th>
                    <th className="p-3 text-sm font-semibold">Unit</th>
                    <th className="p-3 text-sm font-semibold text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any, index: number) => (
                    <tr
                      key={index}
                      className={`border-t border-neutral-border ${
                        index % 2 === 0
                          ? "bg-white"
                          : "bg-neutral-light bg-opacity-50"
                      }`}
                    >
                      <td className="p-3 text-neutral-heading font-medium">
                        {item.name}
                      </td>
                      <td className="p-3 text-neutral-text">
                        {item.hsnCode || "N/A"}
                      </td>
                      <td className="p-3 text-neutral-text">{item.quantity}</td>
                      <td className="p-3 text-neutral-text">
                        ₹{item.price.toFixed(2)}
                      </td>
                      <td className="p-3 text-neutral-text">
                        {item.unit || "N/A"}
                      </td>
                      <td className="p-3 text-neutral-heading font-medium text-right">
                        ₹{item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="mb-8">
            <div className="flex justify-end">
              <div className="w-full md:w-80 bg-neutral-light rounded-lg p-4 border border-neutral-border">
                <div className="flex justify-between mb-2 text-neutral-text">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    ₹{invoice.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2 text-neutral-text">
                  <span>GST Amount:</span>
                  <span className="font-medium">
                    ₹{invoice.gstAmount.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-neutral-border my-3"></div>
                <div className="flex justify-between text-lg font-bold text-neutral-heading">
                  <span>Grand Total:</span>
                  <span>₹{invoice.grandTotal.toFixed(2)}</span>
                </div>
                {!isPaid && remainingAmount > 0 && (
                  <div className="mt-2 pt-2 border-t border-neutral-border">
                    <div className="flex justify-between text-accent-red">
                      <span>Remaining:</span>
                      <span className="font-medium">
                        ₹{remainingAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-navy-600 mr-2" />
                <h3 className="text-xl font-semibold text-neutral-heading">
                  Payment History
                </h3>
              </div>
              {!isPaid && (
                <Button
                  onClick={handlePaymentDialogOpen}
                  className="bg-navy-600 hover:bg-navy-700 text-white transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment
                </Button>
              )}
            </div>

            {paymentLogs.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {paymentLogs.map((log: any) => (
                  <div
                    key={log.id}
                    className="bg-white rounded-lg border border-neutral-border p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="bg-navy-600 text-white p-3 rounded-full mr-4">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-neutral-heading font-semibold">
                            ₹{Number(log.amount).toFixed(2)}
                          </div>
                          <div className="text-sm text-neutral-text">
                            {new Date(log.paymentDate).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                      {log.note && (
                        <div className="bg-neutral-light p-2 rounded-md text-sm text-neutral-text">
                          {log.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isPaid && (
                  <div className="flex items-center justify-center bg-emerald-50 text-emerald-700 border border-emerald-200 p-4 rounded-lg">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      Payment completed. Thank you!
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-neutral-light rounded-lg border border-neutral-border">
                <Calendar className="w-10 h-10 mx-auto mb-3 text-neutral-text opacity-50" />
                <p className="text-neutral-text font-medium">
                  No payment records found
                </p>
                <p className="text-sm text-neutral-text opacity-75 mt-1">
                  {isPaid
                    ? "Invoice marked as paid, but no payment records exist."
                    : "Add a payment record to track customer payments"}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
            <Button
              onClick={handleDownload}
              className="bg-navy-600 hover:bg-navy-700 text-white font-medium px-6 py-2.5 shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-navy-500"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Invoice Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-neutral-heading flex items-center">
              <Edit className="w-5 h-5 mr-2 text-navy-600" />
              Edit Invoice
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-5 py-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="vehicalNumber"
                  className="text-neutral-heading font-medium"
                >
                  Vehicle Number
                </Label>
                <Input
                  id="vehicalNumber"
                  value={editForm.vehicalNumber}
                  onChange={(e) =>
                    setEditForm({ ...editForm, vehicalNumber: e.target.value })
                  }
                  className="border-neutral-border focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="invoiceType"
                  className="text-neutral-heading font-medium"
                >
                  Invoice Type
                </Label>
                <select
                  id="invoiceType"
                  className="flex h-10 w-full rounded-md border border-neutral-border bg-white px-3 py-2 text-neutral-heading ring-offset-white focus:border-navy-600 focus:outline-none focus:ring-1 focus:ring-navy-600"
                  value={editForm.invoiceType}
                  onChange={(e) =>
                    setEditForm({ ...editForm, invoiceType: e.target.value })
                  }
                >
                  <option value="Credit">Credit</option>
                  <option value="Debit">Debit</option>
                </select>
              </div>
            </div>
            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
                className="border-neutral-border text-neutral-text hover:bg-neutral-light hover:text-neutral-heading"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-navy-600 text-white hover:bg-navy-700"
              >
                {updateMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-neutral-heading flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-navy-600" />
              Add Payment
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit}>
            <div className="grid gap-5 py-4">
              <div className="grid gap-2">
                <Label
                  htmlFor="amount"
                  className="text-neutral-heading font-medium"
                >
                  Payment Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-text">
                    ₹
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    className="pl-7 border-neutral-border focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="paymentDate"
                  className="text-neutral-heading font-medium"
                >
                  Payment Date
                </Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={paymentForm.paymentDate}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentDate: e.target.value,
                    })
                  }
                  className="border-neutral-border focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="note"
                  className="text-neutral-heading font-medium"
                >
                  Note (Optional)
                </Label>
                <Textarea
                  id="note"
                  value={paymentForm.note}
                  onChange={(e) =>
                    setPaymentForm({ ...paymentForm, note: e.target.value })
                  }
                  placeholder="Additional information about this payment"
                  className="border-neutral-border focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPaymentDialogOpen(false)}
                className="border-neutral-border text-neutral-text hover:bg-neutral-light hover:text-neutral-heading"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={paymentMutation.isPending}
                className="bg-navy-600 text-white hover:bg-navy-700"
              >
                {paymentMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
