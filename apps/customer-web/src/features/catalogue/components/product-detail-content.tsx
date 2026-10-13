import type { ProductDetail } from "@/features/catalogue/types/product";
import { ProductGallery } from "@/features/catalogue/components/product-gallery";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/utils/format-currency";
import { useState } from "react";


type ProductDetailContentProps = {
    product: ProductDetail;
};


export function ProductDetailContent({ product }: ProductDetailContentProps) {

    const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.variant_id ?? null);

    const selectedVariant = product.variants.find((variant) => variant.variant_id === selectedVariantId) || product.variants[0];

    console.log("Selected Variant:", selectedVariant);
    console.log("variant images:", selectedVariant?.images);
    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-12">
            <div className="min-w-0">
                <ProductGallery
                    key={selectedVariant?.variant_id ?? "no-variant"}
                    images={selectedVariant?.images ?? []}
                    productName={product.name}
                />
            </div>

            <section className="space-y-6 lg:py-2">
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground font-medium">
                        {product.category_name}
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        {product.name}
                    </h1>
                    <p className="text-2xl font-semibold text-primary">
                        {selectedVariant ? currencyFormatter.format(parseFloat(selectedVariant.price)) : "Price not available"}
                    </p>
                </div>

                {product.description && (
                    <p className="leading-relaxed max-w-2xl text-muted-foreground">
                        {product.description}
                    </p>
                )}

                {selectedVariant ? (
                    <fieldset className="space-y-4">
                        <legend className="text-sm font-medium text-foreground">
                            Choose a  variant
                        </legend>

                        <div className="flex flex-wrap gap-2">
                            {product.variants.map((variant) => {
                                const isSelected = variant.variant_id === selectedVariantId;

                                return (
                                    <Button
                                        key={variant.variant_id}
                                        type="button"
                                        variant={isSelected ? "default" : "outline"}
                                        onClick={() => setSelectedVariantId(variant.variant_id)}
                                        className="h-auto rounded-full px-3 py-2 whitespace-normal"
                                    >
                                        {variant.name}
                                    </Button>
                                );
                            })} 
                        </div>
                    </fieldset>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No variants available for this product.
                    </p>
                )}
            </section>
        </div>
    )
}