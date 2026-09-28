import type { ApiErrorResponse } from "@/types/api"
import { isAxiosError } from "axios"
import { useUpdateVariant } from "../hooks/use-variants";



import type { ProductVariant } from "../types/variant";
import { CreateVariantForm } from "./create-variant-form";

import type { VariantFormData } from "../schemas/variant-form-schema";




type EditVariantDialogProps = {
    variant: ProductVariant | null;
    onClose: () => void;
    onUpdated: () => void;
    
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



export function EditVariantDialog({onClose, variant, onUpdated}: EditVariantDialogProps) {
    const updateVariantMutation = useUpdateVariant();
    

    if (variant === null) {
        return null;
    }

    const variantId = variant.variant_id;

    const errorMessage = updateVariantMutation.isError ? UpdateVariantResponseError(updateVariantMutation.error) : null;

    const handleUpdateVariantForm = async (values: VariantFormData) => {
        try {
            await updateVariantMutation.mutateAsync({
                variantId: variantId,
                variantData: {
                    name: values.name,
                    sku: values.sku,
                    price: values.price,
                }
            });
            onClose();
            onUpdated();
        } catch (error) {
            console.error(error);
        }
    };
    


    return(
        

            <CreateVariantForm
                isOpen={true}
                onClose={onClose}
                onSubmit={handleUpdateVariantForm}
                isPending={updateVariantMutation.isPending}
                submitLabel="Update Variant"
                loadingText="Updating Variant..."
                errorMessage={errorMessage}
                initialValues={{
                    name: variant.name,
                    sku: variant.sku,
                    price: Number(variant.price),
                }}
            />
                
         
    )
}       
    