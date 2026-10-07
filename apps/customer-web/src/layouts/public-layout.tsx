import { CustomerHeader } from "@/components/layout/customer-header"
import { CustomerFooter } from "@/components/layout/customer-footer"
import { Outlet } from "react-router-dom"


export function PublicLayout() {
    return (
        <>
            <CustomerHeader />

            <main className="">
                <Outlet />
            </main>

            <CustomerFooter />
        </>
    )
}