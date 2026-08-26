import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authQueryKeys } from "@/features/auth/api/auth-query-keys";
import { useNavigate} from "react-router-dom";

import { logoutUser } from "../api/logout-user";




export function LogOutButton() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.setQueryData(authQueryKeys.me, null);
            navigate("/login", {replace: true});
        }

    });

    function handleLogout() {
        logoutMutation.mutate();
    }


    return(
        <div>
            <Button 
                type="button"
                variant="outline"
                disabled={logoutMutation.isPending}
                onClick={handleLogout}
            >  
                {logoutMutation.isPending ? "Logging out..": "Log out"}
            </Button>
            {logoutMutation.isError && (
                <p role="alert" className="text-sm text-destructive">Unable to Logout. Please try again.</p>
            )}
        </div>
    )
}