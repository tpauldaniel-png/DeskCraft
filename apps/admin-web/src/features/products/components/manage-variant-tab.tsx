
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCreateVariant, useVariants } from "../hooks/use-variants";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateVariantForm } from "./create-variant-form";
import type { ProductVariant } from "../types/variant";
import { StatusBadge } from "@/components/shared/status-badge";
import type { VariantFormData } from "../schemas/variant-form-schema";
import type { ApiErrorResponse } from "@/types/api";
import { isAxiosError } from "axios";


function createFormResponseError(error: unknown) {
    if (isAxiosError<ApiErrorResponse>(error)) {
        return(
            error.response?.data.error.message ??
            "Could not create the variant. Check the details and try again."
        )
    }

    return "Could not create the variant. Check the details and try again."
}




type ManageVariantTabProps = {
    productId: string;
    
    
    
};


const PAGE_SIZE = 10;   
export function ManageVariantTab({ productId }: ManageVariantTabProps) {

    const [page, setPage] = useState(1);
    const [isCreateVariantOpen, setIsCreateVariantOpen] = useState(false);
    



    const variantsQuery = useVariants({
        page: page,
        page_size: PAGE_SIZE,
        product_id: productId,
    });

    const total = variantsQuery.data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const variantItems = variantsQuery.data?.items ?? [];

    const createVariantMutation = useCreateVariant();

    const errorMessage = createVariantMutation.isError ? createFormResponseError(createVariantMutation.error) : null;

    async function handleCreateVariant(variantData: VariantFormData) {
        try {
            await createVariantMutation.mutateAsync({
                product_id: productId,
                name: variantData.name,
                price: variantData.price,
                sku: variantData.sku,
            });

            setIsCreateVariantOpen(false);
            variantsQuery.refetch();
        } catch (error) {
            console.error("Failed to create variant:", error);
        }
    }

    




    function formatDate(date: string) {
        return new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(date))
    }

    return (
        <section className="space-y-4">
            
            {variantsQuery.isLoading && (
                <div className="text-muted-foreground text-sm">Loading variants...</div>
            )}

            <Button type="button" onClick={() => setIsCreateVariantOpen(true)} className="mb-4 mt-4">
                Create Variant
            </Button>

            

            <CreateVariantForm
                isOpen={isCreateVariantOpen}
                onClose={() => setIsCreateVariantOpen(false)}
                onSubmit={handleCreateVariant}
                isPending={createVariantMutation.isPending}
                submitLabel="Create Variant"
                loadingText="Creating..."
                errorMessage={errorMessage}
            />
            
            

            

            {variantsQuery.isError && (
                <div
                    role="alert"
                    className="rounded-b-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    <p className="text-destructive text-sm">
                        Could not load variants.
                    </p>

                    <Button type="button" variant="outline" onClick={() => variantsQuery.refetch()}>
                        Try again
                    </Button>
                </div>
            )}

            {variantsQuery.isSuccess && variantItems.length === 0 && (
                <div
                    role="alert"
                    className="rounded-lg border border-accent-foreground/30 bg-accent/10 px-4 py-3 text-sm text-secondary-foreground text-center"
                >
                    <p className="text-muted-foreground text-sm">
                        No variants found for this product.
                    </p>
                </div>
            )}

            <Table className="overflow-x-auto rounded-lg border">
                <TableCaption>Variants for the selected product</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Updated Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {variantItems.map((variant: ProductVariant) => (
                        <TableRow key={variant.variant_id}>
                            <TableCell>{variant.name}</TableCell>
                            <TableCell>₹ {variant.price}</TableCell>
                            <TableCell>{variant.sku}</TableCell>
                            <TableCell>{formatDate(variant.updated_at)}</TableCell>
                            <TableCell>
                                <StatusBadge status={variant.is_active ? "success" : "danger"}>
                                    {variant.is_active ? "Active" : "Inactive"}
                                </StatusBadge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button type="button" variant="outline" size="sm" className="mr-2" >
                                    Edit
                                </Button>
                                <Button type="button" variant="outline" size="sm" >
                                    {variant.is_active ? "Deactivate" : "Activate"}
                                </Button>
                                
                            </TableCell>
                        </TableRow>
                    ))}


                </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-4">
                <p className="text-muted-foreground text-sm">
                    Page {page} of {totalPages}
                </p>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </section>
    )



}