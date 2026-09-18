import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Category } from "../types/category";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";


type CategaoryTableProps = {
    categories: Category[];
    onEdit: (category: Category) => void;
    onToggleStatus: (category: Category) => void;
    updatingCategoryId?: string | null;

}








export function CategoryTable({categories, onEdit, onToggleStatus, updatingCategoryId}: CategaoryTableProps) {

    function formatDate(date: string) {
        return new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(date))
    }

    return(
        <div>
            <Table className="overflow-x-auto rounded-lg border">
                <TableCaption>A list of DeskCraft categories</TableCaption>
                <TableHeader>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updated Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableHeader>

                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                No Categories have been created yet.
                            </TableCell>
                        </TableRow>
                    ): (
                        categories.map((category) => {
                            const isUpdating = updatingCategoryId === category.category_id;

                            return(
                                <TableRow key={category.category_id}>
                                    <TableCell className="font-medium">
                                        {category.name}
                                    </TableCell>

                                    <TableCell className="max-w-sm whitespace-normal text-muted-foreground">
                                        {category.description || "No description"}
                                    </TableCell>

                                    <TableCell>
                                        <StatusBadge status={category.is_active ? "success" : "danger"}>
                                            {category.is_active ? "Active": "Inactive"}
                                        </StatusBadge>
                                    </TableCell>

                                    <TableCell>
                                        {formatDate(category.updated_at)}
                                    </TableCell>

                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Button onClick={() => onEdit(category)} type="button" variant="outline" size="sm">
                                                Edit
                                            </Button>

                                            <Button onClick={() => onToggleStatus(category)} type="button" variant="ghost" size="sm" disabled={isUpdating}>
                                                {
                                                    isUpdating ? "Updating..." : category.is_active ? "Deactivate" : "Activate"
                                                }
                                            </Button>
                                        </div>
                                    </TableCell>


                                </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </div>
    )


}
