import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import CustomAdminSideBar from "@/components/CustomAdminSidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full">
            <SidebarProvider>
                <CustomAdminSideBar />
                {children}
            </SidebarProvider>
        </div>
    )
}


