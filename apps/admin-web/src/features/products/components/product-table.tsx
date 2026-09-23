

import type { Category } from "@/features/categories/types/category";
import type { Product } from "../types/product";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";



type ProductTableProps = {
    products: Product[];
    categories: Category[];
    onEdit: (product: Product) => void;
    onToggleStatus: (product: Product) => void;
    updatingProductId?: string | null;
}


export function ProductTable({products, categories, onEdit, onToggleStatus, updatingProductId}: ProductTableProps) {

    function formatDate(date: string) {
        return new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(date))
    }

    return(
        <div>
            <Table className="overflow-x-auto rounded-lg border">
                <TableCaption>A list of DeskCraft products</TableCaption>
                <TableHeader>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableHeader>
                <TableBody>
                    {products.map(product => {
                        const category = categories.find(c => c.category_id === product.category_id);
                        return (
                            <TableRow key={product.product_id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{category?.name || "Unknown"}</TableCell>
                                <TableCell>
                                    <StatusBadge status={product.is_active ? "success" : "danger"}>
                                        {product.is_active ? "Active" : "Inactive"}
                                    </StatusBadge>
                                </TableCell>
                                <TableCell>{formatDate(product.updated_at)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(product)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onToggleStatus(product)}
                                        disabled={updatingProductId === product.product_id}
                                    >
                                        {product.is_active ? "Deactivate" : "Activate"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </  TableBody>
            </Table>
        </div>
    );
}
