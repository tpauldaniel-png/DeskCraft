import { useState } from "react";
import { useCreateCategory } from "../hooks/use-categories";
import type { CategoryFormValues } from "../schemas/category-form-schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { CategoryForm } from "./category-form";
import { isAxiosError } from "axios";
import type { ApiErrorResponse } from "@/types/api";

function createFormResponseError(error: unknown) {
    if (isAxiosError<ApiErrorResponse>(error)) {
        return(
            error.response?.data.error.message ??
            "Could not create the category. Check the details and try again."
        )
    }

    return "Could not create the category. Check the details and try again."
}






export function CreateCategoryDialog() {
    const [open, setOpen]= useState(false);
    const createCategoryMutation = useCreateCategory();

    async function handleSubmit(values:CategoryFormValues) {
        try {
            await createCategoryMutation.mutateAsync({
                name: values.name,
                description: values.description || null,
            });

            setOpen(false)
        } catch {

        }
    }

    function handleOpenChange(nextOpen: boolean){
        setOpen(nextOpen);
        if (!nextOpen) {
            createCategoryMutation.reset()
        }
    }

    const errorMessage = createCategoryMutation.isError ? createFormResponseError(createCategoryMutation.isError) : null;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger render={<Button type="button">Add Category</Button>}/>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Category</DialogTitle>
                    <DialogDescription>
                        Add a new product category to DeskCraft.
                    </DialogDescription>
                </DialogHeader>

                {errorMessage && (
                    <p
                        role="alert"
                        className="rounded-b-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                        {errorMessage}   
                    </p>
                )};
                    
                <CategoryForm onSubmit={handleSubmit} isPending={createCategoryMutation.isPending} submitLabel="Create Category" loadingText="Creating Category..."/>

            </DialogContent>
        </Dialog>
    )

    

}