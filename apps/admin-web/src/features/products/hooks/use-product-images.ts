import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createProductImage, getProductImages, reorderProductImages, updateProductImageAltText } from "../api/product-images";



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


export function useUpdateProductImageAltText(variantId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productImageId, altText }: { productImageId: string; altText: string }) =>
            updateProductImageAltText(variantId, productImageId, altText),
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


export function useReorderProductImages(variantId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (imageIds: string[]) => reorderProductImages(variantId, imageIds),
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
