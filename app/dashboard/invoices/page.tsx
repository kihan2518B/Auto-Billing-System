import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import InvoiceForm from './_components/InvoiceForm'

export default async function InvoicesPage() {
    const session = await supabase.auth.getUser()

    if (!session) {
        redirect('/auth/login')
    }

    const invoices = await prisma.invoice.findMany({
        include: { customer: true, organization: true },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Invoices</h1>
            <InvoiceForm />
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
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="border-t">
                                <td className="px-4 py-2">{invoice.invoiceNumber}</td>
                                <td className="px-4 py-2">{invoice.customer.name}</td>
                                <td className="px-4 py-2">{invoice.organization.name}</td>
                                <td className="px-4 py-2">${invoice.totalAmount.toFixed(2)}</td>
                                <td className="px-4 py-2">{invoice.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}