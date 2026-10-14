import { ProductCard } from "./product-card";

import { useProducts } from "../hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";


type RelatedProductsSectionProps = {
    categoryId: string;
    currentProductId: string;
};


const RELATED_PRODUCTS_LIMIT = 4;

export function RelatedProductsSection({ categoryId, currentProductId }: RelatedProductsSectionProps) {
    
    const productsQuery = useProducts({
        category_id: categoryId,
        page: 1,
        page_size: RELATED_PRODUCTS_LIMIT + 1,
        sort: "name_asc",
    });

    const relatedProducts = (productsQuery.data?.items ?? [])
        .filter((product) => 
            product.product_id !== currentProductId &&
            product.category_id === categoryId
        )
        .slice(0, RELATED_PRODUCTS_LIMIT);
    
    if (productsQuery.data && relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="space-y-6 border-t border-border pt-8">
            <h2 className="text-2xl font-semibold tracking-tight">
                Related Products
            </h2>

            {productsQuery.isPending ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {Array.from({ length: RELATED_PRODUCTS_LIMIT }).map((_, index) => (
                        <div key={index} className="space-y-3">
                            <Skeleton className="aspect-square w-full rounded-xl" />
                            <Skeleton className="h-5 w-3/4 " />
                            <Skeleton className="h-4 w-24" />

                        </div>
                    ))}
                </div>
                
            )
            : productsQuery.isError && !productsQuery.data ? (
                <div className="flex flex-col items-center justify-center space-y-4">
                    <p className="text-center text-sm text-muted-foreground">
                        Unable to load related products. Please try again later.
                    </p>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => productsQuery.refetch()}
                    >
                        Retry
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                    {relatedProducts.map((product) => (
                        <ProductCard key={product.product_id} product={product} />
                    ))}
                </div>
            )}
        </section>
    )
}