

export type Product = {
    product_id: string;
    category_id: string;
    category_name: string;
    name: string;
    slug: string;
    starting_price: string | null;
    image_url: string | null;
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
}