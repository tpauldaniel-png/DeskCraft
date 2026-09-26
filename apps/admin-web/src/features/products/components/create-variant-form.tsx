

import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import type { SubmitHandler } from "react-hook-form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/shared/loading-button";
import { variantFormSchema, type VariantFormData } from "../schemas/variant-form-schema";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";




type CreateVariantFormProps = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: SubmitHandler<VariantFormData>;
    isPending: boolean;
    submitLabel: string;
    loadingText: string;
    errorMessage?: string | null;
}


export function CreateVariantForm({onSubmit, isPending, submitLabel, loadingText, errorMessage, isOpen, onClose}: CreateVariantFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<VariantFormData>({
        resolver: zodResolver(variantFormSchema),
        defaultValues: {
            name: "",
            sku: "",
            price: undefined,
        }
    });

    const isLoading = isPending || isSubmitting;


    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) {
                onClose();
            }}
            }
        >
        
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{submitLabel}</DialogTitle>
                    <DialogDescription>
                        {submitLabel} of the product.
                    </DialogDescription>
                </DialogHeader>

                {errorMessage && (
                    <p className="text-destructive text-sm">{errorMessage}</p>
                )}

                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field data-invalid={Boolean(errors.name)}>
                            <FieldLabel htmlFor="variant-name">Name</FieldLabel>
                            <Input
                                id="variant-name"
                                type="text"
                                placeholder="Enter variant name"
                                {...register("name")}
                            />
                            {errors.name && (
                                <FieldError>{errors.name.message}</FieldError>
                            )}
                        </Field>

                        <Field data-invalid={Boolean(errors.sku)}>
                            <FieldLabel htmlFor="variant-sku">SKU</FieldLabel>
                            <Input
                                id="variant-sku"
                                type="text"
                                placeholder="Enter SKU"
                                {...register("sku")}
                            />
                            {errors.sku && (
                                <FieldError>{errors.sku.message}</FieldError>
                            )}
                        </Field>

                        <Field data-invalid={Boolean(errors.price)}>
                            <FieldLabel htmlFor="variant-price">Price</FieldLabel>
                            <Input
                                id="variant-price"
                                type="number"
                                placeholder="Enter price"
                                min="0"
                                {...register("price", { valueAsNumber: true })}
                            />
                            {errors.price && (
                                <FieldError>{errors.price.message}</FieldError>
                            )}
                        </Field>
                    </FieldGroup>

                    <LoadingButton
                        type="submit"
                        className="w-full h-11 mt-4"
                        isLoading={isLoading}
                        loadingText={loadingText}
                    >
                        {submitLabel}
                    </LoadingButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}