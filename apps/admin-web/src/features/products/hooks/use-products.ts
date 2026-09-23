import { createProduct, getProducts, updateProduct } from "../api/products-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ProductCreateInput, ProductListParams, ProductUpdateInput } from "../types/product";  



const productKeys = {
  all: ["products"] as const,
  list: (params: ProductListParams) => 
    ["products", "list", params] as const,
};



export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => getProducts(params),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: ProductCreateInput) => createProduct(productData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productKeys.all
      });
    }
  });
}

type UpdateProductVariables = {
  productId: string;
  productData: ProductUpdateInput;
};  


export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({productId, productData}: UpdateProductVariables) => updateProduct(productId, productData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: productKeys.all
      });
    }
  });
}