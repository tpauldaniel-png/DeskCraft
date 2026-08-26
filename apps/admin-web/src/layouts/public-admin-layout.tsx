import { Outlet } from "react-router-dom"

export function PublicAdminLayout() {
    return (
        <>
            <header>DeskCraft Admin</header>

            <main>
                <Outlet />
            </main>

            <footer>DeskCraft footer</footer>
        </>
    )
}