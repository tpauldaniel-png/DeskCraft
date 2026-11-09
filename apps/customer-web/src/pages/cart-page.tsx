import { Link, Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { CartEmptyState } from "@/features/cart/components/cart-empty-state";
import { CartItemRow } from "@/features/cart/components/cart-item-row";
import { CartSummary } from "@/features/cart/components/cart-summary";

import {
  useCart,
  useCartIsMutating,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/features/cart/hooks/use-cart";

import { getCartErrorMessage } from "@/features/cart/utils/cart-utils";
import { Breadcrumb, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";


type CartPageMessageProps = {
  title: string;
  message: string;
  onRetry?: () => void;
  pending?: boolean;
};

function CartPageMessage({
  title,
  message,
    onRetry,
    pending = false,
}: CartPageMessageProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p role={onRetry ? "alert" : "status"} className="mt-4 text-muted-foreground">
            {message}
        </p>
        {onRetry && (
            <Button
                type="button"
                variant="outline"
                className="mt-6"
                disabled={pending}
                onClick={onRetry}
            >
                {pending ? "Trying again…" : "Try again"}
            </Button>
        )}
    </section>
  );
}






export function CartPage() {

    const currentUser = useCurrentUser();
    
    const userId = currentUser.data?.user_id;

    const cartQuery = useCart(userId);
    const updateItem = useUpdateCartItem(userId);
    const removeItem = useRemoveCartItem(userId);
    const isCartMutating = useCartIsMutating(userId);

    const controlsDisabled = isCartMutating || cartQuery.isFetching;
    const mutationError = updateItem.error ?? removeItem.error;

    function clearMutationErrors() {
        updateItem.reset();
        removeItem.reset();
    }

    function handleQuantityChange(itemId: string, newQuantity: number) {
        if (controlsDisabled || !Number.isSafeInteger(newQuantity) || newQuantity < 1) {
            return;
        }

        clearMutationErrors();
        updateItem.mutate({ cart_item_id: itemId, quantity: newQuantity });
    }

    function handleRemove(CartItemId: string) {
        if (controlsDisabled) return;

        clearMutationErrors();
        removeItem.mutate(CartItemId);
    }

    if (currentUser.isPending) {
        return <CartPageMessage title="Your cart" message="Checking your session…" />;
    }

    if (currentUser.isError) {
        return (
            <CartPageMessage
                title="Your cart"
                message="There was an error checking your session. Please try again."
                onRetry={currentUser.refetch}
                pending={currentUser.isFetching}
            />
        );
    }

    if (!currentUser.data) {
        return <Navigate to="/login" replace state={{ from: "/cart" }} />;
    }

    if (cartQuery.isPending) {
        return (
            <CartPageMessage
                title="Your cart"
                message="Loading your cart…"
            />
        );
    }

    const cart = cartQuery.data;

    if (!cart) {
        return (
            <CartPageMessage
                title="Your cart"
                message={getCartErrorMessage(
                    cartQuery.error,
                    "Unable to load your cart. Please try again.",
                )}
                onRetry={cartQuery.refetch}
                pending={cartQuery.isFetching}
            />
        );
    }


    return (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbLink render={<Link to={"/products"} />}>
                        Shop
                    </BreadcrumbLink>

                    <BreadcrumbSeparator />
                    
                    <BreadcrumbLink render={<Link to={"/cart"} />}>
                        Cart
                    </BreadcrumbLink>
                </BreadcrumbList>
            </Breadcrumb>


            <header className="mt-8">
                <h1 id="cart-page-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Your cart
                </h1>

                <p className="mt-3 text-sm text-muted-foreground mb-4">
                    {cart.total_quantity} {cart.total_quantity === 1 ? "item" : "items"} selected for your workspace.
                </p>
            </header>


            {cartQuery.isError && (
                <div className="mb-6 rounded-xl border border-destructive/30  bg-destructive/5 text-sm p-4">
                    <p>{getCartErrorMessage(cartQuery.error, "Unable to refresh your cart. Please try again.")}</p>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        disabled={controlsDisabled}
                        onClick={() => void cartQuery.refetch()}
                    >
                        {cartQuery.isFetching ? "Refreshing…" : "Try again"}
                    </Button>
                </div>
            )}

                
            {mutationError && (
                <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                    <p>{getCartErrorMessage(mutationError)}</p>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={clearMutationErrors}
                    >
                        Dismiss
                    </Button>
                </div>
            )}

            {cart.items.length === 0 ? (
                <CartEmptyState />
            ) : (
                <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
                    <div>
                        <ul
                            aria-label="Cart items"
                            aria-busy={controlsDisabled}
                            className="divide-y overflow-hidden rounded-2xl border bg-background"
                        >
                            {cart.items.map((item) => (
                                <li key={item.cart_item_id}>
                                    <CartItemRow
                                        item={item}
                                        disabled={controlsDisabled}
                                        isRemoving ={removeItem.isPending && removeItem.variables === item.cart_item_id}
                                        onRemove={handleRemove}
                                        onQuantityChange={handleQuantityChange}
                                    />
                                </li>
                            ))} 
                        </ul>

                        <p className="mt-3 min-h-5 text-sm text-muted-foreground">
                            {isCartMutating ? "Updating your cart…" : cartQuery.isFetching ? "Refreshing your cart…" : ""}
                        </p>
                    </div>

                    <CartSummary subtotal={cart.cart_subtotal} totalQuantity={cart.total_quantity} />
                </div>
            )}
            
        
        </section>
        
    );
}