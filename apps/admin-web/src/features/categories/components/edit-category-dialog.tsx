
import type { Category } from "../types/category";
import { useUpdateCategory } from "../hooks/use-categories";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { isAxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api";
import { CategoryForm } from "./category-form";
import type { CategoryFormValues } from "../schemas/category-form-schema";



type EditCategoryDialogProps = {
    category: Category | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;

}

function UpdateCategoryResponseError(error: unknown) {
    if (isAxiosError<ApiErrorResponse>(error)) {
        return(
            error.response?.data.error.message ??
            "Could not update the category. Check the details and try again."
        )
    }

    return "Could not update the category. Check the details and try again."
}




export function EditCategoryDialog({open, onOpenChange, category}: EditCategoryDialogProps) {
    
    const updateCategoryMutation = useUpdateCategory();

    if (category === null) {
        return null;
    }

    const categoryId = category.category_id;


    async function handleSubmit(values:CategoryFormValues) {
        try {
            await updateCategoryMutation.mutateAsync({
                categoryId,
                categoryData: {
                    name: values.name,
                    description: values.description || null,
                }

            })

            onOpenChange(false);
        } catch {

        }
    }



    function handleOpenChange(nextOpen: boolean) {

        onOpenChange(nextOpen);
        if (!nextOpen) {
            updateCategoryMutation.reset();
        }
    }

    const errorMessage = updateCategoryMutation.isError ? UpdateCategoryResponseError(updateCategoryMutation.isError) : null;

    return(
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={<Button type="button">Edit Category</Button>} />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>Update the category name or description.</DialogDescription>
                </DialogHeader>
                {errorMessage && (
                    <p
                        role="alert"
                        className="rounded-b-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                        {errorMessage}   
                    </p>
                )}

                <CategoryForm 
                    key={category.category_id}
                    defaultValues={{
                        name: category.name,
                        description: category.description ?? "",
                    }}
                    onSubmit={handleSubmit}
                    isPending={updateCategoryMutation.isPending}
                    loadingText="Saving Changes..."
                    submitLabel="Save Changes"

                />
            </DialogContent>
        </Dialog>
    )

}



