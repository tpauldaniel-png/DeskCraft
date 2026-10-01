import  { VariantImageUploadForm } from "./variant-image-upload-form";
import { useCreateProductImage } from "../hooks/use-product-images";
import { ProductVariantImageGallery } from "./variant-image-gallery";

import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";




type VariantImageManagerProps = {
    variantId: string;
};

export function VariantImageManager({ variantId }: VariantImageManagerProps) {
    const [uploadOpen, setUploadOpen] = useState(false);
    const createImage = useCreateProductImage(variantId);

    async function handleUpload(formData: FormData) {
        await createImage.mutateAsync(formData);
        setUploadOpen(false);
    }



    return(
        <section className="mt-8 rounded-xl border bg-card p-5 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold">
                        Variant Images
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Upload images and review their display order and alt text.
                    </p>
                </div>

                <Button type="button" onClick={() => setUploadOpen(true)}>
                    Add image
                </Button>
            </div>

            <ProductVariantImageGallery variantId={variantId} />

            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Upload Variant Image</DialogTitle>
                        <DialogDescription>
                            <p>Choose an image and describe it with alt text.</p>
                            <p>JPEG, PNG, GIF, WebP. Max size: 5MB.</p>
                        </DialogDescription>
                    </DialogHeader>

                    <VariantImageUploadForm
                        onSubmit={handleUpload}
                        isPending={createImage.isPending}
                    />
                </DialogContent>
            </Dialog>
        </section>
    );
}
