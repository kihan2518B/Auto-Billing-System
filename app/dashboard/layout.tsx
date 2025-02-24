import type React from "react"
import CustomAdminSideBar from "@/components/DashbardSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

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


