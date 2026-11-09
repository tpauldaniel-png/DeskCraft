
import { getCart, addToCart, updateCartItem, removeCartItem } from "../api/cart";
import { useIsMutating, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CartResponse } from "../types/cart";




export const cartKeys = {
    all: ['cart'] as const,
    user: (userId: string | null) => ['cart', userId] as const,
};



export function useCart(userId?: string | null) {
    return useQuery({
        queryKey: cartKeys.user(userId ?? null),
        queryFn: ({signal}) => {
            if (!userId) {
                throw new Error("Sign in to view your cart");
            }
            return getCart(signal);
        },
        enabled: Boolean(userId),
        retry: false,
    });
}



export function useCartMutataion<TVariables>(
    userId: string | null | undefined,
    mutationFn: (variables: TVariables) => Promise<CartResponse>,
) {
    const queryClient = useQueryClient();
    
    const queryKey = cartKeys.user(userId ?? null);

    return useMutation({

        mutationKey: queryKey,

        scope: {
            id: `cart:${userId ?? 'anonymous'}`,
        },

        mutationFn: (variables: TVariables) => {
            if (!userId) {
                throw new Error("Sign in to update your cart");
            }

            return mutationFn(variables);
        },

        retry: false,

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey, exact: true });
        },

        onSuccess: async (cart) => {
            await queryClient.invalidateQueries({ queryKey, exact: true });

            queryClient.setQueryData<CartResponse>(queryKey, cart);
        },

        onError: async (error) => {
            console.error("Error updating cart", error.message);
            await queryClient.invalidateQueries({ queryKey, exact: true });
        }
    });


}

export function useAddToCart(userId?: string | null) {
    return useCartMutataion(userId, addToCart);
}

export function useUpdateCartItem(userId?: string | null) {
    return useCartMutataion(userId, updateCartItem);
}

export function useRemoveCartItem(userId?: string | null) {
    return useCartMutataion(userId, removeCartItem);
}


export function useCartIsMutating(userId?: string | null) {
    const mutationCount = useIsMutating({
        mutationKey: cartKeys.user(userId ?? null),
        exact: true,
    });

    return mutationCount > 0;
}



















