import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";

import { useDeleteAddress } from "../hooks/use-address";
import type { AddressResponse } from "../types/address";

type DeleteAddressDialogProps = {
    userId: string;
    address: AddressResponse;
    onClose: () => void;
};

export function DeleteAddressDialog({
    userId,
    address,
    onClose,
}: DeleteAddressDialogProps) {
    const deleteAddress = useDeleteAddress(userId);
    const isDeleting = deleteAddress.isPending;
    const hasError = deleteAddress.isError;

    async function handleDelete() {
        try {
            await deleteAddress.mutateAsync(address.address_id);
            onClose();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <AlertDialog open onOpenChange={(open) => {
            if (!open && !isDeleting) onClose();
        }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Address</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this address? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {hasError && (
                    <p className="mb-4 text-sm text-destructive" role="alert">
                        An error occurred while deleting the address.
                    </p>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => void handleDelete()}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

