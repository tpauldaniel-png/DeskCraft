
import { Button } from "@/components/ui/button";

type ProductPaginationProps = {
    page: number;
    pageSize: number;
    total: number;
    itemCount: number;
    isfetching: boolean;
    onPageChange: (newPage: number) => void;
};

export function ProductPagination({ page, pageSize, total, itemCount, isfetching, onPageChange }: ProductPaginationProps) {
    const totalPages = Math.ceil(total / pageSize);

    if (total === 0) {
        return null;
    }

    if (page > totalPages) {
        return (
            <div className="flex items-center flex-wrap gap-4">
                <p className="text-sm text-muted-foreground">
                    This page has no products.
                </p>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onPageChange(1)}
                    disabled={isfetching}
                >
                    Go to first page
                </Button>
            </div>
        );
    }

    const firstItem = itemCount > 0 ? (page - 1) * pageSize + 1 : 0;
    const lastItem = itemCount > 0 ? Math.min(firstItem + itemCount - 1, total) : 0;

    return (
        <div className="flex flex-col border-t gap-4 border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                Showing {firstItem} to {lastItem} of {total} products
            </p>

            <nav className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onPageChange(page - 1)}
                    disabled={isfetching || page === 1}
                >
                    Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </span>

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => onPageChange(page + 1)}
                    disabled={isfetching || page === totalPages}
                >
                    Next
                </Button>
            </nav>
        </div>
    );
}
