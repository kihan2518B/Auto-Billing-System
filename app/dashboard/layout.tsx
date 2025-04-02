"use client"
import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import CustomAdminSideBar from "@/components/CustomAdminSidebar"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createClientComponentClient();
    return (
        <div className="w-full">
            <SidebarProvider>
                <CustomAdminSideBar />
                <SessionContextProvider supabaseClient={supabase}>
                    {children}
                    <Toaster
                        position="top-right"
                        reverseOrder={false}
                        toastOptions={{
                            style: {
                                fontFamily: 'inherit',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                            },
                        }}
                    />
                </SessionContextProvider>
            </SidebarProvider>
        </div>
    )
}


