import { RegisterForm } from "@/features/auth/components/register-form";
import { registerUser } from "@/features/auth/api/register-user";
import type { RegisterFormValues } from "@/features/auth/schemas/register-form-schema";
import type { ApiErrorResponse } from "@/types/api";

import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";

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

        <section
            aria-labelledby="register-heading"
            className="mx-auto w-full max-w-md px-4 py-10"
        >
            <div className="mb-6 space-y-2">
                <h1 id="register-heading" className="text-2xl font-semibold">
                Create your DeskCraft account
                </h1>
                <p className="text-sm text-muted-foreground">
                Enter your details to create your account.
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

            <RegisterForm onSubmit={handleValidSubmit} isPending={registerMutation.isPending}/>
        </section>
    )

}
