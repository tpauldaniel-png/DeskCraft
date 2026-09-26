

export type ProductVariant = {
    variant_id: string;
    product_id: string;
    name: string;
    price: number;
    sku: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type ProductVariantListResponse = {
    items: ProductVariant[];
    total: number;
    page: number;
    page_size: number;
};

export type ProductVariantListParams = {
    page: number;
    page_size: number;
    search?: string;
    product_id?: string;
    is_active?: boolean;
};

export type ProductVariantCreateInput = {
    product_id: string;
    name: string;
    price: number;
    sku: string;
};

export type ProductVariantUpdateInput = {
    name?: string;
    price?: number;
    sku?: string;
    is_active?: boolean;
};



