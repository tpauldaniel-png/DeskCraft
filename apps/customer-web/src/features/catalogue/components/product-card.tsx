import type { Product } from "../types/product";
import {currencyFormatter} from "@/utils/format-currency";



type ProductCardProps = {
    product: Product;
};


export function ProductCard({ product }: ProductCardProps) {
    return (
        <article>
            <div className="group bg-card shadow-sm border border-border flex flex-col h-full overflow-hidden
                rounded-2xl transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1
                hover:border-primary/30 hover:shadow-md">
                <div className="relative aspect-square overflow-hidden bg-secondary/40">
                    {product.image_url ? (
                        <img 
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-contain transition-transform duration-500"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                            No image available
                        </div>
                    )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category_name}</p>
                    <h3 className="text-base font-semibold leading-6 text-foreground mb-4 ">{product.name}</h3>
                    <p className="mt-auto text-base font-semibold text-primary">
                        {product.starting_price ? `From ₹ ${currencyFormatter.format(parseFloat(product.starting_price))}` : "Price not available"}
                    </p>
                </div>
            </div>
        </article>
    );
}

