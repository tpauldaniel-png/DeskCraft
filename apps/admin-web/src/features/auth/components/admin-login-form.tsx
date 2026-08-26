import { useForm, type SubmitHandler} from "react-hook-form"
import { loginSchema, type LoginFormValues } from "../schemas/login-form-schema"
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



type LoginFormProps = {
    onSubmit: SubmitHandler<LoginFormValues>;
    isPending: boolean;

}


export function AdminLoginForm({onSubmit, isPending}: LoginFormProps) {
    const {
        register,
        handleSubmit, 
        formState: {errors, isSubmitting},
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema), 
        defaultValues:{
            email: "",
            password: "",
    }});

    return (
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <Field data-invalid={Boolean(errors.email)}>
                    <FieldLabel htmlFor="login-email">Email </FieldLabel>
                    <Input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={Boolean(errors.email)}
                        placeholder="Enter your email"
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
                        {...register("password")}
                    />
                    {errors.password && (
                        <FieldError errors={[errors.password]} />
                    )}
                </Field>
            </FieldGroup>

            <Button type="submit" disabled={isPending || isSubmitting}>
                {isPending || isSubmitting ? "Logging in..." : "Log in"}
            </Button>
        </form>
    )
}