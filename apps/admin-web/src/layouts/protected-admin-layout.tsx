import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { useAdminSession } from "@/features/auth/hooks/use-admin-session";
import { AccessDeniedPage } from "@/pages/access-denied-page";
import { isAxiosError } from "axios";
import { Outlet, Navigate, useLocation } from "react-router-dom";


export function ProtectedAdminLayout(){
    const location = useLocation();
    const {data: admin, isError, isPending, error, refetch} = useAdminSession();
    

    if (isPending) {
        return(
            <main>Verifying Admin access...</main>
        )
    }

    if (isError && isAxiosError(error) && error.response?.status === 403) {
        return <AccessDeniedPage />
    }
    

    if (isError) {
        return(
            <main role="alert">
                <p>Unable to Verify session</p>
                <button type="button" onClick={() => void refetch()}>Try again</button>
            </main>
        )
    }

    if (!admin) {
        return(
            <Navigate to="/login" replace state={{from: location.pathname + location.search + location.hash}} />
        );
    }



    return(
        <SidebarProvider>
            <AdminSidebar admin={admin}/>

            <SidebarInset>
                <AdminHeader />
                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}