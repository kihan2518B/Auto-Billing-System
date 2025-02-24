import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import OrganizationForm from './_components/OrganizationForm'
import { supabaseClient } from '@/utils/supabase'

export default async function OrganizationPage() {
    const session = await supabaseClient.auth.getUser()

    if (!session) {
        redirect('/auth/login')
    }

    const organizations = await prisma.organization.findMany()

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Organizations</h1>
            <OrganizationForm />
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Existing Organizations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizations.map((org) => (
                        <div key={org.id} className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold mb-2">{org.name}</h3>
                            <p>GST: {org.gstNumber}</p>
                            <p>Bank: {org.bankName}</p>
                            {/* Add more details as needed */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}