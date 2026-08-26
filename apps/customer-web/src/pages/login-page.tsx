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
            className="mx-auto w-full max-w-md px-4 py-10"
        >
            <div className="mb-6 space-y-2">
                <h1 id="login-heading" className="text-2xl font-semibold">
                    Log in to your DeskCraft account
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

            <LoginForm onSubmit={handleLoginSubmit} isPending={loginMutation.isPending}/>
        </section>
    )
}
