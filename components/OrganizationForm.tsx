"use client"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export default function OrganizationForm() {
  const [name, setName] = useState("")
  const [gstNumber, setGstNumber] = useState("")
  const [address, setAddress] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [ifscCode, setIfscCode] = useState("")
  const [bankName, setBankName] = useState("")
  const [rulesAndPolicies, setRulesAndPolicies] = useState("")

  const queryClient = useQueryClient()

  const createOrganization = useMutation(
    async (organizationData) => {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organizationData),
      })
      if (!response.ok) {
        throw new Error("Failed to create organization")
      }
      return response.json()
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["organizations"])
        // Reset form fields
        setName("")
        setGstNumber("")
        setAddress("")
        setAccountNumber("")
        setIfscCode("")
        setBankName("")
        setRulesAndPolicies("")
      },
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createOrganization.mutate({
      name,
      gstNumber,
      address,
      accountNumber,
      ifscCode,
      bankName,
      rulesAndPolicies,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold">Create Organization</h2>
      <input
        type="text"
        placeholder="Organization Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
        placeholder="Account Number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="IFSC Code"
        value={ifscCode}
        onChange={(e) => setIfscCode(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        placeholder="Bank Name"
        value={bankName}
        onChange={(e) => setBankName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        placeholder="Rules and Policies"
        value={rulesAndPolicies}
        onChange={(e) => setRulesAndPolicies(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
        disabled={createOrganization.isLoading}
      >
        {createOrganization.isLoading ? "Creating..." : "Create Organization"}
      </button>
    </form>
  )
}

