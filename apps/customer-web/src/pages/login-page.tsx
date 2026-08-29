import type { LoginFormValues } from "@/features/auth/schemas/login-form-schema";
import { loginUser } from "@/features/auth/api/login-user";
import { LoginForm } from "@/features/auth/components/login-form";
import type { ApiErrorResponse } from "@/types/api";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { authQueryKeys } from "@/features/auth/api/auth-query-keys";
import { CustomerAuthShell} from "@/features/auth/components/auth-shell";

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
        <CustomerAuthShell
            headingId="login-heading"
            title="Welcome back"
            description="Sign in  to access your DeskCraft account"
        >
            
            {errorMessage && (
                <p
                    role="alert"
                    className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                    {errorMessage}
                
                </p>
            )}
            
            <LoginForm onSubmit={handleLoginSubmit} isPending={loginMutation.isPending}/>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                New to DeskCraft?{" "}
                <Link
                    to="/register"
                    className="text-primary font-semibold underline-offset-4 hover:underline"
                >
                    Create an account
                </Link>
            </p>
            
        </CustomerAuthShell>
    );
}
