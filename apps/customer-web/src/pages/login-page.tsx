import type { LoginFormValues } from "@/features/auth/schemas/login-form-schema";
import { loginUser } from "@/features/auth/api/login-user";
import { LoginForm } from "@/features/auth/components/login-form";
import type { ApiErrorResponse } from "@/types/api";

import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { authQueryKeys } from "@/features/auth/api/auth-query-keys";

function getLoginError(error: unknown) {
    if (isAxiosError<ApiErrorResponse>(error)) {
        return (
            error.response?.data.error.message ??
            "Unable to login. Please try again."
        )
    }

    return "Unable to connect to the server. Please try again."
}


export function LoginPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const location = useLocation();

    const locationState = location.state as {
        from?: string;
    } | null;

    const destination = locationState?.from ?? "/account";
    
    const loginMutation = useMutation({
        mutationFn: loginUser,

        onSuccess: (response) => {
            queryClient.setQueryData(authQueryKeys.me, response.data)
            navigate(destination,
                {
                    replace: true,
                    state: {
                        message: "Login is successful"
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
            className="min-h-svh bg-background px-page py-section md:px-page-md lg:px-page-lg"
        >
            <div className="mx-auto mx-w-md">
                <h1 id="login-heading" className="text-3xl font-bold tracking-tight text-foreground">
                    Log in to your DeskCraft account
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Enter your email and password to continue.
                </p>
            </div>
            {errorMessage && (
                <p
                role="alert"
                className=""
                >
                {errorMessage}
                
                </p>
            )}
            <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-card">
                <LoginForm onSubmit={handleLoginSubmit} isPending={loginMutation.isPending}/>
            </div>
        </section>
    )
}
