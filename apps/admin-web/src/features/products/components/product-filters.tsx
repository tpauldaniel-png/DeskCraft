
import { Input } from "@/components/ui/input";

import type { Category } from "../../categories/types/category";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup,DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuTrigger, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";



type ProductFiltersProps = {
    searchText: string;
    onSearchTextChange: (value: string) => void;

    categoryId: string | undefined;
    onCategoryChange: (value: string | undefined) => void;

    isActive: boolean | undefined;
    onIsActiveChange: (value: boolean | undefined) => void;

    categories: Category[];
    onClear: () => void;
}


export function ProductFilters({searchText, onSearchTextChange, categoryId, onCategoryChange, isActive, onIsActiveChange, categories, onClear}: ProductFiltersProps) {
    const selectedCategory = categories.find(category => category.category_id === categoryId);

    const categoryLabel = selectedCategory ? selectedCategory.name : "All Categories";

    const statusLabel = isActive === undefined ? "All Statuses" : isActive ? "Active" : "Inactive";

    const hasActiveFilters = searchText.trim().length > 0 || categoryId !== undefined || isActive !== undefined;

    function handleStatusChange(value: string) {
        if (value === "all") {
            onIsActiveChange(undefined);
            return;
        }

        onIsActiveChange(value === "active");
    }


    function handleCategoryChange(value: string) {
        if (value === "all") {
            onCategoryChange(undefined);
        } else {
            onCategoryChange(value);
        }
    }

    return(
        <div className="flex flex-col gap-4 rounded-lg border bg-card md:flex-row md:items-center md:justify-between min-h-14 px-4 py-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center flex-1">
                <label htmlFor="product-search">Search Products</label>

                <Input
                    id="product-search"
                    type="search"
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(e) => onSearchTextChange(e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center sm:flex-wrap">

                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={<Button 
                            type="button"
                            variant="outline"
                            className="w-full justify-between md:w-auto"
                        />}
                    >
                        <span className="truncate">{categoryLabel}</span>
                        <ChevronDown className="size-4 opacity-30"/>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={categoryId ?? "all"}
                                onValueChange={handleCategoryChange}
                            >
                                <DropdownMenuRadioItem value="all">
                                    All Categories
                                </DropdownMenuRadioItem>

                                {categories.map(category => (
                                    <DropdownMenuRadioItem key={category.category_id} value={category.category_id}>
                                        {category.name}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                    
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={<Button 
                            type="button"
                            variant="outline"
                            className="w-full justify-between md:w-auto"
                        />}
                    >
                        <span className="truncate">{statusLabel}</span>
                        <ChevronDown className="size-4 opacity-30"/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={isActive === undefined ? "all" : isActive ? "active" : "inactive"}
                                onValueChange={handleStatusChange}
                            >
                                <DropdownMenuRadioItem value="all">
                                    All Statuses
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="active">
                                    Active
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="inactive">
                                    Inactive
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <Button variant="outline" className="w-full md:w-auto" onClick={onClear} disabled={!hasActiveFilters}>
                    Clear Filters
                </Button>
            </div>
        </div>
    );
}
        


