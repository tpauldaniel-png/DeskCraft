import { apiClient } from "@/lib/api-client";


export async function logoutUser(): Promise<void> {
    await apiClient.post(
        "/api/v1/auth/logout"
    )
    
}