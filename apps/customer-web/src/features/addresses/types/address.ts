


export type CreateAddressParams = {
    recipient_name: string;
    phone_number: string;
    address_line1: string;
    address_line2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country?: string;
    is_default?: boolean;
};

export type UpdateAddressParams = Partial<CreateAddressParams> & {
    address_id: string;
};

export type AddressResponse = Required<CreateAddressParams> & {
    address_id: string;
    created_at: string;
    updated_at: string;
};
