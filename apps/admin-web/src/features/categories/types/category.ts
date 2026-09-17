


export type Category = {
    category_id: string;
    name: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;

}

export type CategoryListResponse = {
    items: Category[];
    total: number;
    page: number;
    page_size: number;
}


export type CategoryCreateInput = {
    name: string;
    description?: string | null;
}

export type CategoryUpdateInput = {
    name?: string;
    description?: string | null;
    is_active?: boolean;
}