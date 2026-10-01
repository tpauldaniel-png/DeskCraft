

export type ProductImage = {
    product_image_id: string;
    variant_id: string;
    image_url: string;
    cloudinary_public_id: string;
    alt_text: string;
    sort_order: number;
    is_active: boolean;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
};

export type ProductImageListResponse = {
    items: ProductImage[];
};