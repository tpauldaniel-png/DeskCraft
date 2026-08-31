import { useForm, type SubmitHandler} from "react-hook-form"
import { loginSchema, type LoginFormValues } from "../schemas/login-form-schema"
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/shared/loading-button";


type LoginFormProps = {
    onSubmit: SubmitHandler<LoginFormValues>;
    isPending: boolean;

}


export function LoginForm({onSubmit, isPending}: LoginFormProps) {
    const {
        register,
        handleSubmit, 
        formState: {errors},
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema), 
        defaultValues:{
            email: "",
            password: "",
    }});

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FieldGroup className="gap-5">
                <Field data-invalid={Boolean(errors.email)}>
                    <FieldLabel htmlFor="login-email">Email </FieldLabel>
                    <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        placeholder="Enter your email"
                        className="h-11 bg-background px-4"
                        {...register("email")}
                    />
                    {errors.email && (
                        <FieldError errors={[errors.email]} />
                    )}
                </Field>

                <Field data-invalid={Boolean(errors.password)}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        aria-invalid={Boolean(errors.password)}
                        placeholder="Enter your password"
                        className="h-11 bg-background px-4"
                        {...register("password")}
                    />
                    {errors.password && (
                        <FieldError errors={[errors.password]} />
                    )}
                </Field>
            </FieldGroup>

            <LoadingButton
                type="submit"
                isLoading={isPending}
                className="h-11 w-full"
                loadingText="Logging in..."
            
            >
                Log in
            </LoadingButton>

            
        </form>
    )
}