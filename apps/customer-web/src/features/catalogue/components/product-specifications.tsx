import { Table, TableBody, TableCell, TableHead,TableRow } from "@/components/ui/table";
import type { ProductDetail } from "@/features/catalogue/types/product";


type ProductSpecificationsProps = {
    specifications: ProductDetail["specifications"];
};

export function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
    if (!specifications) {
        return null;
    }

    const rows = [
        {
            label : "Material",
            value: specifications.material?.trim() || null,
        },
        {
            label: "Adjustment",
            value: specifications.adjustment_feature?.trim() || null,
        },
        {
            label: "Maximum load",
            value: typeof specifications.max_load_kg === "number" ? `${specifications.max_load_kg} kg` : null,
        },
        {
            label: "Assembly required",
            value: typeof specifications.assembly_required === "boolean" ? (specifications.assembly_required ? "Yes" : "No") : null,
        }
    ].filter((row) => row.value !== null);

    if (rows.length === 0) {
        return null;
    }

    return (
        <section className="space-y-5 border-t border-border pt-8">
            <h2 className="text-2xl font-semibold tracking-tight">
                Specifications
            </h2>

            <div className="max-w-3xl">
                <Table>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.label}>
                                <TableHead className="w-40 py-4 align-top font-medium whitespace-normal text-muted-foreground sm:w-52">
                                    {row.label}
                                </TableHead>

                                <TableCell className="py-4 align-top whitespace-normal">
                                    {row.value}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </section>
    )
}