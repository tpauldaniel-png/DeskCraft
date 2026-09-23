
import { ProductForm } from "./product-form";
import { useCreateProduct } from "../hooks/use-products";

import type { ProductFormData } from "../schemas/product-form-schema";
import type { Category } from "@/features/categories/types/category";


type CreateProductTabProps = {
    categories: Category[];
    onCreated: () => void;
}



export function CreateProductTab({categories, onCreated}: CreateProductTabProps){

    const createProductMutation = useCreateProduct();
    


    async function handleSubmitForm(values: ProductFormData) {
        try {
            await createProductMutation.mutateAsync({
                name: values.name,
                description: values.description || null,
                category_id: values.category_id,
            });

            onCreated()
        } catch (error) {
            console.error("Failed to create product", error)
        }
    }




    return(
        <ProductForm
            categories={categories}
            onSubmit={handleSubmitForm}
            isPending={createProductMutation.isPending}
            submitLabel="Create Product"
            loadingText="Creating Product..."
        />
    )
}