import { Button } from "@/components/ui/button";
import { useProductImages, useReorderProductImages, useUpdateProductImageAltText } from "../hooks/use-product-images";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@/components/shared/loading-button";




export function ProductVariantImageGallery({ variantId }: { variantId: string }) {
    const { data, isLoading, isError } = useProductImages(variantId);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentImageId, setCurrentImageId] = useState<string | null>(null);
    
    

    const updateProductImageAltTextMutation = useUpdateProductImageAltText(variantId);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            alt_text: "",
        },
    });

    const reorderMutation = useReorderProductImages(variantId);

    async function handleMove(index:number, direction: -1 | 1) {
        if (!data) return;

        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= data.items.length) return;

        const imageIds = data.items.map(image => image.product_image_id);

        [imageIds[index], imageIds[targetIndex]] = [imageIds[targetIndex], imageIds[index]];

        await reorderMutation.mutateAsync(imageIds);
    }

    async function handleEditAltText(productImageId: string, altText: string) {
        setCurrentImageId(productImageId);
        setIsEditDialogOpen(true);
        
        setValue("alt_text", altText);
        
    }
    
    async function handleFormSubmit(values: { alt_text: string }) {
        if (!currentImageId) return;

        await updateProductImageAltTextMutation.mutateAsync({
            productImageId: currentImageId,
            altText: values.alt_text,
        });
        setIsEditDialogOpen(false);
    }

    return(
        <div className="flex flex-col gap-4">
            {isLoading && <p className="text-muted-foreground">Loading images...</p>}
            {isError && <p className="text-muted-foreground">Error loading images.</p>}

            {data && data.items.length === 0 && <p className="text-muted-foreground">No images found for this variant.</p>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data && data.items.map((image, index) => (
                    <figure key={image.product_image_id} className="rounded-lg border p-3 bg-card overflow-hidden sm:w-75 flex flex-col items-center">
                        <div className="aspect-square bg-muted/40 p-3 flex h-44 items-center justify-center rounded-md">
                            <img
                                src={image.image_url}
                                alt={image.alt_text}
                                loading="lazy"
                                className="h-full w-full rounded-md object-contain"
                            />
                        </div>
                        <figcaption className="mt-2 space-y-1 p-3">
                            <p className="text-sm font-medium">Position {index + 1}</p>
                            <p className="text-muted-foreground line-clamp-2 text-sm max-w-40">
                                {image.alt_text}
                            </p>
                            <Button type="button" variant="ghost" onClick={() => handleEditAltText(image.product_image_id, image.alt_text)} className="mt-2">
                                Edit Alt Text
                            </Button>
                            <div className="mt-2 flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleMove(index, -1)}
                                    disabled={index === 0 || reorderMutation.isPending}
                                    className="p-3"
                                >
                                    {"<"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleMove(index, 1)}
                                    disabled={index === data.items.length - 1 || reorderMutation.isPending}
                                    className="p-3"
                                >
                                    {">"}
                                </Button>
                            </div>
                        </figcaption>
                    </figure>
                ))}
            </div>
            
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Alt Text</DialogTitle>
                        <DialogDescription>
                            Update the alt text for the selected image.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="alt-text-input">Alt Text</FieldLabel>
                                <input
                                    type="text"
                                    id="alt-text-input"
                                    className="w-full rounded-md border bg-background px-3 py-2.5 text-sm"
                                    {...register("alt_text")}
                                />
                                <FieldError>
                                    {errors.alt_text?.message}
                                </FieldError>
                            </Field>

                            <LoadingButton
                                isLoading={updateProductImageAltTextMutation.isPending}
                                loadingText="Updating..."
                                type="submit"
                                className="w-full h-11 mt-2"
                            >
                                Update Alt Text
                            </LoadingButton>
                    </FieldGroup>


                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}


