

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
    min_price: string | null;
    max_price: string | null;
}


export type ProductListParams = {
    page: number;
    page_size: number;
    search?: string;
    category_id?: string;
    sort?: ProductSort;
    min_price?: number;
    max_price?: number;
}



export type ProductDetailVariantImage = {
    product_image_id: string;
    image_url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
};

export type ProductDetailVariant = {
    variant_id: string;
    name: string;
    price: string;
    images: ProductDetailVariantImage[];
};

export type ProductSpecification = {
    material: string | null;
    adjustment_feature: string | null;
    max_load_kg: number | null;
    assembly_required: boolean | null;
};



export type ProductDetail = {
    product_id: string;
    category_id: string;
    category_name: string;
    name: string;
    slug: string;
    description: string | null;
    specifications: ProductSpecification | null;
    variants: ProductDetailVariant[];
}