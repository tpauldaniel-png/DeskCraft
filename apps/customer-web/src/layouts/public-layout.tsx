import { CustomerHeader } from "@/components/layout/customer-header"
import { Outlet } from "react-router-dom"

export function PublicLayout() {
    return (
        <>
            <CustomerHeader />

            <main className="flex min-h-0 flex-1 items-center justify-center">
                <Outlet />
            </main>

            
        </>
    )
}