import type { LoginFormValues } from "@/features/auth/schemas/login-form-schema";
import { loginUser } from "@/features/auth/api/login-user";
import { AdminLoginForm } from "@/features/auth/components/admin-login-form";
import type { ApiErrorResponse } from "@/types/api";

import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { adminAuthQueryKeys } from "@/features/auth/api/admin-auth-query-keys";
import { getAdminSession } from "@/features/auth/api/get-admin-session";

import { Card, CardContent, CardDescription, CardHeader,CardTitle } from "@/components/ui/card";

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

            const admin = await getAdminSession();

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
            className="w-full px-page py-section md:px-page-md lg:px-page-lg"
        >

            <div className="mx-auto w-full max-w-md">
                <Card className="border-border bg-card shadow-card">
                    <CardHeader className="space-y-4 text-center">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-widest text-brand-warm">
                                Admin Portal
                            </p>
                            <CardTitle id="login-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                Welcome back
                            </CardTitle>
                            <CardDescription className="text-sm leading-6">
                                Enter your administrator email and password to continue.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-5">
                        {errorMessage && (
                            <p
                            role="alert"
                            className="rounded-b-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                            >
                            {errorMessage}
                            
                            </p>
                        )}
                    
                        <AdminLoginForm onSubmit={handleLoginSubmit} isPending={loginMutation.isPending}/>
                    </CardContent>
                </Card>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                    Access is restricted to authorized DeskCraft administrators.
                </p>
            </div>
        </section>
    )
}
