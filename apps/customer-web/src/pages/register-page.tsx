import { RegisterForm } from "@/features/auth/components/register-form";
import { registerUser } from "@/features/auth/api/register-user";
import type { RegisterFormValues } from "@/features/auth/schemas/register-form-schema";
import type { ApiErrorResponse } from "@/types/api";

import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { CustomerAuthShell } from "@/features/auth/components/auth-shell";

function getRegistrationError(error: unknown) {
    if (isAxiosError<ApiErrorResponse>(error)) {
        return (
            error.response?.data.error.message
        )
    }
}



export function RegisterPage() {

    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            navigate("/login",
                {
                    replace: true,
                    state: {
                        message: "Registraion is successful. Please Log in."
                    }
                }
            )
        }
    })
    

    function handleValidSubmit(formValues: RegisterFormValues) {
        registerMutation.mutate(formValues)
    }

    const errorMessage = registerMutation.isError ? getRegistrationError(registerMutation.error) : null;

    return (
        <CustomerAuthShell
            headingId="register-heading"
            title="Create your account"
            description="Join in the world of DeskCraft to setup your workspace"
        >
        
            

            {errorMessage && (
                <p
                    role="alert"
                    className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                    {errorMessage}
                
                </p>

            )}


            <RegisterForm onSubmit={handleValidSubmit} isPending={registerMutation.isPending}/>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-primary font-semibold underline-offset-4 hover:underline"
                >
                    Sign in
                </Link>
            </p>
        </CustomerAuthShell>
    )

}
