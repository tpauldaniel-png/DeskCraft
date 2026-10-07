
import { ProductGrid } from "@/features/catalogue/components/product-grid";
import { useProducts } from "@/features/catalogue/hooks/use-products";
import { Button } from "@/components/ui/button";






export function ProductsPage() {
    const productsQuery = useProducts({page: 1, page_size: 20});


    return (
        <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                        The DeskCraft Collection
                    </p>
                    <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        All Products
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                        Find thoughtful essentials for healthier and more comfortable workspace.
                    </p>
                </div>

                {productsQuery.isSuccess && productsQuery.data.items.length > 0 && (
                    <p className="shrink-0text-sm text-muted-foreground">
                        {productsQuery.data.total} products found
                    </p>
                )}
            </header>
                
                {productsQuery.isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground text-sm">Loading products...</p>
                    </div>
                )}

                {productsQuery.isError && (
                    <div
                        role="alert"
                        className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                        <p className="text-destructive text-sm">
                            Could not load Products.
                        </p>

                        <Button type="button" variant="outline" onClick={() => productsQuery.refetch()} disabled={productsQuery.isFetching} className="mt-2">
                            Try again
                        </Button>
                    </div>
                )}

                {productsQuery.isSuccess && (
                    productsQuery.data.items.length > 0 ? (
                        <ProductGrid products={productsQuery.data.items} />
                    ) : (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-muted-foreground text-sm">No products found.</p>
                        </div>
                    )
                )}
                
            
        </div>
    );
}