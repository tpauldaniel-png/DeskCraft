import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createProductVariant, getProductVariants, updateProductVariant } from "../api/variant-api";
import type { ProductVariantCreateInput, ProductVariantListParams, ProductVariantUpdateInput } from "../types/variant";


const variantKeys = {
  all: ["variants"] as const,
  list: (params: ProductVariantListParams) => 
    ["variants", "list", params] as const,
};

export function useVariants(params: ProductVariantListParams) {
    return useQuery({
        queryKey: variantKeys.list(params),
        queryFn: () => getProductVariants(params),
    });
}


export function useCreateVariant() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (variantData: ProductVariantCreateInput) => createProductVariant(variantData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: variantKeys.all
            });
        },
    });
}

type UpdateVariantVariables = {
    variantId: string;
    variantData: ProductVariantUpdateInput;
};

export function useUpdateVariant() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ variantId, variantData }: UpdateVariantVariables) =>
            updateProductVariant(variantId, variantData),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: variantKeys.all,
            });
        },
    });
}

