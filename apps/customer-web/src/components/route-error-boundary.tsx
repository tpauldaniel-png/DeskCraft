import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";


export function RootErrorBoundary() {
    const error = useRouteError()

    if (isRouteErrorResponse(error)) {
        return (
            <main role="alert">
                <h1>{error.status}</h1>
                <p>{error.statusText || "The request could not be completed."}</p>
                <Link to="/">Return to Home</Link>
            </main>
        );
    }

    return (
        <main role="alert">
            <h1>Something went wrong</h1>
            <p>Please try again or return to the home page.</p>
            <Link to="/">Return to home</Link>
        </main>
    )
}
