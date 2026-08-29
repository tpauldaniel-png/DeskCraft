import { Outlet } from "react-router-dom"

export function PublicAdminLayout() {
    return (
        <div className="flex min-h-svh flex-col bg-background">
            <header className="border-b border-border/70 bg-card">
                <div className="mx-auto flex h-16 w-full max-w-content items-center gap-2 px-page md:px-page-md lg:px-page-lg">
                    <span className="text-lg font-semibold tracking-tight text-primary">
                        DeskCraft
                    </span>
                    <span className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                        Admin
                    </span>
                </div>
            </header>

            <main className="relative flex flex-1 items-center justify-center">
                <Outlet />
                
            </main>

            
        </div>
    )
}