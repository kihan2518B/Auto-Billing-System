import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import OrganizationForm from './_components/OrganizationForm'
import { supabaseClient } from '@/utils/supabase'
import Link from 'next/link'
import Image from 'next/image'
import { Building2, FileSpreadsheet } from 'lucide-react'

export default async function OrganizationPage() {
    const session = await supabaseClient.auth.getUser()

    if (!session) {
        redirect('/auth/login')
    }

    const organizations = await prisma.organization.findMany()

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-3xl font-bold text-navy-800 mb-4 md:mb-0">
                    Organizations
                </h1>
            </div>
                <OrganizationForm />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                    <Link 
                        href={`/dashboard/organization/${org.id}`} 
                        key={org.id} 
                        className="
                            bg-white 
                            rounded-lg 
                            shadow-md 
                            hover:shadow-lg 
                            transition-shadow 
                            duration-300 
                            border 
                            border-gray-200 
                            overflow-hidden 
                            group"
                    >
                        <div className="relative w-full h-48 bg-gray-100">
                            {org.logo ? (
                                <Image 
                                    src={org.logo} 
                                    alt={`${org.name} Logo`} 
                                    fill 
                                    className="object-contain p-4"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <Building2 className="w-16 h-16" />
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-navy-900 mb-2 group-hover:text-navy-700 transition-colors">
                                {org.name}
                            </h3>
                            <div className="space-y-2 text-gray-600">
                                <p className="flex items-center gap-2">
                                    <FileSpreadsheet className="w-4 h-4" />
                                    GST: {org.gstNumber}
                                </p>
                                <p>Bank: {org.bankName}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}