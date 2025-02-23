"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Customer, Organization } from "@prisma/client"

interface InvoiceFormProps {
  customers: Customer[]
  organization: Organization
}

export default function InvoiceForm({ customers, organization }: InvoiceFormProps) {
  const [customerId, setCustomerId] = useState("")
  const [items, setItems] = useState([{ productName: "", hsnCode: "", quantity: 0, price: 0, unit: "" }])

  const queryClient = useQueryClient()

  const createInvoice = useMutation(
    async (invoiceData) => {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      })
      if (!response.ok) {
        throw new Error("Failed to create invoice")
      }
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["invoices", organization.id])
        // Reset form fields
        setCustomerId("")
        setItems([{ productName: "", hsnCode: "", quantity: 0, price: 0, unit: "" }])
      },
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const gstAmount = totalAmount * 0.18 // 18% GST
    createInvoice.mutate({
      customerId,
      organizationId: organization.id,
      totalAmount,
      gstAmount,
      items,
    })
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { productName: "", hsnCode: "", quantity: 0, price: 0, unit: "" }])
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold">Create Invoice</h2>
      <select
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="w-full p-2 border rounded"
        required
      >
        <option value="">Select Customer</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>
      {items.map((item, index) => (
        <div key={index} className="space-y-2">
          <input
            type="text"
            placeholder="Product Name"
            value={item.productName}
            onChange={(e) => handleItemChange(index, "productName", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="HSN Code"
            value={item.hsnCode}
            onChange={(e) => handleItemChange(index, "hsnCode", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => handleItemChange(index, "quantity", Number.parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={item.price}
            onChange={(e) => handleItemChange(index, "price", Number.parseFloat(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Unit (e.g., CBM, Quintal)"
            value={item.unit}
            onChange={(e) => handleItemChange(index, "unit", e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      ))}
      <button type="button" onClick={addItem} className="w-full p-2 bg-gray-200 text-gray-800 rounded">
        Add Item
      </button>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded" disabled={createInvoice.isLoading}>
        {createInvoice.isLoading ? "Creating..." : "Create Invoice"}
      </button>
    </form>
  )
}

