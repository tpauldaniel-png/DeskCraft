import { Link, Outlet } from "react-router-dom"

export function PublicLayout() {
    return (
        <div className="flex min-h-svh flex-col bg-background text-foreground">
            <header className="border-b border-border bg-card">
                <div className="mx-auto flex h-16 w-full max-w-content items-center px-page md:px-page-md lg:px-page-lg">
                    <Link to="/" className="text-xl tracking-tight font-semibold">DeskCraft</Link>
                </div>
            </header>

            <main className="flex min-h-0 flex-1">
                <Outlet />
            </main>

            
        </div>
    )
}