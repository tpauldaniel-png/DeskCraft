import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createProductImage, getProductImages } from "../api/product-images";



const productImageKeys = {
  all: ["product-images"] as const,
  list: (variantId: string) => ["product-images", "list", variantId] as const,
};


export function useProductImages(variantId: string) {
    return useQuery({
        queryKey: productImageKeys.list(variantId),
        queryFn: () => getProductImages(variantId),
    });
}

export function useCreateProductImage(variantId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (imageData: FormData) => createProductImage(variantId, imageData),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: productImageKeys.list(variantId),
                }),
                queryClient.invalidateQueries({
                    queryKey: ["variants"],
                }),
            ]);
        },
    });
}