// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useQuery } from '@tanstack/react-query'
// import { User } from '@supabase/supabase-js'
// import axios from 'axios'

// const fetchCustomers = async () => {
//   const res = await axios.get("/api/invoices", { params: { getorgandcust: true } })
//   return res.data
// }

// export default function InvoiceForm({ user }: { user: User }) {
//   const [customerId, setCustomerId] = useState('')
//   const [organizationId, setOrganizationId] = useState('')
//   const [items, setItems] = useState([{ name: '', hsnCode: '', quantity: 0, price: 0, unit: '', amount: 0 }])
//   const router = useRouter()

//   const { data, isLoading } = useQuery({
//     queryKey: ["customers and organizations"],
//     queryFn: () => fetchCustomers(),
//     enabled: !!user
//   })
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
//       const gstAmount = totalAmount * 0.18 // Assuming 18% GST

//       const response = await fetch('/api/invoices', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           customerId,
//           organizationId,
//           items,
//           totalAmount,
//           gstAmount,
//         }),
//       })

//       if (!response.ok) throw new Error('Failed to create invoice')
//       router.refresh()
//       // Reset form
//       setCustomerId('')
//       setOrganizationId('')
//       setItems([{ name: '', hsnCode: '', quantity: 0, price: 0, unit: '', amount: 0 }])
//     } catch (error) {
//       console.error('Error creating invoice:', error)
//     }
//   }

//   const addItem = () => {
//     setItems([...items, { name: '', hsnCode: '', quantity: 0, price: 0, unit: '', amount: 0 }])
//   }

//   const updateItem = (index: number, field: string, value: string | number) => {
//     const newItems = [...items]
//     newItems[index] = { ...newItems[index], [field]: value }
//     setItems(newItems)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
//       <h2 className="text-2xl font-semibold mb-4">Create New Invoice</h2>
//       {/* Add dropdowns for selecting customer and organization */}
//       <div className="mb-4">
//         <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
//           Customer
//         </label>
//         <select
//           id="customerId"
//           value={customerId}
//           onChange={(e) => setCustomerId(e.target.value)}
//           required
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         >
//           <option value="">Select a customer</option>
//           {isLoading && <option>Loading Customers...</option>}
//           {data && data.customers.map((customer: any) => (
//             <option key={customer.id} value={customer.id}>
//               {customer.name}
//             </option>
//           ))}
//           {/* Add customer options here */}
//         </select>
//       </div>
//       <div className="mb-4">
//         <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700">
//           Organization
//         </label>
//         <select
//           id="organizationId"
//           value={organizationId}
//           onChange={(e) => setOrganizationId(e.target.value)}
//           required
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         >
//           <option value="">Select an organization</option>
//           {isLoading && <option>Loading Organizations...</option>}
//           {data && data.organizations.map((org: any) => (
//             <option key={org.id} value={org.id}>
//               {org.name}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="mb-4">
//         <h3 className="text-lg font-medium mb-2">Invoice Items</h3>
//         {items.map((item, index) => (
//           <div key={index} className="grid grid-cols-5 gap-2 mb-2">
//             <input
//               type="text"
//               placeholder="Product Name"
//               value={item.name}
//               onChange={(e) => updateItem(index, 'name', e.target.value)}
//               className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             />
//             <input
//               type="text"
//               placeholder="HSN Code"
//               value={item.hsnCode}
//               onChange={(e) => updateItem(index, 'hsnCode', e.target.value)}
//               className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             />
//             <input
//               type="number"
//               placeholder="Quantity"
//               value={item.quantity}
//               onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
//               className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             />
//             <input
//               type="number"
//               placeholder="Price"
//               value={item.price}
//               onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
//               className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             />
//             <input
//               type="text"
//               placeholder="Unit"
//               value={item.unit}
//               onChange={(e) => updateItem(index, 'unit', e.target.value)}
//               className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             />
//             <input
//               type="text"
//               placeholder="Amount"
//               value={item.amount}
//               disabled
//               onChange={(e) => updateItem(index, 'amount', e.target.value)}
//               className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//             />
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={addItem}
//           className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//         >
//           Add Item
//         </button>
//       </div>
//       <button
//         type="submit"
//         className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//       >
//         Create Invoice
//       </button>
//     </form>
//   )
// }

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { User } from '@supabase/supabase-js'
import axios from 'axios'

const fetchCustomers = async () => {
  const res = await axios.get("/api/invoices", { params: { getorgandcust: true } })
  console.log("res.data: ", res.data);

  return res.data
}

export default function InvoiceForm({ user }: { user: User }) {
  const [customerId, setCustomerId] = useState('')
  const [organizationId, setOrganizationId] = useState('')
  const [vehicalNumber, setVehicalNumber] = useState('')
  const [items, setItems] = useState([{ name: '', hsnCode: '', quantity: 0, price: 0, unit: '', amount: 0 }])
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ["customers and organizations"],
    queryFn: fetchCustomers,
    enabled: !!user
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const totalAmount = Number(items.reduce((sum, item) => sum + item.amount, 0).toFixed(0))

      const gstAmount = Number((totalAmount * 0.18).toFixed(0)) // Assuming 18% GST
      const grandTotal = Number((totalAmount + gstAmount).toFixed(0))
      console.log("totalAmount,gstAmount,grandTotal: ", totalAmount, gstAmount, grandTotal);
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          organizationId,
          items,
          totalAmount,
          gstAmount,
          grandTotal,
          vehicalNumber
        }),
      })

      if (!response.ok) throw new Error('Failed to create invoice')
      // router.refresh()
      // Reset form
      // setCustomerId('')
      // setOrganizationId('')
      // setVehicalNumber('')
      // setItems([{ name: '', hsnCode: '', quantity: 0, price: 0, unit: '', amount: 0 }])
    } catch (error) {
      console.error('Error creating invoice:', error)
    }
  }

  const addItem = () => {
    setItems([...items, { name: '', hsnCode: '', quantity: 0, price: 0, unit: '', amount: 0 }])
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Update amount dynamically based on quantity * price
    if (field === 'quantity' || field === 'price') {
      const quantity = parseFloat(newItems[index].quantity.toString()) || 0
      const price = parseFloat(newItems[index].price.toString()) || 0
      newItems[index].amount = Number((quantity * price).toFixed(0))
    }

    setItems(newItems)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Create New Invoice</h2>

      {/* Customer Dropdown */}
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
          {isLoading ? <option>Loading Customers...</option> : data?.customers.map((customer: any) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      {/* Organization Dropdown */}
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
          {isLoading ? <option>Loading Organizations...</option> : data?.organizations.map((org: any) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>
      </div>

      {/* Invoice Items */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Invoice Items</h3>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-6 gap-2 mb-2">
            <input
              type="text"
              placeholder="Product Name"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="text"
              placeholder="HSN Code"
              value={item.hsnCode}
              onChange={(e) => updateItem(index, 'hsnCode', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="text"
              placeholder="Unit"
              value={item.unit}
              onChange={(e) => updateItem(index, 'unit', e.target.value)}
              className="rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="text"
              placeholder="Amount"
              value={item.amount.toFixed(2)}
              disabled
              className="rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
            />
            <input
              type="text"
              onChange={(e) => setVehicalNumber(e.target.value)}
              placeholder="Vehical Number"
              value={vehicalNumber}
              className="rounded-md border-gray-300 shadow-sm bg-gray-100 "
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
        >
          Add Item
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Create Invoice
      </button>
    </form>
  )
}
