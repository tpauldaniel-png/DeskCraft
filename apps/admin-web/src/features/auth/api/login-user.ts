import { apiClient } from "@/lib/api-client";
import type { LoginFormValues } from "../schemas/login-form-schema";
import type { AuthUser } from "../types/auth";


type LoginRequest = {
    email: string;
    password: string;
}

type LoginResponse = {
    message: string,
    data: AuthUser
}



export async function loginUser(formValues:LoginFormValues): Promise<LoginResponse> {
    const requestBody: LoginRequest = {
        email: formValues.email.trim().toLowerCase(),
        password: formValues.password,
    };

    const response = await apiClient.post<LoginResponse>(
        "/api/v1/auth/login",
        requestBody,
    )

    return response.data
}