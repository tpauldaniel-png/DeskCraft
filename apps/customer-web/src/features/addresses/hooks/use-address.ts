


import { getAddresses, createAddress, updateAddress, deleteAddress } from "../api/address";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const addressKeys = {
    all: ["addresses"] as const,
    user: (userId: string | null) => [ "addresses", userId] as const,
};


export function useAddresses(userId?: string | null) {
    return useQuery({
        queryKey: addressKeys.user(userId ?? null),
        enabled: Boolean(userId),
        queryFn: ({signal}) => {
            if (!userId) {
                throw new Error("Sign in to view your addresses");
            }
            return getAddresses(signal);
        },
    });
}

function useAddressMutation<TVariables, TResult>(
    userId: string | null | undefined,
    request: (variables: TVariables) => Promise<TResult>,    
) {
    const queryClient = useQueryClient();

    const queryKey = addressKeys.user(userId ?? null);

    return useMutation({
        mutationKey: queryKey,
        retry: false,
        mutationFn: (variables: TVariables) => {
            if (!userId) {
                throw new Error("Sign in to update your addresses");
            }

            return request(variables);
        },
        onSuccess:  () => {
             queryClient.invalidateQueries({ queryKey, exact: true });
        },
    });
}


export function useCreateAddress(userId?: string | null) {
    return useAddressMutation(userId, createAddress);
}

export function useUpdateAddress(userId?: string | null) {
    return useAddressMutation(userId, updateAddress);
}

export function useDeleteAddress(userId?: string | null) {
    return useAddressMutation(userId, deleteAddress);
}