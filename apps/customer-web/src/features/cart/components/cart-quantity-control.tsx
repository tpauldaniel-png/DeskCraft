import { Button } from "@/components/ui/button";

type CartQuantityControlProps = {
  quantity: number;
  productName: string;
  disabled: boolean;
  onChange: (quantity: number) => void;
};


export function CartQuantityControl({
  quantity,
  productName,
    disabled,
    onChange,
}: CartQuantityControlProps) {
    return (
        <div
            role="group"
            aria-label={`Quantity for ${productName}`}
            className="inline-flex items-center rounded-lg border bg-background p-1"
        >
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                aria-label={`Decrease quantity of ${productName}`}
                disabled={disabled || quantity <= 1}
                onClick={() => onChange(quantity - 1)}
            >
                <span aria-hidden="true" className="text-lg">−</span>
            </Button>

            <span className="min-w-10 px-2 text-center text-sm font-medium tabular-nums">
                {quantity}
            </span>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-9"
                aria-label={`Increase quantity of ${productName}`}
                disabled={disabled}
                onClick={() => onChange(quantity + 1)}
            >
                <span aria-hidden="true" className="text-lg">+</span>
            </Button>
        </div>
    );
}