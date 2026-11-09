import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

import { useAddToCart, useCartIsMutating } from "../hooks/use-cart";
import { getCartErrorMessage } from "../utils/cart-utils";

type AddToCartButtonProps = {
    variant_id: string | undefined;
    quantity?: number;
};

export function AddToCartButton({ variant_id, quantity = 1 }: AddToCartButtonProps) {

    const navigate = useNavigate();
    const location = useLocation();

    const currentUser = useCurrentUser();
    const userId = currentUser.data?.user_id;

    const addToCartMutation = useAddToCart(userId);
    const isMutating = useCartIsMutating(userId);

    const validQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

    console.log("Cart auhtentication check", {
        userId,
        userFields: Object.keys(currentUser.data ?? {})
    })

    function handleAddToCart() {
        if (
            !variant_id ||
            !validQuantity ||
            currentUser.isPending ||
            currentUser.isError ||
            isMutating
            
        ) {
            return;
        }
        
        if (!currentUser.data) {
            navigate("/login", {
                state: {
                    from: location.pathname + location.search + location.hash,
                },
            });
            return;
        }

        addToCartMutation.reset();

        addToCartMutation.mutate(
            {
                variant_id,
                quantity: validQuantity,
            },
            {
                onSuccess: () => {
                    navigate("/cart");
                },
            }
        );
        
    }

    return (
        <div className="space-y-3">
            <Button
                type="button"
                size="lg"
                className="w-fit cursor-pointer"
                disabled={!variant_id || !validQuantity || isMutating || currentUser.isPending || currentUser.isError}
                onClick={handleAddToCart}
            >
                {currentUser.isPending ? "Checking session…" : addToCartMutation.isPending ? "Adding…" : "Add to cart"}
            </Button>

            {!variant_id && (
                <p className="text-sm text-muted-foreground">
                    No active variant is available.
                </p>
            )}

            {currentUser.isError && (
                <div role="alert" className="space-y-2">
                    <p className="text-sm text-destructive">
                        Unable to verify your session.
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={currentUser.isFetching}
                        onClick={() => currentUser.refetch()}
                    >
                        try again
                    </Button>
                </div>
            )}

            {addToCartMutation.isError && (
                <div role="alert" className="space-y-2">
                    <p className="text-sm text-destructive">
                        {getCartErrorMessage(addToCartMutation.error)}
                    </p>
                </div>
            )}
        </div>
    );
}

