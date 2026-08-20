import { Button } from "@/components/ui/button";

export function HomePage() {
    return (

        <main className="flex min-h-screen flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold">DeskCraft</h1>

            <p className="text-muted-foreground">
                Build a workspace that works for you.
            </p>

            <Button>Explore DeskCraft</Button>
        </main>
    );
}