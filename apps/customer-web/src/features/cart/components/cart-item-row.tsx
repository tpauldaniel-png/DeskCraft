import { useState } from "react";

import { Button } from "@/components/ui/button";

import type { CartItemResponse } from "../types/cart";
import { formatCartMoney } from "../utils/cart-utils";
import { CartQuantityControl } from "./cart-quantity-control";


type CartItemRowProps = {
  item: CartItemResponse;
  disabled: boolean;
  isRemoving: boolean;
    onQuantityChange: (itemId: string, quantity: number) => void;
    onRemove: (itemId: string) => void;
};


export function CartItemRow({
  item,
  disabled,
    isRemoving,
    onQuantityChange,
    onRemove,
}: CartItemRowProps) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const showImage = Boolean(
    item.image_url && item.image_url !== failedImageUrl,
  );

    return (
        <article className="flex gap-4 p-4 sm:gap-6 sm:p-6">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted sm:size-32">
                {showImage ? (
                    <img
                        src={item.image_url ?? undefined}
                        alt={item.product_name}
                        width={128}
                        height={128}
                        loading="lazy"
                        decoding="async"
                        onError={() => setFailedImageUrl(item.image_url)}
                        className="h-full w-full object-contain p-2"
                    />
                ) : (
                    <span className="px-2 text-center text-xs text-muted-foreground">
                        No image available
                    </span>
                )}
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4">
                    <h2 className="wrap-break-word text-base font-medium sm:text-lg">
                        {item.product_name}
                    </h2>
                    <p className="shrink-0 font-semibold tabular-nums">
                        {formatCartMoney(item.line_total)}
                    </p>


                </div>

                <p className="mt-1 break-all text-xs text-muted-foreground">
                    SKU: {item.sku}
                </p>

                <p className="mt-2 text-sm text-muted-foreground">
                    {formatCartMoney(item.current_unit_price)} each
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-4">
                    <CartQuantityControl
                        quantity={item.quantity}
                        productName={item.product_name}
                        disabled={disabled || isRemoving}
                        onChange={(newQuantity) =>
                            onQuantityChange(item.cart_item_id, newQuantity)
                        }
                    />

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={disabled || isRemoving}
                        onClick={() => onRemove(item.cart_item_id)}
                    >
                        Remove
                    </Button>
                </div>
            </div>
        </article>
    );
}