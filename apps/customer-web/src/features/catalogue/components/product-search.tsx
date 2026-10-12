import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState, type FormEvent } from "react";


type ProductSearchProps = {
    searchText: string;
    onSearch: (query: string) => void;
};


export function ProductSearch({ searchText, onSearch }: ProductSearchProps) {

    const [draftSearchText, setDraftSearchText] = useState(searchText);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const query = draftSearchText.trim();
        setDraftSearchText(query);
        onSearch(query);

    }

    function handleClear() {
        setDraftSearchText("");
        onSearch("");
    }

    return (
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3 rounded-lg  bg-background p-4 sm:flex-row sm:items-center relative">
            <label htmlFor="product-search" className="sr-only">
                Search Products
            </label>

            

            <Input
                id="product-search"
                type="search"
                name="search"
                maxLength={200}

                value={draftSearchText}
                onChange={(e) => setDraftSearchText(e.target.value)}
                placeholder="Search products..."
                className="flex-1 h-10 min-w-0 rounded-full border border-border bg-card px-4 text-sm text-foreground placeholder:text-primary"
            />
            <div className="flex shrink-0 gap-2">
                <Button type="submit">Search</Button>
                <Button type="button" onClick={handleClear} variant="outline">
                    Clear
                </Button>
            </div>
        </form>
    );
}