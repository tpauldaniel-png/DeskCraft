import { Link } from "react-router-dom";

import { formatCartMoney } from "../utils/cart-utils";

type CartSummaryProps = {
  subtotal: string;
  totalQuantity: number;
};


export function CartSummary({
    subtotal,
    totalQuantity,
}: CartSummaryProps) {
    return (
        <aside
            aria-labelledby="cart-summary-title"
            className="self-start rounded-2xl border bg-muted/30 p-6 lg:sticky lg:top-24"
        >
            <h2 id="cart-summary-title" className="text-lg font-semibold">
                Cart summary
            </h2>

            <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Total quantity</dt>
                    <dd className="font-medium tabular-nums">{totalQuantity}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-medium tabular-nums">{formatCartMoney(subtotal)}</dd>
                </div>
            </dl>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                Subtotal covers the items in your cart. Delivery and any additional
                charges are not included.
            </p>

            <Link
                to="/products"
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
                Continue shopping
            </Link>
        </aside>
    );
}