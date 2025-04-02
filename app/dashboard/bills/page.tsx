import { redirect } from 'next/navigation'
import InvoiceForm from './_components/InvoiceForm'
import { createClient } from '@/utils/supabase/server'
import InvoicesList from './_components/InvoicesList'
import DownloadInvoice from './_components/DownloadInvoice'

export default async function InvoicesPage() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
        redirect('/auth/login')
    }

    // const invoices = [{ id: 1, invoiceNumber: 1, customer: { name: 'John Doe' }, organization: { name: 'Acme Inc' }, totalAmount: 100, status: 'PENDING' }]

    return (
        <div className="p-6 w-full">
            <h1 className="text-3xl font-bold mb-6">Invoices</h1>
            <InvoiceForm user={data.user} />
            <InvoicesList user={data.user} />
            <DownloadInvoice />
        </div>
    )
}