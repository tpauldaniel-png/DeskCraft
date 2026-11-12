import { Button } from "@/components/ui/button.tsx";
import type { AddressResponse } from "../types/address.ts";

type AddressCardProps = {
    address: AddressResponse;
    onEdit: () => void;
    onDelete: () => void;
};


export function AddressCard({ address, onEdit, onDelete }: AddressCardProps) {
    return (
        <article className="flex h-full flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground">
            <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold wrap-break-word">{address.recipient_name}</h2>
                {address.is_default && (
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        Default
                    </span>
                )}
            </div>

            <div className="flex-1 space-y-1 wrap-break-word text-sm text-muted-foreground">
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>{address.city}, {address.state} {address.postal_code}</p>
                <p>{address.country}</p>
                <p>{address.phone_number}</p>
            </div>
            <div className="flex gap-2">
                <Button onClick={onEdit} type="button" variant="outline">Edit</Button>
                <Button variant="ghost" onClick={onDelete} type="button" className="text-destructive">Delete</Button>
            </div>
        </article>
    );
}

