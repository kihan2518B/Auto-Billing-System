import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import InvoiceReport from './_components/InvoiceReport'

export default async function Page() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    console.log(data)
    if (!data.user) {
        redirect('/login')
    }
    return (
        <div className='flex w-full h-full items-center justify-center'>
            <InvoiceReport user={data.user} />
        </div>
    )
}
