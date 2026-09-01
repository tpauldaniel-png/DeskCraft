import { useLocation } from "react-router-dom"
import { Separator } from "../ui/separator"
import { SidebarTrigger } from "../ui/sidebar"

import { LogOutButton } from "@/features/auth/components/admin-logout-button";




const pageTitles : Record<string, string> = {
    "/dashboard": "Dashboard",
    "/categories": "Categories",
    "/products" : "Products",
    "/inventory": "Inventory",
    "/orders" : "Orders",
    "/shipping": "Shipping",
}



export function AdminHeader() {
    const location = useLocation();

    const pageTitle = pageTitles[location.pathname] ?? "DeskCraft Admin"


    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
            <SidebarTrigger className="-ml-1"/>

            <Separator orientation="vertical" className="h-4"/>

            <h1 className="text-lg font-semibold">
                {pageTitle}
            </h1>

            <div className="ml-auto">
                <LogOutButton />
            </div>
            
        </header>

        
    )
}
