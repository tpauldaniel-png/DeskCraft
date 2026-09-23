import type { Category } from "@/features/categories/types/category";
import type { Product } from "../types/product";
import { useUpdateProduct } from "../hooks/use-products";
import type { ProductFormData } from "../schemas/product-form-schema";
import { ProductForm } from "./product-form";






type EditProductTabProps = {
    product: Product;
    categories: Category[];
    onUpdated: () => void;
}

export function EditProductTab({ product, categories, onUpdated }: EditProductTabProps) {
    const updateProductMutation = useUpdateProduct();


    async function handleSubmitForm(values: ProductFormData) {
        try {
            await updateProductMutation.mutateAsync({
                productId: product.product_id,
                productData: {
                    category_id: values.category_id,
                    name: values.name,
                    description: values.description,
                }
            });
            onUpdated();
        } catch (error) {
            console.error("Failed to update product", error)

        }
    }
    return(
        <ProductForm
            categories={categories}
            onSubmit={handleSubmitForm}
            isPending={updateProductMutation.isPending}
            submitLabel="Update Product"
            loadingText="Updating product..."
            defaultValues={{
                category_id: product.category_id,
                name: product.name,
                description: product.description ?? "",
            }}
        />
    );
}