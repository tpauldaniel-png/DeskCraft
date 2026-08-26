import { apiClient } from "@/lib/api-client";
import type { AuthUser } from "../types/auth";
import { isAxiosError } from "axios";




export async function getAdminSession(): Promise<AuthUser | null>{

    try {
        const response = await apiClient.get(
            "/api/v1/auth/admin-check"
        );

        return response.data
    } catch(error) {
        if (isAxiosError(error) && error.response?.status == 401) {
            return null
        }
        throw error
    }
}