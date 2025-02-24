"use client"
import { User } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import React from 'react'
import axios from "axios"

const fetchCustomers = async () => {
    const res = await axios.get("/api/customers")
    return res.data.customers
}
export default function CustomersList({ user }: { user: User }) {
    const { data: customers } = useQuery({
        queryKey: ["customers"],
        queryFn: () => fetchCustomers(),
        enabled: !!user
    })

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Existing customers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {!customers && <div>No customer found...</div>}
                {customers && customers.map((cust: any) => (
                    <div key={cust.id} className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-xl font-semibold mb-2">{cust.name}</h3>
                        <p>GST: {cust.gstNumber}</p>
                        {/* Add more details as needed */}
                    </div>
                ))}
            </div>
        </div>
    )
}
