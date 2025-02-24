'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InvoiceForm() {
  const [customerId, setCustomerId] = useState('')
  const [organizationId, setOrganizationId] = useState('')
  const [items, setItems] = useState([{ name: '', hsnCode: '', quantity: 0, price: 0, unit: '' }])
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
      const gstAmount = totalAmount * 0.18 // Assuming 18% GST

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          organizationId,
          items,
          totalAmount,
          gstAmount,
        }),
      })

      if (!response.ok) throw new Error('Failed to create invoice')
      router.refresh()
      // Reset form
      setCustomerId('')
      setOrganizationId('')
      setItems([{ name: '', hsnCode: '', quantity: 0, price: 0, unit: '' }])
    } catch (error) {
      console.error('Error creating invoice:', error)
    }
  }

  const addItem = () => {
    setItems([...items, { name: '', hsnCode: '', quantity: 0, price: 0, unit: '' }])
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Create New Invoice</h2>
      {/* Add dropdowns for selecting customer and organization */}
      <div className="mb-4">
        <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
          Customer
        </label>
        <select
          id="customerId"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select a customer</option>
          {/* Add customer options here */}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700">
          Organization
        </label>
        <select
          id="organizationId"
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Select an organization</option>
          {/* Add organization options here */}
        </select>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Invoice Items</h3>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 mb-2">
            <input
              type="text"
              placeholder="Product Name"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="text"
              placeholder="HSN Code"
              value={item.hsnCode}
              onChange={(e) => updateItem(index, 'hsnCode', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <input
              type="text"
              placeholder="Unit"
              value={item.unit}
              onChange={(e) => updateItem(index, 'unit', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Item
        </button>
      </div>
      <button
        type="submit"
        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Invoice
      </button>
    </form>
  )
}