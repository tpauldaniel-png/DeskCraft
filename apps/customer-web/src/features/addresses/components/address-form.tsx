import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";
import { useId } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { AddressResponse } from "../types/address";

function requiredText(label: string, maxLength: number) {
    return z
    .string()
    .trim()
    .min(1, { message: `${label} is required` })
    .max(maxLength, { message: `${label} must be at most ${maxLength} characters` });
}

const addressSchema = z.object({
    recipient_name: requiredText("Recipient name", 100),
    phone_number: requiredText("Phone number", 20),
    address_line1: requiredText("Address line 1", 200),
    address_line2: z
        .string()
        .trim()
        .max(200, { message: "Address line 2 must be at most 200 characters" })
        .transform((value) => (value === "" ? null : value)),
    city: requiredText("City", 100),
    state: requiredText("State", 100),
    postal_code: requiredText("Postal code", 20),
    country: requiredText("Country", 50),
    is_default: z.boolean(),
});

type AddressFormInput = z.input<typeof addressSchema>;
type AddressFormOutput = z.output<typeof addressSchema>;

type AddressFormProps = {
    address: AddressResponse | undefined;
    isSaving: boolean;
    onCancel: () => void;
    onSave: (values: AddressFormOutput) => Promise<void>;
};

type AddressInputProps = {
    label: string;
    field: UseFormRegisterReturn;
    error: string | undefined;
    autocomplete: string;
    type?: "text" | "tel";
    optional?: boolean;
    fullWidth?: boolean;
}

function AddressInput({ label, field, error, autocomplete, type = "text", optional = false, fullWidth = false }: AddressInputProps) {
    const id = useId();

    return (
        <div className={fullWidth ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
            <label htmlFor={id} className=" text-sm font-medium">
                {label}
            </label>
            <Input
                {...field}
                id={id}
                type={type}
                autoComplete={autocomplete}
                required={!optional}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
            />
            {error && (
                <p className="text-sm text-destructive" id={`${id}-error`}>
                    {error}
                </p>
            )}
        </div>
    );
}


export function AddressForm({ address, isSaving, onCancel, onSave }: AddressFormProps) {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AddressFormInput, unknown, AddressFormOutput>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            recipient_name: address?.recipient_name ?? "",
            phone_number: address?.phone_number ?? "",
            address_line1: address?.address_line1 ?? "",
            address_line2: address?.address_line2 ?? "",
            city: address?.city ?? "",
            state: address?.state ?? "",
            postal_code: address?.postal_code ?? "",
            country: address?.country ?? "",
            is_default: address?.is_default ?? false,
        },
    }); 

    const busy = isSaving || isSubmitting;

    return (
        <form onSubmit={handleSubmit(onSave)} className="space-y-6" noValidate>
            <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
                <AddressInput
                    label="Recipient name"
                    field={register("recipient_name")}
                    error={errors.recipient_name?.message}
                    autocomplete="name"
                />
                <AddressInput
                    label="Phone number"
                    field={register("phone_number")}
                    error={errors.phone_number?.message}
                    autocomplete="tel"
                />
                <AddressInput
                    label="Address line 1"
                    field={register("address_line1")}
                    error={errors.address_line1?.message}
                    autocomplete="address-line1"
                    fullWidth
                />
                <AddressInput
                    label="Address line 2"
                    field={register("address_line2")}
                    error={errors.address_line2?.message}
                    autocomplete="address-line2"
                    optional
                    fullWidth
                />
                <AddressInput
                    label="City"
                    field={register("city")}
                    error={errors.city?.message}
                    autocomplete="address-level2"
                />
                <AddressInput
                    label="State"
                    field={register("state")}
                    error={errors.state?.message}
                    autocomplete="address-level1"
                />
                <AddressInput
                    label="Postal code"
                    field={register("postal_code")}
                    error={errors.postal_code?.message}
                    autocomplete="postal-code"
                />
                <AddressInput
                    label="Country"
                    field={register("country")}
                    error={errors.country?.message}
                    autocomplete="country"
                />

                <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                        {...register("is_default")}
                        type="checkbox"
                        className="size-4 accent-primary"
                    />
                    <span>Set as default address</span>
                </label>
            </fieldset>

            <div className="flex justify-end gap-2 flex-wrap">
                <Button type="button" variant="outline" onClick={onCancel} disabled={busy}>
                    Cancel
                </Button>
                <Button type="submit" disabled={busy}>
                    {address ? "Update Address" : "Add Address"}
                </Button>
            </div>
        </form>
    );
}
