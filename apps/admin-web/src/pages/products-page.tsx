import { ProductFilters } from "@/features/products/components/product-filters";

import { useProducts } from "@/features/products/hooks/use-products";
import { useUpdateProduct } from "@/features/products/hooks/use-products";


import { useState } from "react";

import { useCategories } from "@/features/categories/hooks/use-categories";

import { Button } from "@/components/ui/button";
import { ProductTable } from "@/features/products/components/product-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateProductTab } from "@/features/products/components/create-product-tab";
import type { Product } from "@/features/products/types/product";
import { EditProductTab } from "@/features/products/components/edit-product-tab";




const PAGE_SIZE = 10;

export function ProductsPage() {
    const [searchText, setSearchText] = useState("");
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
    const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

    const [activeTab, setActiveTab] = useState("product-list");

    const [page, setPage] = useState(1);    

    const categoriesQuery = useCategories(page, PAGE_SIZE);
    const categories = categoriesQuery.data?.items ?? [];
    const total = categoriesQuery.data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const updateProductMutation = useUpdateProduct();

    const updatingProductId = updateProductMutation.isPending
        ? (updateProductMutation.variables?.productId ?? null)
        : null;

    



    const productsQuery = useProducts({
        search: searchText,
        category_id: categoryId,
        is_active: isActive,
        page: page,
        page_size: PAGE_SIZE,
    });

    const products = productsQuery.data?.items ?? [];

    

    function handleSearchTextChange(value: string) {
        setSearchText(value);
        setPage(1);
    }

    function handleCategoryChange(value: string | undefined) {
        setCategoryId(value);
        setPage(1);
    }

    function handleIsActiveChange(value: boolean | undefined) {
        setIsActive(value);
        setPage(1);
    }

    function handleClearFilters() {
        setSearchText("");
        setCategoryId(undefined);
        setIsActive(undefined);
        setPage(1);
    }

    function handleEdit(product: Product) {
        setSelectedProduct(product);
        setActiveTab("edit-product");
    }


    function handleToggleStatus(product: Product) {
        updateProductMutation.mutate({
            productId: product.product_id,
            productData: {
                is_active: !product.is_active,
            },
        });
    }


    return(
        <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Products</h1>
                    <p className="text-muted-foreground text-sm">
                        Create and manage DeskCraft Products
                    </p>
                </div>

                
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 w-full bg-card rounded-lg border p-4">
                <TabsList className="w-full justify-start bg-accent/10 dark:bg-accent/20 rounded-lg border-none p-1">
                    <TabsTrigger value="product-list" className="h-9 px-3">
                        Product List
                    </TabsTrigger>
                    <TabsTrigger value="create-product" className="h-9 px-3">
                        Create Product
                    </TabsTrigger>

                    {selectedProduct && (
                        <TabsTrigger value="edit-product" className="h-9 px-3">
                            Edit Product
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="product-list" className="space-y-4">
                    <ProductFilters
                        searchText={searchText}
                        onSearchTextChange={handleSearchTextChange}
                        categoryId={categoryId}
                        onCategoryChange={handleCategoryChange}
                        isActive={isActive}
                        onIsActiveChange={handleIsActiveChange}
                        categories={categories}
                        onClear={handleClearFilters}
                    />

                    {productsQuery.isLoading && (
                        <div className="flex items-center justify-center py-8">
                            <p className="text-muted-foreground text-sm">Loading products...</p>
                        </div>
                    )}

                    {productsQuery.isError && (
                        <div
                            role="alert"
                            className="rounded-b-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                        >
                            <p className="text-destructive text-sm">
                                Could not load Products.
                            </p>

                            <Button type="button" variant="outline" onClick={() => productsQuery.refetch()}>
                                Try again
                            </Button>
                        </div>
                    )}

                    {productsQuery.isSuccess && (
                        <>
                            <ProductTable
                                products={products}
                                categories={categories}
                                onEdit={handleEdit}
                                onToggleStatus={handleToggleStatus}
                                updatingProductId={updatingProductId}
                            />


                            <div className="flex items-center justify-between">
                                <p className="text-muted-foreground text-sm">
                                    Page {page} of {totalPages}
                                </p>
                        
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={page === 1}
                                        onClick={() => setPage((currentPage) => currentPage -1)}
                                    >
                                        Previous
                                    </Button>

                                    

                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={page >= totalPages}
                                        onClick={() => setPage((currentPage) => currentPage + 1)}
                                    
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}

                </TabsContent>

                <TabsContent value="create-product" className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                        Create a new product for DeskCraft.
                    </p>

                    <CreateProductTab
                        categories={categories}
                        onCreated={() => setActiveTab("product-list")}
                    />
                </TabsContent>

                <TabsContent value="edit-product" className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                        Edit the selected product.
                    </p>

                    {selectedProduct && (
                        <EditProductTab
                            key={selectedProduct.product_id}
                            product={selectedProduct}
                            categories={categories}
                            onUpdated={() => {
                                setSelectedProduct(null);
                                setActiveTab("product-list");
                            }}
                        />
                    )}
                </TabsContent>
            </Tabs>
        </section>
    )
}
            