
import { apiClient } from "@/lib/api-client";
import { isAxiosError } from "axios";

import type { AuthUser } from "../types/auth";


export async function getCurrentUser(): Promise<AuthUser | null> {
    try {
        const response = await apiClient.get<AuthUser>(
            "/api/v1/auth/me"
        );

        return response.data
    } catch (error: unknown) {
        if (isAxiosError(error) && error.response?.status === 401 ) {
            return null
        }

        throw error
    }
}