'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseClient } from '@/utils/supabase'

export default function OrganizationForm() {
  const [name, setName] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [address, setAddress] = useState('')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data } = await supabaseClient.auth.getUser()

    console.log(data)
    try {
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, gstNumber, address, bankName, accountNumber, ifscCode, userId: data.user?.id }),
      })
      console.log("response: ", response)
      if (!response.ok) throw new Error('Failed to create organization')
      // router.refresh()
      // Reset form
      setName('')
      setGstNumber('')
      setAddress('')
      setBankName('')
      setAccountNumber('')
      setIfscCode('')
    } catch (error) {
      console.error('Error creating organization:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Add New Organization</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Organization Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="gstNumber" className="block text-sm font-medium text-gray-700">
            GST Number
          </label>
          <input
            type="text"
            id="gstNumber"
            value={gstNumber}
            onChange={(e) => setGstNumber(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        {/* Add more form fields for address, bank details, etc. */}
      </div>
      <button
        type="submit"
        className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Organization
      </button>
    </form>
  )
}