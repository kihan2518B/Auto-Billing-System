"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/utils/supabase"
import OrganizationForm from "@/components/OrganizationForm"
import OrganizationList from "@/components/OrganizationList"
import InvoiceForm from "@/components/InvoiceForm"
import InvoiceList from "@/components/InvoiceList"
import CustomerForm from "@/components/CustomerForm"
import CustomerList from "@/components/CustomerList"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [selectedOrganization, setSelectedOrganization] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const {
    data: organizations,
    isLoading: organizationsLoading,
    error: organizationsError,
  } = useQuery(["organizations"], async () => {
    const response = await fetch("/api/organizations")
    if (!response.ok) {
      throw new Error("Failed to fetch organizations")
    }
    return response.json()
  })

  const {
    data: customers,
    isLoading: customersLoading,
    error: customersError,
  } = useQuery(
    ["customers", selectedOrganization],
    async () => {
      if (!selectedOrganization) return []
      const response = await fetch(`/api/customers?organizationId=${selectedOrganization}`)
      if (!response.ok) {
        throw new Error("Failed to fetch customers")
      }
      return response.json()
    },
    { enabled: !!selectedOrganization },
  )

  const {
    data: invoices,
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useQuery(
    ["invoices", selectedOrganization],
    async () => {
      if (!selectedOrganization) return []
      const response = await fetch(`/api/invoices?organizationId=${selectedOrganization}`)
      if (!response.ok) {
        throw new Error("Failed to fetch invoices")
      }
      return response.json()
    },
    { enabled: !!selectedOrganization },
  )

  if (organizationsLoading) return <div>Loading organizations...</div>
  if (organizationsError) return <div>Error: {(organizationsError as Error).message}</div>

  const selectedOrg = organizations?.find((org) => org.id === selectedOrganization)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <OrganizationForm />
      <OrganizationList organizations={organizations} onSelectOrganization={(id) => setSelectedOrganization(id)} />
      {selectedOrganization && selectedOrg && (
        <>
          <h2 className="text-xl font-semibold mt-8 mb-4">Managing Organization: {selectedOrg.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <CustomerForm organization={selectedOrg} />
              {customersLoading ? (
                <div>Loading customers...</div>
              ) : customersError ? (
                <div>Error: {(customersError as Error).message}</div>
              ) : (
                <CustomerList customers={customers} />
              )}
            </div>
            <div>
              <InvoiceForm customers={customers || []} organization={selectedOrg} />
              {invoicesLoading ? (
                <div>Loading invoices...</div>
              ) : invoicesError ? (
                <div>Error: {(invoicesError as Error).message}</div>
              ) : (
                <InvoiceList invoices={invoices} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

