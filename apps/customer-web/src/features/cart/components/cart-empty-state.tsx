import { Link } from "react-router-dom";

export function CartEmptyState() {
    return (
        <div className="rounded-2xl border border-dashed bg-muted/20 px-6 py-16 text-center sm:py-24">
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Find the pieces that make your workspace feel right.
            </p>
            <Link
                to="/products"
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
                Shop Now
            </Link>
        </div>
    );
}