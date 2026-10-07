


import type { ProductListParams } from '../types/product';
import { getProducts } from '../api/product-api';
import { useQuery } from '@tanstack/react-query';

const productKeys = {
    all: ['products'] as const,
    list: (params: ProductListParams) => ['products', 'list', params] as const,
};


export function useProducts(params: ProductListParams) {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => getProducts(params),
    });
}