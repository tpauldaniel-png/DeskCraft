import { Button } from "@/components/ui/button";
import { CategoryTable } from "@/features/categories/components/category-table";
import { CreateCategoryDialog } from "@/features/categories/components/create-category-dialog";
import { EditCategoryDialog } from "@/features/categories/components/edit-category-dialog";
import { useCategories, useUpdateCategory } from "@/features/categories/hooks/use-categories";
import type { Category } from "@/features/categories/types/category";
import { useState } from "react";








const PAGE_SIZE = 10;

export function CategoriesPage() {
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);


    const categoriesQuery = useCategories(page, PAGE_SIZE);
    const updateCategoryMutation = useUpdateCategory();

    const categories = categoriesQuery.data?.items ?? [];
    const total = categoriesQuery.data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total/ PAGE_SIZE))

    const updatingCategoryId = updateCategoryMutation.isPending
        ? (updateCategoryMutation.variables?.categoryId ?? null)
        : null;

    function handleEdit(category: Category) {
        setSelectedCategory(category)
        setEditDialogOpen(true)
    }

    function handleEditDialogOpenChange(open: boolean) {
        setEditDialogOpen(open);

        if(!open) {
            setSelectedCategory(null);
        }
    }

    function handleToggeleStatus(category: Category) {
        updateCategoryMutation.mutate({
            categoryId: category.category_id,
            categoryData: {
                is_active: !category.is_active,
            }
        })
    }


    return(
        <section className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Categories</h1>
                    <p className="text-muted-foreground text-sm">
                        Create and manage DeskCraft Categories
                    </p>
                </div>

                <CreateCategoryDialog />
            </div>

            {categoriesQuery.isPending && (
                <p className="text-muted-foreground text-sm">
                    Loading Categories...
                </p>
            )}

            {categoriesQuery.isError && (
                <div
                    role="alert"
                    className="rounded-b-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    <p className="text-destructive text-sm">
                        Could not load Categories.
                    </p>

                    <Button type="button" variant="outline" onClick={() => categoriesQuery.refetch()}>
                        Try again
                    </Button>
                </div>
            )}

            {categoriesQuery.isSuccess && (
                <>
                    <CategoryTable 
                        categories={categories}
                        onEdit={handleEdit}
                        onToggleStatus={handleToggeleStatus}
                        updatingCategoryId={updatingCategoryId}     
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
            <EditCategoryDialog 
                open={editDialogOpen}
                onOpenChange={handleEditDialogOpenChange}
                category={selectedCategory}
            
            />
        </section>
    )
}

