import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/features/health/get-health";

export function HomePage() {

    const healthQuery = useQuery({
        queryKey: ["health"],
        queryFn: getHealth
    })

    if (healthQuery.isPending) {
        return <p>Checking Backend...</p>
    }

    if (healthQuery.isError) {
        return <p>Unable to connect to the backend</p>
    }



    return (

        <main className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">DeskCraft</h1>

            <p className="text-muted-foreground">
                Build a workspace that works for you.
            </p>
            <p>Backend status: {healthQuery.data.status}</p>

            <Button>Explore DeskCraft</Button>
        </main>
    );
}