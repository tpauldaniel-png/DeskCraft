
import {  useState } from "react";
import { Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { AddressCard } from "@/features/addresses/components/address-card";
import { AddressFormDialog } from "@/features/addresses/components/address-form-dialog";
import { DeleteAddressDialog } from "@/features/addresses/components/delete-address-dialog";
import { useAddresses } from "@/features/addresses/hooks/use-address";
import type { AddressResponse } from "@/features/addresses/types/address";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

type ActiveDialog =
  | { kind: "add" }
  | { kind: "edit" | "delete"; address: AddressResponse }
  | null;

const pageClassName = "mx-auto max-w-5xl space-y-6 px-4 py-12 sm:px-6";

export function AddressesPage() {
  const currentUser = useCurrentUser();

  if (currentUser.isPending || currentUser.isError) {
    return (
      <section className={pageClassName}>
        <h1 className="text-3xl font-semibold tracking-tight">Saved addresses</h1>
        {currentUser.isError ? (
          <>
            <p role="alert" className="text-sm text-muted-foreground">
              We couldn't check your session.
            </p>
            <Button type="button" variant="outline" onClick={() => void currentUser.refetch()}>
              Try again
            </Button>
          </>
        ) : (
          <p role="status" className="text-sm text-muted-foreground">Checking your session…</p>
        )}
      </section>
    );
  }

  const userId = currentUser.data?.user_id;
  if (!userId) {
    return <Navigate to="/login" replace state={{ from: "/addresses" }} />;
  }

  return <SavedAddresses key={userId} userId={userId} />;
}

function SavedAddresses({ userId }: { userId: string }) {
  const addressesQuery = useAddresses(userId);
  const [dialog, setDialog] = useState<ActiveDialog>(null);
  const addresses = addressesQuery.data ?? [];

  function openDialog(nextDialog: NonNullable<ActiveDialog>) {
    
    setDialog(nextDialog);
  }

  

  return (
    <section className={pageClassName}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Saved addresses
        </h1>
        <Button type="button" onClick={() => openDialog({ kind: "add" })}>
          Add address
        </Button>
      </div>

      {addressesQuery.isPending && (
        <p role="status" className="text-sm text-muted-foreground">
          Loading your saved addresses…
        </p>
      )}

      {addressesQuery.isError && (
        <div className="flex flex-wrap items-center gap-3">
          <p role="alert" className="text-sm text-destructive">
            We couldn't load your saved addresses.
          </p>

          <Button type="button" variant="outline" onClick={() => void addressesQuery.refetch()} disabled={addressesQuery.isPending}>
            Try again
          </Button>
        </div>
      )}
      

      {addressesQuery.isSuccess && addresses.length === 0 && (
        <p role="status" className="text-sm text-muted-foreground">
          You don't have any saved addresses yet.
        </p>
      )}

      {addresses.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.address_id}>
              <AddressCard
                address={address}
                onEdit={() => openDialog({ kind: "edit", address })}
                onDelete={() => openDialog({ kind: "delete", address })}
              />
            </li>
          ))}
        </ul>
      )}

      {(dialog?.kind === "add" || dialog?.kind === "edit") && (
        <AddressFormDialog
            key={dialog.kind === "edit" ? dialog.address.address_id : "add"}
            userId={userId}
            address={dialog.kind === "edit" ? dialog.address : undefined}
            onClose={() => setDialog(null)}     
          />
      )}
      

      {dialog?.kind === "delete" && (
        <DeleteAddressDialog
          address={dialog.address}
          userId={userId}
          onClose={() => setDialog(null)}
        />
      )}
    </section>
  );
}











