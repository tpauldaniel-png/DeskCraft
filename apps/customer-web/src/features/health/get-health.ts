import { apiClient } from "@/lib/api-client"

type HealthResponse = {
    status: string,
    service: string
}

export async function getHealth(): Promise<HealthResponse> {
    const response = await apiClient.get<HealthResponse>("/health")

    return response.data
}