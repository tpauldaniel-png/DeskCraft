import { useCurrentUser } from "@/features/auth/hooks/use-current-user"

export function AccountPage() {
    const {data: user, isPending, isError} = useCurrentUser();

    if (isPending) {
        return(
            <p>Loading your account...</p>
        )
    }


    if (isError) {
        return(
            <p role="alert">Unable to load your account</p>
        )
    }

    if (!user) {
        return(
            <p>Your are not logged in</p>
        )
    }
    return(
        <section>
            <h1>Welcome {user.first_name}</h1>
            <p>{user.email}</p>
        </section>
    )
}