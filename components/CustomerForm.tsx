"use client"

import type React from "react"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Organization } from "@prisma/client"

interface CustomerFormProps {
  organization: Organization
}

export default function CustomerForm({ organization }: CustomerFormProps) {
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [gstNumber, setGstNumber] = useState("")

  const queryClient = useQueryClient()

  const createCustomer = useMutation(
    async (customerData) => {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      })
      if (!response.ok) {
        throw new Error("Failed to create customer")
      }
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["customers", organization.id])
        // Reset form fields
        setName("")
        setAddress("")
        setGstNumber("")
      },
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createCustomer.mutate({
      name,
      address,
      gstNumber,
      organizationId: organization.id,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold">Add Customer</h2>
      <input
        type="text"
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="GST Number"
        value={gstNumber}
        onChange={(e) => setGstNumber(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded" disabled={createCustomer.isLoading}>
        {createCustomer.isLoading ? "Adding..." : "Add Customer"}
      </button>
    </form>
  )
}

