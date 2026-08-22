import {useForm, type SubmitHandler} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormValues } from "../schemas/register-form-schema";
import { Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


type RegisterFormProps = {
    onSubmit: SubmitHandler<RegisterFormValues>
}

export function RegisterForm({onSubmit}: RegisterFormProps) {
    const {
        register, 
        handleSubmit,
        formState: {errors, isSubmitting},
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema), 
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
        },
    });

    return(
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <Field data-invalid={Boolean(errors.firstName)}>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <Input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        aria-invalid={Boolean(errors.firstName)}
                        placeholder="Enter your first name"
                        {...register("firstName")}
                    />
                    {errors.firstName && (
                        <FieldError errors={[errors.firstName]} />
                    )}
                </Field>

                <Field data-invalid={Boolean(errors.lastName)}>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <Input
                        id="lastName"
                        type="text"
                        autoComplete="family-name"
                        aria-invalid={Boolean(errors.lastName)}
                        placeholder="Enter your last name"
                        {...register("lastName")}
                    />
                    {errors.lastName && (
                        <FieldError errors={[errors.lastName]} />
                    )}
                </Field>

                <Field data-invalid={Boolean(errors.email)}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
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

                <Field data-invalid={Boolean(errors.phoneNumber)}>
                    <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                    <Input
                        id="phoneNumber"
                        type="tel"
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.phoneNumber)}
                        placeholder="+919876543210"
                        {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                        <FieldError errors={[errors.phoneNumber]} />
                    )}
                </Field>

                <Field data-invalid={Boolean(errors.password)}>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        aria-invalid={Boolean(errors.password)}
                        placeholder="Create a password"
                        {...register("password")}
                    />
                    {errors.password && (
                        <FieldError errors={[errors.password]} />
                    )}
                </Field>
            </FieldGroup>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
        </form>
    )

    
}