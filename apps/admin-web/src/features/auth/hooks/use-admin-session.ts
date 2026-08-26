import { useQuery } from "@tanstack/react-query";
import { adminAuthQueryKeys } from "../api/admin-auth-query-keys";
import { getAdminSession } from "../api/get-admin-session";



export function useAdminSession() {
    return useQuery({
        queryKey: adminAuthQueryKeys.session,
        queryFn: getAdminSession,
        retry: false,

    });
}