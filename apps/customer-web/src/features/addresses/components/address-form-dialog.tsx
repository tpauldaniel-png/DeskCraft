import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";

import { useCreateAddress, useUpdateAddress } from "../hooks/use-address";
import type { AddressResponse, CreateAddressParams } from "../types/address";
import { AddressForm } from "./address-form";

type AddressFormDialogProps = {
    userId: string;
    address: AddressResponse | undefined;
    onClose: () => void;
};

export function AddressFormDialog({
    userId,
    address,
    onClose,
}: AddressFormDialogProps) {
    const createAddress = useCreateAddress(userId);
    const updateAddress = useUpdateAddress(userId);
    const isSaving = createAddress.isPending || updateAddress.isPending;
    const hasError = createAddress.isError || updateAddress.isError;

    async function handleSave(values: Required<CreateAddressParams>) {
        try {
            if (address) {
                const changes: Partial<CreateAddressParams> = Object.fromEntries(
                    Object.entries(values).filter(
                        ([name, value]) => value !== address[name as keyof CreateAddressParams],
                    ),
                );
                if (Object.keys(changes).length > 0) {
                    await updateAddress.mutateAsync({ address_id: address.address_id, ...changes });
                }
            } else {
                await createAddress.mutateAsync(values);
            }
            onClose();
        } catch (error) {
            console.error(error);
        } 
    }

    return (
        <Dialog open onOpenChange={(open) => {
            if (!open && !isSaving) onClose();
        }}>
            <DialogContent
                className="max-h-[90dvh] overflow-y-auto sm:max-w-xl"
            >
                <DialogHeader>
                    <DialogTitle>{address ? "Edit Address" : "Add Address"}</DialogTitle>
                    <DialogDescription>Enter the address details below.</DialogDescription>
                </DialogHeader>

                {hasError && (
                    <p className="mb-4 text-sm text-destructive" role="alert">
                        An error occurred while saving the address.
                    </p>
                )}
                <AddressForm
                    address={address}
                    onSave={handleSave}
                    onCancel={onClose}
                    isSaving={isSaving}
                />
            </DialogContent>
        </Dialog>
    )

}

