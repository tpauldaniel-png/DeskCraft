import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { Button } from "@base-ui/react/button";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LogOutButton } from "@/features/auth/components/logout-button";

export function ProtectedLayout() {
    const location = useLocation();

    const {data: user, isPending, isError, refetch,} = useCurrentUser();

    if (isPending) {
        return(
            <main aria-live="polite">Checking your session...</main>
        )
    }

    if (isError) {
        return(
            <main role="alert">
                <p>Unable to verify your session</p>
                <Button type="button" onClick={() => void refetch()}>Try Again</Button>
            </main>
        );
    }

    if (!user) {
        return(
            <Navigate to="/login" replace state={{from: location.pathname}} />
        );
    }
    return (
        <>
            <header>
                <span>DeskCraft</span>
                <LogOutButton />
            </header>

            <main>
                <Outlet />
            </main>

            <footer>DeskCraft footer</footer>
        </>
    )
}