

export type AddToCartParams = {
    variant_id: string;
    quantity: number;
};

export type UpdateCartItemParams = {
    cart_item_id: string;
    quantity: number;
};

export type CartItemResponse = {
    cart_item_id: string;
    variant_id: string;
    product_name: string;
    sku: string;
    image_url: string | null;

    quantity: number;
    current_unit_price: string;
    line_total: string;

    created_at: string;
    updated_at: string;
    
};


export type CartResponse = {
    cart_id: string | null;
    items: CartItemResponse[];
    total_quantity: number;
    cart_subtotal: string;
};