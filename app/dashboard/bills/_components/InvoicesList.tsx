"use client"
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import Link from 'next/link'
import React from 'react'

async function GetInvoices() {
    const res = await axios.get("/api/invoices")
    return res.data.invoices
}
export default function InvoicesList({ user }: { user: User }) {
    const { data: invoices, isLoading } = useQuery({
        queryKey: ["invoices"],
        queryFn: () => GetInvoices(),
        enabled: !!user
    })
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Recent Invoices</h2>
            <table className="w-full bg-white shadow rounded-lg">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Invoice Number</th>
                        <th className="px-4 py-2 text-left">Customer</th>
                        <th className="px-4 py-2 text-left">Organization</th>
                        <th className="px-4 py-2 text-left">Total Amount</th>
                        <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (<>Loading Invoices...</>)}
                    {invoices && invoices.map((invoice: any) => (
                        <tr key={invoice.id} className="border-t">
                            <td className="px-4 py-2">{invoice.invoiceNumber}</td>
                            <td className="px-4 py-2">{invoice.customer.name}</td>
                            <td className="px-4 py-2">
                                <Link href={`/dashboard/bills/${invoice.id}`}>
                                    {invoice.organization.name}
                                </Link>
                            </td>
                            <td className="px-4 py-2">${invoice.totalAmount.toFixed(2)}</td>
                            <td className="px-4 py-2">{invoice.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
