import { Outlet } from "react-router-dom"

export function PublicLayout() {
    return (
        <>
            <header>DeskCraft</header>

            <main>
                <Outlet />
            </main>

            <footer>DeskCraft footer</footer>
        </>
    )
}