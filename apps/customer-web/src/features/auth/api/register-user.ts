import { apiClient } from "@/lib/api-client";
import type { RegisterFormValues } from "../schemas/register-form-schema";

type RegisterRequest = {
    first_name : string;
    last_name: string;
    email: string;
    phone_number: string | null;
    password: string;
}

type RegisteredUser = {
    id: string;
    first_name : string;
    last_name: string;
    email: string;
    phone_number: string | null;
    password: string;
    role: string;
    is_active: string;
}


export async function registerUser(formValues: RegisterFormValues): Promise<RegisteredUser> {
    const requestBody: RegisterRequest = {
        first_name: formValues.firstName.trim(),
        last_name: formValues.lastName.trim(),
        email: formValues.email.trim().toLowerCase(),
        phone_number: formValues.phoneNumber.trim() || null,
        password: formValues.password,
    };

    const response = await apiClient.post<RegisteredUser>(
        "/api/v1/auth/register",
        requestBody,
    );

    return response.data
}