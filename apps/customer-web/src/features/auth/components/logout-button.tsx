import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authQueryKeys } from "@/features/auth/api/auth-query-keys";
import { useNavigate} from "react-router-dom";

import { logoutUser } from "../api/logout-user";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useState } from "react";




export function LogOutButton() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const logoutMutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            queryClient.setQueryData(authQueryKeys.me, null);
            setIsDialogOpen(false);
            navigate("/login", {replace: true});
        }

    });

    function handleLogout() {
        logoutMutation.mutate();
    }


    return(
        <div>
            <ConfirmDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                trigger={
                    <Button variant="outline" >Log out</Button>
                }
                title="Log out of DeskCraft account?"
                description="You will need to provide credentials to access your account again"
                confirmLablel="Log out"
                pendingLabel="Logging out..."
                isPending={logoutMutation.isPending}
                onConfirm={handleLogout}
            
            />

            {logoutMutation.isError && (
                <p role="alert" className="text-sm text-destructive">Unable to Logout. Please try again.</p>
            )}
        </div>
            

    )
}