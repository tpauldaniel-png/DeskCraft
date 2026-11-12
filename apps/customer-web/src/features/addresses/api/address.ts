import { apiClient } from "@/lib/api-client";

import type { AddressResponse, CreateAddressParams, UpdateAddressParams } from "../types/address";


export async function getAddresses(signal?: AbortSignal): Promise<AddressResponse[]> {
    const response = await apiClient.get<AddressResponse[]>("/api/v1/addresses", { signal });
    return response.data;
}

export async function createAddress(params: CreateAddressParams): Promise<AddressResponse> {
    const response = await apiClient.post<AddressResponse>("/api/v1/addresses", params);
    return response.data;
}


export async function updateAddress({ address_id, ...updateParams }: UpdateAddressParams): Promise<AddressResponse> {
    const response = await apiClient.put<AddressResponse>(`/api/v1/addresses/${address_id}`, updateParams);
    return response.data;
}


export async function deleteAddress(address_id: string): Promise<void> {
    await apiClient.delete(`/api/v1/addresses/${address_id}`);
}

