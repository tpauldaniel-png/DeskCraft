

export type Product = {
    product_id: string;
    category_id: string;
    category_name: string;
    name: string;
    slug: string;
    starting_price: string | null;
    image_url: string | null;
}

export type ProductSort = "name_asc" | "name_desc" | "price_asc" | "price_desc";

export type ProductListResponse = {
    items: Product[];
    total: number;
    page: number;
    page_size: number;
    sort: ProductSort;
}


export type ProductListParams = {
    page: number;
    page_size: number;
    search?: string;
    category_id?: string;
    sort?: ProductSort;
}