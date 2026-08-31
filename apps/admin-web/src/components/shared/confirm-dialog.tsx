
import type { ReactElement } from "react";


import { LoadingButton } from "./loading-button";
import { AlertDialog, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, AlertDialogFooter, 
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";




type ConfirmDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger: ReactElement;
    title: string;
    description: string;
    confirmLablel?: string;
    pendingLabel?: string;
    cancelLabel?: string;
    isPending?: boolean;
    destructive?: boolean;
    onConfirm: () => void;
}

export function ConfirmDialog({
    open, onOpenChange, trigger, title, description, confirmLablel = "Confirm", pendingLabel="Processing...",
    cancelLabel ="Cancel", isPending= false, onConfirm, destructive,
}: ConfirmDialogProps) {

    function handleOpenChange(nextOpen: boolean) {
        if (!isPending) {
            onOpenChange(nextOpen)
        }
    }

    return(
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger render={trigger} />

            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>{cancelLabel}</AlertDialogCancel>

                    <LoadingButton
                        type="button"
                        variant={destructive ? "destructive" : "default"}
                        isLoading={isPending}
                        loadingText={pendingLabel}
                        onClick={onConfirm}
                    >
                        {confirmLablel}
                    </LoadingButton>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}



