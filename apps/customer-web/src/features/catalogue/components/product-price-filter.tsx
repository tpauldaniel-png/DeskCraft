import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


type ProductFilterProps = {
    minPrice: number | undefined;
    maxPrice: number | undefined;
    onApply: (minPrice: number | undefined, maxPrice: number | undefined) => void;
    onReset: () => void;
};

export function ProductPriceFilter({ minPrice, maxPrice, onApply, onReset }: ProductFilterProps) {

    const [minPriceInput, setMinPriceInput] = useState<string>(minPrice?.toString() ?? "");
    const [maxPriceInput, setMaxPriceInput] = useState<string>(maxPrice?.toString() ?? "");

    const [error, setError] = useState<string | null>(null);

    function handleSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault();

        const minText = minPriceInput.trim()
        const maxText = maxPriceInput.trim()

        const nextMinPrice = minText === "" ? undefined : Number(minText);
        const nextMaxPrice = maxText === "" ? undefined : Number(maxText);

        if ((nextMinPrice !== undefined && (!Number.isFinite(nextMinPrice) || nextMinPrice < 0)) || (nextMaxPrice !== undefined && (!Number.isFinite(nextMaxPrice) || nextMaxPrice < 0))) {
            setError("Please enter valid numbers for min and max price");
            return;
        }


        if (nextMinPrice !== undefined && nextMaxPrice !== undefined && nextMinPrice > nextMaxPrice) {
            setError("Minimum price cannot be greater than maximum price");
            return;
        }

        setError(null);
        onApply(nextMinPrice, nextMaxPrice);
    }

    function handleReset() {
        setMinPriceInput("");
        setMaxPriceInput("");
        setError(null);
        onReset();
    }

    return (
        <form onSubmit={handleSubmit} className="w-full lg:w-auto space-y-2">
            <div className="grid gap-3 grid-cols-2 item sm:flex sm:flex-wrap">
                <div className="min-w-0 space-y-1.5 sm:w-70 sm:flex-none">

                    <label htmlFor="min_price" className="text-sm  font-medium text-muted-foreground pl-2">
                        Min Price (₹)
                    </label>

                    <Input
                        type="number"
                        id="min_price"
                        placeholder="No Minimum"
                        value={minPriceInput}
                        onChange={(e) => {
                            setMinPriceInput(e.target.value)
                            setError(null);
                        }}
                        className="h-10 rounded-lg border-border bg-background px-3 text-sm shadow-none mt-2 w-full"
                    />
                </div>

                <div className="min-w-0 space-y-1.5 sm:w-70 sm:flex-none">
                    <label htmlFor="max_price" className="text-sm font-medium text-muted-foreground pl-2">
                        Max Price (₹)
                    </label>
                    <Input
                        type="number"
                        id="max_price"
                        placeholder="No Maximum"
                        value={maxPriceInput}
                        onChange={(e) => {
                            setMaxPriceInput(e.target.value)
                            setError(null);
                        }}
                        className="h-10 rounded-lg border-border bg-background px-3 text-sm shadow-none mt-2 w-full"
                    />
                </div>

                <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button type="submit">
                        Apply
                    </Button>
                </div>
            </div>

            {error && (
                <p className="text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}
        </form>
    )
}