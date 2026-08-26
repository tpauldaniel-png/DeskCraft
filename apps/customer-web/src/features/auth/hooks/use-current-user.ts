import { useQuery } from "@tanstack/react-query";
import { authQueryKeys } from "../api/auth-query-keys";
import { getCurrentUser } from "../api/get-current-user";




export function useCurrentUser() {
    return useQuery({
        queryKey: authQueryKeys.me,
        queryFn: getCurrentUser,
        retry: false
    });
}