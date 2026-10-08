
import { ProductGrid } from "@/features/catalogue/components/product-grid";
import { useProducts } from "@/features/catalogue/hooks/use-products";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { usePublicCategories } from "@/features/catalogue/hooks/use-categories";
import { CategoryNavigation } from "@/features/catalogue/components/category-navigation";
import type { ProductSort } from "@/features/catalogue/types/product";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup,DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuTrigger, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ProductPagination } from "@/features/catalogue/components/product-pagination";





const PAGE_SIZE = 10;

export function ProductsPage() {
    
    const [searchParams, setSearchParams] = useSearchParams();

    const activeCategoryId = searchParams.get("category_id") || undefined;

    const pageValue = Number(searchParams.get("page") ?? "1");
    const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;

    const sortValue = searchParams.get("sort");

    const sort: ProductSort = 
        sortValue === "name_asc" || 
        sortValue === "name_desc" || 
        sortValue === "price_asc" || 
        sortValue === "price_desc" 
            ? sortValue 
            : "name_asc";

    const publicCategoriesQuery = usePublicCategories();

    const productsQuery = useProducts({page, page_size: PAGE_SIZE, category_id: activeCategoryId, sort});

    const selectedCategory = publicCategoriesQuery.data?.find(category => category.category_id === activeCategoryId);

    function handleSortChange(newSort: ProductSort) {
        setSearchParams((prevParams) => {
            const updatedParams = new URLSearchParams(prevParams);
            updatedParams.set("sort", newSort);
            updatedParams.set("page", "1");
            return updatedParams;
        });
    }

    function handlePageChange(newPage: number) {
        setSearchParams((prevParams) => {
            const updatedParams = new URLSearchParams(prevParams);

            updatedParams.set("page", newPage.toString());
            return updatedParams;
        });
    }


    return (
        <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
                        The DeskCraft Collection
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {activeCategoryId ? selectedCategory?.name : "All Products"}
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
                
                {publicCategoriesQuery.isLoading && (
                    <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground text-sm">Loading categories...</p>
                    </div>
                )}

                {publicCategoriesQuery.isError && (
                    <div
                        role="alert"
                        className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                        <p className="text-destructive text-sm">
                            Could not load Categories.
                        </p>

                        <Button type="button" variant="outline" onClick={() => publicCategoriesQuery.refetch()} disabled={publicCategoriesQuery.isFetching} className="mt-2">
                            Try again
                        </Button>
                    </div>
                )}
                
                {publicCategoriesQuery.isSuccess && (
                    <CategoryNavigation categories={publicCategoriesQuery.data} activeCategoryId={activeCategoryId} />
                )}

                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                        render={<Button 
                            type="button"
                            variant="outline"
                            className="w-full justify-between md:w-auto"
                        />}
                    >
                        <span className="truncate">Sort Products</span>
                        <ChevronDown className="size-4 opacity-30"/>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Sort Products</DropdownMenuLabel>
                            <DropdownMenuRadioGroup value={sort} onValueChange={(value) => handleSortChange(value as ProductSort)}>
                                <DropdownMenuRadioItem value="name_asc">Name (A-Z)</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="name_desc">Name (Z-A)</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="price_asc">Price (Low to High)</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="price_desc">Price (High to Low)</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>



                
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

                {productsQuery.isSuccess && (
                    <ProductPagination
                        page={page}
                        pageSize={PAGE_SIZE}
                        total={productsQuery.data.total}
                        itemCount={productsQuery.data.items.length}
                        isfetching={productsQuery.isFetching}
                        onPageChange={handlePageChange}
                    />
                )}


                
            
        </div>
    );
}