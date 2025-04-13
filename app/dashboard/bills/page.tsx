import { redirect } from 'next/navigation'
import InvoiceForm from './_components/InvoiceForm'
import { createClient } from '@/utils/supabase/server'
import InvoicesList from './_components/InvoicesList'

export default async function InvoicesPage() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()

    if (!data.user) {
        redirect('/login')
    }

    return (
        <div className="p-6 w-screen">
            <h1 className="text-3xl font-bold mb-6">Invoices</h1>
            <InvoiceForm user={data.user} />
            <InvoicesList user={data.user} />
        </div>
    )
}