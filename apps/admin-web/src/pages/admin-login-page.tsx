import type { LoginFormValues } from "@/features/auth/schemas/login-form-schema";
import { loginUser } from "@/features/auth/api/login-user";
import { AdminLoginForm } from "@/features/auth/components/admin-login-form";
import type { ApiErrorResponse } from "@/types/api";

import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { adminAuthQueryKeys } from "@/features/auth/api/admin-auth-query-keys";
import { getAdminSession } from "@/features/auth/api/get-admin-session";

function getLoginError(error: unknown) {
    if (isAxiosError<ApiErrorResponse>(error)) {
        return (
            error.response?.data.error.message ??
            "Unable to login. Please try again."
        )
    }

    return "Unable to verify admin access. Please try again."
}


export function AdminLoginPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const location = useLocation();

    const locationState = location.state as {
        from?: string;
    } | null;

    const requestedDestination = locationState?.from;

    const destination = 
        requestedDestination?.startsWith("/") &&
        !requestedDestination.startsWith("//")
            ? requestedDestination
            : "/dashboard"

    
    const loginMutation = useMutation({
        mutationFn: async (formValues: LoginFormValues) => {
            await loginUser(formValues);

            const admin = getAdminSession();

            if (!admin) {
                throw new Error("Admin session verification failed");
            }

            return admin;
        },

        onSuccess: (admin) => {
            queryClient.setQueryData(adminAuthQueryKeys.session, admin)
            navigate(destination,
                {
                    replace: true,
                    state: {
                        message: "Admin Login is successful"
                    }
                }
            )
        }
    });

    function handleLoginSubmit(formValues: LoginFormValues) {
        loginMutation.mutate(formValues)
    }

    const errorMessage = loginMutation.isError ? getLoginError(loginMutation.error) : null;

    return (
        <section
            aria-labelledby="login-heading"
            className="mx-auto w-full max-w-md px-4 py-10"
        >
            <div className="mb-6 space-y-2">
                <h1 id="login-heading" className="text-2xl font-semibold">
                    Log in to your DeskCraft Admin account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email and password to continue.
                </p>
            </div>
            {errorMessage && (
                <p
                role="alert"
                className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                {errorMessage}
                
                </p>
            )}

            <AdminLoginForm onSubmit={handleLoginSubmit} isPending={loginMutation.isPending}/>
        </section>
    )
}
