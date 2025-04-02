import { Home, BookOpen, Calendar, UserCheck } from "lucide-react";
// Define role-based menu items
export const Menuitems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Bills", url: "/dashboard/bills", icon: BookOpen },
    { title: "Organizations", url: "/dashboard/organization", icon: UserCheck },
    { title: "Customers", url: "/dashboard/customers", icon: UserCheck },
    { title: "Reports", url: "/dashboard/reports", icon: UserCheck },
]