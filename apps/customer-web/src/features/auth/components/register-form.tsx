import {useForm, type SubmitHandler} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { registerSchema, type RegisterFormValues } from "../schemas/register-form-schema";
import { Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/shared/loading-button";

type RegisterFormProps = {
    onSubmit: SubmitHandler<RegisterFormValues>;
    isPending: boolean;
}

export function RegisterForm({onSubmit, isPending}: RegisterFormProps) {
    const {
        register, 
        handleSubmit,
        formState: {errors},
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
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FieldGroup>
                <div className="grid gap-5 sm:grid-cols-2">
                    <Field data-invalid={Boolean(errors.firstName)}>
                        <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                        <Input
                            id="firstName"
                            type="text"
                            autoComplete="given-name"
                            aria-invalid={Boolean(errors.firstName)}
                            placeholder="Enter your first name"
                            className="h-11 bg-background px-4"
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
                            className="h-11 bg-background px-4"
                            {...register("lastName")}
                        />
                        {errors.lastName && (
                            <FieldError errors={[errors.lastName]} />
                        )}
                    </Field>
                </div>

                <Field data-invalid={Boolean(errors.email)}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
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

                <Field data-invalid={Boolean(errors.phoneNumber)}>
                    <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                    <Input
                        id="phoneNumber"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.phoneNumber)}
                        placeholder="+91 98765 43210"
                        className="h-11 bg-background px-4"
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
                loadingText="Creating account..."
            
            >
                Create account
            </LoadingButton>
        </form>
    )

    
}