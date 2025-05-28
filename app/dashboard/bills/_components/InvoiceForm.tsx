"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@supabase/supabase-js";
import axios from "axios";
import { Plus, Trash2, ChevronDown, Save, Truck, Receipt } from "lucide-react";
import toast from "react-hot-toast";

const fetchCustomers = async () => {
  const res = await axios.get("/api/invoices", {
    params: { getorgandcust: true },
  });
  return res.data;
};

export default function InvoiceForm({ user, refetch }: { user: User, refetch: () => void }) {
  const [customerId, setCustomerId] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [vehicalNumber, setVehicalNumber] = useState("");
  const [invoiceType, setInvoiceType] = useState<"DEBIT" | "CREDIT">("DEBIT");
  const [referenceInvoiceNumber, setReferenceInvoiceNumber] = useState("");
  const [items, setItems] = useState([
    { name: "", hsnCode: "", quantity: 0, price: 0, unit: "", amount: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isItemsExpanded, setIsItemsExpanded] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["customers and organizations"],
    queryFn: fetchCustomers,
    enabled: !!user,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (vehicalNumber.length < 9) {
      toast.error("Vehical number should be in this format GJ00XX0000");
      setIsSubmitting(false);
      return;
    }
    vehicalNumber.toUpperCase();
    try {
      const totalAmount = Number(
        items.reduce((sum, item) => sum + item.amount, 0).toFixed(0)
      );
      const gstAmount = Number((totalAmount * 0.18).toFixed(0)); // 18% GST
      const grandTotal = Number((totalAmount + gstAmount).toFixed(0));

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          organizationId,
          items,
          totalAmount,
          gstAmount,
          grandTotal,
          vehicalNumber,
          invoiceType,
          referenceInvoiceNumber:
            invoiceType === "CREDIT" ? referenceInvoiceNumber : null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create invoice");

      // Show success toast
      toast.success(
        `${invoiceType} Invoice created successfully with total amount ₹${grandTotal.toFixed(
          2
        )}`
      );

      refetch()
      // Reset form
      setCustomerId("");
      setOrganizationId("");
      setVehicalNumber("");
      setReferenceInvoiceNumber("");
      setItems([
        { name: "", hsnCode: "", quantity: 0, price: 0, unit: "", amount: 0 },
      ]);
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { name: "", hsnCode: "", quantity: 0, price: 0, unit: "", amount: 0 },
    ]);
    toast.success("Item added to invoice.");
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
      toast.success("Item removed from invoice");
    }
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "quantity" || field === "price") {
      const quantity = parseFloat(newItems[index].quantity.toString()) || 0;
      const price = parseFloat(newItems[index].price.toString()) || 0;
      newItems[index].amount = Number((quantity * price).toFixed(0));
    }

    setItems(newItems);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  const gstAmount = (totalAmount * 0.18).toFixed(0);
  const grandTotal = totalAmount + Number(gstAmount);

  return (
    <div className="w-full mx-auto p-3 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-white p-4 sm:p-6 rounded-lg shadow-md space-y-5"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-heading mb-3">
          Create New Invoice
        </h2>

        {/* Invoice Type Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-neutral-border mb-5">
          <button
            type="button"
            onClick={() => setInvoiceType("DEBIT")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all ${invoiceType === "DEBIT"
                ? "bg-primary text-neutral-white"
                : "bg-neutral-light text-neutral-text hover:bg-neutral-border"
              }`}
          >
            Debit Invoice
          </button>
          <button
            type="button"
            onClick={() => setInvoiceType("CREDIT")}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all ${invoiceType === "CREDIT"
                ? "bg-primary text-neutral-white"
                : "bg-neutral-light text-neutral-text hover:bg-neutral-border"
              }`}
          >
            Credit Invoice
          </button>
        </div>

        {/* Customer & Organization Selection */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
          <div className="relative">
            <label
              htmlFor="customerId"
              className="block text-sm font-medium text-neutral-text mb-1"
            >
              Customer
            </label>
            <div className="relative">
              <select
                id="customerId"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                disabled={isLoading}
                className="w-full p-3 rounded-md border border-neutral-border text-neutral-text bg-neutral-white focus:ring-2 focus:ring-primary-ring focus:border-primary focus:outline-none disabled:bg-neutral-disabled appearance-none"
              >
                <option value="">Select a customer</option>
                {isLoading ? (
                  <option>Loading...</option>
                ) : (
                  data?.customers.map((customer: any) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-neutral-text pointer-events-none" />
            </div>
          </div>

          <div className="relative">
            <label
              htmlFor="organizationId"
              className="block text-sm font-medium text-neutral-text mb-1"
            >
              Organization
            </label>
            <div className="relative">
              <select
                id="organizationId"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
                required
                disabled={isLoading}
                className="w-full p-3 rounded-md border border-neutral-border text-neutral-text bg-neutral-white focus:ring-2 focus:ring-primary-ring focus:border-primary focus:outline-none disabled:bg-neutral-disabled appearance-none"
              >
                <option value="">Select an organization</option>
                {isLoading ? (
                  <option>Loading...</option>
                ) : (
                  data?.organizations.map((org: any) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-neutral-text pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Vehicle Number & Reference Invoice Number (conditional) */}
        <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
          <div>
            <label
              htmlFor="vehicalNumber"
              className="block text-sm font-medium text-neutral-text mb-1"
            >
              Vehicle Number
            </label>
            <div className="relative">
              <input
                id="vehicalNumber"
                type="text"
                value={vehicalNumber}
                onChange={(e) => setVehicalNumber(e.target.value.toUpperCase())}
                placeholder="Enter vehicle number"
                className="w-full p-3 pl-9 rounded-md border border-neutral-border text-neutral-text focus:ring-2 focus:ring-primary-ring focus:border-primary focus:outline-none"
              />
              <Truck className="absolute left-3 top-3 w-5 h-5 text-neutral-text" />
            </div>
          </div>

          {invoiceType === "CREDIT" && (
            <div>
              <label
                htmlFor="referenceInvoiceNumber"
                className="block text-sm font-medium text-neutral-text mb-1"
              >
                Invoice Number
              </label>
              <div className="relative">
                <input
                  id="referenceInvoiceNumber"
                  type="text"
                  value={referenceInvoiceNumber}
                  onChange={(e) => setReferenceInvoiceNumber(e.target.value)}
                  placeholder="Enter invoice number"
                  required
                  className="w-full p-3 pl-9 rounded-md border border-neutral-border text-neutral-text focus:ring-2 focus:ring-primary-ring focus:border-primary focus:outline-none"
                />
                <Receipt className="absolute left-3 top-3 w-5 h-5 text-neutral-text" />
              </div>
            </div>
          )}
        </div>

        {/* Invoice Items */}
        <div className="mt-6 bg-neutral-light rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setIsItemsExpanded(!isItemsExpanded)}
            className="w-full flex items-center justify-between p-4 text-left text-neutral-heading font-medium bg-neutral-light hover:bg-gray-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center justify-center bg-primary text-neutral-white rounded-full text-xs">
                {items.length}
              </span>
              Invoice Items
            </span>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${isItemsExpanded ? "rotate-180" : ""
                }`}
            />
          </button>

          {isItemsExpanded && (
            <div className="p-3">
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-md shadow-sm border border-neutral-border"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-neutral-heading">
                        Item #{index + 1}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-1 text-accent-red hover:text-accent-red-hover transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="block text-xs text-neutral-text mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={item.name}
                          onChange={(e) =>
                            updateItem(index, "name", e.target.value)
                          }
                          required
                          className="w-full p-2 rounded-md border border-neutral-border focus:ring-2 focus:ring-primary-ring focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-text mb-1">
                          HSN Code
                        </label>
                        <input
                          type="text"
                          placeholder="HSN Code"
                          value={item.hsnCode}
                          onChange={(e) =>
                            updateItem(index, "hsnCode", e.target.value)
                          }
                          required
                          className="w-full p-2 rounded-md border border-neutral-border focus:ring-2 focus:ring-primary-ring focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-neutral-text mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity || ""}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          required
                          min="0"
                          step="0.0001"
                          className="w-full p-2 rounded-md border border-neutral-border focus:ring-2 focus:ring-primary-ring focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-text mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.price || ""}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          required
                          min="0"
                          step="0.01"
                          className="w-full p-2 rounded-md border border-neutral-border focus:ring-2 focus:ring-primary-ring focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs text-neutral-text mb-1">
                          Unit
                        </label>
                        <input
                          type="text"
                          placeholder="Unit"
                          value={item.unit}
                          onChange={(e) =>
                            updateItem(index, "unit", e.target.value)
                          }
                          className="w-full p-2 rounded-md border border-neutral-border focus:ring-2 focus:ring-primary-ring focus:border-primary focus:outline-none text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <label className="block text-xs text-neutral-text mb-1">
                        Amount
                      </label>
                      <input
                        type="text"
                        value={`₹${item.amount.toFixed(2)}`}
                        disabled
                        className="w-full p-2 rounded-md border border-neutral-border bg-neutral-light text-neutral-heading font-medium cursor-not-allowed text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addItem}
                className="mt-3 flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-medium text-primary bg-white border border-primary rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" /> Add New Item
              </button>
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="mt-6 bg-neutral-light p-4 rounded-lg">
          <div className="flex justify-between text-neutral-text mb-2">
            <span>Subtotal:</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="flex justify-between text-neutral-text mb-2">
            <span>GST (18%):</span>
            <span>₹{gstAmount}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-neutral-heading pt-2 border-t border-neutral-border">
            <span>Grand Total:</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full px-6 py-3 text-neutral-white bg-primary rounded-md hover:bg-primary-hover disabled:bg-primary-disabled transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Save className="w-5 h-5" />
            {isSubmitting
              ? `Creating ${invoiceType} Invoice...`
              : `Create ${invoiceType} Invoice`}
          </button>
        </div>
      </form>
    </div>
  );
}
