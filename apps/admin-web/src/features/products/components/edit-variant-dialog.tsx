import type { ApiErrorResponse } from "@/types/api"
import { isAxiosError } from "axios"
import { useUpdateVariant } from "../hooks/use-variants";

import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { ProductVariant, } from "../types/variant";




type EditVariantDialogProps = {
    variant: ProductVariant | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}




function UpdateVariantResponseError(error: unknown) {
    if (isAxiosError<ApiErrorResponse>(error)) {
        return(
            error.response?.data.error.message ??
            "Could not update the variant. Check the details and try again."
        )
    }

    return "Could not update the variant. Check the details and try again."
}



export function EditVariantDialog({open, onOpenChange, variant}: EditVariantDialogProps) {
    const updateVariantMutation = useUpdateVariant();
    

    if (variant === null) {
        return null;
    }

    const variantId = variant.variant_id;

    const errorMessage = updateVariantMutation.isError ? UpdateVariantResponseError(updateVariantMutation.error) : null;

    


    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger render={<Button type="button">Edit Category</Button>} />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Variant</DialogTitle>
                    <DialogDescription>
                        Update the details of the variant.
                    </DialogDescription>
                </DialogHeader> 

                {errorMessage && (
                    <p className="text-destructive text-sm">{errorMessage}</p>
                )}

                
            </DialogContent>
        </Dialog>
    )
}       
    