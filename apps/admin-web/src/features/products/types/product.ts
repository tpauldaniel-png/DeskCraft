



export type Product = {
    product_id: string;
    category_id: string;
    name: string;
    description: string | null;
    slug: string;
    specifications: Record<string, unknown> | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type ProductListResponse = {
    items: Product[];
    total: number;
    page: number;
    page_size: number;
}

export type ProductListParams = {
    page: number;
    page_size: number;
    search?: string;
    category_id?: string;
    is_active?: boolean;
}


export type ProductCreateInput = {
    name: string;
    description?: string | null;
    category_id: string;
}

export type ProductUpdateInput = {
    name?: string;
    description?: string | null;
    category_id?: string;
    is_active?: boolean;
    
}

