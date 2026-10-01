import { useProductImages } from "../hooks/use-product-images";





export function ProductVariantImageGallery({ variantId }: { variantId: string }) {
    const { data, isLoading, isError } = useProductImages(variantId);

    return(
        <div className="flex flex-col gap-4">
            {isLoading && <p className="text-muted-foreground">Loading images...</p>}
            {isError && <p className="text-muted-foreground">Error loading images.</p>}

            {data && data.items.length === 0 && <p className="text-muted-foreground">No images found for this variant.</p>}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data && data.items.map((image, index) => (
                    <figure key={image.product_image_id} className="rounded-lg border p-3 bg-card overflow-hidden">
                        <div className="aspect-square bg-muted/40 p-3">
                            <img
                                src={image.image_url}
                                alt={image.alt_text}
                                loading="lazy"
                                className="h-full w-full rounded-md object-contain"
                            />
                        </div>
                        <figcaption className="mt-2 space-y-1 p-3">
                            <p className="text-sm font-medium">Position {index + 1}</p>
                            <p className="text-muted-foreground line-clamp-2 text-sm">
                                {image.alt_text}
                            </p>
                        </figcaption>
                    </figure>
                ))}
            </div>
        </div>
    );
}