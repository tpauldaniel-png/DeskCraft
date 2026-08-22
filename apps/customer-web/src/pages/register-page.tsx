import { RegisterForm } from "@/features/auth/components/register-form"
import { useState } from "react"


export function RegisterPage() {
    const [isValidated, setIsValidated] = useState(false)

    function handleValidSubmit() {
        setIsValidated(true)
    }

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
                Enter your details to validate the registration form.
                </p>
            </div>

            {isValidated && (
                <p
                role="status"
                className="mb-4 rounded-md border border-green-600 bg-green-50 p-3 text-sm text-green-800"
                >
                Form validation passed. No account was created.
                
                </p>
            )}

            <RegisterForm onSubmit={handleValidSubmit} />
        </section>
    )

}
