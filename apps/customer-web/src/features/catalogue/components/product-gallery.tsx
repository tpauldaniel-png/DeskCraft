import type { ProductDetail } from "@/features/catalogue/types/product";
import { useState } from "react";

type ProductGalleryProps = {
    images: ProductDetail["variants"][number]["images"];
    productName: string;
}


export function ProductGallery({ images, productName }: ProductGalleryProps) {

    const defaultImage = images.find((image) => image.sort_order === 1) || images[0];
    const [selectedImageId, setSelectedImageId] = useState(defaultImage?.product_image_id ?? null);

    const selectedImage = images.find((image) => image.product_image_id === selectedImageId) || defaultImage;

    if (!selectedImage) {
        return (
            <div className="flex h-70 sm:h-90 lg:h-105 items-center justify-center rounded-2xl border border-border bg-background p-1.5 transition-colors">
                <p className="text-sm text-muted-foreground">
                    No images available
                </p>
            </div>
        )
    }

    return (
        <div className=" min-w-0 space-y-4">
            <div className="h-70 w-fit overflow-hidden rounded-2xl border border-border bg-muted/40 sm:h-90 lg:h-105">
                <img
                    src={selectedImage.image_url}
                    alt={selectedImage.alt_text ?? productName}
                    className=" static block h-full w-full object-contain transition-transform duration-500 "
                />
            </div>

            <div className="flex gap-2 overflow-x-auto p-1">
                {images.map((image) => {
                    const isSelected = image.product_image_id === selectedImageId;
                    return (
                        <button
                            key={image.product_image_id}
                            type="button"
                            onClick={() => setSelectedImageId(image.product_image_id)}
                            className={`h-20 w-20 shrink-0 rounded-xl border bg-background p-1.5 transition-colors
                                ${isSelected ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary/50"}`}
                        >
                            <img
                                src={image.image_url}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-contain transition-transform duration-500 static block"
                            />
                        </button>
                    );
                })}

        
            </div>
        </div>
    )
}