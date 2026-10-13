


import type { ProductListParams } from '../types/product';
import { getProducts, getProductBySlug } from '../api/product-api';
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

export function useProductDetail(slug: string | undefined) {
    return useQuery({
        queryKey: ['products', 'detail', slug],
        queryFn: () => {
            if (!slug) {
                throw new Error('Slug is required to fetch product detail');
            }
            return getProductBySlug(slug);
        },
        enabled: Boolean(slug),
    });
}

